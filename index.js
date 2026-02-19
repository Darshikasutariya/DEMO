import express from "express";
import doSomeHeavyTask from "./util.js";
import responseTime from "response-time";
import client from "prom-client";
import { createLogger, transports } from "winston";
// import LokiTransport from "winston-loki";
import insertData from "./service/clickhouse/insertdata.js";
import createLog from "./service/clickhouse/logHelper.js";
import clickhouseMiddleware from "./middleware/clickhousemiddleware.js";
import { startConsumer } from "./service/kafka/consumer.js";
// const options = {
//     transports: [
//         new LokiTransport({
//             labels: {
//                 appName: "express",
//             },
//             host: "http://127.0.0.1:3100"
//         })
//     ]
// };
// const logger = createLogger(options);
const app = express();
const PORT = process.env.PORT || 8000;


const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });
const reqResTime = new client.Histogram({
    name: "http_expres_req_res_time",
    help: "This tells how much time taken by request and response",
    labelNames: ["method", "route", "status_code"],
    buckets: [1, 50, 100, 200, 400, 500, 800, 1000, 2000],
})
const totalRequestCounter = new client.Counter({
    name: "total_req",
    help: "This tells total number of requests",
    labelNames: ["method", "route", "status_code"],
})
// Apply ClickHouse logging middleware
app.use(clickhouseMiddleware);

app.use(responseTime((req, res, time) => {
    totalRequestCounter.inc();
    reqResTime.labels({
        method: req.method,
        route: req.url,
        status_code: res.statusCode
    }).observe(time)
}));

app.get("/", async (req, res) => {
    // Middleware will automatically log based on status code
    res.send("Hello World !!");
});

app.get("/slow", async (req, res) => {
    // Middleware will automatically log based on status code
    try {
        const timeTaken = await doSomeHeavyTask();
        return res.json({
            status: "success",
            message: `Heavy task completed in ${timeTaken} ms`,
        });
    } catch (error) {
        // Set status to 500 for errors so middleware logs as error
        res.status(500);
        return res.json({
            status: "error",
            message: error.message,
        });
    }
});


app.get("/metrics", async (req, res) => {
    res.setHeader("Content-Type", client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
});

app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);

    try {
        await startConsumer();
        console.log('Kafka consumer started successfully');
    } catch (error) {
        console.error('Failed to start Kafka consumer:', error.message);
    }
});
