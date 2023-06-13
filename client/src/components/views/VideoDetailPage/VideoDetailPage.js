import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import SideVideo from "./Sections/SideVideo";
import Subscribe from "./Sections/Subscribe";

export default function VideoDetailPage() {
  const { videoId } = useParams();
  const variable = { videoId: videoId };

  const [VideoDetail, setVideoDetail] = useState([]);

  useEffect(() => {
    axios.post("/api/video/getVideoDetail", variable).then((response) => {
      if (response.data.success) {
        setVideoDetail(response.data.videoDetail);
      } else {
        alert("비디오 정보를 가져오길 실패했습니다.");
      }
    });
  }, []);

  if (VideoDetail.writer) {
    return (
      <div>
        <Row>
          <Col lg={18} md={16} xs={24}>
            <div style={{ width: "100%", padding: "3rem 4rem" }}>
              <video
                style={{ width: "85%" }}
                src={`http://localhost:5000/${VideoDetail.filePath}`}
                controls
              />

              <List.Item
                style={{ display: "flex" }}
                actions={[
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Subscribe userTo={VideoDetail.writer._id} />
                  </div>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={VideoDetail.writer.image} />}
                  title={VideoDetail.writer.name}
                  description={VideoDetail.description}
                />
              </List.Item>

              {/* Comment */}
            </div>
          </Col>
          <Col lg={6} md={8} xs={24}>
            <SideVideo />
          </Col>
        </Row>
      </div>
    );
  } else {
    return <div>... 로딩중</div>;
  }
}
