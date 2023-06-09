import React, { Component } from "react";
import { Button, Drawer, Form, Input } from "antd";
import { Image as Images } from "../Images";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { TextArea } = Input;

class CreateNote extends Component {
  render() {
    return (
      <React.Fragment>
        <Drawer
          centered
          title={
            <div className="d-flex align-items-center justify-content-between">
              <div className="create-note-div d-flex align-items-center">
                <img
                  alt=""
                  className="img-fluid"
                  src={Images.note_header_icon}
                />
                <div className="create-note-heading-drawer">Note Title</div>
              </div>
              <Button className="delete-btn-drawer p-0 border-0 bg-transparent">
                <img
                  src={Images.delete_icon_drawer}
                  alt=""
                  className="img-fluid"
                />
              </Button>
            </div>
          }
          visible={this.props.visible}
          onOk={this.props.onClose}
          onCancel={this.props.onClose}
          className="main-drawer-div"
          width={"450px"}
          placement={"right"}
          onClose={this.props.onClose}
          closeIcon={
            <img
              src={Images.right_arrow_icon_drawer}
              alt=""
              className="img-fluid"
            />
          }
          footer={
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Button onClick={this.props.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={this.props.onClose} type="primary">
                Create Note
              </Button>
            </div>
          }
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <Form {...layout} className="main-inner-form">
                <div className="row">
                  <div className="col-12">
                    <Form.Item
                      name="Description"
                      label={false}
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <TextArea
                        className="text-area-main"
                        placeholder={"Enter note here"}
                      />
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default CreateNote;
