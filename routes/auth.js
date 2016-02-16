var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', (req, res, next) => {

});

router.post('/', (req, res, next) => {
  var today = new Date();
  var exp = new Date(today);
  var user = req.body;

  exp.setDate(today.getDate() + 1);

  var token = jwt.sign({
    _id: user.id,
    username: user.username,
    exp: parseInt(exp.getTime() / 1000),
  }, process.env.JWT_SECRET);

  res.send(token);
});

module.exports = router;
