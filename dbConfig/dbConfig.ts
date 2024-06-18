import mongoose from 'mongoose'

export async function connect(){
    try {
        console.log(process.env.MONGO_URI!)
        mongoose.connect(process.env.MONGO_URI!)
        const connection=mongoose.connection;


        connection.on('connected',()=>{
            console.log('Mongo db is connected successfully')
        })

        connection.on('error',(err)=>{
            console.log('MongoDB connection error')
            process.exit()
        })
    } catch (error) {
        console.log('Something goes wrong')
    }
}