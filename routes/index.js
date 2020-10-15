var express = require('express');
var router = express.Router();
const articleModel = require('../models/Articles');


/* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: 'Home', subtitle: 'My home page' });
// });

router.get('/reverse', (req, res) => {
  res.render('reverse')
})

router.get("/", async (req, res, next)=>{
  const articles = await articleModel.find().sort({ _id: -1 }).limit(3)
  res.render("index", {articles})
})

router.get("/contact", (req, res) => {
  res.render("contact")
})

module.exports = router;
