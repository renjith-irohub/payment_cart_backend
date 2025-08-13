const mongoose=require('mongoose')

const connectdb=async()=>{
try {
       await mongoose.connect(process.env.MONGOURI)
       console.log('mongodb connected successfuly') 
} catch (error) {
   console.log('mongodb connection error',error) 
}


}
connectdb()
