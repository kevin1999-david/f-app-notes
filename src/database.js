const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://kevin:kevin@cluster0.dsppt.mongodb.net/NOTES?retryWrites=true&w=majority', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
}).then(db => console.log('DB is connected'))
    .catch(
        err => console.error(err)
    );

