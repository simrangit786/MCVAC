import React, { Component } from 'react';
import { Button, Form, Input, message, Select, Spin } from "antd";
import { Image as Images } from '../../../Images'
import { handleError } from '../../../../Controller/Global';
import { getProjects, getProjectStatusOptions } from '../../../../Controller/api/projectServices';
import { createWorkOrder, getWorkOrderStatusOptions, updateWorkOrder } from '../../../../Controller/api/workOrderServices';
import CommonWarningModal from '../../../modals/CommonWarningModal';
import { connect } from 'react-redux';
import { ProjectDetailAction } from "../../../../Store/actions/projectAction";
import { withRouter } from 'react-router-dom';
import WoCustomSelectOptions from "./WoCustomSelectOptions";


const { Option } = Select;
const layout = {
    labelCol: { span: 24 }, wrapperCol: { span: 24 },
};
const { TextArea } = Input;

class WorkOrderGeneralInfoCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            fetching: false,
            statusTypes: [],
            projectVal: null,
            visibleRetrieveWarning: false,
            retrieve_proj: false,
        }
        this.formRef = React.createRef();
    }

    componentDidMount() {
        if (this.props.location.pathname?.includes('create')) {
            this.formRef.current.setFieldsValue({
                status: {
                    value: "SERVICE_REQUEST"
                }
            })
        }
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
            retrieve_project: retrieve_proj && !this.props.workOrder ? retrieve_proj : false
        }

        this.setState({ btnLoader: true });
        if (this.props.workOrder) {
            updateWorkOrder(this.props.workOrder.id, params).then(res => {
                this.props.setWorkOrder(res.data, 2);
                message.success('Work Order updated successfully!')
            }).catch(err => {
                handleError(err)
            }).finally(() => {
                this.setState({ btnLoader: false })
            })
        }
        else {
            createWorkOrder(params).then(res => {
                this.props.setWorkOrder(res.data, 2);
                message.success('Work Order created successfully!')
            }).catch(err => {
                handleError(err)
            }).finally(() => {
                this.setState({ btnLoader: false })
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.workOrder != this.props.workOrder) {
            console.log("enter")
            const { workOrder } = this.props;
            this.formRef.current.setFieldsValue({
                ...workOrder,
                project: { label: workOrder?.project?.name, value: workOrder?.project?.id },
                status: {
                    // label: workOrder?.status ,
                    value: workOrder?.status
                }
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

    handleRetrieveproject = () => {
        const { project_data } = this.props;
        this.setState({ retrieve_proj: true, visibleRetrieveWarning: false }, () => {
            const values = {
                // project_start_date: proposal_data?.project_start_date ? moment(proposal_data?.project_start_date) : null,
                // project_end_date: proposal_data?.project_end_date ? moment(proposal_data?.project_end_date) : null,
                description: project_data?.description,
                // name: proposal_data?.name,
                // opportunity: proposal_data?.opportunity?.name
            }
            this.formRef.current.setFieldsValue({
                ...values,
            })
        })
    }


    render() {
        const { projects, fetching, statusTypes, btnLoader, projectVal } = this.state;
        const { workOrder } = this.props
        // console.log(workOrder)

        return (<React.Fragment>
            <div className="row common-form-card-row">
                <div className="col-12">
                    <div className="row info-gray-div align-items-center">
                        <h6 className="mb-0">Please input general information for workorder.</h6>
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
                                        notFoundContent={fetching ? <Spin size="small" /> : null}
                                        filterOption={false}
                                        // onFocus={() => this.getWorkOrderStatusOptions(false)}
                                        // onSearch={(e) => this.getWorkOrderStatusOptions(false, { search: e })}
                                        placeholder="Select Status"
                                    >
                                        {/* {statusTypes.map(status => { */}

                                        <Option value={"SERVICE_REQUEST"}>Service Request</Option>
                                        <Option value={"IN_QUEUE"}>In Queue</Option>
                                        <Option value={"EN_ROUTE"}>En Route</Option>
                                        <Option value={"ON_SITE"}>On Site</Option>
                                        <Option value={"COMPLETED"}>Completed</Option>
                                        <Option value={"VOID"}>Void</Option>
                                        {/* })} */}
                                    </Select>
                                </Form.Item>
                            </div>
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
                                        disabled={workOrder?.project}
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
                                    <span className={`retrieve-oppo ${workOrder && 'cursor'}`}
                                        // <span
                                        // remove this style when button is clickable
                                        // style={{ color: '#BDBDBD' }}
                                        // className={`retrieve-oppo`}
                                        onClick={() => {
                                            if (!workOrder) {
                                                this.handleWarningModal(true)
                                            }
                                        }}
                                    >Retrieve information</span>
                                }
                            </div>
                            <div className="col-12">
                                <Form.Item
                                    name="description"
                                    label={"Description"}
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
export default connect(mapStateToProps, { ProjectDetailAction })(withRouter(WorkOrderGeneralInfoCreate));


