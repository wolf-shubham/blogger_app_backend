const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const multer = require('multer')

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const blogRoutes = require('./routes/blogRoutes')
const categoryRoutes = require('./routes/categoryRoute')


dotenv.config()
app.use(express.json())

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log('mongoDB connected'))
    .catch((err) => console.log(err));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded");
});

app.use('/auth/', authRoutes)
app.use('/user/', userRoutes)
app.use('/blog/', blogRoutes)
app.use('/category', categoryRoutes)

app.listen('5000', () => {
    console.log('server is running')
})