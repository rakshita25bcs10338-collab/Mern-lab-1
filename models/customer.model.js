import mongoose from "mongoose";
//this is schema for the customer model
const customerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
    }
}, { timestamps: true })

const Customer = mongoose.model('Customer', customerSchema)

export default Customer