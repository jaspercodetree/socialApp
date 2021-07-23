const express = require('express');
const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet');
const dotenv = require('dotenv');
const morgan = require('morgan');

const authRoute = require('./routes/auth');

//使用dotenv
dotenv.config();

mongoose.connect(
	process.env.MONGODB_URL,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	() => console.log('connected to MongoDB')
);

//中介程式
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

// app.get('/', (req, res) => res.send('123'));
app.use('/api/auth', authRoute);

app.listen(8800, () => console.log('Backend server is running'));
