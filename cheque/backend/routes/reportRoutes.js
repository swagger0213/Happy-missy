const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/get-report', reportController.getreport);

router.post('/post-report', reportController.postreport);

router.delete('/delate-report/:id', reportController.deleteReports);

router.put('/update-report/:id', reportController.updateReport);

module.exports = router;