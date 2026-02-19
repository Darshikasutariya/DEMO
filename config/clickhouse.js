import { createClient } from '@clickhouse/client';
import dotenv from 'dotenv';
dotenv.config();
const clickhouse = createClient({
    url: 'http://localhost:8123',
    username: process.env.CLICKHOUSE_USER,
    password: process.env.CLICKHOUSE_PASSWORD,
});

export default clickhouse;
