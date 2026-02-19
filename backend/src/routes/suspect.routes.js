const express = require('express');
const router = express.Router();
const { getSuspects, createSuspect, deleteSuspect } = require('../controllers/suspect.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/', getSuspects);
router.post('/', createSuspect);
router.delete('/:id', deleteSuspect);

module.exports = router;
