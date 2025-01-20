import express from "express";
import {faker} from "@faker-js/faker";
import SillyCat from "../schemas/SillyCat.js";

const router = express.Router()

router.get('/', async (req, res) => {
    try {
    const cats = await SillyCat.find({})
    const collection = (
        {
            "items": cats,
            "_links": {
                "self": {
                    "href": process.env.BASE_URL+"/silly-cats"
                },
                "collection": {
                    "href": process.env.BASE_URL+"/silly-cats"
                }
            }
        })
        res.status(200).json(collection) }
    catch (error) {
        res.status(400).send(error)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params
        const cat = await SillyCat.findById(id)
        const collection = (
            {
                "items": cat,
                "_links": {
                    "self": {
                        "href": process.env.BASE_URL+"/silly-cats"
                    },
                    "collection": {
                        "href": process.env.BASE_URL+"/silly-cats"
                    }
                }
            })
        res.status(200).json(collection) }
    catch (error) {
        res.status(400).send(error)
    }
})

router.post('/seed', async (req, res) => {
    try {
        let {amount, reset} = req.body

        if (reset === true) {
            await SillyCat.deleteMany()
        }

        for (let i = 0 ; i < amount; i++) {
            await SillyCat.create({
                name: faker.person.firstName(),
            })
        }
        res.status(200).json({success:true})
    } catch (error) {
        res.status(400).send(error)
    }
})

export default router