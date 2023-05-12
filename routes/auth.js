const router = require('express').Router();
const User = require('../models/User')
const jwt = require('jsonwebtoken');

const JWT_EXPIRE = "1d"
const JWT_SECRET = "jlfdsahkj"
//Register
router.post("/register", async (req, res) => {
    const newUser =  new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        lastname: req.body.lastname,
        name: req.body.name
    })
    console.log("newUser===>", newUser);
    try {
        const savedUser = await newUser.save();
        console.log("savedUser ====>", savedUser);
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json(error);
    }
})

//LOGIN
router.post("/login", async (req, res) => {
    try {
        console.log("In Login ====>");
        //finding user with the provided username
        const user = await User.findOne({ email: req.body.email });
        console.log("User Details ====>", user);
        
        //if user does not exist
        if(!user){
            return res.status(401).json("Wrong credentials");
        }
        //calling insatance method to comparehashed password
        const isMatch = await user.comparePassword(req.body.password);
        if(!isMatch){
            return res.status(401).json("Wrong credentials");
        }
        
        //if every thing is okay then send the user details except password
        const accestoken = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET || JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE || JWT_EXPIRE})
        const { password, ...others } = user._doc;
        res.status(201).json({...others,accestoken});
    } catch (error) {
        // res.status(500).json(error);
        console.log(error)
    }
})

module.exports = router