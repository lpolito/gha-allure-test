const {AllureRuntime} = require('allure-js-commons');

const ROOT_DESCRIBE_BLOCK = 'ROOT_DESCRIBE_BLOCK';


function ansiRegex({onlyFirst = false} = {}) {
	const pattern = [
		'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
	].join('|');

	return new RegExp(pattern, onlyFirst ? undefined : 'g');
}

function stripAnsi(string) {
	if (typeof string !== 'string') {
		throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
	}

	return string.replace(ansiRegex(), '');
}

module.exports = (classExtend) => class extends classExtend {
    constructor(config, context) {
        super(config, context)
    }
    
    async setup() {
        await super.setup();

        this.allure = new AllureRuntime({
            resultsDir: 'allure-report'
        });
        this.global.allureRuntime = this.allure;
    }

    async teardown() {
        await super.teardown();
    }

    runscript(script) {
        return super.runScript(script)
    }

    handleTestEvent(event, state) {
        const {
            name: eventName,
            test,
            describeBlock,
        } = event;

        switch (eventName) {
        case 'run_describe_start':
            // Called at the start of a test describe block or suite.
            const {name: parentName} = this.currentGroup || {};

            const suiteName = (parentName !== undefined && parentName !== ROOT_DESCRIBE_BLOCK)
                ? `${parentName} ${describeBlock.name}`
                : describeBlock.name;
            this.currentGroup = this.allure.startGroup(suiteName);

            break;
        case 'run_describe_finish':
            // Called at the end of a describe block or test file.
            this.currentGroup.endGroup();

            break;
        case 'test_skip':
        case 'test_todo':
            const status = eventName === 'test_skip' ? 'skipped' : 'todo';


            this.currentGroup.startTest(test.name);
            this.currentTest = this.currentGroup.startTest(test.name);
            this.currentTest.endTest();
            // this.allure.endCase(status, {message: `Test is marked as: ${status}`});

            break;
        case 'test_fn_start':
            // Called after beforeAll / beforeEach, and at start of unit test (it() / test()).
            this.currentTest = this.currentGroup.startTest(test.name);

            break;
        case 'test_done':
            // Called after success or failure.
            if (test.errors.length > 0) {
                // Test failed.
                const error = Array.isArray(test.errors[0]) ? test.errors[0][0] : {};

                const details = {};
                // Use stripAnsi so that Allure can successfully build XML reports with valid characters.
                if (typeof error === 'object') {
                    // In the event that the error is a thrown Error.
                    details.message = stripAnsi(error.message);
                    details.stack = stripAnsi(error.stack);
                } else if (typeof error === 'string') {
                    // In the event the error is just a message from Jest.
                    const [message, ...stackArray] = error.split('\n');

                    details.message = stripAnsi(message);
                    details.stack = stripAnsi(stackArray.join('\n'));
                }
                
                // this.allure.endCase('failed', details);
                this.currentTest.endTest();
            } else {
                // Test passed.
                // this.allure.endCase('passed');
                this.currentTest.endTest();
            }

            break;
        default:
            break;
        }
    }
};
