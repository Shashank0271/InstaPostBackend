const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const createUser = async (req, res) => {
    console.log("entered create user controller");
    const newUser = await User.create(req.body);
    res.status(StatusCodes.OK).json({ message: 'user created successfully', newUser });
}

module.exports = {
    createUser,
}