import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlist.controller.js'

const router = express.Router()

router.get('/', authMiddleware, getWishlist)
router.post('/:productId', authMiddleware, addToWishlist)
router.delete('/:productId', authMiddleware, removeFromWishlist)

export default router