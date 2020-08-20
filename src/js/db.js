import localforage from 'localforage';

function createDB (opts) {
    const db = localforage.createInstance(opts);

    db.get = function (key) {
        if (key) {
            return db.getItem(key);
        } else {
            return db.keys().then(async (keys) => {
                const map = {};
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    map[key] = await db.get(key);
                }
                return Promise.resolve(map);
            });
        }
    };

    db.set = function (key, val) {
        return db.setItem(key, val);
    };

    db.remove = function (key) {
        return db.removeItem(key);
    };

    db.clear = function () {
        return db.clear();
    };

    db.save = function (data) {
        return db.set('data', data);
    };

    db.load = function () {
        return db.get('data');
    };

    return db;
}

const dbs = {
    connections: createDB({
        name: 'couchman',
        storeName: 'connections',
        description: 'List of user-added db connections'
    }),
    views: createDB({
        name: 'couchman',
        storeName: 'views',
        description: 'List of user-added views'
    })
};

export default dbs;
