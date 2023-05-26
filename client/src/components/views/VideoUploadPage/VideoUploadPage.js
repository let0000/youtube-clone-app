import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Typography, Button, Form, message, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import Dropzone from "react-dropzone";

const { Title } = Typography;

function VideoUploadPage() {
  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>Upload Video</Title>
      </div>
      <Form onSubmit>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* { Drop zone} */}
          <Dropzone onDrop multiple maxSize>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <PlusOutlined style={{ fontSize: "3rem" }} />
              </div>
            )}
          </Dropzone>

          {/* { Thumbnail} */}
          <div>
            <img src alt="" />
          </div>
        </div>

        <br />
        <br />

        <lavel>Title</lavel>
        <Input onChange value />

        <br />
        <br />

        <lavel>Description</lavel>
        <TextArea onChange value />

        <br />
        <br />

        <select onChange>
          <option key={true} value></option>
        </select>

        <br />
        <br />

        <select onChange>
          <option key={true} value></option>
        </select>

        <br />
        <br />

        <Button type="primary" size="large" onClick>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default VideoUploadPage;
