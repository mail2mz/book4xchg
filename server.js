const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');
const path = require('path');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute =
  //'mongodb://<your-db-username-here>:<your-db-password-here>@ds249583.mlab.com:49583/fullstack_app';
  'mongodb+srv://user1:user1@clusterone-n3x4p.mongodb.net/test?retryWrites=true&w=majority';
// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// this is our get method
// this method fetches all available data in our database
router.get('/getData', (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post('/updateData', (req, res) => {
  const { id, book_name, update } = req.body;

  Data.findByIdAndUpdate(id, book_name, update, (err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });


});

// this is our delete method
// this method removes existing data in our database
router.delete('/deleteData', (req, res) => {
  const { id } = req.body;
  Data.findByIdAndRemove(id, (err) => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create methid
// this method adds new data in our database
router.post('/putData', (req, res) => {
  let data = new Data();

  const { id, book_name, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS',
    });
  }
  data.book_name = book_name;
  data.id = id;
  data.message = message;
  data.id = id;
  data.save((err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// append /api for our http requests
app.use('/api', router);

	// Serve static files from the React app
	app.use(express.static(path.join(__dirname, 'client/build')));
	// The "catchall" handler: for any request that doesn't
	// match one above, send back React's index.html file.
	app.get('*', (req, res) => {
  		res.sendFile(path.join(__dirname+'/client/build/index.html'));
	});

const port = process.env.PORT || API_PORT;
// launch our backend into a port
app.listen(port, () => console.log(`LISTENING ON PORT ${API_PORT}`));