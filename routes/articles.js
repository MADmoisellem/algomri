var express = require('express');
var router = express.Router();

const articleModel = require('../models/Articles')
const categoryModel = require('../models/Categories')

// router.get('/form-add-articles', async (req, res, next) => {
//   const categories = await categoryModel.find()
//   res.render('farticles/form-add-articles', {
//     title: 'Articles',
//     categories
//   });
// });
router.get('/form-add-articles', async (req, res, next) => {
  res.render('farticles/form-add-articles')
});

/* GET manage-ateliers page */
// router.get('/manage-articles', function (req, res, next) {
//   console.log("inside 'req.body'", req.body)
//   articleModel
//     .find()
//     .then((dbRres) => {
//       res.render('farticles/manage-articles', {
//         articles: dbRres
//       });
//     })
//     .catch(next);
// });

/* GET Article listing. */
router.get("/", async (req, res, next) => {
  try {
    const article = await articleModel.find()
    .populate("category")
    .populate("author")
    res.json(article)
  } catch (err) {
    next(err)
  }
});

/* POST Article. */
router.post("/articles-add", async (req, res, next) => {
  try {
    const article = req.body;
    const newArticle = await articleModel.create(article)
    res.redirect('/articles/all-articles')
  } catch (err) {
    next(err)
  }
});
/*GET all articles*/
router.get("/all-articles", async (req, res, next) =>{
  try{
   const author = req.session.user_id
   const articles = await articleModel.find()
   res.render("farticles/all-articles", {articles})
   console.log("contenu des articles>>>>>>>>>>", articles);
   
  } catch(err){
    next(err)
  }
});


/*GET ONE article*/

router.get("/one-article/:id", async (req,res,next)=>{
  try{
    const article = req.params.id
    const oneArticle = await articleModel.findById(article);
    res.render("farticles/one-article", {oneArticle})
  } catch(err){
    next(err)
  }
});

/*GET manage articles*/
router.get("/manage-articles", async (req, res, next)=>{
  try{
    const articles = await articleModel.find()
    res.render("farticles/manage-articles", {articles})
  }catch(err){
    next(err)
  }
});

/* DELETE an article. */
router.get("/delete/:id", async (req, res, next) => {
  
  try {
    await articleModel.findByIdAndDelete(req.params.id)
    res.redirect("/articles/manage-articles")
  } catch (err) {
    next(err)
  }
});

/* UPDATE articles. */
router.get('/form-edit/:id', async (req, res, next) => {
  try {
    const article = await articleModel.findById(req.params.id);
    res.render("farticles/form-edit-articles", {
      article
    })
  } catch (err) {
    next(err)
  }
})

router.post('/form-edit/:id', async (req, res, next) => {
  try {
    const atelier = {
      ...req.body
    };
    await articleModel.findByIdAndUpdate(
      req.params.id,
      atelier, {
        new: true,
        useFindAndModify: false
      })
    res.redirect("/ateliers/manage-ateliers")
  } catch (err) {
    next(err)
  }
})

module.exports = router;
