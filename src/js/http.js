function _call (method, url, user = '', pass = '', opts = {}) {
    if (user && pass) {
        opts.headers = {
            ...opts.headers,
            authorization: `Basic ${btoa(`${user}:${pass}`)}`
        };
    }

    opts.headers = Object.assign({
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }, opts.headers);

    return fetch(url, {
        ...opts,
        method: method || 'get'
    }).then(res => res.json());
}

const http = {
    get: function (...args) {
        return _call('get', ...args);
    },
    put: function (...args) {
        return _call('put', ...args);
    },
    post: function (...args) {
        return _call('post', ...args);
    },
    delete: function (...args) {
        return _call('delete', ...args);
    }
};

export default http;
