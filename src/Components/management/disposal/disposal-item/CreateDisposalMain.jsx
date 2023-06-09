import React, {Component} from "react";
import {Button, Collapse} from "antd";
import {CaretRightOutlined} from "@ant-design/icons";
import {history} from "../../../../Controller/history";
import {reverse} from "named-urls/src";
import CommonWarningModal from "../../../modals/CommonWarningModal";
import CreateDisposalGeneralInfo from "./create/CreateDisposalGeneralInfo";
import CreateUniversalUnits from "./create/CreateUniversalUnits";
import CreateCustomUnitsMeasurement from "./create/CreateCustomUnitsMeasurement";
import CreateCostDisposal from "./create/CreateCostDisposal";
import CreateDocumentDisposal from "./create/CreateDocumentDisposal";
import {routes} from "../../../../Controller/Routes";
import {getDisposalById, updateDisposal,} from "../../../../Controller/api/disposalServices";
import {handleError} from "../../../../Controller/Global";
import {getActiveKey} from "../../../../Controller/utils";
import {connect} from "react-redux";
import {setBreadcrumb} from "../../../../Store/actions/breadcrumbAction";
import {withRouter} from "react-router-dom";
import UnsavedDataPrompt from "../../../modals/UnsavedDataPrompt";
import CreateWarehouseVendorDisposalFacilities from "./create/CreateWarehouseVendorDisposalFacilities";
import DisposalInventoryCreationModal from "../../../modals/DisposalInventoryCreationModal";
import RequireSuccessModal from "../../../modals/requiredDataModals/RequireSuccessModal";

const {Panel} = Collapse;

class CreateDisposalMain extends Component {
    state = {
        activeKey: ["1"],
        visible: false,
        visibleWarning: false,
        disposal: null,
        unsavedExit: false,
        requiredSuccessModalVisible: false
    };

    componentDidMount() {
        let arrEdit = [
            {
                title: "Edit Disposal",
                // url: routes.dashboard.management.disposal.self
                url: "#",
            },
        ];
        let arr = [
            {
                title: "Create Disposal",
                url: "#",
                // url: routes.dashboard.management.disposal.self
            },
        ];

        if (this.props.match.params.id) {
            this.props.setBreadcrumb(arrEdit);
            this.getDisposalItem();
      this.setState({ activeKey: this.props.location.editTab || "1" })

        } else {
            this.props.setBreadcrumb(arr);
        }
    }

    getDisposalItem = () => {
        let Id = this.props.match.params.id || this.state.disposal.id;
        getDisposalById(Id)
            .then((res) => {
                this.setState({disposal: res.data}, () => {
                    let disp = this.state?.disposal;
                    if (disp?.name && disp?.parent) {
                        if (!this.props.match?.params?.id) {
                            if (disp?.uom_array?.length && disp?.internal_location?.length) {
                                this.setState(() => {
                                    return {disposal: disp, unsavedExit: false};
                                });
                            } else {
                                this.setState(() => {
                                    return {disposal: disp, unsavedExit: true};
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

    onChange = (name, value) => {
        this.setState({[name]: value});
    };

    setDisposal = (disposal, num) => {
        if (this.state?.disposal?.name && this.state?.disposal?.parent) {
            if (disposal?.uom_array?.length && disposal?.internal_location?.length) {
                this.setState(() => {
                    return {disposal, unsavedExit: false};
                });
                if (!this.props.match.params.id) {
                    this.setState({requiredSuccessModalVisible: true});
                }
            } else {
                this.setState(() => {
                    return {disposal};
                });
            }
        } else {
            this.setState(() => {
                return {disposal, unsavedExit: true};
            });
        }

        let alreadyExist = null;
        if (this.state.activeKey.length > 1) {
            alreadyExist = this.state.activeKey.find((i) => i == num);
        }
        if (!alreadyExist) {
            this.setState((prevState) => {
                return {
                    disposal,
                    activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "7")],
                };
            });
        }
        // this.setState({disposal, activeKey: getActiveKey(this.state.activeKey, "7")})
    };

    showConfirmModal = (visible) => {
        if (visible && !this.state.disposal.is_inventory) {
            updateDisposal(this.state.disposal.id, {is_inventory: true})
                .then()
                .catch((err) => {
                    handleError(err);
                });
        }
        this.setState({
            visible: visible,
        });
    };
    showWarningModal = (visible) => {
        this.setState({
            visibleWarning: visible,
        });
    };
    onCollapseChange = (activeKey) => {
        this.setState({activeKey});
    };
    showRequiredSuccessModal = (visible) => {
        this.setState({
            requiredSuccessModalVisible: visible,
        });
    };

    handleViewMainButtonCLick = () => {
        let {disposal} = this.state;
        if (this.props?.match?.params?.id) {
            history.push(
                reverse(routes.dashboard.management.disposal.items.view, {
                    id: disposal.id,
                })
            );
        } else {
            this.showConfirmModal(true);
        }
    };

    render() {
        let {disposal, activeKey} = this.state;
        return (
            <React.Fragment>
                {/* <UnsavedDataPrompt unsavedExit={this.state.unsavedExit} exit={true} message={""}/> */}
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
                                activeKey={activeKey}
                                onChange={this.onCollapseChange}
                                // accordion
                                expandIcon={({isActive}) => (
                                    <CaretRightOutlined rotate={isActive ? 90 : 0}/>
                                )}
                                // defaultActiveKey={this.props.location.editTab ? [this.props.location.editTab] : ["1"]}
                                // defaultActiveKey={["1"]}
                            >
                                <Panel
                                    header={
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0">
                                                    General Information <sup>*</sup>
                                                </h5>
                                                {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                                            </div>
                                        </div>
                                    }
                                    key="1"
                                >
                                    <CreateDisposalGeneralInfo
                                        disposal={disposal}
                                        onChange={this.onChange}
                                        setdisposal={this.setDisposal}
                                    />
                                </Panel>

                                <Panel
                                    disabled={!disposal}
                                    header={
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0 text-capitalize">
                                                    Universal Units of Measurement <sup>*</sup>
                                                </h5>
                                                {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                                            </div>
                                        </div>
                                    }
                                    key="2"
                                >
                                    <CreateUniversalUnits
                                        disposal={disposal}
                                        setDisposal={this.setDisposal}
                                    />
                                </Panel>
                                <Panel
                                    disabled={!disposal}
                                    header={
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0 text-capitalize">
                                                    Custom Units of Measurement
                                                </h5>
                                                {/*<Button className="border-0 p-0 bg-transparent text-uppercase">Optional</Button>*/}
                                            </div>
                                        </div>
                                    }
                                    key="3"
                                >
                                    <CreateCustomUnitsMeasurement
                                        getDisposalItem={this.getDisposalItem}
                                        disposal={disposal}
                                        setDisposal={this.setDisposal}
                                    />
                                </Panel>

                                {/* <Panel disabled={!disposal} header={
                                    <div className="col-12">
                                        <div
                                            className="row info-card-heading-row align-items-center justify-content-between">
                                            <h5 className="mb-0 text-capitalize">Estimated Total Cost</h5>
                                            <Button
                                                className="border-0 p-0 bg-transparent text-uppercase">required</Button>
                                        </div>
                                    </div>
                                } key="4">
                                    <CreateCostDisposal disposal={disposal} onChange={this.onChange} setdisposal={this.setDisposal} />
                                </Panel> */}

                                <Panel
                                    disabled={!disposal}
                                    header={
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0 text-capitalize">
                                                    Warehouse & Vendor Disposal Facilities <sup>*</sup>
                                                </h5>
                                                {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                                            </div>
                                        </div>
                                    }
                                    key="4"
                                >
                                    <CreateWarehouseVendorDisposalFacilities
                                        disposal={disposal}
                                        getDisposalItem={this.getDisposalItem}
                                        setDisposal={this.setDisposal}
                                    />
                                    {/*<CreateInternalLocations disposal={disposal} getDisposalItem={this.getDisposalItem} setDisposal={this.setDisposal} />*/}
                                </Panel>

                                {/*<Panel disabled={!disposal} header={*/}
                                {/*    <div className="col-12">*/}
                                {/*        <div*/}
                                {/*            className="row info-card-heading-row align-items-center justify-content-between">*/}
                                {/*            <h5 className="mb-0 text-capitalize">External Locations</h5>*/}
                                {/*            <Button*/}
                                {/*                className="border-0 p-0 bg-transparent text-uppercase">Optional</Button>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*} key="6">*/}
                                {/*    <CreateDropOffFacilities disposal={disposal} setDisposal={this.setDisposal}/>*/}
                                {/*</Panel>*/}

                                <Panel
                                    disabled={!disposal}
                                    header={
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0 text-capitalize">
                                                    Reference Price
                                                </h5>
                                                {/*<Button className="border-0 p-0 bg-transparent text-uppercase">Optional</Button>*/}
                                            </div>
                                        </div>
                                    }
                                    key="5"
                                >
                                    <CreateCostDisposal
                                        disposal={disposal}
                                        onChange={this.onChange}
                                        setdisposal={this.setDisposal}
                                    />
                                </Panel>

                                <Panel
                                    disabled={!disposal}
                                    header={
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0 text-capitalize">Documents</h5>
                                                {/*<Button className="border-0 p-0 bg-transparent text-uppercase">Optional</Button>*/}
                                            </div>
                                        </div>
                                    }
                                    key="7"
                                >
                                    <CreateDocumentDisposal
                                        disposal={disposal}
                                        onChange={this.onChange}
                                        setdisposal={this.setDisposal}
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
                                            className="w-auto"
                                            disabled={!disposal}
                                            onClick={() =>
                                                this.state.unsavedExit
                                                    ? history.push(
                                                        reverse(
                                                            routes.dashboard.management.disposal.items.view,
                                                            {id: disposal.id}
                                                        )
                                                    )
                                                    : this.handleViewMainButtonCLick()
                                            }
                                            type={"primary"}
                                        >
                                            {" "}
                                            {`Complete View (Disposal & Disposal Inventory)`}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <DisposalInventoryCreationModal
                    heading={`You’ve successfully ${
                        this.props.match.params.id ? "updated" : "created"
                    } this Disposal and Disposal Inventory.`}
                    subHeading={
                        <p className="mb-0">
                            If you want to view the disposal Inventory you just created,
                            please click &nbsp; "
                            <Button
                                // onClick={() => history.push(reverse(routes.dashboard.management.disposal.items.view, {id: disposal.id}))}
                                className="bg-transparent border-0 shadow-none p-0"
                            >
                                Go to Disposal Inventory
                            </Button>
                            "
                            <br/>
                            If you want to view the disposal please click &nbsp; "
                            <Button
                                onClick={() =>
                                    history.push(
                                        reverse(routes.dashboard.management.disposal.items.view, {
                                            id: disposal.id,
                                        })
                                    )
                                }
                                className="bg-transparent border-0 shadow-none p-0"
                            >
                                View Disposal
                            </Button>
                            "
                        </p>
                    }
                    // okTitle={'View Disposal'}
                    viewDisposalInventory={() =>
                        history.push(
                            reverse(routes.dashboard.management.disposal_inventory.view, {
                                id: disposal.id,
                            })
                        )
                    }
                    viewDisposal={() =>
                        history.push(
                            reverse(routes.dashboard.management.disposal.items.view, {
                                id: disposal.id,
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
                    } this Disposal?`}
                />
                <RequireSuccessModal
                    visible={this.state.requiredSuccessModalVisible}
                    heading={"You've successfully added all of the required information."}
                    subHeading={
                        "Thank you for adding all the required information! To continue adding optional information, select Continue. To view the Disposal, select View Disposal."
                    }
                    onClose={() => {
                        this.showRequiredSuccessModal(false);
                    }}
                    okText={"View Disposal"}
                    onOK={() => {
                        this.showRequiredSuccessModal(false);
                        history.push(
                            reverse(routes.dashboard.management.disposal.items.view, {
                                id: disposal.id,
                            })
                        );
                    }}
                />
            </React.Fragment>
        );
    }
}

export default connect(null, {setBreadcrumb})(withRouter(CreateDisposalMain));
