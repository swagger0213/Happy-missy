const express = require('express');
const router = express.Router();
const chequeController = require('../controllers/chequeController');


router.get('/', chequeController.getCheques);


router.post('/', chequeController.addCheques);


router.delete('/:id', chequeController.deleteCheques);

module.exports = router;
