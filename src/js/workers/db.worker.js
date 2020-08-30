onmessage = function (e) {
    const conn = e.data.conn;
    const allDbs = e.data.dbs;
    const dbs = [];
    const reqs = [];

    if (allDbs) {
        postMessage({
            type: 'buildDocs',
            conn: conn,
            payload: allDbs
        });

        for (let i = 0; i < allDbs.length; i++) {
            const db = allDbs[i];

            reqs[i] = new XMLHttpRequest();

            reqs[i].open('GET', `${conn.baseUrl}/${db}`, false);

            reqs[i].onload = function () {
                dbs.push(JSON.parse(reqs[i].response));
            };

            reqs[i].send();
        }
    } else {
        const req = new XMLHttpRequest();

        req.open('GET', `${conn.baseUrl}/_all_dbs`, false);

        req.onload = function () {
            const allDbs = JSON.parse(req.response);

            postMessage({
                type: 'buildDocs',
                conn: conn,
                payload: allDbs
            });

            for (let i = 0; i < allDbs.length; i++) {
                const db = allDbs[i];

                reqs[i] = new XMLHttpRequest();

                reqs[i].open('GET', `${conn.baseUrl}/${db}`, false);

                reqs[i].onload = function () {
                    dbs.push(JSON.parse(reqs[i].response));
                };

                reqs[i].send();
            }
        };

        req.send();
    }

    postMessage({
        type: 'setDbs',
        conn: conn,
        payload: dbs
    });
};
