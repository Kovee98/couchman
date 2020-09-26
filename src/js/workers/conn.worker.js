import DbWorker from './db.worker.js';

/*
    persistent worker for each connection
        - only calculates the cache for the dbs that need it
        - spawns a db.worker for each chunk of databases
*/

// number of databases per chunk
const chunkSize = 100;

onmessage = function (e) {
    const conn = e.data.conn;
    const cache = e.data.cache;
    const req = new XMLHttpRequest();

    req.open('GET', `${conn.baseUrl}/_all_dbs`, false);

    if (conn.user && conn.pass) {
        req.setRequestHeader('Authorization', 'Basic ' + btoa(`${conn.user}:${conn.pass}`));
    }

    req.onload = function () {
        const allDbs = JSON.parse(req.response);
        const dbs = allDbs.reduce((acc, curr) => {
            // no need to re-cache the db if there are already documents
            if (!cache[curr] || !cache[curr].docs) {
                acc.push(curr);
            }
            return acc;
        }, []);

        if (dbs.length <= 0) return;

        // return all dbs
        postMessage({
            type: 'addDbs',
            conn: conn,
            payload: dbs
        });

        // divide cache labor into chunks for more efficient data collection
        const chunks = Math.ceil(dbs.length / chunkSize);
        console.log('chunks:', chunks);

        for (let i = 0; i < chunks; i++) {
            const index = i * chunkSize;
            const slice = dbs.slice(index, index + chunkSize);
            const worker = new DbWorker();

            worker.onmessage = function (e) {
                postMessage(e.data);
            };

            worker.postMessage({
                conn: conn,
                dbs: slice
            });
        }
    };

    req.send();
};
