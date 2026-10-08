import Customer from '../models/customer.model.js'
import Product from '../models/product.model.js'

const isValidId = (id) => /^[0-9a-fA-F]{24}$/.test(id)

// loads the user's cart with each product's CURRENT data (price, stock...) filled in
const loadCart = async (customerId) => {
    const customer = await Customer.findById(customerId).populate({
        path: 'cart.product',
        select: 'name price category image stock',
    })
    return customer.cart.filter((item) => item.product)
}

// POST /cart/:productId
export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params

        if (!isValidId(productId)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' })
        }

        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' })
        }

        const existing = req.user.cart.find((item) => item.product.equals(productId))
        const newQuantity = existing ? existing.quantity + 1 : 1

        if (newQuantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: product.stock === 0
                    ? 'Product is out of stock'
                    : `Only ${product.stock} unit(s) available`,
            })
        }

        if (existing) {
            await Customer.updateOne(
                { _id: req.user._id, 'cart.product': productId },
                { $set: { 'cart.$.quantity': newQuantity } }
            )
        } else {
            await Customer.updateOne(
                { _id: req.user._id },
                { $push: { cart: { product: productId, quantity: 1 } } }
            )
        }

        const cart = await loadCart(req.user._id)
        res.status(201).json({ success: true, message: 'Cart updated', cart })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

// GET /cart
export const getCart = async (req, res) => {
    try {
        const cart = await loadCart(req.user._id)
        res.status(200).json({ success: true, cart })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

// PATCH /cart/:productId   body: { quantity }
export const updateQuantity = async (req, res) => {
    try {
        const { productId } = req.params
        const { quantity } = req.body

        if (!isValidId(productId)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' })
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({ success: false, message: 'Quantity must be a whole number, at least 1' })
        }

        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' })
        }

        const inCart = req.user.cart.some((item) => item.product.equals(productId))
        if (!inCart) {
            return res.status(404).json({ success: false, message: 'Product not in cart' })
        }

        if (quantity > product.stock) {
            return res.status(400).json({ success: false, message: `Only ${product.stock} unit(s) available` })
        }

        await Customer.updateOne(
            { _id: req.user._id, 'cart.product': productId },
            { $set: { 'cart.$.quantity': quantity } }
        )

        const cart = await loadCart(req.user._id)
        res.status(200).json({ success: true, message: 'Quantity updated', cart })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

// DELETE /cart/:productId
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params

        if (!isValidId(productId)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' })
        }

        const inCart = req.user.cart.some((item) => item.product.equals(productId))
        if (!inCart) {
            return res.status(404).json({ success: false, message: 'Product not in cart' })
        }

        await Customer.updateOne(
            { _id: req.user._id },
            { $pull: { cart: { product: productId } } }
        )

        const cart = await loadCart(req.user._id)
        res.status(200).json({ success: true, message: 'Product removed from cart', cart })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}