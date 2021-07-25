const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');

router.get('/', (req, res) => {
	res.send('post');
});

module.exports = router;
