const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json')
const express = require('express');
const cors = require('cors')({ origin: true });
const bodyParser = require('body-parser')
const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://testing-eca3b.firebaseio.com"
});

app.use(cors);
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.end(JSON.stringify({status: 'success'}))
});

app.post('/update', (req, res) => {
  const uid = req.body.uid;
  admin.auth().updateUser(uid, {
    emailVerified: true
  })
  .then(function(userRecord) {
    res.end(JSON.stringify({status: 'Updated User'}))
  })
  .catch(function(error) {
    res.end(JSON.stringify({status: `Something wrong when updating user: ${uid}`, error: error}))
  });
})

app.post('/removeClaims', (req, res) => {

  const idToken = req.body.idToken;

  console.log(idToken);

  admin.auth().verifyIdToken(idToken)
    .then((claims) => {
      admin.auth().setCustomUserClaims(claims.sub, { admin: null })
      .then( () => {
        res.end(JSON.stringify({status: 'success'}))
      })
    })
    .catch((error) => {
      res.end(JSON.stringify({status: 'error', error: error}))
    })

})

app.post('/setCustomClaims', (req, res) => {
  
  const idToken = req.body.idToken;

  console.log(idToken);

  admin.auth().verifyIdToken(idToken)
    .then((claims) => {
      // console.log(claims);
      // res.end()
      // return false;
      if (typeof claims.email !== 'undefined' &&
          typeof claims.email_verified !== 'undefined' &&
          claims.email_verified &&
          claims.email.indexOf('asd@asd.com') != -1) {
          admin.auth().setCustomUserClaims(claims.sub, { admin: true })
            .then(function() {
              res.end(JSON.stringify({
                status: 'success',
                isAdmin: true
              }));
            });
      } else {
        res.end(JSON.stringify({
          status: 'success',
          isAdmin: null
        }));
      }
    })
    .catch((err) => {
      console.log(err)
      res.end(JSON.stringify({status: 'error'}));
    })
});

app.post('/info', (req, res) => {

  const mail = req.body.mail;

  admin.auth().getUserByEmail(`${mail}`)
    .then((user) => {
      const currentCustomClaims = user.customClaims;
      (typeof currentCustomClaims !== 'undefined' )  ?
        res.end(JSON.stringify({
          status: currentCustomClaims
        }))
      :
        res.end(JSON.stringify({
          status: {admin: null}
        }))
      
    })
    .catch((error) => {
      res.end(JSON.stringify({
        status: 'No user'
      }))
    });

})

exports.app = functions.https.onRequest(app);