import kafka from '../config/kafka.js';

const admin = kafka.admin();

async function createTopics() {
    try {
        await admin.connect();
        console.log('Admin connected');

        const topics = await admin.listTopics();

        const topicsToCreate = [];
        if (!topics.includes('info')) {
            topicsToCreate.push({ topic: 'info', numPartitions: 3, replicationFactor: 3 });
        }
        if (!topics.includes('error')) {
            topicsToCreate.push({ topic: 'error', numPartitions: 3, replicationFactor: 3 });
        }

        if (topicsToCreate.length > 0) {
            await admin.createTopics({ topics: topicsToCreate });
            console.log('Topics created:', topicsToCreate.map(t => t.topic).join(', '));
        } else {
            console.log('Topics already exist');
        }

        await admin.disconnect();
        console.log('Done!');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

createTopics();
