/*
    fetches documents for n databases
        - posts associative array of dbs with documents to parent worker
*/

// how many dbs to send back at a time
//  smaller - faster response times but more message posts
//  larger - longer response times but fewer message posts
const sendSize = 50;

onmessage = function (e) {
    const conn = e.data.conn;
    const dbChunk = e.data.dbs;
    let dbs = {};

    for (let i = 0; i < dbChunk.length; i++) {
        const dbName = dbChunk[i];
        const dbReq = new XMLHttpRequest();
        const docReq = new XMLHttpRequest();

        dbReq.open('GET', `${conn.baseUrl}/${dbName}`, false);
        docReq.open('GET', `${conn.baseUrl}/${dbName}/_all_docs?include_docs=true`, false);

        if (conn.user && conn.pass) {
            dbReq.setRequestHeader('Authorization', 'Basic ' + btoa(`${conn.user}:${conn.pass}`));
            docReq.setRequestHeader('Authorization', 'Basic ' + btoa(`${conn.user}:${conn.pass}`));
        }

        dbReq.onload = function () {
            const db = JSON.parse(dbReq.response);
            dbs[dbName] = Object.assign(dbs[dbName] || {}, {
                ...db,
                docs: {
                    offset: 0,
                    rows: [],
                    total_rows: 0
                }
            });

            if (Object.values(dbs).length >= sendSize) {
                postMessage({
                    type: 'addDocs',
                    conn: conn,
                    payload: dbs
                });

                dbs = {};
            }
        };

        docReq.onload = function () {
            const docs = JSON.parse(docReq.response);
            dbs[dbName] = Object.assign(dbs[dbName] || {}, { docs });

            if (Object.values(dbs).length >= sendSize) {
                postMessage({
                    type: 'addDocs',
                    conn: conn,
                    payload: dbs
                });

                dbs = {};
            }
        };

        dbReq.send();
        docReq.send();
    }

    // don't forget what's left over (remainder)
    postMessage({
        type: 'addDocs',
        conn: conn,
        payload: dbs
    });
};
