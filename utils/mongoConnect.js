const mongoose = require('mongoose')

module.exports = () => {mongoose.connect('mongodb://localhost:27017/bookshelf', {
    useNewUrlParser: true,
    useUnifiedTopology: true  
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})};