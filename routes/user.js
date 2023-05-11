const router = require('express').Router();
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken")
const bcrypt = require("bcryptjs");
const User = require('../models/User');

//in all the routes below we have used verifyTokenAnd... middleware which are imported from a file, which basically calls next fxn after getting jsonwebtoken from the headers and verifying it. if next fxn within them is called then the async fxn get it's turn to run


//delete user
router.delete("/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json("User deleted sucessfully!")
    } catch (error) {
        res.status(500).json(error);
    }
})

//find a single user, only admin can do that
router.get("/find/:userId", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json(error);
    }
})

//finding all users, only admin can do that
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    //if you have specified some query in the url then get it
    const query = req.query.new;
    try {
        //if there is query then sort in descending order of id
        const users = query ? await User.find().sort({ _id: -1 }) : await User.find()
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router