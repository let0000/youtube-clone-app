const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const { User } = require("./models/User");

const { auth } = require("./middleware/auth");

const config = require("./config/key");

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => res.send("Hello World! 서버 열림"));

app.post("/api/users/register", async (req, res) => {
  //회원 가입 할때 필요한 정보들을 client 에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.

  const user = new User(req.body);

  await user
    .save()
    .then(() => {
      res.status(200).json({
        success: true,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        success: false,
        err: err,
      });
    });
});

app.post("/api/users/login", (req, res) => {
  // DB에서 요청된 이메일 찾기
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.json({
          loginSuccess: false,
          message: "제공된 이메일에 해당하는 유저가 없습니다.",
        });
      }

      // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인
      user
        .comparePassword(req.body.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.json({
              loginSuccess: false,
              message: "비밀번호가 틀렸습니다.",
            });
          }

          // 비밀 번호까지 같다면 Token 생성하기
          user
            .generateToken()
            .then((user) => {
              // Token을 저장한다. 어디에? 쿠키
              res.cookie("x_auth", user.token).status(200).json({
                loginSuccess: true,
                userId: user._id,
              });
            })
            .catch((err) => {
              return res.status(400).send(err);
            });
        })
        .catch((err) => {
          return res.status(400).send(err);
        });
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
});

app.get("/api/users/auth", auth, (req, res) => {
  // 여기 까지 미들웨어를 통과해 왔다는 얘기는 Authentication 이 True 라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
    .then((user) => {
      return res.status(200).send({
        success: true,
      });
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
});

app.get("/api/hello", (req, res) => {
  res.send("안녕하세요~");
});

const port = 5000;

app.listen(port, () => console.log(`Example app listening on port ${port}`));
