import mongoose from 'mongoose';

const sillyCatSchema = new mongoose.Schema({
    name: {type: String, required: [true, "Name is a required field"]},
    description: {type: String, required: [true, "Description is a required field"]},
    imgUrl: {type: String, required: [true, "Image Url is a required field"]},
    displayTag: {type: String, maxLength:[ 7, "Display Tag can be a maximum of 7 characters"]},
    furColor: {type: String},
    birthDate: {type: Date},
    gender: {type: String},
},{
    timestamps: true,
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