const KyoClient = require('./structures/KyoClient.js');

let client = new KyoClient({ prefix: '>' })

client.start();