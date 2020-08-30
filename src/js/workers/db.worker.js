onmessage = function (e) {
    const currConn = e.data.currConn;
    const allDbs = e.data.dbs;
    const dbs = [];
    const reqs = [];

    if (allDbs) {
        postMessage({
            type: 'buildDocs',
            currConn: currConn,
            payload: allDbs
        });

        for (let i = 0; i < allDbs.length; i++) {
            const db = allDbs[i];

            reqs[i] = new XMLHttpRequest();

            reqs[i].open('GET', `${currConn.baseUrl}/${db}`, false);

            reqs[i].onload = function () {
                dbs.push(JSON.parse(reqs[i].response));
            };

            reqs[i].send();
        }
    } else {
        const req = new XMLHttpRequest();

        req.open('GET', `${currConn.baseUrl}/_all_dbs`, false);

        req.onload = function () {
            const allDbs = JSON.parse(req.response);

            postMessage({
                type: 'buildDocs',
                currConn: currConn,
                payload: allDbs
            });

            for (let i = 0; i < allDbs.length; i++) {
                const db = allDbs[i];

                reqs[i] = new XMLHttpRequest();

                reqs[i].open('GET', `${currConn.baseUrl}/${db}`, false);

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
        currConn: currConn,
        payload: dbs
    });
};
