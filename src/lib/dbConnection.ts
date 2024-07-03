import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: Number
}

const connection: ConnectionObject = {}

const dbConnect = async (): Promise<void> =>{
    if(connection.isConnected){
        console.log("DB already connected")
        return 
    }
    try{
        const db = await mongoose.connect(process.env.MONOGO_URI || "",{})

        connection.isConnected = db.connections[0].readyState

        console.log("DB connection successfull")
    }catch(error){

        console.log("DB connection failed")

        process.exit(1)

    }
}

export default dbConnect