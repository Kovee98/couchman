onmessage = function (e) {
    const conn = e.data.conn;
    const allDbs = e.data.payload;
    const docs = [];
    const reqs = [];

    for (let i = 0; i < allDbs.length; i++) {
        const db = allDbs[i];

        reqs[i] = new XMLHttpRequest();

        reqs[i].open('GET', `${conn.baseUrl}/${db}/_all_docs?include_docs=true`, false);

        if (conn.user && conn.pass) {
            reqs[i].setRequestHeader('Authorization', 'Basic ' + btoa(`${conn.user}:${conn.pass}`));
        }

        reqs[i].onload = function () {
            const res = JSON.parse(reqs[i].response);
            res.db = db;
            docs.push(res);
        };

        reqs[i].send();
    }

    postMessage({
        type: 'setDocs',
        conn: conn,
        payload: docs
    });
};
