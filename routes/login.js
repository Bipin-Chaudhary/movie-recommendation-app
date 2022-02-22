const fs = require("fs");
const express = require("express");
const router = express.Router();
const generateHash = require("../helper/generateHash");
const { check, validationResult } = require("express-validator");
const multer = require("multer");

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

router.get("/", (req, res) => {
  res.render("login");
});

router.post(
  "/",
  upload.single("avatar"),
  [
    check("sEmail", "Invalid email address").not().isEmpty().isEmail(),
    check(
      "sPassword",
      "password should contain alteast one digit,symbol,small & upper case letters"
    )
      .not()
      .isEmpty()
      .isLength({ min: 8, max: 20 }),
  ],

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("login", errors);
    } else {
      let aUser = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));

      const bUserExist = aUser.find((u) => {
        return (
          u.sEmail == req.body.sEmail &&
          u.sPassword == generateHash(req.body.sPassword)
        );
      });

      if (bUserExist) {
        aUser.forEach((u) => {
          if (u.sEmail === bUserExist.sEmail) {
            u.bLoggedIn = "true";
          } else {
            u.bLoggedIn = "false";
          }
        });

        //writing in users file
        fs.writeFile("./data/users.json", JSON.stringify(aUser), (err) => {
          if (err) throw "file write error";
          console.log("user data saved!");
        });

        // res.send(`${bUserExist.sName} logged in`);
        res.render("login", {
          alert: `${bUserExist.sName} Logged In`,
        });
      } else {
        console.log(bUserExist);
        res.render("login", { alert: "UserId and Password not found" });
      }
    }
  }
);

module.exports = router;
