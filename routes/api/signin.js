const express = require('express');
const router = express.Router();

const User = require('../../models/User');
const UserSession = require('../../models/UserSession');

// @route GET api/users
router.post('/signup', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email.toLowerCase();
    const username = req.body.username;
    const password = req.body.password;

    if (!firstName) {
        return res.send({
            success: false,
            message: "Error: Firstname cannot be blank"
        })
    };

    if (!lastName) {
        return res.send({
            success: false,
            message: "Error: Lastname cannot be blank"
        })
    };

    if (!email) {
        return res.send({
            success: false,
            message: "Error: Email cannot be blank"
        })
    };

    if (!password) {
        return res.send({
            success: false,
            message: "Error: Password cannot be blank"
        })
    };

    if (!username) {
        return res.send({
            success: false,
            message: "Error: Username cannot be blank"
        })
    };

    //email.toLowerCase();

    // Verify email does not exist
    User.find({
        email: email
    }, (err, previousUsers) => {
        if (err) {
            return res.send({
                success: false,
                message: "Error: Server Error"
            })
        } else if (previousUsers.length > 0) {
            return res.send({
                success: false,
                message: "Error: Account already exists"
            })
        }

        const newUser = new User();

        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.email = email;
        newUser.username = username;
        newUser.password = newUser.generateHash(password);
        newUser.save().then(user => res.json(user))
    })
});

router.post('/signin', (req, res) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    if (!email) {
        return res.send({
            success: false,
            message: "Error: Email cannot be blank"
        })
    };

    if (!password) {
        return res.send({
            success: false,
            message: "Error: Password cannot be blank"
        })
    };

    User.find({
        email: email
    }, (err, users) => {
        if (err) {
            return res.send({
                success: false,
                message: "Error: Server Error"
            })
        } else if (users.length != 1) {
            return res.send({
                success: false,
                message: "Error: Invalid"
            })
        }

        const user = users[0];
        if (!user.validPassword(password, user.password)) {
            return res.send({
                success: false,
                message: "Error: Invalid"
            })
        }


        // Otherwise create a new UserSession
        const userSession = new UserSession();
        userSession.userId = user.id;
        userSession.save((err, doc) => {
            if (err) {
                return res.send({
                    success: false,
                    message: "Error: Server Error"
                })
            }

            return res.send({
                success: true,
                message: "Valid Sign In",
                token: doc._id
            })
        })

    })

})

router.get('/verify', (req, res) => {
    const token = req.query.token;

    UserSession.find({
        _id: token,
        isDeleted: false,
    }, (err, session) => {
        if (err) {
            return res.send({
                sucess: false,
                message: 'Error: Server Error'
            })
        }
        if (session.length != 1) {
            return res.send( {
                sucess: false,
                message: 'Error: Invalid'
            });
        } else {
            return res.send({
                sucess: true,
                message: 'Good Verify'
            })
        }
    })
})

router.get('/logout', (req, res) => {
    const token = req.query.token;
    console.log(token)

    UserSession.findOneAndUpdate({
        _id: token,
        isDeleted: false,
    }, {$set: {isDeleted: true}}, null, (err, session) => {
        if (err) {
            return res.send({
                sucess: false,
                message: 'Error: Server Error'
            })
        } else {
            return res.send({
                sucess: true,
                message: 'Good Verify'
            })
        }
    })
})

module.exports = router;