const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		desc: {
			type: String,
			max: 500,
		},
		img: {
			type: String,
			default: '',
		},
		likes: {
			type: Array,
			default: [],
		},
		comments: {
			type: Array,
			default: [],
		},
		emojiImg: {
			type: String,
			default: '',
		},
		emojiText: {
			type: String,
			max: 10,
		},
		tagUserId: {
			type: String,
		},
		isPostEditEver: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
