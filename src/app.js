require('dotenv').config()
require('./conn.js')
let express = require('express')
let app = express()
let {Data} = require('./models/data.model')
let path = require('path')
const fetch = require('node-fetch');

let port = process.env.PORT || 3001;

app.get('/',(req,res)=>{
  // '67.250.186.196'
    const userIp = req.ip || req.connection.remoteAddress;
    getIpInfo(userIp);
   
    app.use(express.static(path.join(__dirname, '../dist')));

    res.sendFile(path.join(__dirname, '../dist/index.html'))
})




async function getIpInfo (ip){

  const accessKey = process.env.KEY;
  const url = 'https://apiip.net/api/check?ip='+ ip +'&accessKey='+ accessKey; 

  const response = await fetch(url);
  const result = await response.json();

  let isExist = await Data.findOne({data : result})
  if(isExist){
    return 
  }
  let savingData =await Data.create({data : result});

  await savingData.save()
};


app.listen(port, ()=>{
    console.log(port)
})

