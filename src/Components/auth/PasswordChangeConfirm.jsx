import React, { Component } from "react";
import { Image as Images } from "../Images";
import { Button, Form, Input } from "antd";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class PasswordChangeConfirm extends Component {
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
                  <div className="row">
                    <div className="col-12 mb-lg-4 text-center">
                      <img
                        src={Images.password_change_lock}
                        className="img-fluid"
                        alt="password change icon"
                      />
                    </div>
                  </div>
                  <h5 className="text-center">Password Changed!</h5>
                  <p className="text-center">
                    You can Sign In to your account now.
                  </p>
                  <Form className="common-form" {...layout}>
                    <div className="row mt-lg-5 mt-md-4">
                      <div className="col-12">
                        <Form.Item>
                          <Button type={"primary"} className="sign-in-btn">
                            Continue Sign in
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

export default PasswordChangeConfirm;
