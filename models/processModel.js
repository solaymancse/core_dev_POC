const mongoose = require('mongoose');

const processSchema = new mongoose.Schema({
    pid: { type: Number, required: true },
    creation_time: { type: Date, required: true },
    logs: [{
        type: Date
    }]
});

module.exports = mongoose.model('Process', processSchema);
