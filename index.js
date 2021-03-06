const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const cors = require("cors");
const creds = require("./config");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "/client/build")));

var transport = {
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: creds.USER,
    pass: creds.PASS,
  },
};

var transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages");
  }
});

app.post("/send", (req, res, next) => {
  var name = req.body.name;
  var subject = req.body.subject;
  var email = req.body.email;
  var message = req.body.message;
  var content = `From : ${name} \nEmail : ${email} \nSubject : ${subject}  \n\n\n ${message}`;

  var mail = {
    from: creds.USER,
    to: "ranjanrajeev1006@gmail.com", // Change to email address that you want to receive messages on
    subject: "New Mail from Contact Form",
    text: content,
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      console.log(err);
      console.log(mail);
      res.json({
        status: "fail",
      });
    } else {
      res.json({
        status: "success",
      });
    }
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Listening on port ${port}`);
