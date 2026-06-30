const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [ 3, 'First name must be at least 3 characters long' ],
        },
        lastname: {
            type: String,
            minlength: [ 3, 'Last name must be at least 3 characters long' ],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [ 5, 'Email must be at least 5 characters long' ],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
        select: false,
    },
    otpExpires: {
        type: Date,
        select: false,
    },
    monthlyBudget: {
        type: Number,
        default: 0,
        min: 0,
    },
    lastBudgetAlertMonth: {
        type: String,
        default: "",
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
})


userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateOtp = async function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = await bcrypt.hash(otp, 10);
    this.otpExpires = Date.now() + 10 * 60 * 1000;
    await this.save();
    return otp;
}

userSchema.methods.verifyOtp = async function (otp) {
    if (!this.otp || !this.otpExpires || this.otpExpires < Date.now()) {
        return false;
    }

    return await bcrypt.compare(otp, this.otp);
}

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model('user', userSchema);


module.exports = userModel;
