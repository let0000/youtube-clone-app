const express = require("express");
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".mp4") {
      return cb(res.status(400).end("only jpg, png, mp4 is allowed"), false);
    }
    cb(null, true);
  },
});

var upload = multer({ storage: storage }).single("file");

//=================================
//              Video
//=================================

router.post("/uploadfiles", (req, res) => {
  // 비디오를 서버에 저장한다.
  upload(req, res, (err) => {
    if (err) {
      return res.json({
        success: false,
        err,
      });
    }
    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post("/uploadVideo", (req, res) => {
  // 비디오 정보들을 저장한다.
  const video = new Video(req.body);

  video
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

router.get("/getVideos", (req, res) => {
  //비디오 정보들을 DB에서 가져와서 클라이언트에 보낸다.

  Video.find()
    .populate("writer")
    .exec()
    .then((videos) => {
      res.status(200).json({
        success: true,
        videos,
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

router.post("/getVideoDetail", (req, res) => {
  Video.findOne({ _id: req.body.videoId })
    .populate("writer")
    .exec()
    .then((videoDetail) => {
      res.status(200).json({
        success: true,
        videoDetail,
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

router.post("/thumbnail", (req, res) => {
  // 썸네일 생성하고 비디오 러닝타임도 가져오기
  let thumbsFilePath = "";
  let fileDuration = "";

  // 비디오 정보 가져오기
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    if (err) {
      console.error(err);
      return res.json({ success: false, error: err });
    }

    console.dir(metadata);
    console.log(metadata.format.duration);

    fileDuration = metadata.format.duration;

    // 썸네일 생성
    ffmpeg(req.body.url)
      .on("filenames", function (filenames) {
        console.log("Will generate " + filenames.join(", "));

        thumbsFilePath = "uploads/thumbnails/" + filenames[0];
      })
      .on("end", function () {
        console.log("Screenshots taken");
        return res.json({
          success: true,
          url: thumbsFilePath,
          fileDuration: fileDuration,
        });
      })
      .on("error", function (err) {
        console.error(err);
        return res.json({ success: false, error: err });
      })
      .screenshots({
        // 비디오의 20%, 40%, 60%, 80% 위치에서 스크린샷을 생성합니다.
        count: 3,
        folder: "uploads/thumbnails",
        size: "320x240",
        // %b는 확장자를 제외한 파일명을 의미합니다.
        filename: "thumbnail-%b.png",
      });
  });
});

module.exports = router;
