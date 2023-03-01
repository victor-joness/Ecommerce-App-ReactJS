const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, require: true, minlength: 3, maxlenght: 30 },
    email: {
      type: String,
      require: true,
      minlength: 3,
      maxlenght: 200,
      unique: true,
    },
    senha: {
      type: String,
      require: true,
      minlength: 3,
      maxlenght: 1024,
    },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

exports.User = User;