var express = require('express');
var router = express.Router();


const User = require('../models/User')
/* GET users listing. */
router.post('/news', function(req, res, next) {
  const user = new User({
    fullname: 'sergen',
    age: 24,
  });

  user.save((err , data) => {
    if (err)
    console.log(err);

    res.json(data);
  });
});

module.exports = router;
