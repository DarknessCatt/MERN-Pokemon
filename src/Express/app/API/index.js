const MongoClient = require('mongodb').MongoClient;
const mongo_uri = 'mongodb://mongo:27017';
const ObjectId = require('mongodb').ObjectId;

const Express = require('express')
const app = Express()
const cors = require('cors')
const bodyParser = require('body-parser');
const port = 3000

app.use(cors())
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

  if(req.body.hasOwnProperty("name") && req.body.name && 
    req.body.hasOwnProperty("stats") && 
    req.body.stats.hasOwnProperty("hp") && req.body.stats.hp &&
    req.body.stats.hasOwnProperty("attack") && req.body.stats.attack &&
    req.body.stats.hasOwnProperty("defense") && req.body.stats.defense &&
    req.body.stats.hasOwnProperty("spattack") && req.body.stats.spattack &&
    req.body.stats.hasOwnProperty("spdefense") && req.body.stats.spdefense &&
    req.body.stats.hasOwnProperty("speed") && req.body.stats.speed )

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

app.patch('/update', cors(), (req, res) => {
  const collection = req.app.locals.collection;

  if(req.body.hasOwnProperty("_id")) {
    collection.findOne({"_id": ObjectId(req.body._id)}, function(err, response) {
        if (err) throw err;
        if (response !== null){

          const update = {}
          if (req.body.name      !== undefined){ update["name"]            = req.body.name }
          if (req.body.hp        !== undefined){ update["stats.hp"]        = req.body.hp }
          if (req.body.attack    !== undefined){ update["stats.attack"]    = req.body.attack }
          if (req.body.defense   !== undefined){ update["stats.defense"]   = req.body.defense }
          if (req.body.spattack  !== undefined){ update["stats.spattack"]  = req.body.spattack }
          if (req.body.spdefense !== undefined){ update["stats.spdefense"] = req.body.spdefense }
          if (req.body.speed     !== undefined){ update["stats.speed"]     = req.body.speed }

          collection.findOneAndUpdate({"_id": ObjectId(req.body._id)}, {$set: update}, {"returnOriginal": false}, function(err, response) {
            if (err) throw err;
            res.status(200).json({"msg": "Updated!", "data": response});
          });

        }
        else{
          res.status(400).json({"msg": "Invalid Id!"})
        }
      });

  }
  else{
    res.status(400).json({"msg": "Missing Entry Id!"})
  }
});

MongoClient.connect(mongo_uri, { useNewUrlParser: true })
.then(client => {
  const db = client.db('pokemon');
  const collection = db.collection('pokemons');
  app.locals.collection = collection;
  app.listen(port, () => console.info(`REST API running on port ${port}`));
}).catch(error => console.error(error));