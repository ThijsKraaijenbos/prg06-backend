import express, {application} from "express"
import mongoose from "mongoose"
import sillycats from "./routes/sillycats.js";

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/silly-cats');
mongoose.set('debug', true); // Dit laat zien in console welke queries worden uitgevoerd


app.use((req, res, next) => {
    const acceptHeader = req.headers['accept'];

    if (acceptHeader.includes('application/json')) {
        next()
    } else {
        res.status(400).send('Illegal format');
    }
})


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'application/json');
    next()
})

//Debugging
// app.use((req, res, next) => {
//     console.log("Content-Type:", req.headers['content-type'], "Method:", req.method);
//     console.log("Accept:", req.headers['accept']);
//     next();
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/silly-cats', sillycats)

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Silly Cats app listening on port ${process.env.EXPRESS_PORT}`)
})