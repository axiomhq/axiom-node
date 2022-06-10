// The purpose of this example is to show how to query a dataset.
import Client from '@axiomhq/axiom-node';

const client = new Client();

async function query() {
    const endTime = new Date(Date.now()).toISOString();
    const startTime = new Date(new Date().getTime() - (1 * 60 * 60)).toISOString(); // 1 minute
    const query = {
        startTime: startTime,
        endTime: endTime,
        resolution: '*',
    };
    const queryOptions = {
        streamingDuration: '5m',
        noCache: false,
    };

    const res = await client.datasets.query('id', query, queryOptions);
    if (res.matches.length === 0) {
        console.warn('no matches found');
        return;
    }

    for(let matched of res.matches) {
        console.log(matched.data);
    }   
}

query();
