import clickhouse from "../../config/clickhouse.js";

async function createDatabase() {
    await clickhouse.command({
        query: `CREATE DATABASE IF NOT EXISTS demo`
    })

}
async function createTable() {

    await clickhouse.command({
        query: `CREATE TABLE IF NOT EXISTS Logs (
        id String,
        service String,
        level String,
        message String,
        timestamp DateTime64(3)
    )
      ENGINE = MergeTree()
      ORDER BY timestamp
    
    `
    })
    console.log("Table created successfully");

}

createDatabase().then(() => {
    createTable();
    console.log("Databse Created Successfully")
}).catch((err) => {
    console.log("Error in creating database", err);
})
