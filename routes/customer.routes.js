import express from 'express'
import { registerUser, loginUser, getMe, logoutUser, changePassword } from '../controllers/customer.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'

const router = express.Router()
//path → middleware → controller wiring
//The router defines the routes for customer-related operations, such as registration, login, retrieving user information, logout, and password change. Each route is associated with a specific controller function that handles the corresponding request.
//what is middleware? Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. They can execute code, make changes to the request and response objects, end the request-response cycle, and call the next middleware function in the stack. In this case, authMiddleware is used to protect certain routes by verifying the user's authentication status before allowing access to those routes.
//u told that middleware is used to make changes in password and how come this helps with getme??
//so this is how middleware works, it checks if the user is authenticated by verifying the token in the cookie. If the user is authenticated, it allows access to the protected routes like getMe and changePassword. If not, it returns an unauthorized response. This way, only authenticated users can access their own information and change their password.
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', authMiddleware, getMe)
router.post('/logout',authMiddleware, logoutUser)
router.patch('/change-password', authMiddleware, changePassword)

export default router