import multer from 'multer';

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, process.cwd() + `/temp/`);
	},
	filename: function (req, file, cb) {
		console.log("Is multer getting file?", file)
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + '-' + uniqueSuffix + '.png');
	},
});

export const upload = multer({ storage: storage });
