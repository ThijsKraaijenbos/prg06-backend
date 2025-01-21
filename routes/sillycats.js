import express from "express";
import {faker} from "@faker-js/faker";
import SillyCat from "../schemas/SillyCat.js";
import sillyCat from "../schemas/SillyCat.js";

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
            res.status(200).json(collection)
    }
    catch (error) {
        res.status(500).json(error)
    }
})

router.post('/', async(req, res) => {
    try {
        const {name, description, imgUrl} = req.body

        await SillyCat.create({
            name: name,
            description: description,
            imgUrl: imgUrl
        })

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

        const collection = (
            {
                "items": cat,
                "_links": {
                    "self": {
                        "href": process.env.BASE_URL+`/silly-cats/${id}`
                    },
                    "collection": {
                        "href": process.env.BASE_URL+`/silly-cats`
                    }
                }
            })
        res.status(200).json(collection)
    }
    catch (error) {
        res.status(400).json(error)
    }
})

router.put('/:id', async(req,res) => {
    try {
        const {id} = req.params
        const {name, description, imgUrl} = req.body

        // Validatie voor lege velden
        if (name === "" || description === "" || imgUrl === "") {
            return res.status(400).json({ message: 'Fields cannot be empty' });
        }

        const updateCat = await SillyCat.findByIdAndUpdate(id, {
            name,
            description,
            imgUrl
        });

        if (!updateCat) {
            return res.status(404).json({ message: 'Cat not found' });
        }

        // Teruggeven van de nieuwe versie
        const updatedCat = await SillyCat.findById(id);
        res.status(200).json(updatedCat);
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

router.post('/seed', async (req, res) => {
    try {
        let {amount, reset} = req.body

        if (reset === true) {
            await SillyCat.deleteMany()
        }

        for (let i = 0 ; i < amount; i++) {
            await SillyCat.create({
                name: faker.person.firstName(),
                description: faker.person.bio(),
                imgUrl: "https://static.wikia.nocookie.net/floppapedia-revamped/images/a/a4/Unico.jpg/revision/latest?cb=20221117214435"
            })
        }
        res.status(200).json({success:true})
    } catch (error) {
        res.status(400).send(error)
    }
})

export default router