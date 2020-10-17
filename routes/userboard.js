var express = require('express');
var router = express.Router();

const userModel = require('../models/Users')

const bcrypt = require("bcrypt");
const uploader = require("./../config/cloudinary");
const protectRoute = require("./../middlewares/protectPrivateRoute");


router.post(
  "/profile/edit/infos/:id",
  uploader.single("avatar"),
  (req, res, next) => {
    const updatedUserInfos = req.body; // on stocke les infos postées dans cette constante
    if (
      // on vérifie la présence de tous les champs requis
      !updatedUserInfos.username ||
      !updatedUserInfos.email
    ) {
      req.flash("veuillez vérifier que les infos fournies sont correctes");
    }

    if (req.file) updatedUserInfos.avatar = req.file.secure_url;
    // check la doc : https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
    userModel // on update l'user par son id en fournissant les données postées
      .findByIdAndUpdate(req.params.id, updatedUserInfos, { new: true }) // attention à l'option new: true
      .then((updatedUser) => {
        req.session.currentUser = updatedUser;
        res.redirect("/dashboard/profile");
      })
      .catch(next);
  }
);

router.post("/profile/edit/password/:id", (req, res, next) => {
  const updatedUserInfos = req.body; // on stocke les infos postées dans cette constante
  if (
    // on vérifie la présence de tous les champs requis
    !updatedUserInfos.oldPassword ||
    !updatedUserInfos.password
  ) {
    // todo => return message erreur
  }
  userModel // on cherche l'user par son id
    .findById(req.params.id) // pour pouvoir comparer l'ancien pot de passe
    .then((user) => {
      // si la promesse est tenue, on vérifie que oldPassword est correct
      const checkOldPassword = bcrypt.compareSync(
        updatedUserInfos.oldPassword, // password provenant du form "texte plein"
        user.password // password stocké en bdd (encrypté)
      ); // compareSync retourne true || false

      if (checkOldPassword === false) {
        // si le oldPassword renseigné n'est pas le bon
        req.flash("error","veuillez vérifier que les infos fournies sont correctes");
        res.redirect("/dashboard/profile");

      } else {
        // si oldPassword renseigné est correct
        const salt = bcrypt.genSaltSync(10); // on génère un sel pour renforcer le hashage
        const hashed = bcrypt.hashSync(updatedUserInfos.password, salt); // encrypte nouveau password

        user.password = hashed; // on remplace le mot de passe "en clair" par le hash
        user.save(); // et enfin on update le document user récupéré de la bdd avec les nouvelles infos
        res.redirect("/dashboard/profile");
      }
    })
    .catch(next);
});


/* DELETE ACCOUNT*/

router.get("/delete-account/:id", (req, res)=>{
  console.log("delete-account###########", req.params.id);
  
  userModel.findByIdAndDelete(req.params.id)
  req.flash("success", "votre compte à bien été supprimé")
  res.redirect("/")
})

module.exports = router;
