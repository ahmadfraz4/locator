require('dotenv').config();
let mongoose = require('mongoose')

mongoose.connect(process.env.MONGO).then(() => console.log('connected')).catch((err)=>console.log('abc'))
