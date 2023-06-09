import React, {useEffect, useRef} from 'react';
import {Button, Collapse, DatePicker, Drawer, Form, Input, Select, TimePicker} from "antd";
import {CaretRightOutlined} from "@ant-design/icons";
import moment from 'moment';
import { updateWorkOrder } from '../../../../../../Controller/api/workOrderServices';
import { handleError } from '../../../../../../Controller/Global';


const layout = {
    labelCol: {span: 24}, wrapperCol: {span: 24},
};
const {Panel} = Collapse;
const {Option} = Select;
const EditServiceInformation = (props) => {
    const formRef = useRef();
    
    console.log(props)
    function callback(key) {
        console.log(key);
    }

    useEffect(() => {
    //   const serviceInfoData = {props.serviceInfoData}
    console.log(props.serviceInfoData,"service data")
    console.log(props?.serviceInfoData?.service_date,"service dat")
      formRef.current.setFieldsValue({
             service_date: moment(props?.serviceInfoData?.workorder?.service_date),
               billing_account_po: props.serviceInfoData.billing_account_po,
               start_time: props.serviceInfoData?.workorder?.start_time && moment(props.serviceInfoData?.workorder?.start_time, "HH:mm:ss"),
               end_time: props.serviceInfoData?.workorder?.end_time && moment(props.serviceInfoData?.workorder?.end_time, "HH:mm:ss")   

      })
    },[])

   function handleSubmit(data){
        console.log(data)
        const params = {
            service_date: data.service_date.format("YYYY-MM-DD"),
            start_time: data.start_time.format("HH:mm:ss.sss"),
            end_time:data.end_time ? data.end_time.format("HH:mm:ss.sss") : null,
            billing_account_po:data.billing_account_po || null ,
        }

        updateWorkOrder(props.serviceInfoData.id,params).then(res => {
            console.log(res.data,"response workorder")

        }).catch((err) => {
            handleError(err)
        })
    }

    function handleClearValue() {
        formRef.current.setFieldsValue({
          service_date: "",
          start_time: "",
          end_time: "",
          billing_account_po: ""
        })
    }

    return (<React.Fragment>
        <Drawer
            centered
            destroyOnClose={true}
            title={'Edit Service Information'}
            visible={props.visible}
            onOk={props.onClose}
            // afterVisibleChange={this.populateVendorData}
            closable={true}
            onClose={props.onClose}
            onCancel={props.onClose}
            // onClose={() => {
            //   (this.state.unSavedExit ? this.setState({ drawerVisible: true }) :
            //     this.handleClose());
            // }
            // }
            // onCancel={() => {
            //   this.state.unSavedExit ? this.setState({ drawerVisible: true }) :
            //     this.handleClose()
            // }
            // }
            className="main-all-form-modal main-drawer-div internal-location drawer-update"
            width={"625px"}
            placement={"right"}
            footer={<div
                style={{
                    textAlign: "right",
                }}
            >
                <Button
                    // onClick={() => {
                    //   this.state.unSavedExit
                    //     ? this.setState({ drawerVisible: true })
                    //     : this.props.onClose();
                    // }}
                    style={{marginRight: 8}}
                >
                    Cancel
                </Button>
                <Button
                    type="primary"
                    // disabled={this.checkDisable()}
                    onClick={() => {
                        handleClearValue()
                        props.onClose()
                    }
                    }
                >
                    Continue
                </Button>
            </div>}
        >
            <div className="row mx-0 inner-modal-main-row">
                <div className="col-12">
                    <div className="row summary-info-inner-row">
                        <div className="col-12">
                            <Collapse className="collapse-update"
                                // onChange={this.populateData}
                                // accordion
                                      defaultActiveKey={["1"]}
                                      onChange={callback}
                                // activeKey={this.state.activeKey}
                                      expandIcon={({isActive}) => (<CaretRightOutlined rotate={isActive ? 90 : 0}/>)}
                            >
                                <Panel
                                    header={<div className="col-12">
                                        <div
                                            className="info-card-heading-row row d-flex align-items-center justify-content-between">
                                            <span>General Information *</span>
                                        </div>
                                    </div>}
                                    key="1"
                                >
                                    <div className="row mx-0 inner-modal-main-row">
                                        <div className="col-12">
                                            <div className="row info-gray-div align-items-center">
                                                <h6 className="mb-0">
                                                    Please choose service date and time.
                                                </h6>
                                            </div>
                                        </div>
                                        <div className="col-12 p-0">
                                            <Form
                                                ref={formRef}
                                                onFinish={handleSubmit}
                                                {...layout}
                                                hideRequiredMark={true}
                                                className="main-inner-form"
                                            >
                                                <div className="row">
                                                    <div className="col-12">
                                                        <h6>Service Date & Time</h6>
                                                    </div>
                                                    <div className="col-12">
                                                        <Form.Item
                                                            name="service_date"
                                                            label={"Service Date *"}
                                                            rules={[{
                                                                required: true, message: 'this field is required'
                                                            }]}
                                                        >
                                                            <DatePicker format={"MM/DD/YYYY"}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                    <div className="col-12">
                                                        <Form.Item
                                                            name="billing_account_po"
                                                            label={"Billing Account PO#/Job#"}
                                                        >

                                                            <Input placeholder={'Type something'}/>
                                                        </Form.Item>
                                                    </div>
                                                    <div className="col-12">
                                                        <Form.Item
                                                            name="start_time"
                                                            label={"Estimated Start Time *"}
                                                            rules={[{
                                                                required: true, message: 'this field is required'
                                                            }]}

                                                        >

                                                            <TimePicker
                                                                placeholder={'Select Estimated Start Time'}/>
                                                        </Form.Item>
                                                    </div>
                                                    <div className="col-12">
                                                        <Form.Item
                                                            name="end_time"
                                                            label={"Estimated End Time"}
                                                            //    rules={[{
                                                            //        required: true,
                                                            //        message: 'this field is required'
                                                            //    }]}
                                                            className="position-relative"
                                                        >
                                                            <TimePicker
                                                                placeholder={'Select Estimated End Time'}/>
                                                        </Form.Item>
                                                    </div>
                                                    <div className="hr-line"/>
                                                    <div className="col-12">
                                                        <div className="row set-to-repeat-row">
                                                            <div className="col-12">
                                                                <h6>Set to Repeat</h6>
                                                            </div>
                                                            <div className="col-12">
                                                                <div className="row position-relative">
                                                                    <div className="col-12 col-sm-6">
                                                                        <Form.Item
                                                                            name="set_to-repeat"
                                                                            label={"Set ot Repeat"}
                                                                            //    rules={[{
                                                                            //        required: true,
                                                                            //        message: 'this field is required'
                                                                            //    }]}
                                                                        >
                                                                            <Select
                                                                                // labelInValue
                                                                                // disabled={proposal?.opportunity}
                                                                                placeholder="Select"
                                                                                // notFoundContent={fetching ? <Spin size="small" /> : null}
                                                                                // filterOption={false}
                                                                                // onSelect={value => this.handleSelectOpp(value)}
                                                                                // onFocus={() => this.fetchOpportunities()}
                                                                                // onSearch={(e) => this.fetchOpportunities({ search: e })}
                                                                            >
                                                                                {/*{opportunities.map((d) => (*/}
                                                                                <Option key={1} value={1}>
                                                                                    Does not repeat
                                                                                </Option>
                                                                                <Option key={2} value={2}>
                                                                                    Repeat
                                                                                </Option>
                                                                                {/*))}*/}
                                                                            </Select>
                                                                        </Form.Item>
                                                                    </div>
                                                                    {/*coming-soon-screen*/}
                                                                    <div
                                                                        className="coming-soon-div coming-soon-div-update">
                                                                        Coming Soon
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 validate-div-col text-md-right">
                                                        <Form.Item>
                                                            <Button
                                                                // loading={this.state.btnLoader}
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
                                </Panel>
                            </Collapse>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>

    </React.Fragment>)
};

export default EditServiceInformation;