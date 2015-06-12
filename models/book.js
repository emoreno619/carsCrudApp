var mongoose = require("mongoose")

var bookSchema = new mongoose.Schema({
	title : {type: String},
	authors : {type: String},
	date : {type: String},
	price : {type: String},
	pic : {type: String}
})

var Book = mongoose.model("Book", bookSchema)

module.exports = Book;