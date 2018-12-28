const utils = require('./utils/utils.js');
const {
  log,
} = utils;

const host = 'http://127.0.0.1:3050';

const apiPath = {
  login: '/api/v1/login',
};

const apiAbsPath = {};
for(let key in apiPath) {
  if(apiPath.hasOwnProperty(key)) {
      apiAbsPath[key] = host + apiPath[key];
  }
}
log('apiAbsPath', apiAbsPath);

module.exports = {
  api: apiAbsPath,
};
