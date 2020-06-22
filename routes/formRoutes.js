var express = require('express');
var router = express.Router();
const form_controller = require('../controllers/Forms');

router.use(form_controller.set_header)
router.get('/', form_controller.show_all);
router.get('/:id', form_controller.show_one);
router.post('/', form_controller.create);

module.exports = router;