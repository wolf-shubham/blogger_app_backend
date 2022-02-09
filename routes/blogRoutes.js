const express = require('express')
const router = express()
const bcrypt = require('bcrypt')

const User = require('../models/User')
const Blog = require('../models/Blog')

router.post('/create', async (req, res) => {
    const newBlog = new Blog(req.body)
    try {
        const saveBlog = await newBlog.save()
        res.status(200).json(saveBlog)

    } catch (error) {
        res.status(401).json(error)
    }
})

router.put("/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog.username === req.body.username) {
            try {
                const updatedBlog = await Blog.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: req.body,
                    },
                    { new: true }
                );
                res.status(200).json(updatedBlog);
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(401).json("You can update only your post!");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog.username === req.body.username) {
            try {
                await blog.delete();
                res.status(200).json("Post has been deleted...");
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(401).json("You can delete only your post!");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        res.status(201).json(blog)
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/", async (req, res) => {
    const username = req.query.username;
    const category = req.query.category;
    try {
        let blogs;
        if (username) {
            blogs = await Blog.find({ username });
        } else if (category) {
            blogs = await Post.find({
                categories: {
                    $in: [category],
                },
            });
        } else {
            blogs = await Blog.find();
        }
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router