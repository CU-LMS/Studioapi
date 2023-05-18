const mongoose = require('mongoose');
const SlotSchema = mongoose.Schema({
    slotNo: {type: Number,required: true,unique: true},
    studioNo: {type: Number, required: true},
    type: {type: String, required: true},
    timingNo: {type:Number, required: true},
    slotBookingsData: [{
        user: {type: mongoose.Types.ObjectId, ref: "User"},
        userEmail: {type: String, required: true},
        date: {type:Date},
        program: {type: String},
        bookedAt: {type: Date, default: Date.now}
    }]
}, { timestamps: true })

module.exports = mongoose.model("Slot", SlotSchema);