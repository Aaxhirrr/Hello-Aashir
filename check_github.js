const https = require('https');

const url = 'https://api.github.com/users/Aaxhirrr/events?per_page=30';
const options = {
    headers: { 'User-Agent': 'Node.js' }
};

https.get(url, options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (Array.isArray(json)) {
                console.log(`Found ${json.length} events.`);
                json.slice(0, 5).forEach(e => {
                    console.log(`${e.type}: ${e.repo.name} - ${e.created_at}`);
                    if (e.type === 'PushEvent') {
                        console.log(`  Commit: ${e.payload.commits?.[0]?.message}`);
                    } else if (e.type === 'CreateEvent') {
                        console.log(`  Create: ${e.payload.ref_type}`);
                    }
                });
            } else {
                console.log('Response is not an array:', json);
            }
        } catch (e) {
            console.error('Error parsing JSON:', e);
        }
    });
}).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
});
