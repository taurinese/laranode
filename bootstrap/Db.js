const { Client } = require('pg')
const db_config = require("../config/app")


module.exports = class Db {
    connect = () => {
        const client = new Client(db_config)
        client.connect(err => {
            if (err) {
                console.log('DB connection error', err.stack)
            }
            else {
                console.log('DB connected')
            }
        })
        return client;
    }
}