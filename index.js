const express=require('express')
require('dotenv').config()
const app=express()
require('./config/db')
const router=require('./router/paymentrouter')
const cors=require('cors')
app.use(cors())


app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json())
app.use(router)




app.listen(3000,()=>{
    console.log('server running successfully')
})