import React, { Component } from "react";
import { Image as Images } from "../Images";
import { Button, Form, Input } from "antd";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class Verification extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="container-fluid credential-fluid-main h-100 px-0">
          <div className="row mx-0 credential-row-main h-100">
            <div className="col-12 col-sm-6 h-100">
              <div className="row credential-logo-left align-items-center justify-content-center h-100">
                <a href="#">
                  <img
                    src={Images.logo_small}
                    alt="logo"
                    className="img-fluid"
                  />
                </a>
              </div>
            </div>
            <div className="col-12 col-sm-6 h-100">
              <div className="row credential-details-right align-items-center h-100">
                <div className="col-12">
                  <h5>Verification</h5>
                  <p>
                    Please enter the verification code we have sent to your
                    registered email or <a href="#">request a new code.</a>
                  </p>
                  <Form className="common-form" {...layout}>
                    <Form.Item
                      name="verification"
                      label={""}
                      className="verification-input"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="" />
                      <Input placeholder="" />
                      <Input placeholder="" />
                      <Input placeholder="" />
                      <Input placeholder="" />
                      <Input placeholder="" />
                    </Form.Item>
                    <div className="row mt-lg-5 mt-md-4">
                      <div className="col-12 col-sm-6">
                        <Form.Item>
                          <Button className="sign-in-btn">Back</Button>
                        </Form.Item>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Item>
                          <Button type={"primary"} className="sign-in-btn">
                            Next
                          </Button>
                        </Form.Item>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Verification;
