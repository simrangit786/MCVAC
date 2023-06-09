import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Button, Dropdown, Form, Input, InputNumber, Menu, message, Radio, Select,} from "antd";
import {Image as Images} from "../../Images";
import {
    createContactEmail,
    createContactPhone,
    removeContactEmail,
    removeContactPhone,
    updateContactEmail,
    updateContactPhone,
    updateDefaultEmail,
    updateDefaultPhone,
} from "../../../Controller/api/contactsServices";
import {formatPhone} from "../../../Controller/utils";
import {handleError} from "../../../Controller/Global";

const layout = {
    labelCol: {span: 24},
    wrapperCol: {span: 24},
};

const {Option} = Select;

class ContactInformation extends Component {
    state = {
        emails: [],
        phones: [],
        selectedPhone: null,
        selectedEmail: null,
    };
    emailRef = React.createRef();
    phoneRef = React.createRef();
    menu = (item, type) => (
        <Menu>
            <Menu.Item key="0">
                <Button
                    onClick={() => this.handleRemove(item, type)}
                    className="border-0 p-0 shadow-none bg-transparent"
                >
                    Remove
                </Button>
            </Menu.Item>
            <Menu.Item key="1">
                <Button
                    onClick={() => this.handleEdit(item, type)}
                    className="border-0 p-0 shadow-none bg-transparent"
                >
                    Edit
                </Button>
            </Menu.Item>
        </Menu>
    );

    handleRemove = (item, type) => {
        if (type === "email") {
            removeContactEmail(item.id)
                .then(() => {
                    const emails = this.props.emails.filter(i => i.id != item.id);
                    message.success("Email removed successfully!");
                    if (emails.length > 0 && item.default_email) {
                        this.handleDefaultEmail(emails[0]?.id)
                    } else {
                        this.props.fetchEmails();
                    }
                })
                .catch((err) => {
                    handleError(err)
                });
        } else {
            removeContactPhone(item.id)
                .then(() => {
                    const phones = this.props.phones.filter(i => i.id != item.id);
                    message.success("Phone Number removed successfully!");
                    if (phones.length > 0 && item.default_phone) {
                        this.handleDefaultPhone(phones[0]?.id);
                    } else {
                        this.props.fetchPhones();
                    }
                })
                .catch((err) => {
                    handleError(err)
                });
        }
    };
    handleEdit = (item, type) => {
        if (type === "email") {
            this.emailRef.current.setFieldsValue({
                ...item,
            });
            this.setState({selectedEmail: item});
        } else {
            this.phoneRef.current.setFieldsValue({
                ...item,
            });
            this.setState({selectedPhone: item});
        }
    };

    handleEmail = (values) => {
        values.contact = this.props.contact.id;
        if (this.state.selectedEmail) {
            updateContactEmail(values, this.state.selectedEmail.id)
                .then((res) => {
                    message.success("Email Updated Successfully!");
                    this.setState({selectedEmail: null});
                    this.emailRef.current.resetFields();
                    this.props.fetchEmails();
                })
                .catch((err) => {
                    handleError(err)
                });
        } else {
            createContactEmail(values)
                .then((res) => {
                    message.success("Email Created Successfully!");
                    this.emailRef.current.resetFields();
                    let emails = [];
                    emails.push(res.data);
                    if (!this.props.emails.length) {
                        this.handleDefaultEmail(res.data.id)
                    } else {
                        this.props.fetchEmails();
                    }
                })
                .catch((err) => {
                    handleError(err)
                });
        }
    };

    handlePhone = (values) => {
        values.contact = this.props.contact.id;
        if (this.state.selectedPhone) {
            updateContactPhone(values, this.state.selectedPhone.id)
                .then((res) => {
                    message.success("Phone Number updated Successfully");
                    this.setState({selectedPhone: null});
                    this.phoneRef.current.resetFields();
                    this.props.fetchPhones();
                })
                .catch((err) => {
                    handleError(err)
                });
        } else {
            createContactPhone(values)
                .then((res) => {
                    message.success("Phone Number Created Successfully!");
                    this.phoneRef.current.resetFields();
                    let phones = [];
                    phones.push(res.data);
                    if (!this.props.phones.length) {
                        this.handleDefaultPhone(res.data.id)
                    } else {
                        this.props.fetchPhones();
                    }
                })
                .catch((err) => {
                    handleError(err)
                });
        }
    };

    phoneNumberValidate = (rule, value, callback) => {
        if (value.toString().length < 10) callback("minimum digits should be 10");
        else callback();
    };

    handleDefaultEmail = (e) => {
        updateDefaultEmail(this.props.contact.id, {email_id: e})
            .then(() => {
                this.props.fetchEmails();
            })
            .catch((err) => {
                handleError(err);
            });
    };

    handleDefaultPhone = (e) => {
        updateDefaultPhone(this.props.contact.id, {phone_id: e})
            .then(() => {
                this.props.fetchPhones();
            })
            .catch((err) => {
                handleError(err);
            });
    };

    handleSubmit = () => {
        this.props.setContact(this.props.contact, 6);
        message.success("Contact updated successfully!");
    };

    render() {
        let {selectedEmail, selectedPhone} = this.state;
        const {emails, phones} = this.props;
        const defaultEmailId = emails?.find((i) => i.default_email === true)?.id;
        const defaultPhoneId = phones?.find((n) => n.default_phone === true)?.id;
        return (
            <React.Fragment>
                <div className="row common-form-card-row">
                    <div className="col-12">
                        <div className="row info-gray-div align-items-center">
                            <h6 className="mb-0">
                                Please add all emails and phone numbers related to this contact.
                            </h6>
                        </div>
                    </div>
                    <div className="col-12 p-0">
                        <div className="row">
                            <div className="col-12 col-sm-6 border-rit-div">
                                <div className="row">
                                    <Form
                                        ref={this.emailRef}
                                        onFinish={this.handleEmail}
                                        hideRequiredMark={true}
                                        {...layout}
                                        className="main-inner-form w-100"
                                    >
                                        <div className="col-12">
                                            <h4>Email Address</h4>
                                        </div>
                                        <div className="col-12">
                                            <Form.Item
                                                name="name"
                                                label={"Email Address Type *"}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "this field is required",
                                                    },
                                                ]}
                                            >
                                                {/* <Input placeholder="Email Address"/> */}
                                                <Select
                                                    placeholder={"Select"}
                                                    // defaultValue={"Select"}
                                                    // value={{value: proposal.status?.id, label: proposal.status?.title}}
                                                    // style={{ width: 250 }}
                                                    suffixIcon={
                                                    <img
                                                        src={Images.caret_small_icon_select}
                                                        alt=""
                                                        className="img-fluid"
                                                />
                                                    }
                                                >
                                                    <Option value={'WORK'}>
                                                        Work
                                                    </Option>
                                                    <Option value={'PERSONAL'}>
                                                        Personal
                                                    </Option>
                                                </Select>
                                            </Form.Item>
                                        </div>
                                        <div className="col-12">
                                            <Form.Item
                                                name="email"
                                                label={"Email Address *"}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "this field is required",
                                                    },
                                                    {type: "email", message: "Valid Email is required"},
                                                ]}
                                            >
                                                <Input placeholder="Email Address"/>
                                            </Form.Item>
                                        </div>
                                        <div className="col-12 validate-div-col validate-div-col-2 text-md-right">
                                            <Form.Item>
                                                <Button htmlType="submit" className="validate-btn-main">
                                                    {selectedEmail ? "Edit" : "Add"}
                                                </Button>
                                            </Form.Item>
                                        </div>
                                    </Form>
                                    {emails?.length > 0 ?
                                        <Radio.Group
                                            className={"w-100"}
                                            name="email"
                                            value={defaultEmailId}
                                            onChange={(e) => this.handleDefaultEmail(e.target.value)}
                                        >
                                            {emails?.map((item) => (
                                                <div key={item.id} className="col-12">
                                                    <div
                                                        className={`row mx-0 pb-0 align-items-center user-info-div-main position-relative opportunity-info-div-main ${
                                                            item.default_email && "active"
                                                        }`}
                                                    >
                                                        <div className="col-12 contact-col-12">
                                                            <div className="user-icons-div">
                                                                <img
                                                                    src={Images.email_inbox_icon}
                                                                    alt=""
                                                                    className="img-fluid"
                                                                />
                                                            </div>
                                                            <div className="user-info-div">
                                                                <h6>{item.name.toLowerCase()}</h6>
                                                                <p className="mb-0">{item.email}</p>
                                                            </div>
                                                            <Dropdown
                                                                overlayClassName="add-remove-dropdown-main"
                                                                overlay={this.menu(item, "email")}
                                                                trigger={["click"]}
                                                            >
                                                                <Button
                                                                    className="ant-dropdown-link ant-dropdown-link-2 border-0 p-0 bg-transparent shadow-none"
                                                                    onClick={(e) => e.preventDefault()}
                                                                >
                                                                    <img
                                                                        src={Images.more_black}
                                                                        alt=""
                                                                        className="img-fluid"
                                                                    />
                                                                </Button>
                                                            </Dropdown>
                                                        </div>
                                                        <div className="col-12 p-0 radio-btn-custom">
                                                            {/* {console.log(item.id,'check')} */}
                                                            <Radio
                                                                className="active"
                                                                value={item.id}
                                                                checked={item.default_email}
                                                                // onChange={() => this.handleDefaultEmail(item.id)}
                                                            >
                                                                Default Email
                                                            </Radio>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </Radio.Group>
                                        :
                                        <div className="col-12">
                                            <div
                                                className="row mx-0 no-data-card-row no-data-card-row-2 align-items-center justify-content-center">
                                                <div className="col-12 text-center">
                                                    <img
                                                        alt={""}
                                                        className="img-fluid"
                                                        src={Images.email_inbox_gray}
                                                    />
                                                    <h6 className="mb-0">
                                                        Added email addresses <br/> will show
                                                        up here
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>

                                    }</div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="row">
                                    <Form
                                        ref={this.phoneRef}
                                        hideRequiredMark={true}
                                        onFinish={this.handlePhone}
                                        {...layout}
                                        className="main-inner-form w-100"
                                    >
                                        <div className="col-12">
                                            <h4>Phone Number</h4>
                                        </div>
                                        <div className="col-12">
                                            <Form.Item
                                                name="name"
                                                label={"Phone Number Type *"}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "this field is required",
                                                    },
                                                ]}
                                            >
                                                {/* <Input placeholder="Phone Number Name"/> */}
                                                <Select
                                                    placeholder={"Select"}
                                                    // defaultValue={"Select"}
                                                    // value={{value: proposal.status?.id, label: proposal.status?.title}}
                                                    // style={{ width: 250 }}
                                                    suffixIcon={
                                                    <img
                                                        src={Images.caret_small_icon_select}
                                                        alt=""
                                                        className="img-fluid"
                                                />
                                                    }
                                                >
                                                    <Option value={'WORK_MAIN'}>
                                                        Work (Main)
                                                    </Option>
                                                    <Option value={'WORK_DIRECT'}>
                                                        Work (Direct)
                                                    </Option>
                                                    <Option value={'PERSONAL'}>
                                                        Personal
                                                    </Option>
                                                    <Option value={'MOBILE'}>
                                                        Mobile
                                                    </Option>
                                                </Select>
                                            </Form.Item>
                                        </div>
                                        <div className="col-12">
                                            <Form.Item
                                                name="phone_number"
                                                label={"Phone Number *"}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "this field is required",
                                                    },
                                                    {validator: this.phoneNumberValidate},
                                                ]}
                                            >
                                                <InputNumber
                                                    formatter={(value) =>
                                                        `${value}`
                                                            .match(/\d*/g)
                                                            .join("")
                                                            .match(/(\d{0,3})(\d{0,3})(\d{0,14})/)
                                                            .slice(1)
                                                            .join("-")
                                                            .replace(/-*$/g, "")
                                                    }
                                                    maxLength={22}
                                                    stringMode={true}
                                                    parser={(value) => value.replace(/\$\s?|(-*)/g, "")}
                                                    placeholder="Phone Number"
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="col-12 validate-div-col validate-div-col-2 text-md-right">
                                            <Form.Item>
                                                <Button htmlType="submit" className="validate-btn-main">
                                                    {selectedPhone ? "Edit" : "Add"}
                                                </Button>
                                            </Form.Item>
                                        </div>
                                    </Form>
                                    {phones?.length > 0 ?
                                        <Radio.Group name="phone"
                                                     value={defaultPhoneId}
                                                     onChange={e => this.handleDefaultPhone(e.target.value)}
                                        >
                                            {phones?.map((item) => (
                                                <div key={item.id} className="col-12">
                                                    <div
                                                        className={`row mx-0 pb-0 align-items-center user-info-div-main position-relative opportunity-info-div-main ${
                                                            item.default_phone && "active"
                                                        }`}
                                                    >
                                                        <div className="col-12 contact-col-12">
                                                            <div className="user-icons-div">
                                                                <img
                                                                    src={Images.call_add_icon}
                                                                    alt=""
                                                                    className="img-fluid"
                                                                />
                                                            </div>
                                                            <div className="user-info-div">
                                                                {/* <h6>{item.name?.includes('_') ? item.name?.split('_').join(" ").toLowerCase() : item.name?.toLowerCase()}</h6> */}
                                                                <h6>{item.name === "WORK_MAIN" ? "Work (Main)" 
                                                                 : item.name === "WORK_DIRECT" ? "Work (Direct)"
                                                                 : item.name?.toLowerCase()}</h6>
                                                                <p className="mb-0">
                                                                    {formatPhone(item.phone_number)}
                                                                </p>
                                                            </div>
                                                            <Dropdown
                                                                overlayClassName="add-remove-dropdown-main"
                                                                overlay={this.menu(item, "phone")}
                                                                trigger={["click"]}
                                                            >
                                                                <Button
                                                                    className="ant-dropdown-link ant-dropdown-link-2 border-0 p-0 bg-transparent shadow-none"
                                                                    onClick={(e) => e.preventDefault()}
                                                                >
                                                                    <img
                                                                        src={Images.more_black}
                                                                        alt=""
                                                                        className="img-fluid"
                                                                    />
                                                                </Button>
                                                            </Dropdown>
                                                        </div>
                                                        <div className="col-12 p-0 radio-btn-custom">
                                                            <Radio
                                                                className="active"
                                                                value={item.id}
                                                                checked={item.default_phone}
                                                                // onChange={() => this.handleDefaultPhone(item.id)}
                                                            >
                                                                Default Phone Number
                                                            </Radio>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </Radio.Group>
                                        :
                                        <div className="col-12">
                                            <div
                                                className="row mx-0 no-data-card-row no-data-card-row-2 align-items-center justify-content-center">
                                                <div className="col-12 text-center">
                                                    <img
                                                        alt={""}
                                                        className="img-fluid"
                                                        src={Images.phone_add_gray}
                                                    />
                                                    <h6 className="mb-0">
                                                        Added phone numbers <br/> will show up
                                                        here
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="col-12 validate-div-col text-md-right">
                                <Form.Item>
                                    <Button
                                        htmlType="submit"
                                        className="validate-btn-main"
                                        onClick={this.handleSubmit}
                                    >
                                        Save and Continue
                                    </Button>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(ContactInformation);
