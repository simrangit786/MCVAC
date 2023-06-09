import React, { Component } from 'react';
import { Button, Checkbox, Form, Input, InputNumber, message, Select } from "antd";
import { Image as Images } from "../../../Images";
import { createBillingAdd, createMainAdd, updateBillingAdd, updateMainAdd } from '../../../../Controller/api/vendorAccountServices';
import { handleError } from '../../../../Controller/Global';
import { countries } from '../../../../Controller/country';
import { orderBy, uniqBy } from "lodash";
import { getAccountCounty } from '../../../../Controller/api/customerAccountServices';


const layout = {
    labelCol: { span: 24 }, wrapperCol: { span: 24 },
};

class AddressInfoVendorCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            county: [],
            updateMainState: null,
            updateBillingState: null,
        }
        this.mainRef = React.createRef();
    }


    handleSubmit = (values) => {
        let main = {
            street_address: values.street_address,
            apartment: values.apartment,
            county: values.county,
            city: values.city,
            state: values.state,
            zip_code: values.zip_code,
            country: values.country || 'US',
            phone: values.phone_number,
            email: values.email,
            account: this.props.vendor.id,
        };
        let billing = {
            street_address: values.street_address_1,
            apartment: values.apartment_1,
            county: values.county_1,
            city: values.city_1,
            state: values.state_1,
            zip_code: values.zip_code_1,
            country: values.country_1 || 'US',
            is_same_main_address: this.state.checked,
            account: this.props.vendor?.id,
        };
        if (this.props.vendor?.main_address && this.props.vendor?.billing_address) {
            updateMainAdd(main, this.props.vendor?.main_address.id)
                .then((resp) => {
                    updateBillingAdd(billing, this.props.vendor?.billing_address.id).then((res) => {
                        this.setState({
                            main: resp.data,
                            billing: res.data,
                        }, () => {
                            this.setState({ unSavedExit: false })
                        })
                        message.success("Address updated Successfully");
                        // this.props.fetchVendorData()
                        this.props.setAddressInVendor(resp.data, res.data)

                    });
                })
                .catch((err) => {
                    handleError(err)
                });
        } else {
            createMainAdd(main)
                .then((resp) => {
                    createBillingAdd(billing).then((res) => {
                        this.setState({
                            main: resp.data,
                            billing: res.data,
                        }, () => {
                            this.setState({ requiredSuccessModalVisible: true }, () => {
                                this.setState({ unSavedExit: false })
                            })
                        });
                        message.success("Address created Successfully");
                        // this.props.fetchVendorData()
                        this.props.setAddressInVendor(resp.data, res.data)
                    });
                })
                .catch((err) => {
                    handleError(err)
                });
        }
    };


    handleCheckbox = (e) => {
        this.setState({ checked: e.target.checked }, () => {
            if (this.state.checked) {
                let { setFieldsValue, getFieldValue } = this.mainRef.current;
                setFieldsValue({
                    street_address_1: getFieldValue("street_address"),
                    apartment_1: getFieldValue("apartment"),
                    country_1: getFieldValue("country"),
                    city_1: getFieldValue("city"),
                    state_1: getFieldValue("state"),
                    zip_code_1: getFieldValue("zip_code"),
                    county_1: getFieldValue("county"),
                });
            }
        });
    };

    componentDidMount(prevProps) {
        this.mainRef.current.setFieldsValue({
            ...this.props.vendor.main_address,
            phone_number: this.props.vendor?.main_address?.phone,
            apartment_1: this.props.vendor.billing_address?.apartment,
            street_address_1: this.props.vendor.billing_address?.street_address,
            country_1: this.props.vendor.billing_address?.country,
            city_1: this.props.vendor.billing_address?.city,
            state_1: this.props.vendor.billing_address?.state,
            zip_code_1: this.props.vendor.billing_address?.zip_code,
            county_1: this.props.vendor.billing_address?.county
        })


        getAccountCounty({ ordering: 'county' })
            .then(response => {
                this.setState({ county: response.data })
                this.setState({ updateMainState: response.data })
                this.setState({ updateBillingState: response.data })
            })
            .catch((err) => {
                handleError(err)
                this.setState({ load: false })
            })

    }

    phoneNumberValidate = (rule, value, callback) => {
        if (!value) callback()
        if (value.toString().length < 10) callback("minimum digits should be 10");
        else callback();
    };
    handleCountyChange = (e) => {
        this.mainRef.current.setFieldsValue({
            state: null,
        })
        const getState = this.state.county.filter(item => item.county === e)
        this.setState({ updateMainState: getState })
        if (getState?.length === 1) {
            this.mainRef.current.setFieldsValue({
                state: getState[0].state
            })
        }
    }

    handleBillingCountyChange = (e) => {
        this.mainRef.current.setFieldsValue({
            state_1: null,
        })
        const getState = this.state.county.filter(item => item.county === e)
        this.setState({ updateBillingState: getState })
        if (getState?.length === 1) {
            this.mainRef.current.setFieldsValue({
                state_1: getState[0].state
            })
        }
    }

    render() {
        let { county, updateMainState, updateBillingState, } = this.state;
        const main = this.props.vendor?.main_address;
        const billing = this.props.vendor?.billing_address;
        return (<React.Fragment>
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
                        ref={this.mainRef}
                        onFinish={this.handleSubmit}
                        hideRequiredMark={true}
                        {...layout}
                        className="main-inner-form"
                    >
                        <div className="row">
                            <div className="col-12 col-sm-6 border-rit-div">
                                <div className="row">
                                    <div className="col-12">
                                        <h4>Main Address</h4>
                                    </div>
                                    <div className="col-12">
                                        <Form.Item
                                            name="street_address"
                                            label={"Street Address *"}
                                            rules={[{
                                                required: true, message: "this field is required",
                                            },]}
                                        >
                                            <Input placeholder="Street Address" />
                                        </Form.Item>
                                    </div>
                                    <div className="col-12">
                                        <Form.Item
                                            name="apartment"
                                            label={"Apartment, Suite, etc"}
                                        >
                                            <Input placeholder="Apartment, Suite, etc" />
                                        </Form.Item>
                                    </div>
                                    <div className="col-12">
                                        {/* <Form.Item
                                            name="county"
                                            label={"County"}
                                            rules={[{
                                                required: false, message: "this field is required",
                                            },]}
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
                                    <div className="col-12">
                                        <Form.Item
                                            name="city"
                                            label={"City *"}
                                            rules={[{
                                                required: true, message: "this field is required",
                                            },]}
                                        >
                                            <Input placeholder="City" />
                                        </Form.Item>
                                    </div>
                                    <div className="col-12">
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
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-12 col-sm-6">
                                                <Form.Item
                                                    name="zip_code"
                                                    label={"ZIP/Postal Code *"}
                                                    rules={[{
                                                        required: true, message: "this field is required",
                                                    },]}
                                                >
                                                    <Input placeholder="Zip/Postal Code" />
                                                </Form.Item>
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <Form.Item
                                                    initialValue={'United States'}
                                                    name="country"
                                                    label={"Country *"}
                                                    rules={[{
                                                        required: true, message: "this field is required",
                                                    },]}
                                                >
                                                    <Select
                                                        showSearch={true}
                                                        // filterOption={(input, option) => {
                                                        //     console.log(input, option)
                                                        //     return option.props.children.toLowerCase().includes(input)
                                                        // }
                                                        // }
                                                        suffixIcon={<img
                                                            alt=""
                                                            src={Images.caret_down_small_select}
                                                            className="img-fluid"
                                                        />}
                                                        placeholder="Select Country"
                                                        defaultValue={main?.country ? main?.country : countries.find(i => i.code === "US").name}
                                                    >
                                                        {countries.map((c) => (
                                                            <Select.Option key={c.code} value={c.name}>
                                                                {c.name}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <Form.Item
                                            name="phone_number"
                                            label={"Phone Number"}
                                            rules={[{
                                                required: false, message: "",
                                            },
                                            // { validator: this.phoneNumberValidate },
                                            () => ({
                                                validator(_, value) {
                                                    if (!value) return Promise.resolve();
                                                    if (value.toString().length >= 10) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('minimum digits should be 10'));
                                                },
                                            }),
                                            ]}
                                        >
                                            <InputNumber
                                                formatter={(value) => `${value}`
                                                    .match(/\d*/g)
                                                    .join("")
                                                    .match(/(\d{0,3})(\d{0,3})(\d{0,14})/)
                                                    .slice(1)
                                                    .join("-")
                                                    .replace(/-*$/g, "")}
                                                parser={(value) => value.replace(/\$\s?|(-*)/g, "")}
                                                placeholder="123-456-7890"
                                                maxLength="22"
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="col-12">
                                        <Form.Item
                                            name="email"
                                            label={"Email Address"}
                                            rules={[{
                                                required: false, message: "",
                                            },]}
                                        >
                                            <Input placeholder="Email Address" />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="row">
                                    <div className="col-12 position-relative">
                                        <h4>Billing Address</h4>
                                        <div className="same-address-label position-absolute">
                                            <Form.Item name="is_same_main_address">
                                                <Checkbox
                                                    checked={this.state.checked}
                                                    onChange={(e) => this.handleCheckbox(e)}
                                                >
                                                    Same as Main Address
                                                </Checkbox>
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <Form.Item
                                            name="street_address_1"
                                            label={"Street Address"}
                                            rules={[{
                                                required: false, message: "this field is required",
                                            },]}
                                        >
                                            <Input placeholder="Street Address" />
                                        </Form.Item>
                                    </div>
                                    <div className="col-12">
                                        <Form.Item
                                            name="apartment_1"
                                            label={"Apartment, Suite, etc"}
                                        >
                                            <Input placeholder="Apartment, Suite, etc" />
                                        </Form.Item>
                                    </div>
                                    <div className="col-12">
                                        <Form.Item
                                            name="county_1"
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
                                                onChange={this.handleBillingCountyChange}
                                                placeholder="Select"
                                            // defaultValue={main?.country ? main?.country : countries.find(i => i.code === "US").name}
                                            >

                                                {uniqBy(county, "county").map((c) => (
                                                    <Select.Option key={c.county} value={c.county}>
                                                        {c.county}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </div>

                                    <div className="col-12">
                                        <Form.Item
                                            name="city_1"
                                            label={"City"}
                                            rules={[{
                                                required: false, message: "this field is required",
                                            },]}
                                        >
                                            <Input placeholder="City" />
                                        </Form.Item>
                                    </div>

                                    <div className="col-12">

                                        <Form.Item
                                            name="state_1"
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

                                                {(uniqBy(orderBy(updateBillingState, "state"), 'state')).map((c) => (

                                                    <Select.Option key={c.state} value={c.state}>
                                                        {c.state}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </div>
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-12 col-sm-6">
                                                <Form.Item
                                                    name="zip_code_1"
                                                    label={"ZIP/Postal Code"}
                                                    rules={[{
                                                        required: false, message: "this field is required",
                                                    },]}
                                                >
                                                    <Input placeholder="Zip/Postal Code" />
                                                </Form.Item>
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <Form.Item
                                                    name="country_1"
                                                    label={"Country"}
                                                    rules={[{
                                                        required: false, message: "this field is required",
                                                    },]}
                                                >
                                                    <Select
                                                        showSearch={true}
                                                        //  filterOption={(input, option) => {
                                                        //     console.log(input, option)
                                                        //     return option.props.children.toLowerCase().includes(input)
                                                        // }
                                                        // }
                                                        suffixIcon={<img
                                                            alt=""
                                                            src={Images.caret_down_small_select}
                                                            className="img-fluid"
                                                        />}
                                                        placeholder="Select Country"
                                                        defaultValue={billing?.country ? billing?.country : 'United States'}>
                                                        {countries.map((c) => (
                                                            <Select.Option key={c.code} value={c.name}>
                                                                {c.name}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                        </div>
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
        </React.Fragment>);
    }
}

export default AddressInfoVendorCreate;