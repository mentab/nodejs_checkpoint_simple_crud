const { MongoClient, ServerApiVersion } = require("mongodb")

const uri = "mongodb://localhost:27017"

async function connectToDatabase() {
    const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    })

    try {
        await client.connect()
        console.log("Connection successfull")
        return client
    } catch(error) {
        console.error("Connection error")
    }
}


async function disconnectFromDatabase(client) {
    await client.close()
    console.log("Connection closed")
}

module.exports = { connectToDatabase, disconnectFromDatabase }