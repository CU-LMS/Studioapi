const mongoose = require('mongoose');
const SlotSchema = mongoose.Schema({
    slotNo: {type: Number,required: true},
    studioNo: {type: Number, required: true},
    type: {type: String, required: true},
    timingNo: {type:Number, required: true},
    slotBookingsData: [{
        user: {type: mongoose.Types.ObjectId, ref: "User"},
        date: {type:Date, unique: true},
        program: {type: String},
        bookedAt: {type: Date, default: Date.now}
    }]
}, { timestamps: true })

module.exports = mongoose.model("Slot", SlotSchema);