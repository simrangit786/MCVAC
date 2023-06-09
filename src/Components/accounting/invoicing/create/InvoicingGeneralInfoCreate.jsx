import React, { Component } from 'react';
import { Button, DatePicker, Form, Input, message, Select, Spin } from "antd";
import { Image as Images } from '../../../Images'
import { handleError } from '../../../../Controller/Global';
import { getProjects, getProjectStatusOptions } from '../../../../Controller/api/projectServices';
import { createWorkOrder, getWorkOrderStatusOptions, updateWorkOrder } from '../../../../Controller/api/workOrderServices';
import CommonWarningModal from '../../../modals/CommonWarningModal';
import { connect } from 'react-redux';
import { ProjectDetailAction } from "../../../../Store/actions/projectAction";
import { withRouter } from 'react-router-dom';
import WoCustomSelectOptions from '../../../operations/work-order/create/WoCustomSelectOptions';
import { createInvoice, getInvoiceStatus, updateInvoice } from '../../../../Controller/api/invoiceServices';
import moment from 'moment/moment';


const { Option } = Select;
const layout = {
    labelCol: { span: 24 }, wrapperCol: { span: 24 },
};
const { TextArea } = Input;

class InvoicingGeneralInfoCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            fetching: false,
            statusTypes: [],
            projectVal: null,
            invoiceStatus: [],
            visibleRetrieveWarning: false,
            retrieve_proj: false,
            createScreen: false
        }
        this.formRef = React.createRef();
    }

    componentDidMount() {
        let createScreen = this.props.location.pathname?.includes('create')
        this.setState({createScreen})
        // if (this.props.location.pathname?.includes('create')) {
        //     this.formRef.current.setFieldsValue({
        //         status: {
        //             value: "SERVICE_REQUEST"
        //         }
        //     })
        // }
    }

    fetchProjects = (params = {}) => {
        this.setState({ fetching: true });
        getProjects(params)
            .then((res) => {
                this.setState({
                    projects: res.data.results,
                    fetching: false,
                });
            })
            .catch((err) => {
                handleError(err);
                this.setState({ fetching: false });
            });
    };

    // getWorkOrderStatusOptions = (SET_DEFAULT, params) => {
    //     this.setState({ fetching: true })
    //     getWorkOrderStatusOptions(params)
    //         .then((res) => {
    //             this.setState({ statusTypes: res.data.results.reverse() });
    //             if (SET_DEFAULT) {
    //                 if (this.props.location.pathname?.includes('create')) {
    //                     this.formRef.current.setFieldsValue({
    //                         status: {
    //                             // label: status.title,
    //                             value: "SERVICE_REQUEST"
    //                        }
    //                     })
    //                 }
    //             }
    //         })
    //         .catch((err) => {
    //             handleError(err);
    //         }).finally(() => {
    //             this.setState({ fetching: false })
    //         });
    // };

    handleSubmit = values => {
        const { retrieve_proj } = this.state;
        const params = {
            ...values,
            status: values.status.value,
            project: values.project.value,
            due_date: values.service_date.format("YYYY-MM-DD"),
            retrieve_project: retrieve_proj && !this.props.workOrder ? retrieve_proj : false
        }

        this.setState({ btnLoader: true });
        if (this.props.Invoice) {
            updateInvoice(this.props.Invoice.id, params).then(res => {
                this.props.setInvoice(res.data, 2);
                message.success('Invoice updated successfully!')
            }).catch(err => {
                handleError(err)
            }).finally(() => {
                this.setState({ btnLoader: false })
            })
        }
        else {
            createInvoice(params).then(res => {
                this.props.setInvoice(res.data, 2);
                message.success('Invoice created successfully!')
            }).catch(err => {
                handleError(err)
            }).finally(() => {
                this.setState({ btnLoader: false })
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.Invoice != this.props.Invoice) {
            const { Invoice } = this.props;
            this.formRef.current.setFieldsValue({
                ...Invoice,
                project: { label: Invoice?.project?.name, value: Invoice?.project?.id },
                status: { label: Invoice?.status?.title, value: Invoice?.status?.id },
                service_date: Invoice.due_date ? moment(Invoice.due_date) : null,
            })
        }
    }


    handleSelectProject = projectVal => {
        this.setState({ projectVal }, () => {
            this.props.ProjectDetailAction(projectVal?.value)
        })
    }

    handleWarningModal = visibleRetrieveWarning => {
        this.setState({ visibleRetrieveWarning })
    }

    getInvoiceStatus = () => {
        getInvoiceStatus().then(res => {
            this.setState({invoiceStatus: res.data.results})
        }).catch((err) => {
            handleError(err);
        })
    }

    handleRetrieveproject = () => {
        const { project_data } = this.props;
        this.setState({ retrieve_proj: true, visibleRetrieveWarning: false }, () => {
            const values = {
                // project_start_date: proposal_data?.project_start_date ? moment(proposal_data?.project_start_date) : null,
                // project_end_date: proposal_data?.project_end_date ? moment(proposal_data?.project_end_date) : null,
                instruction: project_data?.instruction,
                // name: proposal_data?.name,
                // opportunity: proposal_data?.opportunity?.name
            }
            this.formRef.current.setFieldsValue({
                ...values,
            })
        })
    }


    render() {
        const { projects, fetching, statusTypes, btnLoader, projectVal,invoiceStatus } = this.state;
        const { Invoice } = this.props
        
        return (<React.Fragment>

            <div className="row common-form-card-row">
                <div className="col-12">
                    <div className="row info-gray-div align-items-center">
                        <h6 className="mb-0">Please choose a project.</h6>
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
                                    name="project"
                                    label={"Associated Project *"}
                                    rules={[{
                                        required: true,
                                        message: 'this field is required'
                                    }]}
                                    className="position-relative"
                                >
                                    <Select
                                        labelInValue
                                        disabled={Invoice?.project}
                                        showSearch
                                        dropdownClassName="custom-select-drop-main"
                                        placeholder="Associated Project"
                                        notFoundContent={fetching ? <Spin size="small" /> : null}
                                        filterOption={false}
                                        onSelect={(value) => this.handleSelectProject(value)}
                                        onFocus={() => this.fetchProjects()}
                                        onSearch={(e) => this.fetchProjects({ search: e })}
                                        optionLabelProp={"label"}
                                    >
                                        {projects.map((d) => (
                                            <Option key={d.id} label={d.name} value={d.id}>
                                                {/*{d.name}*/}
                                                <WoCustomSelectOptions
                                                    data={d}
                                                    img={Images.folder_icon_black}
                                                    type={'Project'}
                                                />
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                {/* <Button className="search-icon bg-transparent border-0 p-0 position-absolute">
                                    <img src={Images.search_small_icon} alt='' className="img-fluid" />
                                </Button> */}
                                {window.location.href.includes('create') && projectVal &&
                    <span className={`retrieve-oppo ${Invoice && 'cursor'}`} onClick={() => {
                      if (!Invoice) {
                        this.handleWarningModal(true)
                      }
                    }}
                    >Retrieve information</span>
                  }
                            </div>
                           <div className="col-12 col-sm-6">
                                <Form.Item
                                    name="status" label={"Status *"}
                                    rules={[{
                                        required: true, message: 'this field is required'
                                    }]}>
                                    <Select
                                        labelInValue
                                        // disabled={true}
                                        suffixIcon={
                                            <img src={Images.caret_small_icon_select} alt={' '} className="img-fluid" />
                                        }
                                        // notFoundContent={fetching ? <Spin size="small" /> : null}
                                        filterOption={false}
                                        onFocus={() => this.getInvoiceStatus()}
                                        // onSearch={(e) => this.getWorkOrderStatusOptions(false, { search: e })}
                                        placeholder="Select Status"
                                    >
                                        {invoiceStatus.map(i => (
                                        <Option value={i.id}>{i.title}</Option>
                                     ))}
                                    </Select>
                                </Form.Item>
                            </div>

                            <div className='col-12'>
                            <Form.Item
                                        name="service_date"
                                        label={"Invoice Due Date *"}
                                       rules={[{
                                           required: true,
                                           message: 'this field is required'
                                       }]}
                                    >
                                        <DatePicker format={"MM/DD/YYYY"}
                                        />
                                    </Form.Item>
                            </div>
            
                            <div className="col-12">
                                <Form.Item
                                    name="instruction"
                                    label={"Invoice Instructions"}
                                    //    rules={[{
                                    //        required: true,
                                    //        message: 'this field is required'
                                    //    }]}
                                    className="position-relative"
                                >
                                    <TextArea
                                        className="text-area-main text-area-task"
                                        placeholder="Enter Description"
                                    />
                                </Form.Item>
                            </div>
                            <div className="col-12 validate-div-col text-md-right">
                                <Form.Item>
                                    <Button
                                        loading={btnLoader}
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
            <CommonWarningModal
                heading={"Are you sure you want to retrieve information from this project?"}
                subHeadingUOM={
                    "If you click Continue, general information, team, billing accounts, site manager accounts & sites, documents, and service variants would be retrieved from the selected project."
                }
                uomWarning
                retrieveWarning
                okAction={this.handleRetrieveproject}
                visible={this.state.visibleRetrieveWarning}
                onClose={() => this.handleWarningModal(false)}
            />
        </React.Fragment>);
    }
}

const mapStateToProps = state => {
    return { ...state };
}
// export default WorkOrderGeneralInfoCreate;
export default connect(mapStateToProps, { ProjectDetailAction })(withRouter(InvoicingGeneralInfoCreate));


