onmessage = function (e) {
    const currConn = e.data;
    const req = new XMLHttpRequest();

    req.open('GET', `${currConn.baseUrl}/_all_dbs`, false);

    req.onload = function () {
        const allDbs = JSON.parse(req.response);
        const dbs = [];
        const xhr = [];

        postMessage({
            type: 'loadDocs',
            currConn: currConn,
            payload: allDbs
        });

        for (let i = 0; i < allDbs.length; i++) {
            const db = allDbs[i];

            xhr[i] = new XMLHttpRequest();

            xhr[i].open('GET', `${currConn.baseUrl}/${db}`, false);

            xhr[i].onload = function () {
                dbs.push(JSON.parse(xhr[i].response));
            };

            xhr[i].send();
        }

        postMessage({
            type: 'setDbs',
            currConn: currConn,
            payload: dbs
        });
    };

    req.send();
};
