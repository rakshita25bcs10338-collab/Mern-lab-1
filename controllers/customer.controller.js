import Customer from "../models/customer.model.js"
import bcrypt from 'bcrypt'
import genToken from "../utils/generateToken.js"
//httpOnly cookies are not accessible via JavaScript, which helps mitigate the risk of client-side script attacks such as XSS. This is a security measure to protect the token from being accessed by malicious scripts running in the user's browser.
const cookieOptions = {
    httpOnly: true
}
//bussiness logic for customer registration, login, logout, and password change is implemented in this file. It handles the requests and responses related to customer authentication and authorization.
export const registerUser = async (req, res) => {
    try {
        const { fullName, phone, email, password } = req.body

        if (!fullName || !phone || !email || !password) {
            return res.status(400).json({ message: 'All fields Required' })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password should be at least 6 characters' })
        }

        const emailExists = await Customer.findOne({ email })
        if (emailExists) {
            return res.status(409).json({ message: 'User Already Exists' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newCustomer = await Customer.create({
            fullName,
            phone,
            email,
            password: hashedPassword
        })

        const token = genToken(newCustomer._id)
        res.cookie('token', token, cookieOptions)

        const customerResponse = {
            _id: newCustomer._id,
            fullName: newCustomer.fullName,
            email: newCustomer.email,
            phone: newCustomer.phone
        }

        res.status(201).json({ success: true, message: 'Customer registered successfully', customer: customerResponse })

    } catch (error) {
        res.status(500).json({ message: 'Server crashed', error: error.message })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields Required' })
        }

        const customer = await Customer.findOne({ email })
        if (!customer) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const passwordMatched = await bcrypt.compare(password, customer.password)
        if (!passwordMatched) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const token = genToken(customer._id)
        res.cookie('token', token, cookieOptions)

        res.status(200).json({ success: true, message: 'Login successful' })

    } catch (error) {
        res.status(500).json({ message: 'Server crashed', error: error.message })
    }
}

export const getMe = (req, res) => {
    const authenticatedCustomer = req.user
    res.status(200).json(authenticatedCustomer)
}

export const logoutUser = (req, res) => {
    res.clearCookie('token', cookieOptions)
    res.status(200).json({ success: true, message: 'Logged out successfully' })
}

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Both old and new passwords are required' })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password should be at least 6 characters' })
        }

        const customer = await Customer.findById(req.user._id)

        const passwordMatched = await bcrypt.compare(oldPassword, customer.password)
        if (!passwordMatched) {
            return res.status(401).json({ message: 'Old password is incorrect' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        customer.password = hashedPassword
        await customer.save()

        res.status(200).json({ success: true, message: 'Password changed successfully' })

    } catch (error) {
        res.status(500).json({ message: 'Server crashed', error: error.message })
    }
}