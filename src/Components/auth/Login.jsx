import React, {Component} from "react";
import {Image as Images} from "../Images";
import {Button, Form, Input, message} from "antd";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {userLoginAction} from "../../Store/actions/authAction";
import { isDomainAccessible, showLabel } from "../../Controller/utils";

const layout = {
    labelCol: {span: 24},
    wrapperCol: {span: 24},
};

class Login extends Component {
    // state = {
    //     BETA_SERVER: false,
       
       
    // }
    handleSubmit = (values) => {
        this.props.userLoginAction(values).catch((err) => {
            if (err.response) {
                Object.keys(err.response.data).map((e) => {
                    message.error(err.response.data[e]);
                });
            }
        });
    };

    componentDidMount() {
        // if (window.location?.href.includes('demo')) {
        //     this.setState({BETA_SERVER: true})
        // }
    }

    render() {
        // const {BETA_SERVER} = this.state;
        return (
            <React.Fragment>
                <div className="container-fluid credential-fluid-main h-100 px-0">
                    <div className="row mx-0 credential-row-main h-100">
                        <div className="col-12 col-sm-6 h-100">
                            <div className="row credential-logo-left align-items-center justify-content-center h-100">
                                <div className="col-12 text-center p-0">
                                    <Link to={"/dashboard/"}>
                                    {isDomainAccessible(['demo']) ? (
                                        <img
                                            src={Images.logo_small}
                                            alt="logo"
                                            className="img-fluid"
                                        />
                                    ) : ( <img
                                        src={Images.new_logo_small}
                                        alt="logo"
                                        className="img-fluid"
                                    />)
                                    }
                                    </Link>
                                    {/* {BETA_SERVER &&
                                        <div className="beta-heading mb-0">
                                            Demo
                                        </div>
                                    } */}
                                     {isDomainAccessible(['lab']) &&
                                        <div className="beta-heading mb-0">
                                            Lab
                                        </div>
                                    }
                                    {isDomainAccessible(['product']) &&
                                        <div className="beta-heading mb-0">
                                            Product
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 h-100">
                            <div className="row credential-details-right align-items-center h-100">
                                <div className="col-12">
                                    <h5>Sign In</h5>
                                    <Form
                                        onFinish={this.handleSubmit}
                                        className="common-form"
                                        {...layout}
                                    >
                                        <Form.Item
                                            name="email"
                                            label={"Email"}
                                            rules={[
                                                {required: true, message: "Email is required"},
                                                {
                                                    type: "email",
                                                    message: "Invalid Email",
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Example@email.com"/>
                                        </Form.Item>
                                        <Form.Item
                                            name="password"
                                            label={"Password"}
                                            rules={[
                                                {required: true, message: "Password is required"},
                                            ]}
                                        >
                                            <Input.Password
                                                iconRender={(visible) =>
                                                    visible ? (
                                                        <img
                                                            src={Images.eye_pwd}
                                                            alt={"eye icon"}
                                                            className="img-fluid"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={Images.eye_pwd}
                                                            alt={"eye icon"}
                                                            className="img-fluid"
                                                        />
                                                    )
                                                }
                                                placeholder="••••••••••"
                                            />
                                        </Form.Item>
                                        {isDomainAccessible(['demo','product']) ? "" :
                                        <div className="w-100 forgot-pswd-div text-right">
                                            <Link
                                                className="position-relative"
                                                to={"/forgot-password/"}
                                            >
                                                Forgot Password?
                                            </Link>
                                        </div>
    }
                                        <Form.Item>
                                            <Button
                                                htmlType="submit"
                                                className="sign-in-btn sign-in-primary d-flex align-items-center justify-content-center"
                                            >
                                                Sign in
                                            </Button>
                                        </Form.Item>
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

const mapStateToProps = () => {
};
const mapActionToProps = {
    userLoginAction,
};
export default connect(mapStateToProps, mapActionToProps)(Login);
