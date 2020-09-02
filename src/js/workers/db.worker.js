onmessage = function (e) {
    const conn = e.data.conn;
    let allDbs = e.data.dbs;

    if (!allDbs) {
        const req = new XMLHttpRequest();

        req.open('GET', `${conn.baseUrl}/_all_dbs`, false);

        if (conn.user && conn.pass) {
            req.setRequestHeader('Authorization', 'Basic ' + btoa(`${conn.user}:${conn.pass}`));
        }

        req.onload = function () {
            allDbs = JSON.parse(req.response);
        };

        req.send();
    }

    postMessage({
        type: 'buildDocs',
        conn: conn,
        payload: allDbs
    });

    for (let i = 0; i < allDbs.length; i++) {
        const db = allDbs[i];
        const req = new XMLHttpRequest();

        req.open('GET', `${conn.baseUrl}/${db}`, false);

        if (conn.user && conn.pass) {
            req.setRequestHeader('Authorization', 'Basic ' + btoa(`${conn.user}:${conn.pass}`));
        }

        req.onload = function () {
            const db = JSON.parse(req.response);

            postMessage({
                type: 'setDb',
                conn: conn,
                payload: db
            });
        };

        req.send();
    }
};
