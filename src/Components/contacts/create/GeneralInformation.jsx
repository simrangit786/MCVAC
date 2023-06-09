import React, {Component} from "react";
import {Button, Form, Input, message, Select} from "antd";
import {createContact, updateContact,} from "../../../Controller/api/contactsServices";

const {TextArea} = Input;

const layout = {
    labelCol: {span: 24},
    wrapperCol: {span: 24},
};

class GeneralInformation extends Component {
    state = {
        buttonLoading: false,
    };
    formRef = React.createRef();
    onSubmit = (values) => {
        this.setState({buttonLoading: true});
        if (this.props.contact) {
            updateContact(values, this.props.contact.id)
                .then((res) => {
                    message.success("Contact Updated Successfully");
                    this.props.setContact(res.data, 2);
                    this.setState({buttonLoading: false});
                })
                .catch((err) => {
                    if (err.response) {
                        Object.keys(err.response.data).map((e) => {
                            message.error(err.response.data[e]);
                        });
                    }
                });
        } else {
            createContact(values)
                .then((res) => {
                    message.success("Contact Created Successfully");
                    this.props.setContact(res.data, 2);
                    this.setState({buttonLoading: false});
                })
                .catch((err) => {
                    if (err.response) {
                        Object.keys(err.response.data).map((e) => {
                            message.error(err.response.data[e]);
                        });
                    }
                    this.setState({buttonLoading: false});
                });
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.contact !== this.props.contact) {
            this.formRef.current.setFieldsValue({
                ...this.props.contact,
            });
        }
    }

    render() {
        let {contact} = this.props;
        let {buttonLoading} = this.state;
        return (
            <React.Fragment>
                <div className="row common-form-card-row">
                    <div className="col-12">
                        <div className="row info-gray-div align-items-center">
                            <h6 className="mb-0">
                                Please input general information here.
                            </h6>
                        </div>
                    </div>
                    <div className="col-12 p-0">
                        <Form
                            ref={this.formRef}
                            onFinish={this.onSubmit}
                            requiredMark={false}
                            {...layout}
                            className="main-inner-form"
                        >
                            <div className="row">
                                <div className="col-12 col-sm-6">
                                    <Form.Item name="salutation" label={"Salutation"} rules={[{
                                        required: false,
                                        message: ''
                                    }]}>

                                        <Select placeholder="Select">
                                            <Select.Option value="MR.">Mr.</Select.Option>
                                            <Select.Option value="MRS.">Mrs.</Select.Option>
                                            <Select.Option value="MS.">Ms.</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className="col-12 col-sm-6">
                                    <Form.Item
                                        name="first_name"
                                        label={"First Name *"}
                                        rules={[
                                            {
                                                required: true,
                                                message: "this field is required",
                                            },
                                        ]}
                                    >
                                        <Input placeholder="First Name"/>
                                    </Form.Item>
                                </div>
                                <div className="col-12 col-sm-6">
                                    <Form.Item
                                        name="middle_name"
                                        label={"Middle Name"}
                                        rules={[
                                            {
                                                required: false,
                                                message: "",
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Middle Name"/>
                                    </Form.Item>
                                </div>
                                <div className="col-12 col-sm-6">
                                    <Form.Item
                                        name="last_name"
                                        label={"Last Name *"}
                                        rules={[
                                            {
                                                required: true,
                                                message: "this field is required",
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Last Name"/>
                                    </Form.Item>
                                </div>
                                <div className="col-12 col-sm-6">
                                    <Form.Item
                                        name="suffix"
                                        label={"Suffix"}
                                        rules={[
                                            {
                                                // required: true,
                                                message: "this field is required",
                                            },
                                        ]}
                                    >
                                        <Select placeholder="Jr.">
                                            <Select.Option value="JR">Jr.</Select.Option>
                                            <Select.Option value="SR">Sr.</Select.Option>
                                            <Select.Option value="I">I</Select.Option>
                                            <Select.Option value="II">II</Select.Option>
                                            <Select.Option value="III">III</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className="col-12">
                                    <Form.Item
                                        name="note"
                                        label={"Note"}
                                        rules={[
                                            {
                                                // required: true,
                                                message: "this field is required",
                                            },
                                        ]}
                                    >
                                        <TextArea
                                            placeholder="Type something"
                                            rows={6}
                                            style={{height: "auto", paddingTop: 15}}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="col-12 validate-div-col text-md-right">
                                    <Form.Item>
                                        <Button
                                            loading={buttonLoading}
                                            htmlType="submit"
                                            className="validate-btn-main"
                                        >
                                            Save and Continue
                                        </Button>
                                    </Form.Item>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default GeneralInformation;
