import React, {Component} from "react";
import {Button, Collapse} from "antd";
import {CaretRightOutlined} from "@ant-design/icons";
import CreateLaborEmployeeGeneralInformation from "./create-new-employee/CreateLaborEmployeeGeneralInformation";
import CreateEmployeeAddressInfoLabor from "./create-new-employee/CreateEmployeeAddressInfoLabor";
import CreateWageInfoLaborEmployee from "./create-new-employee/CreateWageInfoLaborEmployee";
import CreateNewEmployeesLabor from "./create-new-employee/CreateNewEmployeesLabor";
import DocumentsNewLaborEmployee from "./create-new-employee/DocumentsNewLaborEmployee";
import CreateInternalLocation from "./create-new-employee/CreateInternalLocation";
import {getEmployeeById,} from "../../../../Controller/api/labourServices";
import {handleError} from "../../../../Controller/Global";
import {connect} from "react-redux";
import {setBreadcrumb} from "../../../../Store/actions/breadcrumbAction";
import {routes} from "../../../../Controller/Routes";
import {getActiveKey} from "../../../../Controller/utils";
import {history} from "../../../../Controller/history";
import {reverse} from "named-urls/src";
import CommonConfirmationModal from "../../../modals/CommonConfirmationModal";
import CommonWarningModal from "../../../modals/CommonWarningModal";
import {withRouter} from "react-router-dom";
import UnsavedDataPrompt from "../../../modals/UnsavedDataPrompt";
import RequireSuccessModal from "../../../modals/requiredDataModals/RequireSuccessModal";

const {Panel} = Collapse;

class CreateLaborNewEmployeeMain extends Component {
    state = {
        employee: null,
        activeKey: ["1"],
        visible: false,
        visibleWarning: false,
        unsavedExit: false,
        requiredSuccessModalVisible: false,
    };
    showConfirmModal = (visible) => {
        this.setState({
            visible: visible,
        });
    };

    showWarningModal = (visible) => {
        this.setState({
            visibleWarning: visible,
        });
    };

    setEmployee = (employee, num) => {
        let emp = this.state?.employee;
        if (emp?.first_name && emp?.last_name) {
            if (
                employee.street &&
                employee.zip_code &&
                employee.phone &&
                employee.email &&
                employee.payroll_id &&
                employee.internal_location
            ) {
                this.setState(() => {
                    return {employee, unsavedExit: false};
                });
                if (!this.props.match.params.id) {
                    this.setState({requiredSuccessModalVisible: true});
                }
            } else {
                this.setState(() => {
                    return {employee};
                });
            }
        } else {
            this.setState(() => {
                return {employee, unsavedExit: true};
            });
        }

        let alreadyExist = null;
        if (this.state.activeKey.length > 1) {
            alreadyExist = this.state.activeKey.find((i) => i == num);
        }
        if (alreadyExist) {
            return null;
        } else {
            this.setState((prevState) => {
                // let findLastKey = "";
                // for(let i = 0; i <= this.state.activeKey.length; i++) {
                //     if(i == this.state.activeKey.length) {
                //         findLastKey = i.toString()
                //     }
                // }
                return {
                    employee,
                    activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "6")],
                };
            });
        }
    };

    fetchEmployee = () => {
        let Id = this.props.match.params.id || this.state.employee.id;
        getEmployeeById(Id)
            .then((res) => {
                this.setState({employee: res.data}, () => {
                    let emp = this.state?.employee;
                    if (emp?.first_name && emp?.last_name) {
                        if (!this.props.match.params.id) {
                            if (
                                emp.street &&
                                emp.zip_code &&
                                emp.phone &&
                                emp.email &&
                                emp.payroll_id &&
                                emp.internal_location
                            ) {
                                this.setState(() => {
                                    return {employee: emp, unsavedExit: false};
                                });
                            } else {
                                this.setState(() => {
                                    return {employee: emp, unsavedExit: true};
                                });
                            }
                        }
                    }
                });
            })
            .catch((err) => {
                handleError(err);
            });
    };

    collapseOnChange = (activeKey) => {
        this.setState({activeKey});
    };

    showRequiredSuccessModal = (visible) => {
        this.setState({
            requiredSuccessModalVisible: visible,
        });
    };

    componentDidMount() {
        let arrCreate = [
            {
                title: "Create Employee",
                url: routes.dashboard.management.labor.employee.create,
            },
        ];
        let arrEdit = [
            {
                title: "Edit Employee",
                url: routes.dashboard.management.labor.employee.edit,
            },
        ];
        this.props.setBreadcrumb(this.props.match.params.id ? arrEdit : arrCreate);
        if (this.props.match.params.id) {
            getEmployeeById(this.props.match.params.id)
                .then((res) => {
                    this.setState({employee: res.data});
                    this.setState({ activeKey: this.props.location.editTab || "1" })
                })
                .catch((err) => {
                    handleError(err);
                });
        }
    }

    handleViewMainButtonCLick = () => {
        let {employee} = this.state;
        if (this.props?.match?.params?.id) {
            history.push(
                reverse(routes.dashboard.management.labor.employee.view, {
                    id: employee.id,
                })
            );
        } else {
            this.showConfirmModal(true);
        }
    };

    render() {
        let {employee, activeKey} = this.state;
        return (
            <React.Fragment>
                {/* <UnsavedDataPrompt unsavedExit={this.state.unsavedExit} exit={true} message={""} /> */}
                <UnsavedDataPrompt
                    // unsavedExit={this.state.unsavedExit} exit={true} message={""}
                    when={this.state.unsavedExit}
                    title="You haven't added all of the required information."
                    cancelText="Continue"
                    okText="Exit"
                    onOK={() => true}
                    onCancel={() => false}
                />
                <div className="main-content-div">
                    <div className="row mx-0 create-opportunity-row">
                        <div className="col-12 col-sm-10">
                            <Collapse
                                //   accordion
                                activeKey={activeKey}
                                onChange={this.collapseOnChange}
                                expandIcon={({isActive}) => (
                                    <CaretRightOutlined rotate={isActive ? 90 : 0}/>
                                )}
                                // defaultActiveKey={["1"]}
                            >
                                <Panel
                                    header={
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0">General Information *</h5>
                                                {/* {employee && employee.first_name !== "" ? (
                          <img alt={""} src={Image.create_ac_checkmark} />
                        ) : (
                          <Button className="border-0 p-0 bg-transparent text-uppercase">
                            required
                          </Button>
                        )} */}
                                            </div>
                                        </div>
                                    }
                                    key="1"
                                >
                                    <CreateLaborEmployeeGeneralInformation
                                        employee={employee}
                                        setEmployee={this.setEmployee}
                                    />
                                </Panel>
                                <Panel
                                    disabled={!employee}
                                    header={
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0">
                                                    Address & Contact Information <sup>*</sup>
                                                </h5>
                                                {/* {
                          employee && employee.street != null ? (
                            <img alt={""} src={Image.create_ac_checkmark} />
                          ) : (
                            ""
                          )
                          // <Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>
                        } */}
                                            </div>
                                        </div>
                                    }
                                    key="2"
                                >
                                    <CreateEmployeeAddressInfoLabor
                                        employee={employee}
                                        setEmployee={this.setEmployee}
                                    />
                                </Panel>
                                <Panel
                                    disabled={!employee}
                                    header={
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0">
                                                    Warehouse <sup>*</sup>
                                                </h5>
                                                {/* {
                          employee && employee.internal_location != null ? (
                            <img alt={""} src={Image.create_ac_checkmark} />
                          ) : (
                            ""
                          )
                          // <Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>
                        } */}
                                            </div>
                                        </div>
                                    }
                                    key="3"
                                >
                                    <CreateInternalLocation
                                        employee={employee}
                                        setEmployee={this.setEmployee}
                                        fetchEmployee={this.fetchEmployee}
                                    />
                                </Panel>
                                <Panel
                                    disabled={!employee}
                                    header={
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0">Wage Information</h5>
                                                {/*<Button className="border-0 p-0 bg-transparent text-uppercase">OPTIONAL</Button>*/}
                                            </div>
                                        </div>
                                    }
                                    key="4"
                                >
                                    <CreateWageInfoLaborEmployee
                                        employee={employee}
                                        setEmployee={this.setEmployee}
                                        fetchEmployee={this.fetchEmployee}
                                    />
                                </Panel>
                                <Panel
                                    disabled={!employee}
                                    header={
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0">labor Groups</h5>
                                                {/*<Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                                            </div>
                                        </div>
                                    }
                                    key="5"
                                >
                                    <CreateNewEmployeesLabor
                                        employee={employee}
                                        setEmployee={this.setEmployee}
                                    />
                                </Panel>
                                <Panel
                                    disabled={!employee}
                                    header={
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0">Documents</h5>
                                                {/*<Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                                            </div>
                                        </div>
                                    }
                                    key="6"
                                >
                                    <DocumentsNewLaborEmployee
                                        employee={employee}
                                        setEmployee={this.setEmployee}
                                    />
                                </Panel>
                            </Collapse>
                            <div className="row">
                                <div className="col-12">
                                    <div className="row mx-0 justify-content-end common-form-btn-row">
                                        <Button
                                            onClick={() => this.showWarningModal(true)}
                                            style={{margin: "0 8px"}}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                this.state.unsavedExit
                                                    ? history.push(
                                                        reverse(
                                                            routes.dashboard.management.labor.employee.view,
                                                            {id: employee.id}
                                                        )
                                                    )
                                                    : this.handleViewMainButtonCLick()
                                            }
                                            disabled={!employee}
                                            type={"primary"}
                                        >
                                            View Employee
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <CommonConfirmationModal
                    heading={`You’ve successfully ${
                        this.props.match.params.id ? "updated" : "created"
                    } this Employee!`}
                    subHeading={
                        <p className="mb-0">
                            To view, select &nbsp;
                            <Button
                                onClick={() =>
                                    history.push(
                                        reverse(routes.dashboard.management.labor.employee.view, {
                                            id: employee.id,
                                        })
                                    )
                                }
                                className="bg-transparent border-0 shadow-none p-0"
                            >
                                View Employee
                            </Button>
                            .{" "}
                        </p>
                    }
                    okTitle={"View Employee"}
                    okAction={() =>
                        history.push(
                            reverse(routes.dashboard.management.labor.employee.view, {
                                id: employee.id,
                            })
                        )
                    }
                    visible={this.state.visible}
                    onClose={() => this.showConfirmModal(false)}
                />

                <CommonWarningModal
                    visible={this.state.visibleWarning}
                    onClose={() => this.showWarningModal(false)}
                    heading={`Are you sure you want to exit ${
                        this.props.match.params.id ? "editing" : "creating"
                    } this Employee?`}
                />
                <RequireSuccessModal
                    visible={this.state.requiredSuccessModalVisible}
                    heading={"You've successfully added all of the required information."}
                    subHeading={
                        "Thank you for adding all the required information! To continue adding optional information, select Continue. To view the Opportunity, select View Opportunity."
                    }
                    onClose={() => {
                        this.showRequiredSuccessModal(false);
                    }}
                    okText={"View Employee"}
                    onOK={() => {
                        this.showRequiredSuccessModal(false);
                        history.push(
                            reverse(routes.dashboard.management.labor.employee.view, {
                                id: employee.id,
                            })
                        );
                    }}
                />
            </React.Fragment>
        );
    }
}

export default connect(null, {setBreadcrumb})(
    withRouter(CreateLaborNewEmployeeMain)
);
