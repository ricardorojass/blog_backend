const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

require('./config/mongoose');
const storyRouter = require('./routers/story');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(storyRouter);

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};