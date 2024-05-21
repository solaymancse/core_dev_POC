const express = require('express');
const router = express.Router();
const processModel = require('../models/processModel');


// Utility function to generate a random number
const generateRandomNumber = () => {
    return Math.floor(Math.random() * 1000000); // Adjust the range as needed
};

// Utility function to format dates
const formatDate = (date) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    const timeString = date.toLocaleString('en-US', options);
    const [time, period] = timeString.split(' ');
    const [hour, minute] = time.split(':');
    const formattedTime = `${hour}.${minute} ${period}`;
    const formattedDate = date.toLocaleDateString('en-GB').replace(/\//g, '.');
    return `${formattedTime} ${formattedDate}`;
  };
  
// Create an process
router.post('/create-process', async (req, res) => {
    const Process = new processModel({
        pid: generateRandomNumber(),
        creation_time: new Date(),
    });
    try {
        const newProcess = await Process.save();

        // Start logging every 5 seconds
        setInterval(async () => {
            newProcess.logs.push(new Date());
            await newProcess.save();
        }, 5000);

        res.status(201).json(newProcess);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all process except logs
router.get('/get-all', async (req, res) => {
    try {
        const processes = await processModel.find({}, { pid: 1, creation_time: 1 });
        const formattedProcesses = processes.map(process => ({
            pid: process.pid,
            creation_time: formatDate(new Date(process.creation_time)),
        }));
        res.json(formattedProcesses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Get logs for a specific PID
router.get('/get/:pid', async (req, res) => {
    try {
        const process = await processModel.findOne({ pid: req.params.pid });
        if (!process) {
            return res.status(404).json({ message: 'Process not found' });
        }
        const formattedLogs = process.logs.map(log => formatDate(new Date(log)));
        res.json({logs: formattedLogs});
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Delete a process
router.delete('/delete-process/:pid', async (req, res) => {
    try {
      const process = await processModel.findOneAndDelete({ pid: req.params.pid });
      if (!process) {
        return res.status(404).json({ message: 'Process not found' });
      }
  
      res.json({ pid: process.pid,message: 'The Process Has Been Successfully Deleted'});
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


module.exports = router;
