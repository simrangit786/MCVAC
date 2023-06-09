import React, {Component} from 'react';
import {Button, Form, Input, InputNumber, Select} from "antd";
import {Image as Images} from "../../Images";

const layout = {
    labelCol: {span: 24}, wrapperCol: {span: 24},
};
const {Option} = Select;


class PriceLookUpServiceVariantFilter extends Component {
    render() {
        return (<React.Fragment>
            <div className="filter-main-card row mx-0">
                <Form
                    ref={this.formRef}
                    onFinish={this.handleSubmit}
                    {...layout}
                    hideRequiredMark={true}
                    className="main-inner-form"
                >
                    <div className="row mx-0 type-working-checkbox">
                        <div className="col-12 col-sm-6 border-right-1">
                            <div className="row">
                                <div className="col-12">
                                    <Form.Item
                                        name="service_family_name"
                                        label={"Service Family Name"}
                                        rules={[{
                                            required: false, message: "",
                                        },]}
                                        className="position-relative"
                                    >
                                        <Select
                                            suffixIcon={<img
                                                alt=""
                                                src={Images.caret_down_small_select}
                                                className="img-fluid"
                                            />}
                                            placeholder={"Select"}
                                            showSearch
                                            filterOption={false}
                                            // onSearch={value => this.getSubUnitName({search: value})}
                                        >
                                            <Option key={1} value={1}>
                                                Select
                                            </Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className="col-12">
                                    <Form.Item
                                        name="tier_name"
                                        label={"Tier Name"}
                                        rules={[{
                                            required: false, message: "",
                                        },]}
                                        className="position-relative"
                                    >
                                        <Input placeholder={'Tier Name'}/>
                                    </Form.Item>
                                </div>
                                <div className="col-12">
                                    <Form.Item
                                        name="Service_Name"
                                        label={"Service Name"}
                                        rules={[{
                                            required: false, message: "",
                                        },]}
                                        className="position-relative"
                                    >
                                        <Select
                                            suffixIcon={<img
                                                alt=""
                                                src={Images.caret_down_small_select}
                                                className="img-fluid"
                                            />}
                                            placeholder={"Select"}
                                            showSearch
                                            filterOption={false}
                                            // onSearch={value => this.getSubUnitName({search: value})}
                                        >
                                            <Option key={1} value={1}>
                                                Select
                                            </Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className="col-12">
                                    <Form.Item
                                        name="Region"
                                        label={"Region"}
                                        rules={[{
                                            required: false, message: "",
                                        },]}
                                        className="position-relative"
                                    >
                                        <Select
                                            suffixIcon={<img
                                                alt=""
                                                src={Images.caret_down_small_select}
                                                className="img-fluid"
                                            />}
                                            placeholder={"Select"}
                                            showSearch
                                            filterOption={false}
                                            // onSearch={value => this.getSubUnitName({search: value})}
                                        >
                                            <Option key={1} value={1}>
                                                Select
                                            </Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className="col-12">
                                    <Form.Item
                                        name="Service_Variant_Name"
                                        label={"Service Variant Name"}
                                        rules={[{
                                            required: false, message: "",
                                        },]}
                                        className="position-relative"
                                    >
                                        <Select
                                            suffixIcon={<img
                                                alt=""
                                                src={Images.caret_down_small_select}
                                                className="img-fluid"
                                            />}
                                            placeholder={"Select"}
                                            showSearch
                                            filterOption={false}
                                            // onSearch={value => this.getSubUnitName({search: value})}
                                        >
                                            <Option key={1} value={1}>
                                                Select
                                            </Option>
                                        </Select>
                                    </Form.Item>
                                    <small className="serviceVNote">e.g. Service Type, etc</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6">
                            <div className="row">
                                <div className="col-12">
                                    <Form.Item
                                        name="Daily_Price"
                                        label={"Daily Price"}
                                        rules={[{
                                            required: false, message: "",
                                        },]}
                                        className="position-relative"
                                    >
                                        <div className="row">
                                            <div className="col-12 col-sm-6">
                                                <InputNumber
                                                    min={0}
                                                    formatter={(value) => `${value}%`}
                                                    parser={(value) => value.replace("%", "")}
                                                    placeholder={"%"}
                                                />
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <InputNumber
                                                    min={0}
                                                    formatter={(value) => `${value}%`}
                                                    parser={(value) => value.replace("%", "")}
                                                    placeholder={"%"}
                                                />
                                            </div>
                                        </div>
                                    </Form.Item>
                                </div>
                                <div className="col-12">
                                    <Form.Item
                                        name="Hourly_Price"
                                        label={"Hourly Price"}
                                        rules={[{
                                            required: false, message: "",
                                        },]}
                                        className="position-relative"
                                    >
                                        <div className="row">
                                            <div className="col-12 col-sm-6">
                                                <InputNumber
                                                    min={0}
                                                    formatter={(value) => `${value}%`}
                                                    parser={(value) => value.replace("%", "")}
                                                    placeholder={"%"}
                                                />
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <InputNumber
                                                    min={0}
                                                    formatter={(value) => `${value}%`}
                                                    parser={(value) => value.replace("%", "")}
                                                    placeholder={"%"}
                                                />
                                            </div>
                                        </div>
                                    </Form.Item>
                                </div>
                                <div className="col-12">
                                    <Form.Item
                                        name="Unit_Price"
                                        label={"Unit Price"}
                                        rules={[{
                                            required: false, message: "",
                                        },]}
                                        className="position-relative"
                                    >
                                        <div className="row">
                                            <div className="col-12 col-sm-6">
                                                <InputNumber
                                                    min={0}
                                                    formatter={(value) => `${value}%`}
                                                    parser={(value) => value.replace("%", "")}
                                                    placeholder={"%"}
                                                />
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <InputNumber
                                                    min={0}
                                                    formatter={(value) => `${value}%`}
                                                    parser={(value) => value.replace("%", "")}
                                                    placeholder={"%"}
                                                />
                                            </div>
                                        </div>
                                    </Form.Item>
                                </div>
                                <div className="col-12">
                                    <Form.Item
                                        name="Unit"
                                        label={"Unit"}
                                        rules={[{
                                            required: false, message: "",
                                        },]}
                                        className="position-relative"
                                    >
                                        <Select
                                            suffixIcon={<img
                                                alt=""
                                                src={Images.caret_down_small_select}
                                                className="img-fluid"
                                            />}
                                            placeholder={"Select"}
                                            showSearch
                                            filterOption={false}
                                            // onSearch={value => this.getSubUnitName({search: value})}
                                        >
                                            <Option key={1} value={1}>
                                                Select
                                            </Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 p-0">
                            <div className="footer-row-main-fix justify-content-between border-0 mt-0 mx-0 row">
                                <Button className="shadow-none" onClick={this.resetFields}>
                                    Clear
                                </Button>
                                <Button type={"primary"} htmlType="submit">
                                    Apply Filter
                                </Button>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        </React.Fragment>);
    }
}

export default PriceLookUpServiceVariantFilter;