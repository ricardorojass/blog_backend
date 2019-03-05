const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

require('./config/mongoose');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(require('./routes'));

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};