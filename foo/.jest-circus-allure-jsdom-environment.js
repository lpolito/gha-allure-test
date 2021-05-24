const JestCircusAllureBaseEnvironment = require('./.jest-circus-allure-base-environment');
const jsdomEnv = require('jest-environment-jsdom-sixteen');

module.exports = JestCircusAllureBaseEnvironment(jsdomEnv);
