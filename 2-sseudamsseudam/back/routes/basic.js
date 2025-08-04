const express = require('express');
const router = express.Router();

router.get('/', (req, res) => { res.send('/api-Get'); });

router.get('/one', (req, res) => { res.send('one'); });

module.exports = router;