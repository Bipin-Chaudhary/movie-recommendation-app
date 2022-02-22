const express = require("express");
const app = express();
const path = require("path");
//routers
const home = require("./routes/home");
const register = require("./routes/register");
const login = require("./routes/login");
const movies = require("./routes/movies");
const recommend = require("./routes/recommend");
const logout = require("./routes/logout");

//middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

//view
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//routes
app.use("/", home);
app.use("/home", home);
app.use("/register", register);
app.use("/login", login);
app.use("/movies", movies);
app.use("/recommend", recommend);
app.use("/logout", logout);

//server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log("Server is running on PORT :: ", PORT));
