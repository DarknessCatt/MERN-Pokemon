const MongoClient = require('mongodb').MongoClient;
const mongo_uri = 'mongodb://mongo:27017';
const ObjectId = require('mongodb').ObjectId;

const Express = require('express')
const app = Express()
const cors = require('cors')
const bodyParser = require('body-parser');
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function GetURLArgs(req) {
  const search = {}
  if (req.query.name      !== undefined){ search["name"]            = {$regex: req.query.name, $options: 'i'} }
  if (req.query.hp        !== undefined){ search["stats.hp"]        = req.query.hp }
  if (req.query.attack    !== undefined){ search["stats.attack"]    = req.query.attack }
  if (req.query.defense   !== undefined){ search["stats.defense"]   = req.query.defense }
  if (req.query.spattack  !== undefined){ search["stats.spattack"]  = req.query.spattack }
  if (req.query.spdefense !== undefined){ search["stats.spdefense"] = req.query.spdefense }
  if (req.query.speed     !== undefined){ search["stats.speed"]     = req.query.speed }
  return search
}

app.get('/', (req, res) => {
  res.json({msg: 'Hello World!'})
})

app.get('/search', cors(), (req, res) => {
  const collection = req.app.locals.collection;
  const search = GetURLArgs(req);
  collection.find(search).toArray(function(err, response) {
    if (err) throw err;
    res.status(200).json(response);
  });
});

app.post('/create', cors(), (req, res) => {
  const collection = req.app.locals.collection;

  if(req.body.hasOwnProperty("name") && req.body.hasOwnProperty("stats") &&
    req.body.stats.hasOwnProperty("hp") && req.body.stats.hasOwnProperty("attack") &&
    req.body.stats.hasOwnProperty("defense") && req.body.stats.hasOwnProperty("spattack") &&
    req.body.stats.hasOwnProperty("spdefense") && req.body.stats.hasOwnProperty("speed"))
    collection.findOne({"name": req.body.name}, function(err, response) {
      if (err) throw err;
      if (response !== null){
        res.status(409).json({"msg": "Duplicate!"})
      }
      else{
        collection.insertOne(req.body, function(err, response) {
          if (err) throw err;
          res.status(200).json({"msg": "Inserted!", "data": req.body});
        });
      }
    });

  else{
    res.status(400).json({"msg": "Invalid Data!"})
  }
});

MongoClient.connect(mongo_uri, { useNewUrlParser: true })
.then(client => {
  const db = client.db('pokemon');
  const collection = db.collection('pokemons');
  app.locals.collection = collection;
  app.listen(port, () => console.info(`REST API running on port ${port}`));
}).catch(error => console.error(error));