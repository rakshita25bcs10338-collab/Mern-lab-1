import express from 'express'
import { createProduct, getProducts, getProductById } from '../controllers/product.controller.js'

const router = express.Router()

// open APIs for this lab (admin auth comes in a later lab)
router.post('/', createProduct)
router.get('/', getProducts)
router.get('/:id', getProductById)

export default router