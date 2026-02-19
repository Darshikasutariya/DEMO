import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'express-logger',
    brokers: ['localhost:9096', 'localhost:9097', 'localhost:9098'],
});

export default kafka;
