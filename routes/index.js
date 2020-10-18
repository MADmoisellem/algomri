var express = require('express');
var router = express.Router();
const articleModel = require('../models/Articles');

var express = require('express');
var router = express.Router();
const nodemailer = require("nodemailer");
const mail_host = "smtp.mailtrap.io";
const mail_host_port = 2525;
const mail_user_address = "94f75a8c7e-c32370@inbox.mailtrap.io";
const mail_user_name = "e1c8ba5ce9b46d";
const mail_user_pass = "c3a79675d69060";

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

// formulaire de contact

async function sendMail(infos) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: mail_host,
    port: mail_host_port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: mail_user_name, // generated ethereal user
      pass: mail_user_pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: ` ${infos.email} `, //  address de la prsn
    to: mail_user_address, // mon email denvoi
    subject: infos.subject, // Subject 
    text: infos.message, // plain text body
    html: `<div>${infos.message}</div>`, // html body
  });

}

router.post("/sendmessage", async (req, res, next) => {
  console.log(req.body);
  sendMail(req.body)
    .then(() => {
      // console.log("mail: ");
      req.flash("success", "Votre message nous à été envoyé. Il sera traité rapidement .");
      res.redirect("/");
    })
    .catch((err) => {
      console.error("erreur:", err);
      res.status(500).json("/contact");
    });
}); 

module.exports = router;
