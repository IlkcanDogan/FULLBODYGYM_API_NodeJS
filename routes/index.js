var express = require('express');
var router = express.Router();
var google = require('@helpers/google');
var db = require('../helpers/database');
var jwt = require('@helpers/jwt');

router.post('/google', (req, res) => {
    let { credential } = req.body;

    if (credential) {
        google.VerifyToken(credential).then((decoded) => {
            db.getConnection().then((connection) => {
                let { email, given_name, family_name } = decoded;

                db.procedure('call sp_COACH_LOGIN_WITH_GOOGLE(?)', [email, given_name, family_name, req.ip], connection).then((result) => {
                    let token = jwt.CreateToken({ id: result.COACH_ID, provider: 'google' });
                    res.redirect(`${process.env.APP_DOMAIN}/coach?token=${token}&firstname=${result.FIRSTNAME}&lastname=${result.LASTNAME}&provider=google`);
                })

                connection.release();
            }).catch((error) => {
                res.status(500).send();
            })
        }).catch((err) => {
            res.status(400).send();
        })
    }
    else {
        res.status(400).send();
    }
});


router.get('/cities', (req, res) => {
    db.getConnection().then((connection) => {
        db.procedure('call sp_CITY_LIST_GET()', [], connection, 'list').then((result) => {
            res.json({ status: 'success', cities: result });
        })

        connection.release();
    }).catch((error) => {
        res.status(500).send();
    })
});

router.get('/state/:cityId', (req, res) => {
    let { cityId } = req.params;

    if (cityId) {
        db.getConnection().then((connection) => {
            db.procedure('call sp_STATE_LIST_GET(?)', [cityId], connection, 'list').then((result) => {
                res.json({ status: 'success', states: result });
            })

            connection.release();
        }).catch((error) => {
            res.status(500).send();
        })
    }
    else {
        res.status(400).send();
    }
});

module.exports = router;