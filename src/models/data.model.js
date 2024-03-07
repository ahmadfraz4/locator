let mongoose = require("mongoose");

let schema = mongoose.Schema({
  joining: {
    type: String,
  },
  name: String,
  wifi: { type: Object },
  short: {
    type: Object,
  },
  data: {
    type: Object,
  },
});

let Data = mongoose.model("data", schema);

module.exports = { Data };
