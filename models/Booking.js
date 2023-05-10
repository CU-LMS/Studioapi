const mongoose = require('mongoose');
const User = require('./User')
const BookingDataSchema = mongoose.Schema({
    user: {type: mongoose.Types.ObjectId, ref: "User"},
    program: {type: String, required: true},
    date: {type: Date, required: true},
})



module.exports = mongoose.model("BookingData", BookingDataSchema)

