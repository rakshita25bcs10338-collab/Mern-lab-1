import jwt from 'jsonwebtoken'
//Generates and verifies JWTs — this is your jwt.sign() in genToken and jwt.verify() in isAuthenticated.
//signs JWTs
const genToken = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return token
}

export default genToken