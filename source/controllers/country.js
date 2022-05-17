const multer = require('multer')
const path = require('path')
const countries = [{
	name: "Australia",
	continent: "Oceania",
	flag: "images/australia.png",
	rank: 4
},
{
	name: "England",
	continent: "Europe",
	flag: "images/england.png",
	rank: 5
},
{
	name: "Namibia",
	continent: "Africa",
	flag: "images/namibia.png",
	rank: 8
},
{
	name: "New Zealand",
	continent: "Oceania",
	flag: "images/newzealand.png",
	rank: 3
},
{
	name: "Pakistan",
	continent: "Asia",
	flag: "images/pakistan.png",
	rank: 6
},
{
	name: "Zimbabwe",
	continent: "Africa",
	flag: "images/zimbabwe.png",
	rank: 7
},
{
	name: "South Africa",
	continent: "Africa",
	flag: "images/southafrica.png",
	rank: 2
},
{
	name: "India",
	continent: "Asia",
	flag: "images/india.png",
	rank: 1
}
]

// getting all countries
const getCountries = async (req, res, next) => {
	try {
		res.status(200).json(countries.map(({name, rank}) => ({name, rank})));
	} catch (err) {
		next(err);
	}
};

//get country by id
const getCountry = async (req, res) => {
	if (!req.params.id) {
		res.status(400).send('Please provide id/rank');
		return;
	}
	const country = countries.find(c => c.rank === parseInt(req.params.id));
	if (!country) res.status(400).send('invalid Id!');
	res.send(country);
};

const getContinents = async (req, res) => {
	try {
		res.status(200).json(countries.map((c) => c.continent).filter((c, i, arr) => arr.indexOf(c) === i));
	} catch (err) {
		next(err);
	}
};

//using multer for image upload and file original name so we have only one flag no duplicates.
const storage = multer.diskStorage({
	destination: './public/images',
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
})

//Init upload
const imageUpload = multer({
	// dest: './',
	limits: {
		fileSize: 4000000 // 1000000 Bytes = 1 MB 
	},
	fileFilter(req, file, cb) {
		console.log(file)
		if (!file.originalname.match(/\.(png|jpg)$/)) {
			// upload only png and jpg extension check
			return cb(new Error('Please upload a Image'))
		} else {
			const filetypes = /jpeg|png|jpg/;
			const mimeType = filetypes.test(file.mimetype);
			if (mimeType) return cb(null, true);
			else {
				cb('Error: Images Only!');
			}
		}
		cb(undefined, true)
	},
	storage: storage,
})

const addCountry = async (req, res) => {
	const {
		name,
		continent,
		rank
	} = req.body;

	if (!name) {
		res.status(400).send('Please provide name');
		return;
	}
	if (!continent) {
		res.status(400).send('Please provide continent');
		return;
	}
	if (!req.file) {
		res.status(400).send('Please provide flag')
		return;
	}
	if (rank || name) {
		const countryRank = countries.find(c => c.rank === parseInt(rank));
		const countryName = countries.find(c => c.name === name);
		if (countryRank) {
			res.status(400).send('Rank already exists!');
			return;
		}
		if (countryName) {
			res.status(400).send('Country already exists!');
			return;
		}
	}

	// http://localhost:8080/images/download.jpg-1652713736104.jpg
	const country = {
		rank: rank,
		continent: continent,
		name: name,
		flag: `images/${req.file.filename}`,
	};
	countries.push(country);
	res.send(countries);
};

module.exports = {
	getCountries,
	getCountry,
	addCountry,
	getContinents,
	imageUpload
};