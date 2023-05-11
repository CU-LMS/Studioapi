const router = require('express').Router();
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken")
const User = require('../models/User');
const Slot = require('../models/Slot');
const sendEmail = require('./email');
const bookingDoneTemplateId = process.env.BOOKINGDONEEMAILTEMPLATE
const getTimingNoString = (timingNO) => {
  let time = ""
  switch (timingNO) {
    case 1:
      time = "10-11"
      break;
    case 2:
      time = "11:30-12:30"
      break;
    case 3:
      time = "2-3"
      break;
    case 4:
      time = "3:15-4:15"
      break;
    default:
      return ""
      break;
  }
  return time
}

//in all the routes below we have used verifyTokenAnd... middleware which are imported from a file, which basically calls next fxn after getting jsonwebtoken from the headers and verifying it. if next fxn within them is called then the async fxn get it's turn to run
// program to get a random item from an array

function getRandomItem(arr) {

  // get random index value
  const randomIndex = Math.floor(Math.random() * arr.length);

  // get random item
  const item = arr[randomIndex];

  return item;
}

//create a booking
router.post("/", verifyTokenAndAuthorization, async (req, res, next) => {
  try {
    const availableSlots = await Slot.find({
      "type": req.body.type,
      "timingNo": req.body.timingNo,
      'slotBookingsData.date': { $ne: new Date(req.body.slotBookingData.date) }
    })
    if (!availableSlots.length) {
      return res.status(400).json({ msg: "all slots of selected dates and selected type are full now!" })
    }
    const slotNos = availableSlots.map(slot => slot.slotNo)
    const randomSlotNo = getRandomItem(slotNos)

    const updatedSlot = await Slot.findOneAndUpdate(
      {
        "slotNo": randomSlotNo,
        'slotBookingsData.date': { $ne: new Date(req.body.slotBookingData.date) }
      },
      {
        $push: {
          "slotBookingsData": req.body.slotBookingData
        },
      }, { new: true }
    );
    const subject = `Studio Booking confirmed`


    const dynamicTemplateData = {
      email: req.body.email,
      type: req.body.type,
      date: req.body.slotBookingData.date,
      program: req.body.slotBookingData.program,
      timing: getTimingNoString(req.body.timingNo),
      slotNo: Math.trunc(randomSlotNo / 10),
    }
    await sendEmail(req, res, req.body.email, subject, bookingDoneTemplateId, dynamicTemplateData)
    res.status(200).json(`booking has been made in studio ${Math.trunc(randomSlotNo / 10)} and slot ${randomSlotNo % 10}`)
  } catch (err) {
    res.status(401).json("there is error in backend code or postman query");
    console.log(err)
  }
})

//get booking on a particular date
router.post("/status", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const slots = await Slot.find({ 'slotBookingsData.date': { $eq: new Date(req.body.date) } });
    const slotNos = slots.map(slot => slot.slotNo)
    res.status(200).json(slotNos)
  } catch (err) {
    console.log(err)
  }
})

//get booking on a particular date and particular type
router.post("/status/:type", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const slots = await Slot.find({
      'slotBookingsData.date': { $eq: new Date(req.body.date) },
      'type': { $eq: req.params.type }
    });

    const slotNos = slots.map(slot => slot.slotNo)
    res.status(200).json(slotNos)
  } catch (err) {
    console.log(err)
    res.status(401).json({ msg: "there is some error", err: err.message })
  }
})

//deprecated
// router.put("/update", async (req, res) => {
//   try {
//     await Slot.findOneAndUpdate({ slotNo: req.body.slotNo }, { timingNo: req.body.timingNo })
//     res.status(201).json({ msg: "slot updates successully" })
//   } catch (error) {
//     res.status(401).json({ msg: "there is some error", err: error.message })
//   }
// })

router.delete("/delete", async (req, res) => {
  try {
    await Slot.findOneAndUpdate({ studioNo: req.body.studioNo, timingNo: req.body.timingNo }, {
      $pull: {
        slotBookingsData: { date: req.body.date }
      }
    })
    res.json({ msg: "done" })
  } catch (error) {
    console.log(error)
    res.json({ msg: "there is some error", err: error.message })
  }
})

router.post("/history", async(req,res)=>{
  try {
    const bookings = await Slot.find({'slotBookingsData.user': {$eq: req.body.userId}},{type: 1, timingNo: 1,studioNo:1,slotNo:1,slotBookingsData: 1})
    res.status(201).json({count: bookings.length, bookings})
  } catch (error) {
    res.status(401).json({msg: 'there is some error', err: error.message})
    
  }
})

module.exports = router