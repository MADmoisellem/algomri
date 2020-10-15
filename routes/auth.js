const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");
const userModel = require("./../models/Users");
// uploader est un middleware, cad une fonction qui s'insère entre une requête http et une réponse http
const uploader = require("../config/cloudinary");
// const protectRoute = require("./../middlewares/protectPrivateRoute");


router.get("/signup", (req, res) => {
  res.render("signup", {
    title: "Inscription",
    js: ["toggle-password-icon"]
  });
});

router.get("/signin", (req, res) => {
  res.render("signin", {
    title: "Connexion",
    js: ["toggle-password-icon"]
  });
});

router.get("/signout", (req, res) => {
  req.session.destroy(() => res.redirect("/auth/signin"));
});

router.post("/signin", (req, res, next) => {
  const userInfos = req.body; //
  // check que mail et mdp sont renseignés
  if (!userInfos.email || !userInfos.password) {
    // never trust user input !!!
    // si non : retourner message warning au client
    req.flash("warning", "Attention, email et password sont requis !");
    res.redirect("/auth/signin");
  }
  // si oui : vérifier que mail et mdp correspondent en bdd
  // 1 - récupérer l'utilisateur avec le mail fourni
  userModel
    .findOne({
      email: userInfos.email
    })
    .then((user) => {
      if (!user) {
        // vaut null si pas d'user trouvé pour ce mail
        // si non .. retiourner une erreur au client
        req.flash("error", "Identifiants incorrects");
        res.redirect("/auth/signin");
      }
      // si oui comparer le mdp crypté stocké en bdd avec la chaîne en clair envoyée depuis le formulaire
      const checkPassword = bcrypt.compareSync(
        userInfos.password, // password provenant du form "texte plein"
        user.password // password stocké en bdd (encrypté)
      ); // checkPassword vaut true || false

      // si le mdp est incorrect: retourner message error sur signin
      if (checkPassword === false) {
        req.flash("error", "Identifiants incorrects");
        res.redirect("/auth/signin");
      }
      // si oui : stocker les infos de l'user en session pour lui permettre de naviguer jusqu'au signout
      const {
        _doc: clone
      } = {
        ...user
      }; // je clone l'user
      delete clone.password; // je supprime le mdp du clone (pas besoin de le stocker ailleurs qu'en bdd)
      req.session.currentUser = clone; // j'inscris le clone dans la session (pour maintenir un état de connexion)
      // - redirection profile
      if (req.session.currentUser.role === "admin") {
        res.redirect("/dashboard/admin-board");
      }else {
        res.redirect("/dashboard/profile")
      }
    })
    .catch(next);
});

/**
 * @see : https://www.youtube.com/watch?v=O6cmuiTBZVs
 */

router.post("/user-signup", uploader.single("avatar"), (req, res, next) => {
  const user = req.body;
  // console.log(user);
  if (req.file) {
    // si un fichier a été uploadé
    user.avatar = req.file.secure_url; // on l'associe à user
  }

  if (!user.username || !user.password || !user.email) {
    // todo retourner un message d'erreur : remplir tous les champs requis + redirect
    console.log("error1");
    req.flash("warning", "Merci de remplir tous les champs requis.");
    res.redirect("/auth/signup");
  } else {
    // console.log(user.email);
    userModel
      .findOne({
        email: user.email
      })
      .then((dbRes) => {
        console.log("RESULTAT BDD >>>> : ", dbRes);
        if (dbRes == null) {
          console.log("CONTINUITE DU CODE")
          // si le programme est lu jusqu'ici, on converti le mot de passe en chaîne cryptée
          const salt = bcrypt.genSaltSync(10);
          const hashed = bcrypt.hashSync(user.password, salt);
          // console.log("password crypté >>>", hashed);
          user.password = hashed; // on remplace le mot de passe "en clair" par sa version cryptée

          // finalement on insère le nouvel utilisateur en base de données
          userModel
            .create(user)
            .then((dbRes) => {
              req.flash("success", "Inscription validée !");
              res.redirect("/auth/signin");
            })
            .catch(next);
        } else {
          // todo retourner message d'erreur : email déjà pris + redirect
          console.log("ICI C L'error2");
          req.flash("warning", "Désolé, cet email n'est pas disponible.");
          res.redirect("/auth/signup");
        }
      })
      .catch(next);

  }
});

module.exports = router;