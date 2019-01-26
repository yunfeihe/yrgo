const config = {};

const baseUrl = 'http://127.0.0.1:3050/api/v1/';

config.apiPath = {
    login: 'user/login',
    bind: 'user/bind',
    course: 'tools/course',
    score: 'tools/score',
};

config.api = {};
for (let key in config.apiPath) {
    config.api[key] = baseUrl + config.apiPath[key];
}

export default config;