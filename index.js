import express, {application} from "express"
import mongoose from "mongoose"
import sillycats from "./routes/sillycats.js";

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/silly-cats');
app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Silly Cats app listening on port ${process.env.EXPRESS_PORT}`)
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.use('/silly-cats', sillycats)