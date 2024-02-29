import mongoose from 'mongoose'
const connect = async ()=>{

    // if(mongoose.connection[0].readyState) return;
    try{
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Database Connected")
    } catch(error){
        // console.log(err)
        throw new Error("Error connecting to Mongoose")
    }
}
export default connect;
