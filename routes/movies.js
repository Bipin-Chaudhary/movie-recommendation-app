const fs = require("fs");
const express = require("express");
const router = express.Router();
const bodyParserUrlencoded = require("body-parser").urlencoded({
  extended: "false",
});

//movie listing function
function getMovies(genre) {
  //reading movies
  const aMovie = JSON.parse(fs.readFileSync("./data/movies.json", "utf-8"));

  if (genre === "all") {
    return aMovie;
  }

  return aMovie.filter((m) => m.sGenre === genre);
}

router.get("/", (req, res) => {
  res.render("movies", { movies: getMovies("all") });
});

router.post("/", bodyParserUrlencoded, (req, res) => {
  let aUser = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));

  const bUserExist = aUser.find((u) => {
    return u.bLoggedIn === "true";
  });

  if (bUserExist) {
    //if user is logged in
    const aMovieList = getMovies(req.body.sGenre);

    res.render("movies", { movies: getMovies(req.body.sGenre) });
  } else {
    res.render("movies", { alert: "Login to see recommended movies" });
  }
});

module.exports = router;
