import mongoose from "mongoose";
const { MONGO_URI } = process.env;
// mongoose connection string and server connection

exports.connect = () => {
mongoose.connect(MONGO_URI, {}).then(result=>{
        console.log('Database Connected')
        
    }).catch(error=>{
        console.log("database connection failed. exiting now...");
        console.error(error);
    })

}