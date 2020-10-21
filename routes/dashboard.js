const express = require("express"); // import express in this module
const router = new express.Router(); // create an app sub-module (router)
// const sneakerModel = require("./../models/Sneaker");
const atelierModel = require('../models/Ateliers')
const categoryModel = require('../models/Categories')
// const fileUploader = require("./../config/cloudinary");
const protectPrivateRoute = require("../middlewares/protectPrivateRoute");
const adminRoute = require("../middlewares/protectAdminRoute");

//ADMIN DASHBOARD
router.get("/admin-board", adminRoute, (req, res) => {
  res.render("dashboard/admin-board")
});
router.get("/dashboard/manage-ateliers", adminRoute, (req, res) => {
  res.render("manage-ateliers")
});

// router.get('/user-check', async (req, res, next) => {
//     try {
//     const ateliers = await atelierModel.find().populate("participants")
//     res.render("dashboard/user-check", {ateliers})
//     }catch (err) {
//         next(err)
//     }
// });
/*check which users are participating*/
router.get('/user-check', adminRoute, async (req, res, next) => {
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
    res.render("dashboard/user-check", {
      categories
    })
  } catch (error) {
    next(error)
  }
})

// USER DASHBOARD
router.get("/profile", protectPrivateRoute, async (req, res, next) => {
  try {
    const ateliers = await atelierModel.find().populate('participants')
    const currentUser = req.session.currentUser._id
    console.log(req.session.currentUser._id);


    const joinedAtelier = ateliers.filter(atelier => {
      return atelier.participants.find(participant => participant._id == currentUser)
    })
    console.log("joinedAtelier>>>>>>>>>>", joinedAtelier);

    res.render("fusers/profile", {
      joinedAtelier,
    })
  } catch (error) {
    next(error)
  }
})

//add a category

router.get("/form-add-category", adminRoute, (req, res) => {
  res.render("dashboard/form-add-category")
});

router.post("/add-a-category", adminRoute, async (req, res, nex) => {
  const newCategory = await categoryModel.create(req.body)
  res.redirect("/dashboard/admin-board")
})


//manage categories page
router.get("/manage-categories", adminRoute, async (req, res, next) => {
  try {
    const categories = await categoryModel.find()
    res.render("dashboard/manage-categories", {
      categories
    })
  } catch (error) {
    next(error)
  }
});

//delete categories
router.get("/category-delete/:id", adminRoute, async (req, res, next) => {
  try {
    const deletecategory = await categoryModel.findByIdAndDelete(req.params.id)
    res.redirect("/dashboard/manage-categories")
  } catch (error) {
    next(error)
  }
});

//update a category

router.get("/form-edit-category/:id", adminRoute, async (req, res, next) => {
  try {
    const category = await categoryModel.findById(req.params.id)
    res.render("dashboard/form-edit-category", {
      category
    })
  } catch (error) {
    next(error)
  }
})

router.post("/category/edit/:id", async (req, res, next) => {
  try {
    const newCategory = await categoryModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      useFindAndModify: false
    })
    res.redirect("/dashboard/admin-board")
  } catch (error) {
    next(error)
  }
})



module.exports = router;