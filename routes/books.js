var express = require('express');
var router = express.Router();

var mongoose = require('mongoose')
//models
const Book = require('../models/Book');

router.post('/new', function(req, res, next) {
  const book = new Book({
    title: 'Udemy angular',
    published: false,
    category: "lambo",
    comments: [
      { message:"Harika kitap" },
     { message:"ben pek beğenmedim"}
  ],
  meta: {
    votes: 12,
    favs: 106
  }
  });

  book.save((err , data) => {
    if (err)
    console.log(err);

    res.json(data);
  });
});


router.get('/search' , (req, res) => {
  Book.find({ category: { $exists: true } } , (err , data) => {
    res.json(data);
  })
});

//publish false ve commnets detaylı getirir
router.get('/searchComment' , (req, res) => {
    Book.find({published: false}, 'comments'  , (err , data) => {
      res.json(data);
    })
});

//sadece bir kayıt getirir
router.get('/searchOne' , (req, res) => {
  Book.findOne({ title: "Udemy Node" } , (err , data) => {
    res.json(data);
  })
});

//Id bazlı sorgu
router.get('/searchById' , (req, res) => {
  Book.findById('5ee0d52c784c1e07006358b9' , (err , data) => {
    res.json(data);
  })
});

//Update 
router.put('/Update' , (req, res) => {
  Book.update({ published: false } , { published: true } , (err , data) => {
    res.json(data);
  })
});

//Id ile Update
router.put('/UpdateById' , (req, res) => {
  Book.findByIdAndUpdate('5ee0f6e5657b49252083f15b' , { userId: '5ee0fe6ec849d3056cc3a4de' } , (err , data) => {
    res.json(data);
  })
});

//Id ile delete
router.delete('/remove', (req , res) => {
  Book.findById('5ee0d52c784c1e07006358b9', (err , book )=> {
    book.remove((err , data) => {
        res.json(data);
    });
  });
});

//Sıralama 1 , -1 
router.get('/sort' , (req, res) => {
  Book.find({ } , (err , data) => {
    res.json(data);
  }).sort({ 'meta.favs': -1})
});

//Sql deki Top ile aynı
router.get('/limit' , (req, res) => {
  Book.find({ } , (err , data) => {
    res.json(data);
  }).limit(2);
});

//skip ile kaç tane atlanacağı limit ile getirileceği
router.get('/limitAndSkip' , (req, res) => {
  Book.find({ } , (err , data) => {
    res.json(data);
  }).skip(1).limit(2);
});

// puplished false olanları bulup kümeliyor "aggregate"
router.get('/aggregate', (req , res) => {
    Book.aggregate([
      {
        $match: {
          published: false
        }
      }
    ], (err , result) => {
      res.json(result);
    });
});

//published'e göre kümeleyip category ile gruplayıp toplama 
router.get('/aggregateSum', (req , res) => {
  Book.aggregate([
    {
      $match: {
        published: false
      }
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: 1 }
      }
    }
  ], (err , result) => {
    res.json(result);
  });
});

// Project ile istediğimiz alanları döneriz
router.get('/aggregateProject', (req , res) => {
  Book.aggregate([
    {
      $match: {
        published: false
      }
    },
    {
      $project: {
        title: 1
      }
    },
    {
      $sort: { title: 1}
    },
    {
      $limit: 2
    },
    {
      $skip: 1
    }
  ], (err , result) => {
    res.json(result);
  });
});

router.get('/aggregatelookupFor', (req , res) => {
    Book.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId('5ee0f6db657b49252083f158')
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          title: 1,
          user: '$user'
        }
      }
    ], (err,result) => {
      res.json(result);
    })
});

module.exports = router;
