import clickhouse from "../../config/clickhouse.js";


async function insertData(log) {
    try {
        await clickhouse.insert({
            table: "Logs",
            values: [log],
            format: "JSONEachRow",
        });
        console.log("Insert data successfully");
        return { success: true, log };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export default insertData;
