let session = {
    get: (key) => {
        return sessionStorage.getItem(key);
    },
    set: (key, val) => {
        sessionStorage.setItem(key, val);
        return val;
    },
    remove: (key) => {
        sessionStorage.removeItem(key);
    },
    clear: () => {
        sessionStorage.clear();
    }
};

export default session;
