import Customer from '../models/customer.model.js'
import Product from '../models/product.model.js'

const isValidId = (id) => /^[0-9a-fA-F]{24}$/.test(id)

// POST /wishlist/:productId
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params

        if (!isValidId(productId)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' })
        }

        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' })
        }

        // req.user comes from the auth middleware (never from the request body)
        const alreadySaved = req.user.wishlist.some((id) => id.equals(productId))
        if (alreadySaved) {
            return res.status(409).json({ success: false, message: 'Product already in wishlist' })
        }

        await Customer.findByIdAndUpdate(req.user._id, {
            $addToSet: { wishlist: productId },
        })

        res.status(201).json({ success: true, message: 'Product added to wishlist' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

// GET /wishlist
export const getWishlist = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id).populate({
            path: 'wishlist',
            select: 'name price category image stock',
        })

        const wishlist = customer.wishlist.filter(Boolean)

        res.json({ success: true, count: wishlist.length, wishlist })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

// DELETE /wishlist/:productId
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params

        if (!isValidId(productId)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' })
        }

        const isSaved = req.user.wishlist.some((id) => id.equals(productId))
        if (!isSaved) {
            return res.status(404).json({ success: false, message: 'Product not in wishlist' })
        }

        await Customer.findByIdAndUpdate(req.user._id, {
            $pull: { wishlist: productId },
        })

        res.json({ success: true, message: 'Product removed from wishlist' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}