const fs = require("fs");
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const generateHash = require("../helper/generateHash");
const multer = require("multer");

const path = require("path");
//multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

router.get("/", (req, res, next) => {
  res.render("register");
});

router.post(
  "/",
  upload.single("avatar"),
  [
    check(
      "sName",
      "Name should be 3 or less than 20 character long and should aphabets"
    )
      .not()
      .isEmpty()
      .isAlpha()
      .isLength({ min: 3, max: 20 }),

    check("sEmail", "Invalid email address").not().isEmpty().isEmail(),
    check("nPhone", "Mobile number should be of 10 digits")
      .not()
      .isEmpty()
      .isMobilePhone(),
    check(
      "sPassword",
      "password should contain alteast one digit,symbol,small & upper case letters"
    )
      .not()
      .isEmpty()
      .isLength({ min: 8, max: 20 }),
  ],

  (req, res, next) => {
    // checking for errors

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // res.json(errors);
      res.render("register", errors);
    } else {
      //reading user data
      let aUser = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));

      const bUserExist = aUser.find((u) => {
        return u.sEmail === req.body.sEmail;
      });

      if (bUserExist) {
        res.render("register", { alert: "User Already Exist" });
      } else {
        const oUser = {
          nId: aUser.length,
          sName: req.body.sName,
          sEmail: req.body.sEmail,
          nPhone: req.body.nPhone,
          sPassword: generateHash(req.body.sPassword),
          bLoggedIn: "false",
        };

        aUser.push(oUser);

        fs.writeFile("./data/users.json", JSON.stringify(aUser), (err) => {
          if (err) throw "file write error";
        });

        res.render("register", { alert: "User Registered Successfuly" });
      }
    }
  }
);

module.exports = router;
