import kafka from '../../config/kafka.js';

const producer = kafka.producer();
async function connectProducer() {
    await producer.connect();
    console.log('Producer connected');
}
async function produceLog(level, logEntry) {
    try {
        await connectProducer();
        const topic = level === 'info' ? 'info' : 'error';
        await producer.send({
            topic,
            messages: [
                {
                    key: logEntry.id,
                    value: JSON.stringify(logEntry),
                },
            ],
        });
        console.log(`Produced log to ${topic} topic:`, logEntry.message);
    } catch (error) {
        console.error('Error producing to Kafka:', error.message);
        throw error;
    }
}
async function disconnectProducer() {
    await producer.disconnect();
    console.log('Producer disconnected');
}

export { produceLog, disconnectProducer };
