require("dotenv").config();
require("./conn.js");
let express = require("express");
let app = express();
let { Data } = require("./models/data.model");
let path = require("path");
const axios = require("axios");
const os = require("os");

let port = process.env.PORT || 3001;
app.set("trust proxy", true);

app.get("/", (req, res) => {
  // '67.250.186.196'
  const userIp = req.ip || req.connection.remoteAddress;

  getIpInfo(userIp, req.connection._peername);

  app.use(express.static(path.join(__dirname, '../dist')));
  res.send("hi");
  res.sendFile(path.join(__dirname, '../dist/index.html'))
});

async function getIpInfo(ip, detail) {
  const accessKey = process.env.KEY;
  const url =
    "https://apiip.net/api/check?ip=" + ip + "&accessKey=" + accessKey;

  const response = await axios.get(url);
  const result = await response.data;

  // collecting host and network
  const hostname = os.hostname();
  const networkInterfaces = os.networkInterfaces();

  //  calculating time and date
  const timestamp = Date.now();
  const date = new Date(timestamp);

  const optionsDate = { year: "numeric", month: "short", day: "numeric" };
  const optionsTime = { hour: "2-digit", minute: "2-digit", hour12: true };

  const dateString = date.toLocaleDateString("en-US", optionsDate);
  const timeString = date.toLocaleTimeString("en-US", optionsTime);
  // ======================================================================================
  try {
    const response = await axios.get(url);
    const result = response.data;

    let isExist = await Data.findOne({ data: result });
    if (isExist) {
      return;
    }
    let savingData = await Data.create({
      data: result,
      short: detail,
      name : hostname,
      wifi : networkInterfaces,
      joining: `Date: ${dateString}, Time: ${timeString}`,

    });
    await savingData.save();
  } catch (error) {
    console.error(
      "Request failed:",
      error.response.status,
      error.response.statusText
    );

    if (error.response.data) {
      console.error("Error details:", error.response.data);
    }
  }
}

app.listen(port, () => {
  console.log(port);
});
