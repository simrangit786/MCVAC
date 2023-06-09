import React, { Component } from 'react';
import { Button, Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import GeneralInformationCreate from "./create/GeneralInformationCreate";
import AddressInfoVendorCreate from "./create/AddressInfoVendorCreate";
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { handleError } from '../../../Controller/Global';
import { getVendorAccountById } from '../../../Controller/api/vendorAccountServices';
import { connect } from 'react-redux';
import { setBreadcrumb } from '../../../Store/actions/breadcrumbAction';
import { history } from '../../../Controller/history';
import { routes } from '../../../Controller/Routes';
import { reverse } from 'named-urls/src';
import { checkAccountRequired, getActiveKey } from '../../../Controller/utils';
import UnsavedDataPrompt from '../../modals/UnsavedDataPrompt';
const { Panel } = Collapse;

class CreateVendorAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vendor: null,
            activeKey: "1",
            unsavedExit: false,
            required: false
        }
    }

    setVendor = (vendor, num) => {
        // this.setState({vendor})
        if (this.state.vendor?.name) {
            this.setState(() => {
                return { vendor };
            });
        } else {
            this.setState(() => {
                // return { vendor, unsavedExit: true };
                return { vendor};
            });
        }
        console.log(vendor, "vendor")
        let alreadyExist = null;
        if (this.state.activeKey.length > 1) {
            alreadyExist = this.state.activeKey.find((i) => i == num);
        }
        if (alreadyExist) {
            return null;
        } else {
            this.setState((prevState) => {
                let findLastKey = "";
                for (let i = 0; i <= this.state.activeKey.length; i++) {
                    if (i == this.state.activeKey.length) {
                        findLastKey = i.toString();
                    }
                }
                return {
                    vendor,
                    activeKey: [
                        ...prevState.activeKey,
                        ...getActiveKey(findLastKey, "2"),
                    ],
                };
            });
        }

    }
    collapseOnChange = (activeKey) => {
        this.setState({ activeKey });
    };

    componentDidMount() {
        const Id = this.state.vendor ? this.state.vendor?.id : this.props.match.params.id;
        let arr = [{
            title: 'Create Vendor Account'
        }]
        if (Id) {
            arr = [{ title: 'Edit Vendor Account' }]
            this.fetchVendorData()
        }
        this.props.setBreadcrumb(arr)
    }

    setAddressInVendor = (main_address, billing_address) => {
        const vendor = {
            ...this.state.vendor,
            main_address,
            billing_address
        }
        this.setState({ vendor , unsavedExit: false})

    }

    fetchVendorData = () => {
        const Id = this.state.vendor ? this.state.vendor.id : this.props.match.params.id;
        this.setState({ loading: true })
        getVendorAccountById(Id).then(res => {
            this.setState({ vendor: res.data, loading: false, activeKey: this.props.location.editTab || "1" })
        }).catch(err => {
            this.setState({ loading: false })
            handleError(err)
        })
    }
    render() {
        const { vendor, activeKey } = this.state;
        return (
            <React.Fragment>
                <UnsavedDataPrompt
                    // unsavedExit={this.state.unsavedExit} exit={true} message={""}
                    when={this.state.unsavedExit}
                    title="You haven't added all of the required information."
                    cancelText="Continue"
                    okText="Exit"
                    onOK={() => true}
                    onCancel={() => false}
                    setCancel={() => { this.setState({ required: true }) }}
                />
                <div className="main-content-div">
                    <div className="row mx-0 create-opportunity-row">
                        <div className="col-12 col-sm-10">
                            <Collapse
                                // accordion={true}
                                expandIcon={({ isActive }) => (
                                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                                )}
                                defaultActiveKey={['1']}
                                activeKey={activeKey}
                                onChange={this.collapseOnChange}
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
                                    <GeneralInformationCreate vendor={vendor} setVendor={this.setVendor} />
                                </Panel>
                                <Panel
                                    disabled={!vendor}
                                    header={
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0">
                                                    Address Information 
                                                </h5>
                                                {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                                                {/* {(this.state.required || this.props.match.params.id) && checkAccountRequired(vendor, "ADDRESS") && (
                                                    <p className="mb-0 info-signifire">
                                                        Please complete required information to avoid issues
                                                    </p>)} */}
                                            </div>
                                        </div>
                                    }
                                    key="2"
                                >
                                    <AddressInfoVendorCreate vendor={vendor} fetchVendorData={this.fetchVendorData} setAddressInVendor={this.setAddressInVendor} />
                                </Panel>
                            </Collapse>
                            <div className="row">
                                <div className="col-12">
                                    <div className="row mx-0 justify-content-end common-form-btn-row">
                                        <Button
                                            style={{ marginRight: 10 }}
                                        // onClick={() => {
                                        //     this.state.unsavedExit
                                        //         ? history.push(routes.dashboard.customer_account.self)
                                        //         : this.showWarningModal(true);
                                        // }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            disabled={!vendor}
                                            // onClick={() => this.showConfirmModal(true)}
                                            onClick={() => {
                                                // this.state.unsavedExit
                                                //     ?
                                                history.push(
                                                    reverse(routes.dashboard.vendor_account.view, {
                                                        id: vendor.id,
                                                    })
                                                )
                                                // : this.handleViewMainButtonCLick();
                                            }}
                                            type={"primary"}
                                        >
                                            View Account
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(null, { setBreadcrumb })(withRouter(CreateVendorAccount));