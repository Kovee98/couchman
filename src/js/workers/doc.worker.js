onmessage = function (e) {
    const conn = e.data.conn;
    const allDbs = e.data.payload;

    for (let i = 0; i < allDbs.length; i++) {
        const db = allDbs[i];
        const req = new XMLHttpRequest();

        req.open('GET', `${conn.baseUrl}/${db}/_all_docs?include_docs=true`, false);

        if (conn.user && conn.pass) {
            req.setRequestHeader('Authorization', 'Basic ' + btoa(`${conn.user}:${conn.pass}`));
        }

        req.onload = function () {
            const res = JSON.parse(req.response);
            res.db = db;

            postMessage({
                type: 'setDoc',
                conn: conn,
                payload: res
            });
        };

        req.send();
    }
};
