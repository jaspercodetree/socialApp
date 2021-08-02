const express = require('express');
const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet');
const dotenv = require('dotenv');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');

const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');
const postsRoute = require('./routes/posts');

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

//上傳圖片檔案
//儲存位置
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/images/post');
	},
	filename: (req, file, cb) => {
		cb(null, req.body.name);
	},
});
const upload = multer({ storage: storage });
//撰寫router
app.post('/api/upload', upload.single('file'), (req, res) => {
	try {
		return res.status(200).json('檔案上傳成功');
	} catch (err) {
		console.log(err);
	}
});

//將靜態檔案改到api資料夾。透過path讓輸入網址/images時能直接拜訪靜態資料夾public/images
//此時可以將圖片放進api內的public/images 並改變前端的env內的檔案連結
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// app.get('/', (req, res) => res.send('123'));
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/posts', postsRoute);

app.listen(8800, () => console.log('Backend server is running'));
