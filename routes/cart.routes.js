import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import { addToCart, getCart, updateQuantity, removeFromCart } from '../controllers/cart.controller.js'

const router = express.Router()

router.use(authMiddleware) // every cart route needs a logged-in user

router.get('/', getCart)
router.post('/:productId', addToCart)
router.patch('/:productId', updateQuantity)
router.delete('/:productId', removeFromCart)

export default router