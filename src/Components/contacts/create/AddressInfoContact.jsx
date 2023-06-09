import React, { Component } from "react";
import { Button, Form, Input, InputNumber, message, Select } from "antd";
import { countries } from "../../../Controller/country";
import { createContactAddress, getOneContact, updateContactAddress } from "../../../Controller/api/contactsServices"
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { getAccountCounty } from '../../../Controller/api/customerAccountServices';
import { handleError } from '../../../Controller/Global';
import { orderBy, uniqBy } from 'lodash';
import { Image as Images } from "../../Images";

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

class AddressInfoContact extends Component {
    formRef = React.createRef()

    constructor(props) {
        super(props);
        this.state = {
            addressInfo: null,
            county: [],
            updateMainState: null,
        }
    }

    handleSubmit = (values) => {
        let { contact } = this.props;
        let address = {
            ...values,
            contact: contact?.id
        }
        if (this.props.address) {
            updateContactAddress(this.props.address.id, address).then(res => {
                let address = res.data;

                this.props.setAddress(address, 3);
                message.success("Address updated successfully");
            })
                .catch((err) => {
                    if (err.response) {
                        Object.keys(err.response.data).map((e) => {
                            message.error(err.response.data[e]);
                        });
                    }
                });
        } else {
            createContactAddress(address).then(res => {
                let address = res.data;
                this.props.setAddress(address, 3);
                message.success("Address created successfully")
            })
                .catch((err) => {
                    if (err.response) {
                        Object.keys(err.response.data).map((e) => {
                            message.error(err.response.data[e]);
                        });
                    }
                });

        }
    }

    componentDidMount() {
        if (this.props?.match?.params?.id) {
            getOneContact(this.props?.match?.params?.id)
            .then(res=>{
                this.formRef.current.setFieldsValue({
                    ...res.data.contact_address,
                    // ...this.props.address,
                    country: res.data.contact_address?.country || "United States",
                    // zip: address?.zip_code
                })
            })
            .catch(err=>{
                handleError(err)
            })
            
        } else {
            if (this.formRef?.current) {
                this.formRef.current.setFieldsValue({
                    country: "United States",
                });
            }
        }
        getAccountCounty({ ordering: 'county' })
            .then(response => {
                this.setState({ county: response.data })
                this.setState({ updateMainState: response.data })
            })
            .catch((err) => {
                handleError(err)
                this.setState({ load: false })
            })
    }
    handleCountyChange = (e) => {
        this.formRef.current.setFieldsValue({
            state: null,
        })
        const getState = this.state.county.filter(item => item.county === e)
        this.setState({ updateMainState: getState })
        if (getState?.length === 1) {
            this.formRef.current.setFieldsValue({
                state: getState[0].state
            })

        }
    }


    render() {
        let { county, updateMainState } = this.state;

        return (
            <React.Fragment>
                <div className="row mx-0 inner-modal-main-row">
                    <div className="row common-form-card-row">
                        <div className="col-12">
                            <div className="row info-gray-div align-items-center">
                                <h6 className="mb-0">
                                    Please input main address and billing address.
                                </h6>
                            </div>
                        </div>
                        <div className="col-12 p-0">
                            <Form
                                ref={this.formRef}
                                onFinish={this.handleSubmit}
                                {...layout}
                                hideRequiredMark={true}
                                className="main-inner-form"
                            >
                                <div className="row">
                                    <div className="col-12 col-sm-6">
                                        <Form.Item
                                            name="street_address"
                                            label={"Street Address *"}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "this field is required",
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Street Address" />
                                        </Form.Item>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <Form.Item
                                            name="apartment"
                                            label={"Apartment, Suite, etc"}
                                            rules={[
                                                {
                                                    required: false,
                                                    message: "",
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Location Name" />
                                        </Form.Item>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        {/* <Form.Item
                                            name="county"
                                            label={"County"}
                                            rules={[
                                                {
                                                    required: false,
                                                    message: "",
                                                },
                                            ]}
                                        >
                                            <Input placeholder="County" />
                                        </Form.Item> */}
                                        <Form.Item
                                            name="county"
                                            label={"County"}
                                            rules={[
                                                {
                                                    required: false,
                                                    message: "this field is required",
                                                },
                                            ]}
                                        >
                                            <Select
                                                showSearch

                                                suffixIcon={
                                                    <img
                                                        alt=""
                                                        src={Images.caret_down_small_select}
                                                        className="img-fluid"
                                                    />
                                                }
                                                onChange={this.handleCountyChange}

                                                placeholder="Select"
                                            // defaultValue={main?.country ? main?.country : countries.find(i => i.code === "US").name}
                                            >

                                                {uniqBy(county, "county").map((c) => (

                                                    <Select.Option key={c.id} value={c.county}>
                                                        {c.county}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <Form.Item
                                            name="city"
                                            label={"City *"}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "this field is required",
                                                },
                                            ]}
                                        >
                                            <Input placeholder="City" />
                                        </Form.Item>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <Form.Item
                                            name="state"
                                            label={"State/Province *"}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "this field is required",
                                                },
                                            ]}
                                        >
                                            <Select
                                                showSearch
                                                suffixIcon={
                                                    <img
                                                        alt=""
                                                        src={Images.caret_down_small_select}
                                                        className="img-fluid"
                                                    />
                                                }

                                                placeholder="Select"

                                            // defaultValue={main?.country ? main?.country : countries.find(i => i.code === "US").name}
                                            >
                                                {(uniqBy(orderBy(updateMainState, "state"), 'state')).map((c) => (
                                                    <Select.Option key={c.id} value={c.state}>
                                                        {c.state}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <div className="row">
                                            <div className="col-6">
                                                <Form.Item
                                                    name="zip_code"
                                                    label={"Zip/Postal Code *"}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "this field is required",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Zip/Postal Code" />
                                                </Form.Item>
                                            </div>
                                            <div className="col-6">
                                                <Form.Item
                                                    name="country"
                                                    label={"Country *"}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "this field is required",
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        showSearch={true}
                                                        suffixIcon={
                                                            <img
                                                                alt=""
                                                                src={Image.caret_down_small_select}
                                                                className="img-fluid"
                                                            />
                                                        }
                                                        placeholder="Please select Country"
                                                    // defaultValue={editData?.country ? editData?.country : 'United States'}
                                                    >
                                                        {countries.map((c) => (
                                                            <Select.Option value={c.name}>
                                                                {c.name}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 validate-div-col text-md-right">
                                        <Form.Item>
                                            <Button htmlType="submit" className="validate-btn-main">
                                                Save and Continue
                                            </Button>
                                        </Form.Item>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(AddressInfoContact);