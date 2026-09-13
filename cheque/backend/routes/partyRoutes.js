const express = require('express');
const router = express.Router();
const partyController = require('../controllers/partyController');

router.get('/', partyController.getParties);


router.post('/', partyController.addParty);

router.delete('/:id', partyController.deleteParty);

module.exports = router;
