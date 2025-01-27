import express from "express";
import {faker} from "@faker-js/faker";
import SillyCat from "../schemas/SillyCat.js";
import sillyCat from "../schemas/SillyCat.js";

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const cats = await SillyCat.find({})
            .skip((page - 1) * limit)
            .limit(limit);

        const totalItems = await sillyCat.countDocuments()
        const totalPages = totalItems / limit

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
                        "previous": null,
                        "next": {
                            "page": page + 1,
                            "href": `${process.env.BASE_URL}/?page=${page + 1}&limit=${limit}`
                        }
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
        const {name, description, imgUrl, method, seedAmount, reset} = req.body

        if (reset === true) {
            await SillyCat.deleteMany()
        }

        if (method === "SEED") {
            for (let i = 0 ; i < seedAmount; i++) {
                await SillyCat.create({
                    name: faker.person.firstName(),
                    description: faker.person.bio(),
                    imgUrl: "https://static.wikia.nocookie.net/floppapedia-revamped/images/a/a4/Unico.jpg/revision/latest?cb=20221117214435"
                })
            }
            res.status(200).json({success:true})
        }
        
        const createCat = await SillyCat.create({
            name,
            description,
            imgUrl
        })

        console.log("body="+ JSON.stringify(req.body, null, 4))
        console.log("createCat="+ createCat)

        res.status(201).json({success:true})

        } catch (error) {
        res.status(401).json(error)
    }
})

router.options('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', ['GET','POST', 'OPTIONS'])
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.status(204).send()
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
        const {name, description, imgUrl} = req.body

        const updateCat = await SillyCat.findByIdAndUpdate(id, {
            name,
            description,
            imgUrl
        }, {
            new: true,
            runValidators: true
        });

        if (!updateCat) {
            return res.status(404).json({ message: 'Cat not found' });
        }

        const updatedCatDebugging = await SillyCat.findById(id)

        res.status(200).json(updatedCatDebugging);

        // console.log("body="+ JSON.stringify(req.body, null, 4))
        // console.log("updateCat="+ updatedCatDebugging)
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/:id', async(req,res) => {
    try {
        const {id} = req.params

        const removeCat = await SillyCat.findByIdAndDelete(id)

        if (!removeCat) {
            return res.status(400).send("Cat with this ID doesn't exist")
        }

        res.sendStatus(204)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.options('/:id', (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', ['GET','POST','PUT','OPTIONS'])
    res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS');
    res.status(204).send()
})

export default router