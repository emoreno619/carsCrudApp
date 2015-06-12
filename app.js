var express = require("express"),
app = express(),
methodOverride = require("method-override"),
bodyParser = require("body-parser"),
request = require('request')

var db = require("./models")

var morgan = require("morgan")
app.use(morgan("tiny"))

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended:true}))
app.use(methodOverride("_method"))

app.get('/', function(req,res){
	res.redirect('/cars')
})

//Index

app.get('/cars', function(req,res){
	db.Car.find({}, function(err,cars){
		db.Book.find({}, function(err,books){
			res.render("cars/index", {cars:cars, books:books})
		})
	})
})

//New

app.get('/cars/new', function(req,res){
	res.render("cars/new")
})

//Show

app.get('/cars/:id', function(req,res){
	db.Car.findById(req.params.id, function(err, car){
		res.render("cars/show", {car:car})
	})
})

//Create

app.post('/cars', function(req,res){
	db.Car.create(req.body.car, function(err){
		res.redirect('/cars')
	})
})

app.get('/searchresults', function(req,res){
	var url = "https://www.googleapis.com/books/v1/volumes?q=" + encodeURIComponent(req.query.search)
	
	var result = []
	request.get(url, function(error, response, body){
		if(!error && response.statusCode === 200){
			var bookData = JSON.parse(body);

			for (var i = 0; i < 10 && i < bookData.totalItems; i++) {
				var aBook = {}
				if(bookData.items[i].volumeInfo.title)
					aBook.title = bookData.items[i].volumeInfo.title
				aBook.authors = bookData.items[i].volumeInfo.authors[0]
				console.log(bookData.items[i].volumeInfo.authors[0])
				aBook.date = bookData.items[i].volumeInfo.publishedDate
				aBook.rating = bookData.items[i].volumeInfo.averageRating
				if (bookData.items[i].volumeInfo.imageLinks)
				aBook.pic = bookData.items[i].volumeInfo.imageLinks.thumbnail
				if ((bookData.items[i].saleInfo.saleability != "FREE" && bookData.items[i].saleInfo.saleability != "NOT_FOR_SALE") || bookData.items[i].saleInfo.retailPrice)
					aBook.price = " Price: " + bookData.items[i].saleInfo.retailPrice.amount
				else 
					aBook.price = " Price: FREE"
				if (bookData.items[i].volumeInfo.industryIdentifiers){
					if (bookData.items[i].volumeInfo.industryIdentifiers[0])
						aBook.isbn = " ISBN: " + bookData.items[i].volumeInfo.industryIdentifiers[0].identifier
					else 
						aBook.isbn = " ISBN: " + bookData.items[i].volumeInfo.industryIdentifiers[1].identifier
				}	
				result.push(aBook)
			}
			res.render("cars/searchresults", {result:result})
		}
	})
})

app.post('/searchresults', function(req,res){
	console.log('hi')
	db.Book.create(req.body.book, function(err){
		res.redirect('/cars')
	})
})

//Edit

app.get('/cars/:id/edit', function(req,res){
	db.Car.findById(req.params.id, function(err, car){
		res.render('cars/edit', {car:car})
	})
})

//Update

app.put('/cars/:id', function(req,res){
	db.Car.findByIdAndUpdate(req.params.id,req.body, function(err){
		res.redirect('/')
	})
})

//Destroy

app.delete('/cars/:id', function(req,res){
	db.Car.findByIdAndRemove(req.params.id, function(err, book){
		res.redirect('/')
	})
})

app.listen(3000, function(){

})
