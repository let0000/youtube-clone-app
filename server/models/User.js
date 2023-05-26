const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    maxlength: 100,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    //비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        // Store hash in your password DB.
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword) {
  return new Promise((resolve, reject) => {
    // plainpassword 와 DB에 저장된 비밀번호가 같은지 확인
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

userSchema.methods.generateToken = function () {
  var user = this;
  return new Promise((resolve, reject) => {
    // jsonwebtoken을 이용해서 token을 생성하기
    jwt.sign(user._id.toHexString(), "secretToken", function (err, token) {
      if (err) return reject(err);

      // user._id + 'secretToken' = token
      // -->
      // 'secretToken' -> user._id

      user.token = token;
      user
        .save()
        .then((user) => resolve(user))
        .catch((err) => reject(err));
    });
  });
};

userSchema.statics.findByToken = function (token) {
  var user = this;
  return new Promise((resolve, reject) => {
    // 토큰을 decode 한다.
    jwt.verify(token, "secretToken", function (err, decoded) {
      //유저 아이디를 이용해서 유저를 찾은 다음에
      //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

      user
        .findOne({ _id: decoded, token: token })
        .then((user) => resolve(user))
        .catch((err) => reject(err));
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
