onmessage = function (e) {
    const conn = e.data.conn;
    const allDbs = e.data.payload;
    const docs = [];
    const xhr = [];

    for (let i = 0; i < allDbs.length; i++) {
        const db = allDbs[i];

        xhr[i] = new XMLHttpRequest();

        xhr[i].open('GET', `${conn.baseUrl}/${db}/_all_docs?include_docs=true`, false);

        xhr[i].onload = function () {
            const res = JSON.parse(xhr[i].response);
            res.db = db;
            docs.push(res);
        };

        xhr[i].send();
    }

    postMessage({
        type: 'setDocs',
        conn: conn,
        payload: docs
    });
};
