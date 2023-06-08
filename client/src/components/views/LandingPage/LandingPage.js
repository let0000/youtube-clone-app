import { Avatar, Col, Row } from "antd";
import Meta from "antd/es/card/Meta";
import Title from "antd/es/typography/Title";
import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment";

function LandingPage() {
  const [Video, setVideo] = useState([]);

  useEffect(() => {
    axios.get("/api/video/getVideos").then((response) => {
      if (response.data.success) {
        console.log(response.data);
        setVideo(response.data.videos);
      } else {
        alert("비디오 가져오기를 실패 했습니다.");
      }
    });
  }, []);

  const renderCards = Video.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col lg={6} md={8} xs={24}>
        <div style={{ position: "relative" }}>
          <a href={`/video/${video._id}`}>
            <img
              style={{ width: "100%" }}
              alt="thumbnail"
              src={`http://localhost:5000/${video.thumbnail}`}
            />
            <div className=" duration">
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </a>
        </div>
        <br />
        <Meta
          style={{ marginLeft: "1rem" }}
          avatar={<Avatar src={video.writer.image} />}
          title={video.title}
        />
        <span style={{ marginLeft: "1rem" }}>{video.writer.name} </span>
        <br />
        <span style={{ marginLeft: "1rem" }}> {video.views} views</span>-{" "}
        <span> {moment(video.createdAt).format("MMM Do YY")} </span>
      </Col>
    );
  });

  return (
    <div
      style={{
        width: "85%",
        margin: "3rem auto",
      }}
    >
      <Title level={2}>Recommended</Title>
      <hr />
      <Row gutter={16}>{renderCards}</Row>
    </div>
  );
}

export default LandingPage;
