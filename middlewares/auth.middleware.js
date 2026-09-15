import jwt from 'jsonwebtoken'
import Customer from "../models/customer.model.js"
//Middleware that reads the Cookie header on incoming requests and populates req.cookies — without it, req.cookies.token would be undefined.
//JWT verification, attaches req.user to the request object if the token is valid, allowing access to protected routes. If the token is invalid or missing, it returns an unauthorized response.
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const customer = await Customer.findById(decoded.id).select('-password')

        if (!customer) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        req.user = customer
        next()

    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
}

export default authMiddleware