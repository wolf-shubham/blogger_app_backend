const express = require('express')
const router = express()
const bcrypt = require('bcrypt')

const User = require('../models/User')
const Blog = require('../models/Blog')

router.put('/:id', async (req, res) => {
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    try {
        if (req.body.userId === req.params.id) {
            try {
                const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                    $set: req.body
                }, { new: true })
                res.status(201).json(updatedUser)
            } catch (error) {
                res.status(401).json(error)
            }
        }
    } catch (error) {
        res.status(402).json('user can updated his account only')
    }
})


router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            try {
                await Blog.deleteMany({ username: user.username })
                await User.findByIdAndDelete(req.params.id)
                res.status(201).json('User deleted')
            } catch (error) {
                res.status(401).json(error)
            }
        }
        catch (error) {
            res.status(500).json(error)
        }
    }
    else {
        console.log('you can delete your account ')
    }
}
)


router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router