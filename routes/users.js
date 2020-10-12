const express = require('express');
const router = express.Router();
const userModel = require("../models/Users");
// const protectAdminRoute = require("../middlewares/protectAdminRoute")
const protectAdminRoute = require("../middlewares/protectAdminRoute");


router.get('/manage-users', protectAdminRoute, function (req, res, next) {
    userModel
        .find()
        .then((dbRres) => {
            res.render('dashboard/manage-users', {
                users: dbRres
            });
        })
        .catch(next);
});

/************************************************/
/******         delete users             ********/
/************************************************/

router.get("/user-delete/:id", (req, res, next) => {
    userModel
        .findByIdAndDelete(req.params.id)
        .then((dbRes) => res.redirect("/users/manage-users"))
        .catch(next);
});


/************************************************/
/******          edit users              ********/
/************************************************/

router.get("/user-edit/:id", async (req, res, next) => {
    console.log(req);
    
    try {
        console.log("whats in req.params.id", req.params.id)
        const user = await userModel.findById(req.params.id)
        res.render("dashboard/form-user-edit", {
            user
        })
    } catch (next) {
        next(err)
    }
});

// router.get('/form-edit/:id', async (req, res, next) => {
//     try {
//         const atelier = await atelierModel.findById(req.params.id)
//         const categories = await categoryModel.find()
//         res.render("fateliers/form-edit-atelier", {
//             atelier,
//             categories
//         })
//     } catch (err) {
//         next(err)
//     }
// })
router.post("/user-edit/:id", (req, res, next) => {
    console.log("did i get in here")
    const user = {
        ...req.body
    };
    userModel
        .findByIdAndUpdate(req.params.id, user, {
            new: true
        })
        .then((dbRes) => res.redirect("/users/manage-users"))
        .catch(next)
});

//router postman test pour créer users
router.post("/create", function (req, res) {
    userModel
        .create(req.body)
    res.json(req.body)
});

module.exports = router;