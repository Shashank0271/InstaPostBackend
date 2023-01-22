const { StatusCodes } = require('http-status-codes');
const { CustomAPIError } = require('../errors/custom-error');
const User = require('../models/User');

const createUser = async (req, res) => {
    console.log("entered create user controller");
    const newUser = await User.create(req.body);
    res.status(StatusCodes.OK).json({ message: 'user created successfully', newUser });
}

const getUser = async (req, res) => {
    console.log("entered get user controller");
    const firebaseUid = req.params.id;
    const user = await User.find({ firebaseUid: firebaseUid });
    if (user.length == 0)
        throw new CustomAPIError('user does not exist', StatusCodes.NOT_FOUND);
    res.status(StatusCodes.OK).json(user);
}

module.exports = {
    createUser,
    getUser,
}