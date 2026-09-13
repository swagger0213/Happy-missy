const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankcontroller');

router.get('/', bankController.getBanks);

router.post('/', bankController.addBank);

router.delete('/:id', bankController.deleteBank);

module.exports = router;
