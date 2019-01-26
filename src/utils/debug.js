export default {
    log(...args) {
        return console.log(new Date().toLocaleTimeString(), ...args);
    }
}