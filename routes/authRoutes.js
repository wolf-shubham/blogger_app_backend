const express = require('express')
const router = express()
const bcrypt = require('bcrypt')

const User = require('../models/User')

router.post('/register', async (req, res) => {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass
        })

        const user = await newUser.save()
        res.status(200).json(user)

    } catch (error) {
        res.status(401).json(error)
    }
})


router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        !user && res.status(400).json('wrong')

        const comparePassword = await bcrypt.compare(req.body.password, user.password)
        !comparePassword && res.status(401).json('invalid credantials')

        res.status(200).json(user)

    } catch (error) {
        res.status(401).json(error)
    }
})

module.exports = router