'use strict';

var SynapsePay = require('synapsepay');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./model/users');
var bcrypt = require('bcrypt');

var app = express();
var router = express.Router();

var port = process.env.API_PORT || 3001;

var env = {
  clientId: 'id-0312aefd-c6fb-48c3-b4a3-0a85a3ece2a7',
  clientSecret: 'secret-e33add20-9b90-43af-a216-a98e61bde30f',
  fingerprint: '987654321'
}

var client = new SynapsePay.Clients(
  env.clientId,
  env.clientSecret,
  false);


mongoose.connect('mongodb://ngynmt:246824a@ds145359.mlab.com:45359/spdb', function(err) {
  if (err) throw err;
  console.log('Successfully connected to MongoDB');
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,PATCH,DEvarE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

router.get('/', function(req, res) {
  res.json({ message: 'API Initialized! '});
});

router.route('/users')
  .get(function(req, res) {
    User.find(function(err, users) {
      if (err) {
        return res.send(err);
      }
      return res.json(users);
    });
  })
  .post(function(req, res) {
    if (req.body['post-type'] === 'signup') {
      User.find({ 'email': req.body.email }, function(err, docs) {
        if (docs.length === 0) {
          var newUserPayload = {
            "logins": [
              {
                "email": req.body.email
              }
            ],
            "phone_numbers": [
              req.body.phone
            ],
            "legal_names": [
              req.body.name
            ],
            "extra": {
              "supp_id": "5303f4ddb4e7b810bf000173",
              "is_business": false,
              "cip_tag":1
            }
          }
          SynapsePay.Users.create(
            client,
            env.fingerprint,
            '123.123.123',
            newUserPayload,
            function(err, userResponse) {
              var userObj;
              if (err) res.json({ message:' Error adding user to SP.' });
              var user = new User();
              user.email = req.body.email;
              user.password = req.body.password;
              user.sp_id = userResponse.json._id;
              user.save(function(err) {
                if (err) {
                  return res.send(err);
                }
                userObj = {
                  message: 'Success',
                  oauth: userResponse.json.oauth_key,
                  refreshToken: userResponse.json.refresh_token,
                  id: userResponse.json._id
                }
                return res.json(userObj);
              })
            }
          )
        } else {
          return res.json({ message: 'Email already exists.'});
        }
      })
    } else if (req.body['post-type'] === 'login') {
      var spId;
      User.findOne({ email: req.body.email }, 'sp_id', function(err, user) {
        if (err) return res.send(err);
        if (!user) {
          return res.send({ message: 'User not found' });
        } else { 
          spId = user.sp_id;       
          // user.comparePassword(req.body.password, function(err, isMatch) {
          //     if (err) return err;
          //     console.log(req.body.password, isMatch);
          // });
          res.send({ message: 'Success', id: spId });
          
        }
      })
    }
  })

router.route('/kyc')
  .post(function(req, res) {
    let user;
    let addDocsPayload = {
      documents: [
        {
          "email": 'test@test.com',
          "phone_number": '901-942-8167',
          "ip": '123.123.123',
          "name": 'Charlie Brown',
          "alias": req.body.alias,
          "entity_type": req.body.gender,
          "entity_scope": req.body.entity_scope,
          "day": req.body.day,
          "month": req.body.month,
          "year": req.body.year,
          "address_street": req.body.address_street,
          "address_city": req.body.address_city,
          "address_subdivision": req.body.address_subdivision,
          "address_postal_code": req.body.address_postal_code,
          "address_country_code": req.body.address_country_code
        }
      ]
    }

    let options = {
      _id: req.body.id,
      fingerprint: env.fingerprint,
      ip_address: '123.123.123' // Helpers.getUserIP()
    }
    // let user;
    SynapsePay.Users.get(client, options, function(err, userRes) {
        if (err) res.send(err, ' Error getting user.');
        user = userRes;
        // res.json(options);
        user.addDocuments(addDocsPayload, function(err, addDocRes) {
          if (err) res.send(err);
          res.send(addDocRes);
        })
      })
  })


router.route('/banks')
  .post(function(req, res) {
    let loginPayload = {
      "type":"ACH-US",
      "info":{
        "bank_id": req.body.username,
        "bank_pw": req.body.password,
        "bank_name": req.body.bank
      }
    }
    let options = {
      _id: req.body.id,
      fingerprint: env.fingerprint,
      ip_address: '123.123.123' 
    }

    SynapsePay.Users.get(client,
      options, function(err, userRes) {
        if (err) res.send(err, ' Error getting user.');
        SynapsePay.Nodes.create(userRes, loginPayload, function(err, nodeResponse) {
          if (err) res.send(err);
          res.json(nodeResponse);
        })
      })
  })

router.route('/getbanks')
  .post(function(req, res) {
    let options = {
      _id: req.body.id,
      fingerprint: env.fingerprint,
      ip_address: '123.123.123' 
    };
      SynapsePay.Users.get(client, options, function(err, userRes) {
      if (err) res.send(err, ' Error getting user.');
      SynapsePay.Nodes.get(userRes, null, function(err, nodesRes) {
        let banks = [];
        nodesRes.nodes.forEach(function(node) {
          banks.push({ name: node.name, properName: node.bank_name })
        })
        res.send({ banks: banks });
      })
    })
  })

router.route('/transactions')
  .post(function(req, res) {
    let createPayload = {
      "to":{
        "type":"ACH-US",
        "id": env.clientId
      },
      "amount":{
        "amount": req.body.total,
        "currency":"USD"
      },
      "extra":{
        "ip": '123.123.123'
      }
    }
    let options = {
      _id: req.body.id,
      fingerprint: env.fingerprint,
      ip_address: '123.123.123' 
    };
    SynapsePay.Users.get(client, options, function(err, userRes) {
      if (err) res.send({ message: ' Error getting user.' });
      SynapsePay.Nodes.get(userRes, { info : { bank_name : req.body.bank } }, function(err, nodesRes) {
      if (err) res.send({ message: ' Error getting node.' });
        SynapsePay.Transactions.create(nodeRes, createPayload, function(err, transactionRes) {
      if (err) res.send({ message: ' Error creating transaction.' });
          res.send(transactionRes);
        })

      })
    })
  })

app.use('/api', router);

app.listen(port, function() {
  console.log(`Running on port ${port}`);
})