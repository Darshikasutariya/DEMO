import kafka from '../../config/kafka.js';
import insertData from '../clickhouse/insertdata.js';

const consumer = kafka.consumer({ groupId: 'logger-group' });

async function startConsumer() {
    try {
        await consumer.connect();
        console.log('Consumer connected');

        await consumer.subscribe({ topics: ['info', 'error'], fromBeginning: true });
        console.log('Subscribed to topics: info, error');

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const logEntry = JSON.parse(message.value.toString());
                    console.log(`Consumed from TOPIC:${topic}: PART:${partition}`, logEntry.message);
                    await insertData(logEntry);
                } catch (error) {
                    console.error('Error processing message:', error.message);
                }
            },
        });
    } catch (error) {
        console.error('Error starting consumer:', error.message);
        throw error;
    }
}

async function stopConsumer() {
    await consumer.disconnect();
    console.log('Consumer disconnected');
}

export { startConsumer, stopConsumer };
