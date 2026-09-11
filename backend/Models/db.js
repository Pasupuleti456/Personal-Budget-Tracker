require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');

try {
    dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

const mongo_url = process.env.MONGO_CONN || 'mongodb://127.0.0.1:27017/tracker';
const fallback_url = 'mongodb://127.0.0.1:27017/tracker';

mongoose.connect(mongo_url, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('MongoDB Connected successfully...');
    })
    .catch((err) => {
        console.log('MongoDB Primary Connection Error: ', err.message);
        if (mongo_url !== fallback_url) {
            console.log('Attempting connection to local MongoDB instance...');
            mongoose.connect(fallback_url, {})
                .then(() => {
                    console.log('MongoDB Connected successfully (Local Instance)...');
                })
                .catch((fallbackErr) => {
                    console.log('MongoDB Connection Error: ', fallbackErr.message);
                });
        }
    });


