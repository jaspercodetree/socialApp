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

//連接MongoDB
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

//multer上傳圖片檔案 - posts
//設定儲存位置
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/images/post');
	},
	filename: (req, file, cb) => {
		cb(null, req.body.name);
	},
});
const upload = multer({ storage: storage });
//撰寫上傳檔案的router
app.post('/api/upload', upload.single('file'), (req, res) => {
	try {
		return res.status(200).json('檔案上傳成功');
	} catch (err) {
		console.log(err);
	}
});

//multer上傳圖片檔案 - person profile
//設定儲存位置
const storagePerson = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/images/person');
	},
	filename: (req, file, cb) => {
		cb(null, req.body.name);
	},
});
const uploadPerson = multer({ storage: storagePerson });
//撰寫上傳檔案的router
app.post('/api/upload/person', uploadPerson.single('file'), (req, res) => {
	try {
		return res.status(200).json('檔案上傳成功');
	} catch (err) {
		console.log(err);
	}
});

//path(目的:將靜態檔案改到api資料夾)
//透過path讓輸入網址/images時，不執行get request等api行為，而是直接拜訪靜態資料夾public/images
//此時可以將圖片放進api內的public/images 並改變前端的env內的檔案連結  使得靜態檔案可以存放在伺服器端  並且能被網頁讀取
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// app.get('/', (req, res) => res.send('123'));
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/posts', postsRoute);

app.listen(8800, () => console.log('Backend server is running'));
