const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "please enter an email"],
      unique: true,
      lowercase: true,
      //validate: [(val)=>{}, 'please enter a valid email']
      validate: [isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "please enter a password"],
      minlength: [7, "Minimum password length is 7 characters"],
    },
  },
  { timestamps: true }
);

// fire a function after doc id saved to the db
// UserSchema.post("save", (doc, next) => {
//   console.log("new user was created and saved", doc);
//   next();
// });
// a function before the doc is saved
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//static method to login user

UserSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email: email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect Password");
  }
  throw Error("incorrect email");
};

module.exports = mongoose.model("User", UserSchema);
