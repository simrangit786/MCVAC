import React, { Component } from "react";
import { Image as Images } from "../Images";
import { Button, Form, Input } from "antd";
import { isDomainAccessible } from "../../Controller/utils";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class ForgotPassword extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="container-fluid credential-fluid-main h-100 px-0">
          <div className="row mx-0 credential-row-main h-100">
            <div className="col-12 col-sm-6 h-100">
              <div className="row credential-logo-left align-items-center justify-content-center h-100">
                <div className="col-12 text-center p-0">
                <a href="#">

<img
  src={Images.logo_small}
  alt="logo"
  className="img-fluid"
/>
</a>
{isDomainAccessible(['lab']) &&
                      <div className="beta-heading mb-0">
                          Lab
                      </div>
                  }
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 h-100">
              <div className="row credential-details-right align-items-center h-100">
                <div className="col-12">
                  <h5>Forgot Password</h5>
                  <p>
                    Please enter your registered email. We will send a a
                    password reset code.
                  </p>
                  <Form className="common-form" {...layout}>
                    <Form.Item
                      name="email"
                      label={"Email"}
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Example@email.com" />
                    </Form.Item>
                    <div className="row mt-lg-5 mt-md-4">
                      <div className="col-12 col-sm-6">
                        <Form.Item>
                          <Button className="sign-in-btn">Cancel</Button>
                        </Form.Item>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Item>
                          <Button type={"primary"} className="sign-in-btn">
                            Send
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

export default ForgotPassword;
