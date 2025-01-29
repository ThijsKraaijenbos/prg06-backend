import mongoose from 'mongoose';

const sillyCatSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    displayTag: {type: String, required: true, max: 5},
    imgUrl: {type: String, required: true},
},{
    // timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {

            ret._links = {
                self: {
                    href: `${process.env.BASE_URL}/silly-cats/${ret.id}`
                },
                collection: {
                    href: `${process.env.BASE_URL}/silly-cats`
                }
            }

            delete ret._id
        }
    }
});


const SillyCat = mongoose.model("SillyCat", sillyCatSchema)
export default SillyCat;