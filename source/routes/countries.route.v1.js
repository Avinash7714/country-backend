const router = require('express').Router();
const {getCountries, getCountry, addCountry, getContinents, imageUpload} = require('../../source/controllers/country.js');

router.get('/countries', getCountries);
router.get('/country/:id', getCountry);
router.post('/country', imageUpload.single('flag'), addCountry);
router.get('/continents', getContinents);

module.exports = router;