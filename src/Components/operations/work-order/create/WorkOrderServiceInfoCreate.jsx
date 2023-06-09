import React, { Component } from 'react';
import { Button, DatePicker, Form, Input, message, Select, TimePicker } from "antd";
import { createWorkOrder, updateWorkOrder } from '../../../../Controller/api/workOrderServices';
import { handleError } from '../../../../Controller/Global';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

const { Option } = Select;
const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};
// const moment = require('moment');
class WorkOrderServiceInfoCreate extends Component {
    state = {
        btnLoader: false
    }
    // state = {
    //   opportunities: [],
    //   fetching: false,
    //   statusTypes: [],
    //   visibleRetrieveWarning: false,
    //   retrieve_opp: false,
    //   opportunityVal: null
    // };
    formRef = React.createRef();

    handleSubmit = (val) => {
        console.log(val,"call")
        // console.log(time,timeString,"string")
        // console.log(val.billing_account_po,"service values")
        const params = {
            service_date: val.service_date.format("YYYY-MM-DD"),
            start_time: val.start_time.format("HH:mm:ss.sss"),
            end_time:val.end_time ? val.end_time.format("HH:mm:ss.sss") : null,
            billing_account_po:val.billing_account_po || null ,
        }
        this.setState({ btnLoader: true });
        if (this.props.workOrder) {
            updateWorkOrder(this.props.workOrder.id, params).then(res => {
                // console.log(res,"response service value")
                this.props.setWorkOrder(res.data, 3);
                message.success('Service information updated successfully!')
            }).catch(err => {
                handleError(err)
            }).finally(() => {
                this.setState({ btnLoader: false })
            })
        } else {
            createWorkOrder(params).then(res => {
                this.props.setWorkOrder(res.data, 3);
                message.success('Service information created successfully!')
            }).catch(err => {
                handleError(err)
            }).finally(() => {
                this.setState({ btnLoader: false })
            })
        }
    }



    componentDidMount() {
        const workOrder = this.props.workOrder || this.props.location.workOrder 
        if (workOrder) {
            this.formRef.current.setFieldsValue({
                ...workOrder,
                service_date: workOrder?.service_date ? moment(workOrder?.service_date) : null,
                start_time: workOrder?.start_time ? moment(workOrder?.start_time, "HH:mm:ss") : null,
                end_time: workOrder?.end_time ? moment(workOrder?.end_time, "HH:mm:ss") : null,
                billing_account_po : workOrder?.billing_account_po || null ,
            })
        }
    }


    // componentDidUpdate(prevProps, prevState) {
    //     console.log("###########")
    //     if (prevProps.workOrder !== this.props.workOrder) {
    //         const { workOrder } = this.props;
    //         console.log(workOrder, "work")

    //         this.formRef.current.setFieldsValue({
    //             ...workOrder,
    //             service_date: workOrder?.service_date ? moment(workOrder?.service_date) : null,
    //             // start_time: workOrder?.start_time ? moment(workOrder?.start_time).format("hh:mm:ss") : null,
    //             // end_time: workOrder?.end_time ? moment(workOrder?.end_time).format("hh:mm:ss") : null
    //             // project: {label: workOrder?.project.name, value: workOrder?.project.id},
    //             // status: {label: workOrder?.status.title, value: workOrder?.status.id}
    //         })
    //     }
    // }

    // componentDidMount() {
    //   this.getProposalStatusOptions();
    // }

    // fetchOpportunities = (params = {}) => {
    //   this.setState({ fetching: true });
    //   getOpportunities(params)
    //     .then((res) => {
    //       this.setState({ opportunities: res.data.results, fetching: false });
    //     })
    //     .catch((err) => {
    //       if (err.response) {
    //         Object.keys(err.response.data).map((e) => {
    //           message.error(err.response.data[e]);
    //         });
    //       }
    //       this.setState({ fetching: false });
    //     });
    // };

    // getProposalStatusOptions = () => {
    //   getProposalStatusOptions()
    //     .then((res) => {
    //       this.setState({ statusTypes: res.data.results });
    //     })
    //     .catch((err) => {
    //       handleError(err);
    //     });
    // };

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //   if (prevProps.proposal !== this.props.proposal) {
    // this.fetchOpportunities()
    // if(window.location.href.includes('create') && this.state.retrieve_opp) {
    //   const values = {
    //     project_start_date: this.props.proposal?.opportunity?.project_start_date ? moment(this.props.proposal?.opportunity?.project_start_date): null,
    //     project_end_date: this.props.proposal?.opportunity?.project_end_date ? moment(this.props.proposal.opportunity?.project_end_date): null,
    //     description: this.props.proposal?.opportunity?.description,
    //     name: this.props.proposal.opportunity?.name,
    //     due_date: this.props.proposal.due_date ? moment(this.props.proposal.due_date) : null,
    //     response_date: this.props.proposal.response_date ? moment(this.props.proposal.response_date) : null,
    //     status: {
    //       label: this.props.proposal.status?.title,
    //       value: this.props.proposal.status?.id,
    //     },
    //     opportunity: {
    //       key: this.props.proposal.opportunity?.id,
    //       value: this.props.proposal.opportunity?.name,
    //     },
    //     creation_date: this.props.proposal.creation_date
    //       ? moment(this.props.proposal.creation_date)
    //       : moment(),
    //   }
    //   this.formRef.current.setFieldsValue({
    //     ...values
    //   })
    //   this.handleSubmit(values, true)
    // }
    // else {
    // this.formRef.current.setFieldsValue({
    //   ...this.props.proposal,
    //   status: {
    //     label: this.props.proposal.status?.title,
    //     value: this.props.proposal.status?.id,
    //   },
    //   opportunity: {
    //     key: this.props.proposal.opportunity?.id,
    //     value: this.props.proposal.opportunity?.name,
    //   },
    //   creation_date: this.props.proposal.creation_date
    //     ? moment(this.props.proposal.creation_date)
    //     : moment(),
    //   due_date: this.props.proposal.due_date
    //     ? moment(this.props.proposal.due_date)
    //     : null,
    //   response_date: this.props.proposal.response_date
    //     ? moment(this.props.proposal.response_date)
    //     : null,
    //   project_start_date:
    //     this.props.proposal.project_start_date ? moment(this.props.proposal.project_start_date) : null,
    //   project_end_date: this.props.proposal.project_end_date ? moment(this.props.proposal.project_end_date) : null,
    // });
    // }
    // }
    // }

    // handleSubmit = (values, FIRST_UPDATE) => {
    //   const {retrieve_opp} = this.state;
    //   this.setState({ buttonLoading: true })
    //     if(retrieve_opp && !this.props.proposal) {
    //     values.retrieve_opportunity = retrieve_opp
    //     }
    //     values.opportunity = values.opportunity?.key;
    //     values.status = values.status.value;
    //     values.creation_date = values.creation_date
    //       ? values.creation_date?.format("YYYY-MM-DD")
    //       : moment().format("YYYY-MM-DD");
    //     values.project_end_date = values.project_end_date?.format("YYYY-MM-DD");
    //     values.project_start_date = values.project_start_date?.format("YYYY-MM-DD");
    //     values.response_date = values.response_date?.format("YYYY-MM-DD");
    //     values.due_date = values.due_date?.format("YYYY-MM-DD");
    //   if (this.props.proposal) {
    //     updateProposal(this.props.proposal.id, values)
    //       .then((res) => {
    //         this.props.setProposal(res.data, 2);
    //         this.setState({ buttonLoading: false });
    //         if(!FIRST_UPDATE) {
    //         message.success("Proposal Updated Successfully");
    //         }
    //       })
    //       .catch((err) => {
    //         handleError(err);
    //         this.setState({ buttonLoading: false });
    //       });
    //   } else {
    //     createProposal(values)
    //       .then((res) => {
    //         this.props.setProposal(res.data, 2);
    //         this.setState({ buttonLoading: false, retrieve_opp: false });
    //         message.success("Proposal Created Successfully");
    //       })
    //       .catch((err) => {
    //         handleError(err);
    //         this.setState({ buttonLoading: false });
    //       });
    //   }
    // };

    // handleRetrieveOpp = () => {
    //     const {opportunity} = this.props;
    //     this.setState({retrieve_opp: true, visibleRetrieveWarning: false }, () => {
    //       const values = {
    //         project_start_date: opportunity?.project_start_date ? moment(opportunity?.project_start_date): null,
    //         project_end_date: opportunity?.project_end_date ? moment(opportunity?.project_end_date): null,
    //         description: opportunity?.description,
    //         name: opportunity?.name,
    //       }
    //       this.formRef.current.setFieldsValue({
    //         ...values
    //       })
    //     })
    // }

    // handleWarningModal = visibleRetrieveWarning => {
    //   this.setState({visibleRetrieveWarning})
    // }

    // handleSelectOpp = opportunityVal => {
    //   // console.log(opportunityVal)
    //   this.setState({opportunityVal}, () => {
    //     this.props.opportunityDetailAction(opportunityVal?.value)
    //   })
    // }

    render() {
        // const { fetching, opportunities, buttonLoading, statusTypes,opportunityVal } = this.state;
        // const {proposal} = this.props
        return (
            <React.Fragment>
                <div className="row common-form-card-row">
                    <div className="col-12">
                        <div className="row info-gray-div align-items-center">
                            <h6 className="mb-0">Please choose service date and time.</h6>
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
                                        name="service_date"
                                        label={"Service Date *"}
                                       rules={[{
                                           required: true,
                                           message: 'this field is required'
                                       }]}
                                    >
                                        <DatePicker format={"MM/DD/YYYY"}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="col-12 col-sm-6">
                                    <Form.Item
                                        name="billing_account_po"
                                        label={"Billing Account PO#/Job#"}
                                    >

                                        <Input placeholder={'Type something'} />
                                    </Form.Item>
                                </div>
                                <div className="col-12 col-sm-6">
                                    <Form.Item
                                        name="start_time"
                                        label={"Estimated Start Time *"}
                                       rules={[{
                                           required: true,
                                           message: 'this field is required'
                                       }]}

                                    >

                                        <TimePicker placeholder={'Select Estimated Start Time'} />
                                    </Form.Item>
                                </div>
                               
                                <div className="col-12 col-sm-6">
                                    <Form.Item
                                        name="end_time"
                                        label={"Estimated End Time"}
                                        //    rules={[{
                                        //        required: true,
                                        //        message: 'this field is required'
                                        //    }]}
                                        className="position-relative"
                                    >
                                        <TimePicker placeholder={'Select Estimated End Time'} />
                                    </Form.Item>
                                </div>
                                <div className="hr-line" />
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
                                                <div className="coming-soon-div coming-soon-div-update">
                                                    Coming Soon
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 validate-div-col text-md-right">
                                    <Form.Item>
                                        <Button
                                            loading={this.state.btnLoader}
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
                {/*<CommonWarningModal
          heading={"Are you sure you want to retrieve information from this opportunity?"}
          subHeadingUOM={
            "If you click Continue, information would be retrieved from the selected opportunity. Once you click Save & Continue on this widget, you cannot change the associated opportunity anymore."
          }
          uomWarning
          retrieveWarning
          okAction={this.handleRetrieveOpp}
          visible={this.state.visibleRetrieveWarning}
          onClose={() => this.handleWarningModal(false)}
        />*/}
            </React.Fragment>
        );
    }
}

// const mapStateToProps = state => {
//   return {...state};
// }
export default withRouter(WorkOrderServiceInfoCreate);
// export default connect(mapStateToProps, {opportunityDetailAction}) (withRouter(GeneralInformation));
