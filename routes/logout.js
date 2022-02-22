const fs = require("fs");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  let aUser = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));

  const bUserExist = aUser.find((u) => {
    return u.bLoggedIn === "true";
  });

  if (bUserExist) {
    aUser[bUserExist.nId].bLoggedIn = "false";
    //writing in users file
    fs.writeFile("./data/users.json", JSON.stringify(aUser), (err) => {
      if (err) throw "file write error";
    });

    res.render("logout", { alert: `${bUserExist.sName} has logged out!` });
  } else {
    res.render("logout", { alert: "No Loggedin user found" });
  }
});

module.exports = router;
