const router = require("express").Router();
const Slot = require("../models/Slot");

router.post("/", async (req, res) => {
  try {
    if (req.body) {
      console.log("req.body ===>", req.body);
      const slot = new Slot(req.body);
      await slot.save();
      console.log("slot created ====>", slot);

      return res.status(201).json({ msg: "slot created" });
    } else {
      return res.status(401).json({ msg: "bad request" });
    }
  } catch (error) {
    res.status(401).json({ msg: "there is some error", err: error.message });
  }
});

module.exports = router;
