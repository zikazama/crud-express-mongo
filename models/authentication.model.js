const mongoose = require('mongoose');

const RefreshTokenSchema = mongoose.Schema({
    refreshToken: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Authentication', RefreshTokenSchema);