import createLog from "../service/clickhouse/logHelper.js";
import { produceLog } from "../service/kafka/producer.js";

const clickhouseMiddleware = (req, res, next) => {
    res.on('finish', async () => {
        try {
            const level = (res.statusCode === 200) ? "info" : "error";
            const message = `${req.method} ${req.url} - Status: ${res.statusCode}`;
            const logEntry = await createLog(level, message);
            await produceLog(level, logEntry);
        } catch (error) {
            console.error("Failed to produce log to Kafka:", error.message);
        }
    });

    next();
};

export default clickhouseMiddleware;
