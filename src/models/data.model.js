let mongoose = require('mongoose');

let schema = mongoose.Schema({
    data : {
        type : Object,
    }
})

let Data = mongoose.model('data', schema)

module.exports = {Data}