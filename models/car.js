var mongoose = require("mongoose")

var carSchema = new mongoose.Schema({
	make : {type: String, required: true},
	model : {type: String, required: true},
	year : {type: Number, required: true},
	type : {type: String, required: true},
	photo : {type: String, required: true}
})

var Car = mongoose.model("Car", carSchema)

module.exports = Car;