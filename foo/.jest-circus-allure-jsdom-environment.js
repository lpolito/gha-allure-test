const {extendAllureBaseEnvironment} = require('jest-circus-allure-environment');
const jsdomEnv = require('jest-environment-jsdom-sixteen');

module.exports = extendAllureBaseEnvironment(jsdomEnv);
