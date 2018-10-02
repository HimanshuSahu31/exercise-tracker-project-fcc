const router = require('express').Router();

const UserController = require('../controllers/user');

router.post('/new-user', UserController.create_new_user);

router.get('/users', UserController.user_get_all);

router.post('/add', UserController.user_add_log);

router.get('/log', UserController.user_get_log);

module.exports = router;