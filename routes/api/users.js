const express = require('express');
const router = express.Router();

const User = require('../../models/User');

// @route GET api/users
router.get('/', (req, res) => {
    User.find()
        .then(users => res.json(users))
});

// @route POST api/users
router.post('/', (req, res) => {
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.emailName,
        password: req.body.password,
    });
    newUser.save().then(user => res.json(user));
});

// @route DELETE api/users
router.delete('/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => user.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json({success: false}));
});

module.exports = router;