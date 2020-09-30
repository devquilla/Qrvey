const mongoose = require('mongoose')

const CLOUD_DATABASE = 'mongodb+srv://dev_user:*Lu1sM0l1n4$@cluster0.pkxkh.mongodb.net/personal?retryWrites=true&w=majority'
const LOCAL_DATABASE = 'mongodb://127.0.0.1:27017/personal'

mongoose.connect(CLOUD_DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database: MongoDB is connected')
}).catch(err => {
    console.error(err)
})