import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
    tagName: {type: String, required: true},
},{
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {

            ret._links = {
                self: {
                    href: process.env.BASE_URL + `/silly-cats/${ret.id}`
                },
                collection: {
                    href: process.env.BASE_URL + `/silly-cats`
                }
            }

            delete ret._id
        }
    }
});


const Tag = mongoose.model("Tag", tagSchema)
export default Tag;