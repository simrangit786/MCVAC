import React, { Component } from "react";
import { Image as Images } from "../Images";
import { Button, Form, Input } from "antd";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class ResetPassword extends Component {
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
                  <h5>Reset Password</h5>
                  <p>Please enter a new password.</p>
                  <Form className="common-form" {...layout}>
                    <Form.Item
                      name="new_password"
                      label={"New Password"}
                      className="position-relative"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="••••••••••" />
                      <Button className="eye-btn position-absolute border-0 p-0 shadow-none bg-transparent">
                        <img
                          src={Images.eye_pwd}
                          alt={"eye icon"}
                          className="img-fluid"
                        />
                      </Button>
                    </Form.Item>
                    <Form.Item
                      name="re_enter_password"
                      label={"Re-enter Password"}
                      className="position-relative"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="••••••••••" />
                      <Button className="eye-btn position-absolute border-0 p-0 shadow-none bg-transparent">
                        <img
                          src={Images.eye_pwd}
                          alt={"eye icon"}
                          className="img-fluid"
                        />
                      </Button>
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
                            Reset
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

export default ResetPassword;
