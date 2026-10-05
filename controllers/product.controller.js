import mongoose from "mongoose"
import Product from "../models/product.model.js"

// POST /products
export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(201).json({ success: true, product })
    } catch (error) {
        // missing field, bad price/stock, wrong type -> 400
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: error.message })
        }
        res.status(500).json({ message: 'Server crashed', error: error.message })
    }
}

// GET /products?search=&category=&sort=
export const getProducts = async (req, res) => {
    try {
        const { search, category, sort } = req.query
        const query = {}

        if (search && search.trim()) {
            // escape regex special characters so user input can't break the query
            const safe = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            query.name = { $regex: safe, $options: 'i' } // case-insensitive "contains"
        }

        if (category && category.trim()) {
            query.category = category.trim()
        }

        // bonus: sorting
        let sortOption = { createdAt: -1 }
        if (sort === 'price_asc') sortOption = { price: 1 }
        if (sort === 'price_desc') sortOption = { price: -1 }

        const products = await Product.find(query)
            .select('name price category image stock') // only what the listing UI needs
            .sort(sortOption)

        res.status(200).json({ success: true, count: products.length, products })
    } catch (error) {
        res.status(500).json({ message: 'Server crashed', error: error.message })
    }
}

// GET /products/:id
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product ID' })
        }

        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        res.status(200).json({ success: true, product })
    } catch (error) {
        res.status(500).json({ message: 'Server crashed', error: error.message })
    }
}