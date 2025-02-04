import express from "express";
import {faker} from "@faker-js/faker";
import SillyCat from "../schemas/SillyCat.js";

const router = express.Router()

router.get('/', async (req, res) => {
    try {

        const totalItems = await SillyCat.countDocuments()
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || parseInt(totalItems);
        const totalPages = Math.ceil(totalItems / limit)

        const cats = await SillyCat.find({})
            .skip((page - 1) * limit)
            .limit(limit);

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
                },
                "pagination": {
                    "currentPage": page,
                    "currentItems": limit,
                    "totalPages": totalPages,
                    "totalItems": totalItems,
                    "_links": {
                        "first": {
                            "page": 1,
                            "href": `${process.env.BASE_URL}/?page=1&limit=${limit}`
                        },
                        "last": {
                            "page": totalPages,
                            "href": `${process.env.BASE_URL}/?page=${totalPages}&limit=${limit}`
                        },
                        "previous": page > 1 ? {
                            "page": page - 1,
                            "href": `${process.env.BASE_URL}/?page=${page + 1}&limit=${limit}`
                        } : null,
                        "next": page < totalPages ? {
                            "page": page + 1,
                            "href": `${process.env.BASE_URL}/?page=${page + 1}&limit=${limit}`
                        } : null
                    }
                }
            })
        res.status(200).json(collection)
    }
    catch (error) {
        res.status(500).json(error)
    }
})

router.post('/', async(req, res) => {
    try {
        const {name, description, displayTag, imgUrl, furColor, birthDate, gender, method, amount, reset} = req.body

        if (method === "SEED") {

            if (!amount) {
                return res.status(400).json({message: "Please enter an amount to seed"})
            }

            if (reset === true) {
                await SillyCat.deleteMany()
            }

            for (let i = 0 ; i < amount; i++) {
                await SillyCat.create({
                    name: faker.person.firstName(),
                    description: faker.person.bio(),
                    displayTag: "Seed",
                    imgUrl: faker.image.urlLoremFlickr({height: 200, width:200, category: 'cat'}),
                    furColor: faker.helpers.arrayElement(['red', 'tuxedo', 'brown', 'black', 'white', 'calico']),
                    birthDate: faker.date.anytime(),
                    gender: faker.person.sex(),
                })
            }
            return res.status(200).json({success:true, message: "Successfully ran seeder"})
        }
        
        const createCat = await SillyCat.create({
            name,
            description,
            displayTag: displayTag ?? "Silly",
            imgUrl,
            furColor,
            birthDate,
            gender
        })

        // console.log("body="+ JSON.stringify(req.body, null, 4))
        // console.log("createCat="+ createCat)

        res.status(201).json({success:true})

        } catch (error) {
        res.status(400).json(error)
    }
})

router.options('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.sendStatus(204)
})

router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params
        const cat = await SillyCat.findById(id)

        if (!cat) {
            return res.status(404).send("Cat with this ID doesn't exist")
        }

        res.status(200).json(cat)
    }
    catch (error) {
        res.status(400).json(error)
    }
})

router.put('/:id', async(req,res) => {
    try {
        const {id} = req.params
        const {name, description, displayTag, imgUrl, furColor, birthDate, gender} = req.body

        const updateCat = await SillyCat.findByIdAndUpdate(id, {
            name,
            description,
            displayTag: displayTag ?? "Silly",
            imgUrl,
            furColor,
            birthDate,
            gender
        }, {
            new: true,
            runValidators: true
        });


        if (!updateCat) {
            return res.status(404).json({ message: 'Cat not found' });
        }

        // const updatedCatDebugging = await SillyCat.findById(id)
        // console.log("body="+ JSON.stringify(req.body, null, 4))
        // console.log("updateCat="+ updatedCatDebugging)

        res.status(200).json(updateCat);

    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/:id', async(req,res) => {
    try {
        const {id} = req.params

        const removeCat = await SillyCat.findByIdAndDelete(id)

        if (!removeCat) {
            return res.status(404).send("Cat with this ID doesn't exist")
        }

        res.sendStatus(204)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.options('/:id', (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS')
    res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS');
    res.sendStatus(204)
    console.log("attempted to go through preflight")
})

export default router