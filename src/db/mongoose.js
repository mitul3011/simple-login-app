const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true
}, (error) => {
    if(error){
        throw new Error(error);
    }

    console.log('Successfully Connected to MongoDB.');
});