const express = require("express");
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");

//=================================
//              Subscribe
//=================================

router.post("/subscribeNumber", (req, res) => {
  // 비디오를 서버에 저장한다.
  Subscriber.find({ userTo: req.body.userTo })
    .exec()
    .then((subscribe) => {
      res.status(200).json({
        success: true,
        subscribeNumber: subscribe.length,
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

router.post("/subscribed", (req, res) => {
  // 비디오를 서버에 저장한다.
  Subscriber.find({ userTo: req.body.userTo, userFrom: req.body.userFrom })
    .exec()
    .then((subscribe) => {
      let result = false;
      if (subscribe.length !== 0) {
        result = true;
      }
      res.status(200).json({
        success: true,
        subscribed: result,
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

module.exports = router;
