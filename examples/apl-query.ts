// The purpose of this example is to show how to query a dataset using the Axiom
// Processing Language (APL).
import Client from '@axiomhq/axiom-node';

const client = new Client();

async function aplQuery() {
    const aplQuery = "['my-dataset'] | where status == 500"

    const res = await client.datasets.aplQuery(aplQuery);
    if (!res.matches || res.matches.length === 0) {
        console.warn('no matches found');
        return;
    }

    for(let matched of res.matches) {
        console.log(matched.data);
    }   
}

aplQuery();
