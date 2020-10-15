var express = require('express');
var router = express.Router();
const atelierModel = require('../models/Ateliers')
const categoryModel = require('../models/Categories')
const langModel = require('../models/Languages')
const fileUploader = require("./../config/cloudinary");
const protectPrivateRoute = require("./../middlewares/protectPrivateRoute");
const adminRoute = require("../middlewares/protectAdminRoute");
const moment = require("moment");

// ################################################################## FRONT ROUTES
//il faut une route qui permet d'ajouter un user dans le tableau de participant d'un atelier
//pour le front

// GET all ateliers
router.get('/all', async (req, res, next) => {
  try {
    const categories = []
    const ateliers = await atelierModel.find().populate('participants')
    const getCategories = await categoryModel.find()

    var filteredAteliers;
    getCategories.forEach(category => {
      filteredAteliers = ateliers.filter(atelier => {
        if (atelier.category == category.id) {
          return atelier;
        }
      })
      categories.push({
        label: category.label,
        ateliers: filteredAteliers
      })
    })
    //console.log("categories>>>>>>>>>>>", categories[0]);
    res.render("fateliers/all-ateliers", {
      categories
    })
  } catch (error) {
    next(error)
  }
})


/* DISPLAY the form to add ateliers*/
router.get('/form-atelier-add',adminRoute, async (req, res, next) => {
  console.log("hello");

  const categories = await categoryModel.find();
  const languages = await langModel.find();
  console.log("lang>>>>>>>>", languages);

  res.render('fateliers/form-atelier-add', {
    categories,
    languages
  });
});

/* GET manage-ateliers page */
router.get('/manage-ateliers',adminRoute, function (req, res, next) {
  console.log("inside 'req.body'", req.body)
  atelierModel
    .find()
    .then((dbRres) => {
      res.render('fateliers/manage-ateliers', {
        ateliers: dbRres
      });
    })
    .catch(next);
});

/* GET ateliers respectively to their category */
/* donne les ateliers par rapport à une seule catégorie*/
router.get('/bycategory/:id', async (req, res, next) => {
  try {
    //const getCategory = await CategoryModel.findById(req.params.id)
    const ateliers = await atelierModel.find()
    const filteredAteliers = ateliers.filter(atelier => atelier.category == req.params.id)
    res.render("fateliers/manage-ateliers", {
      ateliers: filteredAteliers
    })
  } catch (err) {
    next(err)
  }
})


/* POST ateliers. */
/*don't forget to adjust the route's prefix in the form*/
/*also adjust it in the redirect*/
router.post("/atelier-add", fileUploader.single("avatar"), (req, res, next) => {
  //   console.log("is req.body going?",req.body)
  //   console.log("inside atelier?", atelier)
  //   const atelier = { ...req.body };
  //   // const date = moment(req.body.date).format('Do MMMM YYYY');
  // atelier.date = date;
  const atelier = {
    title : req.body.title,
    description : req.body.description,
    avatar : req.body.avatar,
    date : req.body.date,
    category : req.body.category
  }
  const adress = {
      numero : req.body.numero,
      rue: req.body.rue,
      code_postale: req.body.code_postale,
      ville: req.body.ville,
  };

  atelier.adress = adress;

  // const date = moment(atelier.date).format('Do MMMM YYYY, h:mm a');
  // atelier.date = date;
  
  if (req.file) {
    atelier.avatar = req.file.secure_url
  } else console.log("no file");
  console.log("y a quoi dans atelier ????????????", atelier);

  atelierModel.create(atelier)
    .then((dbRes) => {
      //console.log("que retourne le create????????????", dbRes);
      
      // console.log("produit ajouté en bdd >>> ", dbRres);
      res.redirect("/ateliers/manage-ateliers")
    })
    .catch(next);
});

/* UPDATE ateliers. */
router.get('/form-edit/:id',adminRoute, async (req, res, next) => {
  try {
    const atelier = await atelierModel.findById(req.params.id)
    const categories = await categoryModel.find()
    res.render("fateliers/form-edit-atelier", {
      atelier,
      categories
    })
  } catch (err) {
    next(err)
  }
})

router.post('/form-edit/:id', fileUploader.single("image"), async (req, res, next) => {
  try {
    const atelier = {
      ...req.body
    };
    const date = moment(atelier.date).format('Do MMMM YYYY');
    atelier.date = date;
    if (req.file) {
      atelier.avatar = req.file.secure_url
    }
    await atelierModel.findByIdAndUpdate(
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

// atelierModel.create(atelier)
//   .then((dbRres) => {
//     // console.log("produit ajouté en bdd >>> ", dbRres);
//     res.redirect("/ateliers/manage-ateliers")
//   })
//   .catch(next);


/* DELETE ateliers. */
router.get('/form-delete/:id',adminRoute, async (req, res, next) => {
  try {
    await atelierModel.findByIdAndDelete(req.params.id)
    res.redirect("/ateliers/manage-ateliers")
  } catch (err) {
    next(err)
  }
})

// ################################################################# BACK ROUTES


/* GET manage-atelier page */
router.get(['/'], async (req, res, next) => {
  //console.log("inside 'req.body'", req.body)

  try {
    const ateliers = await atelierModel.find()
    res.json(ateliers);

  } catch (error) {
    console.log(error)
  }


});

//route pour qu'un user participe à un atelier
router.get('/participate/:id', protectPrivateRoute, async (req, res, next) => {
  console.log(req.session.currentUser);
try {
    // 1 trouver l'atelier par id
    // 2 ajouter l'id de user connecté dans l'array des participants (mongo : $push)
    const updatedAtelier = await atelierModel.findByIdAndUpdate(req.params.id, {
      $push: {
        participants: req.session.currentUser._id
      }
    }, {
      new: true
    });
    console.log("atelier avec participant >>>>>",updatedAtelier);
    // req.flash("error", "vous devez être connecté pour participer")
    res.redirect("/ateliers/all")
  } catch (err) {
    next(err);
  }

});
//est ce l'atelier contient le participant
//peut find si l'id de l'user est dans les participant de l'atelier (avec l'id correspondante)
//si non : push
// si oui : redirect ateliers/all

/*séparé les produits, chaque produit sera dans un tableau de sa proptre catégorie*/
// router.get('/bycategory', async (req, res, next) => {
//   try {
//     const arrayAllAteliers = []
//     const ateliers = await atelierModel.find()
//     const categories = await categoryModel.find()


//     var filteredAteliers;
//     categories.forEach(category => {
//       filteredAteliers = ateliers.filter(atelier => {
//         if (atelier.category == category.id) {
//           return atelier
//         }
//       })

//       arrayAllAteliers.push({
//         label: category.label,
//         filteredAteliers
//       })
//     })
//     console.log(arrayAllAteliers)
//     //const filteredAteliers = ateliers.filter(atelier => atelier.category == req.params.id )
//     res.json(arrayAllAteliers)
//   } catch (err) {
//     next(err)
//   }
// })

//POST AND EDIT a category
router.post("/category", (req, res)=>{
  const newArticle = req.body
  categoryModel.create(newArticle)
  res.redirect("/ateliers/form-atelier-add")
})

router.get("/category/:id", (req, res)=>{
  categoryModel.findByIdAndDelete(req.params.id)
  res.redirect("/ateliers/form-atelier-add")
})










module.exports = router;

// 1) supprimer attr participant de events et atelier
// 2) dans users ajouter les attr event et atelier 
//  {
//   "avatar": "https://cdn.onlinewebfonts.com/img_258083.png",
//   "role": "user",
//   "ateliers": [
//       {"_id" : "435345345346342543253245324"},
//       {"_id" : "435345345346342543253245324"}
//   ],
//   "_id": "5f30040fab245b853d7456c8",
//   "name": "Wade",
//   "lastname": "Wilson",
//   "username": "Deadpool",
//   "password": "1234",
//   "__v": 0
// }
// 3) pour avoir ts les participant d'un event : 
// - récupérer l'id de l'event (ou atelier) qui m'interesse 
// - ensuite tous les users 
// - dans un filter comparer tous les user à l'id de l'event/ atelier qui m'interesse
// 4) réfléchir à la route dans laquelle je fais les filtres
// 5) peut être $ebus pour créer un component qui récupère les users une seule fois
// et faire le filter directement dans le front 
// et rendre l'event dispo dans toute l'app