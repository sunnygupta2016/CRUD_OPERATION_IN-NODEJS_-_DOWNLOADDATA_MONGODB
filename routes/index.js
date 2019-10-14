var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var rollNo=require('mongodb').ObjectID.rollno;
var assert = require('assert');
const fs=require('fs');
const Json2csvParser=require('json2csv').Parser;
var csv = require('csv-express');


var url = 'mongodb://localhost:27017/student';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/get-data', function(req, res, next) {
  var resultArray = [];
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const db=client.db('student');
    var cursor = client.db('student').collection('userdata').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      client.close();
      res.render('index', {items: resultArray});
    });
  });
});

router.post('/insert', function(req, res, next) {
  var item = {
    name: req.body.name,
    _id: req.body.rollno,
    gmail: req.body.gmail,
    branch:req.body.branch
  };

  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const db=client.db('student');
    db.collection('userdata').insertOne(item, function(err, result) {
      assert.equal(null, err);
      console.log('Item inserted');
      client.close();
    });
  });

  res.redirect('/');
});

router.post('/update', function(req, res, next) {
  var item = {
     name: req.body.name,
    _id: req.body.rollno,
    gmail: req.body.gmail,
    branch:req.body.branch
    
  };
  var rollno = req.body.rollno;
  MongoClient.connect(url, function(err, client) {
    const db=client.db('student');

    assert.equal(null, err);
    db.collection('userdata').updateOne({"_id":rollno}, {$set: item}, function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      client.close();
    });
  });
});

router.post('/delete', function(req, res, next) {
 var rollno = req.body.rollno;
   //var id =req.params.rollno;
  
  MongoClient.connect(url, function(err, client) {
     const db=client.db('student');
    assert.equal(null, err);
    db.collection('userdata').deleteOne({"_id":rollno}, function(err, result) {
      assert.equal(null, err);
      console.log('Item deleted');
      client.close();
    });
  });
});
router.get('/exporttocsv',function(req,res,next){
  var filename="item.csv";
   var dataArray;
MongoClient.connect(url,function(err,client){
  const db=client.db('student');
  assert.equal(null,err);
  db.collection('userdata').find({}).toArray( function(err, result){
    result.forEach(function(result){
      
    });

        assert.equal(null,err);
        console.log('item downloaded');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader("Content-Disposition", 'attachment; filename='+filename);
        res.csv(result, true);
        client.close();
  
  });
});
});

module.exports = router;