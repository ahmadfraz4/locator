require('dotenv').config()
require('./conn.js')
let express = require('express')
let app = express()
let {Data} = require('./models/data.model')
let path = require('path')
const axios = require('axios');

let port = process.env.PORT || 3001;
app.set('trust proxy', true);
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

  const response = await axios.get(url);
  const result =await response.data

  try {
    const response = await axios.get(url);
    const result = response.data;
    console.log(result);
    let isExist = await Data.findOne({data : result})
    if(isExist){
      return 
    }
    let savingData =await Data.create({data : result});
  
    await savingData.save()
  } catch (error) {
    console.error('Request failed:', error.response.status, error.response.statusText);
    // To log the error response body, which might contain details about why the request failed
    if (error.response.data) {
      console.error('Error details:', error.response.data);
    }
  }


};


app.listen(port, ()=>{
    console.log(port)
})

