var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var parseUrlEncoded = bodyParser.urlencoded({extended: false});

var blocks = {
	'Fixed':'Fastened securely in position',
	'Movable':'Capable of being moved',
	'Rotating':'Moving in a circle around its center'
};

var locations = {
	'Fixed': 'First floor', 'Movable': 'Elevator', 'Rotating': 'Penthouse'
};

var logger = require('./logger');
app.use(logger);


app.param('name', function(request, response, next){
	var name = request.params.name;
	var block = name[0].toUpperCase() + name.slice(1).toLowerCase();
	request.blockName = block;
	next();
});



app.get('/', function(request, response) {
	//1)response.send('Huilo woorld');
	//5)
	response.sendFile(__dirname + '/public/index2.html');
});


app.get('/blocks', function(request, response) {
	//2) response.send(blocks);
	//3) response.json(blocks);
	//4) response.redirect('/parts');
	//7) response.redirect(301, '/parts');
	
	/*xxx
	if(request.query.limit >= 0) {
		response.json(blocks.slice(0, request.query.limit));
	} else {
		response.send(blocks);
	}
	*/

	response.json(Object.keys(blocks));
});

app.get('/blocks/:name', function(request, response){
	
	var description = blocks[request.blockName];

	if(!description) {
		response.status(404)
		.json('No description found for ' + request.params.name);
	} else {
		response.json(description);
	}
});

app.post('/blocks', parseUrlEncoded, function(request, response){
	var newBlock = request.body;
	blocks[newBlock.name] = newBlock.description;
	console.log(blocks);
	response.status(201).json(newBlock.name);
});

app.delete('/blocks/:name', function(request, response){
	console.log(request.blockName);
	delete blocks[request.blockName];
	console.log(blocks);
	response.sendStatus(200);
});

app.get('/locations/:name', function(request, response){
	var location = locations[request.blockName];

	if(!location) {
		response.status(404)
		.json('No location found for ' + request.params.name);
	} else {
		response.json(location);
	}
});


//6
app.use(express.static('public'));


/*
app.use(function(request, response, next){
	next();
});
*/

var port = 3000;
app.listen(port, function(){
	console.log('Listening on ' + port)
});