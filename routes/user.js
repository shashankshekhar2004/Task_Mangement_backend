const express=require('express');
const router=express.Router();
const User=require('../models/user')
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
router.post('/sign-in',async(req,res)=>{
    try{
        //console.log(req.body.password);
        const {username,email,password}=req.body;
    const existingUser=await User.findOne({username:username});
    const existingEmail=await User.findOne({email:email});
    if(existingUser){
        return res.status(400).json({message:'Username already exists'});
    }
    else if(username.length<4){
        return res.status(400).json({message:'Username should be at least 4 characters long'});
    }
    if(existingEmail){
        return res.status(400).json({message:'Email already exists'});
    }
    const hashPass=await bcrypt.hash(password,10);
    const newUser=new User({username:username,email:email,password:hashPass});
    await newUser.save();
    res.status(201).json({message:'User created successfully'});

    }
    catch(error){
        console.error(error);
        res.status(500).json({error:error.message});
    }
})
router.post('/log-in', async (req, res) => {
    try {
        const { username, password } = req.body;
        //console.log(password);
        // Check if the user exists
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: existingUser._id, username: existingUser.username },
            process.env.SECRET_KEY,
            { expiresIn: "2d" }
        );

        res.json({ message: 'Logged in successfully', id: existingUser._id, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


module.exports=router;