const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// handle errors

const handleError = (err) => {
  let error = { email: "", password: "" };
  if (err.message === "incorrect email") {
    error.email = "This Email is not registered";
  }
  if (err.message === "Incorrect Password") {
    error.email = "The password is incorrect";
  }
  if (err.code === 11000) {
    //duplicate error code
    error.email = "That email is registered already";
    return error;
  }
  //validation error
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      error[properties.path] = properties.message;
    });
  }
  return error;
};

/// jwt ////
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "my task secret", { expiresIn: maxAge });
};

///pages///
const getHomepage = (req, res) => {
  res.render("home");
};
const getSmoothiePage = (req, res) => {
  res.render("smoothies");
};
const signup_get = (req, res) => {
  res.render("signup");
};
const login_get = (req, res) => {
  res.render("login");
};
const login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (error) {
    const errors = handleError(error);
    res.status(400).json({ errors });
  }
};
const login_post2 = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const authenticated = await bcrypt.compare(password, user.password);
      if (authenticated) {
        res.status(200).json(user);
        const token = createToken(user._id);
        res.cookie("jwt", token, { maxAge: maxAge * 1000, httpOnly: true });
      }
      throw Error("Incorrect Password");
    }
    throw Error("User not found");
  } catch (error) {
    res.status(404).json({ msg: error });
  }
};
const signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (error) {
    const errors = handleError(error);
    res.status(404).json({ errors });
  }
};
// const signup_post2 = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     res.status(201).json({ msg: "input all fields" });
//   }
//   const userExist = await User.findOne({ email });
//   if (userExist) {
//     res.status(201).json({ msg: "This user already exists" });
//   }
//   //hashing password
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);
//   const user = await User.create({ email, password: hashedPassword });
//   // res.status(201).json(user);
//   if (user) {
//     res.status(201).json({
//       msg: `welcome mr ${email}`,
//       data: user,
//     });
//   } else {
//     res.status(400).json({ msg: "error" });
//   }
// };

const logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1000 });
  res.redirect("/");
};

module.exports = {
  getHomepage,
  getSmoothiePage,
  signup_get,
  signup_post,
  login_get,
  login_post,
  logout,
};
