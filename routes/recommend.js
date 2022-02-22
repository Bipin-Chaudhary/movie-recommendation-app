const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const bodyParserUrlencoded = require("body-parser").urlencoded({
  extended: "false",
});
const multer = require("multer");
const { clearLine } = require("readline");

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "public", "images"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const upload = multer({ storage: diskStorage });

router.get("/", (req, res) => {
  res.render("recommend");
});

router.post("/", upload.single("sImage"), (req, res) => {
  let aUser = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
  const aMovie = JSON.parse(fs.readFileSync("./data/movies.json", "utf-8"));

  const bUserExist = aUser.find((u) => {
    return u.bLoggedIn === "true";
  });

  if (bUserExist) {
    const oMovie = {
      nId: aMovie.length,
      sMovieName: req.body.sMovieName,
      sGenre: req.body.sGenre,
      sDescription: req.body.sDescription,
      sImage: req.file.filename,
    };

    aMovie.push(oMovie);

    //writing in movies file
    fs.writeFile("./data/movies.json", JSON.stringify(aMovie), (err) => {
      if (err) throw "file write error";
    });
    // res.send("alert('Movie added')");
    res.render("recommend", { alert: "Movie Added!" });
  } else {
    // res.send("Log in to see recommended movies");
    res.render("recommened", { alert: "Login to recommend movies" });
  }
});

module.exports = router;
