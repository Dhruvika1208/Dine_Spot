const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/dinespot';
    console.log('Connecting to Mongo:', mongoURI);
    await mongoose.connect(mongoURI);
    console.log('Connected!');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:');
    for (const col of collections) {
        const count = await mongoose.connection.db.collection(col.name).countDocuments();
        console.log(` - ${col.name}: ${count} documents`);
    }

    await mongoose.disconnect();
    console.log('Disconnected!');
}

check().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
