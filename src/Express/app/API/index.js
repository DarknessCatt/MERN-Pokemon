const MongoClient = require('mongodb').MongoClient;
const mongo_uri = 'mongodb://mongo:27017';
const ObjectId = require('mongodb').ObjectId;

const Express = require('express')
const app = Express()
const cors = require('cors')
const port = 3000

app.get('/', (req, res) => {
	res.json({msg: 'Hello World!'})
})

app.get('/search', cors(), (req, res) => {
	const collection = req.app.locals.collection;
	const search = {}
	if (req.query.name			!== undefined){ search["name"]						= {$regex: req.query.name, $options: 'i'} }
	if (req.query.hp				!== undefined){ search["stats.hp"]				= req.query.hp }
	if (req.query.attack		!== undefined){ search["stats.attack"]		= req.query.attack }
	if (req.query.defense		!== undefined){ search["stats.defense"]		= req.query.defense }
	if (req.query.spattack	!== undefined){ search["stats.spattack"]	= req.query.spattack }
	if (req.query.spdefense	!== undefined){ search["stats.spdefense"]	= req.query.spdefense }
	if (req.query.speed			!== undefined){ search["stats.speed"]			= req.query.speed }
	collection.find(search).toArray(function(err, response) {
    if (err) throw err;
    res.status(200).json(response);
  });
	//collection.findOne(search).then(response => res.status(200).json(response)).catch(error => console.error(error));
});

MongoClient.connect(mongo_uri, { useNewUrlParser: true })
.then(client => {
	const db = client.db('pokemon');
	const collection = db.collection('pokemons');
	app.locals.collection = collection;
	app.listen(port, () => console.info(`REST API running on port ${port}`));
}).catch(error => console.error(error));