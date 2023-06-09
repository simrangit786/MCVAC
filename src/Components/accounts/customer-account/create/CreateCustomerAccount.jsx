import React, { Component } from "react";
import { Button, Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import GeneralInformation from "./GeneralInformation";
import PaymentInformation from "./PaymentInformation";
import AddressInformation from "./AddressInformation";
import ContactsInfo from "./ContactsInfo";
import DocsInfo from "./DocsInfo";
import CommonWarningModal from "../../../modals/CommonWarningModal";
import { getAccount, getOneCustomerAccount } from "../../../../Controller/api/customerAccountServices";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../../Store/actions/breadcrumbAction";
import { routes } from "../../../../Controller/Routes";
import CommonConfirmationModal from "../../../modals/CommonConfirmationModal";
import { history } from "../../../../Controller/history";
import { reverse } from "named-urls/src";
import { withRouter } from "react-router-dom";
import CustomerTeamInfo from "./CustomerTeamInfo";
import UnsavedDataPrompt from "../../../modals/UnsavedDataPrompt";
import { checkAccountRequired, getActiveKey } from "../../../../Controller/utils";
import RequireSuccessModal from "../../../modals/requiredDataModals/RequireSuccessModal";
import { handleError } from "../../../../Controller/Global";

const { Panel } = Collapse;

class CreateCustomerAccount extends Component {
    state = {
        account: null,
        payment: null,
        address: null,
        warningModalVisible: false,
        visibleConfirm: false,
        unsavedExit: false,
        activeKey: ["1"],
        requiredSuccessModalVisible: false,
        requiredWarningModalVisible: false,
        required: false
    };

    // setAccount = (account) => {
    //     this.setState({ account, unsavedExit: true })
    // };
    // setPayment = (payment) => {
    //     this.setState({ payment })
    // };
    setAddress = (address) => {
        this.getAccountDetail(address.main)
        this.setState({ address, unsavedExit: false });
        if (!this.props.match.params.id) {
            this.setState({ requiredSuccessModalVisible: true });
        }
    };

    setAccount = (account, num) => {
        if (this.state.account?.name) {
            this.setState(() => {
                return { account };
            });
        } else {
            this.setState(() => {
                // return { account, unsavedExit: true};
                return { account};
            });
        }

        let alreadyExist = null;
        if (this.state.activeKey.length > 1) {
            alreadyExist = this.state.activeKey.find((i) => i == num);
        }
        if (!alreadyExist) {
            this.setState((prevState) => {
                return {
                    account,
                    activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "6")],
                };
            });
        }
    };
    setPayment = (payment, num) => {
        this.getAccountDetail(payment)
        let alreadyExist = null;
        if (this.state.activeKey.length > 1) {
            alreadyExist = this.state.activeKey.find((i) => i == num);
        }
        if (!alreadyExist) {
            this.setState((prevState) => {
                return {
                    payment,
                    activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "6")],
                };
            });
        }
    };
    // setAddress = (address, num) => {
    // if(this.state.account?.name)
    // {
    // this.setState(() => {
    //             return { address, unsavedExit:false}
    //         })
    // }
    //     let alreadyExist = null;
    //     if (this.state.activeKey.length > 1) {
    //         alreadyExist = this.state.activeKey.find(i => i == num);
    //     }
    //     if (!alreadyExist) {
    //         this.setState(prevState => {
    //             return { address, activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "6")] }
    //         })
    //     }
    // };
    showConfirmModal = (visible) => {
        this.setState({
            visibleConfirm: visible,
        });
    };

    showWarningModal = (visible) => {
        this.setState({
            warningModalVisible: visible,
        });
    };

    showRequiredSuccessModal = (visible) => {
        this.setState({
            requiredSuccessModalVisible: visible,
        });
    };
    showRequiredWarningModal = (visible) => {
        this.setState({
            requiredWarningModalVisible: visible,
        });
    };
    
    getAccountDetail = (data) => {
        getOneCustomerAccount(this.props.match.params.id || data.account)
                .then((res) => {
                    this.setState({
                        account: res.data,
                        payment: res.data.payment_information,
                        address: {
                            main: res.data.main_address,
                            billing: res.data.billing_address,
                        },
                    });
                })
                .catch((err) => {
                    handleError(err)
                });
    }

    componentDidMount() {
        let arrCreate = [
            {
                title: "Create Billing Account",
                url: routes.dashboard.customer_account.create,
            },
        ];
        let arrEdit = [{ title: "Edit Billing Account", url: "#" }];
        if (this.props.match.params.id) {
            // this.setState({activeKey: this.props.location.editTab})
            this.props.setBreadcrumb(arrEdit);
            getOneCustomerAccount(this.props.match.params.id)
                .then((res) => {
                    this.setState({
                        account: res.data,
                        payment: res.data.payment_information,
                        address: {
                            main: res.data.main_address,
                            billing: res.data.billing_address,
                        },
                        activeKey: this.props.location.editTab || "1"
                    });
                })
                .catch((err) => {
                    handleError(err)
                });
        } else {
            this.props.setBreadcrumb(arrCreate);
        }
    }

    handleCollapseChange = (activeKey) => {
        this.setState({ activeKey });
    };

    handleViewMainButtonCLick = () => {
        let { account } = this.state;
        if (this.props?.match?.params?.id) {
            this.setState({ unsavedExit: false });
            history.push(
                reverse(routes.dashboard.customer_account.view, { id: account.id })
            );
        } else {
            this.showConfirmModal(true);
        }
    };


    render() {
        let { account, payment, address, activeKey } = this.state;
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
                    setCancel= {()=>{this.setState({required:true})}}
                />
                <div className="main-content-div">
                    <div className="row mx-0 create-opportunity-row">
                        <div className="col-12 col-sm-10">
                            <Collapse
                                //   accordion
                                activeKey={activeKey}
                                expandIcon={({ isActive }) => (
                                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                                )}
                                defaultActiveKey={
                                    this.props.location.editTab
                                        ? [this.props.location.editTab]
                                        : ["1"]
                                }
                                onChange={this.handleCollapseChange}
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
                                    <GeneralInformation
                                        account={account}
                                        setAccount={this.setAccount}
                                    />
                                </Panel>
                                <Panel
                                    disabled={!account}
                                    header={
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0">Payment Information</h5>
                                                {/*<Button className="border-0 p-0 bg-transparent text-uppercase">Optional</Button>*/}
                                                {/* {(this.state.required || this.props.match.params.id) && checkAccountRequired(account,"PAYMENT") && (
                                                    <p className="mb-0 info-signifire">
                                                        Please complete required information to avoid issues
                                                    </p>)} */}
                                            </div>
                                        </div>
                                    }
                                    key="2"
                                >
                                    <PaymentInformation
                                        account={account}
                                        payment={payment}
                                        setPayment={this.setPayment}
                                    />
                                </Panel>
                                <Panel
                                    disabled={!account}
                                    header={
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0">
                                                    Address Information 
                                                </h5>
                                                {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                                                {/* {(this.state.required || this.props.match.params.id) && checkAccountRequired(account,"ADDRESS") && (
                                                    <p className="mb-0 info-signifire">
                                                        Please complete required information to avoid issues
                                                    </p>)} */}
                                            </div>
                                        </div>
                                    }
                                    key="3"
                                >
                                    <AddressInformation
                                        account={account}
                                        address={address}
                                        setAddress={this.setAddress}
                                    />
                                </Panel>
                                <Panel
                                    disabled={!account}
                                    header={
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0">Contacts</h5>
                                                {/*<Button className="border-0 p-0 bg-transparent text-uppercase">OPTIONAL</Button>*/}
                                            </div>
                                        </div>
                                    }
                                    key="4"
                                >
                                    <ContactsInfo
                                        account={account}
                                        setAccount={this.setAccount}
                                    />
                                </Panel>
                                <Panel
                                    disabled={!account}
                                    header={
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0">Team</h5>
                                                {/*<Button className="border-0 p-0 bg-transparent text-uppercase">OPTIONAL</Button>*/}
                                            </div>
                                        </div>
                                    }
                                    key="6"
                                >
                                    <CustomerTeamInfo
                                        account={account}
                                        setAccount={this.setAccount}
                                    />
                                </Panel>
                                <Panel
                                    disabled={!account}
                                    header={
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0">Documents</h5>
                                                {/*<Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                                            </div>
                                        </div>
                                    }
                                    key="5"
                                >
                                    <DocsInfo account={account} setAccount={this.setAccount} />
                                </Panel>
                            </Collapse>
                            <div className="row">
                                <div className="col-12">
                                    <div className="row mx-0 justify-content-end common-form-btn-row">
                                        <Button
                                            style={{ marginRight: 10 }}
                                            onClick={() => {
                                                this.state.unsavedExit
                                                    ? history.push(routes.dashboard.customer_account.self)
                                                    : this.showWarningModal(true);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            disabled={!account}
                                            // onClick={() => this.showConfirmModal(true)}
                                            onClick={() => {
                                                this.state.unsavedExit
                                                    ? history.push(
                                                        reverse(routes.dashboard.customer_account.view, {
                                                            id: account.id,
                                                        })
                                                    )
                                                    : this.handleViewMainButtonCLick();
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
                <CommonConfirmationModal
                    heading={"You’ve successfully created this Billing Account!"}
                    subHeading={
                        <p className="mb-0">
                            To view this billing account, select{" "}
                            <Button
                                onClick={() =>
                                    history.push(
                                        reverse(routes.dashboard.customer_account.view, {
                                            id: account.id,
                                        })
                                    )
                                }
                                className="border-0 shadow-none p-0 bg-transparent"
                            >
                                View Billing Account.
                            </Button>
                        </p>
                    }
                    okAction={() => {
                        this.setState({ unsavedExit: false });
                        history.push(
                            reverse(routes.dashboard.customer_account.view, {
                                id: account.id,
                            })
                        );
                    }}
                    okTitle={"View Billing Account"}
                    visible={this.state.visibleConfirm}
                    onClose={() => this.showConfirmModal(false)}
                />
                <CommonWarningModal
                    heading={
                        this.props.match.params.id
                            ? "Are you sure you want to exit editing this Billing Account?"
                            : "Are you sure you want to exit creating this Billing Account?"
                    }
                    okAction={() => {
                        this.setState({ unsavedExit: false }, () => {
                            history.push(routes.dashboard.customer_account.self);
                        });
                    }}
                    visible={this.state.warningModalVisible}
                    onClose={() => {
                        this.showWarningModal(false);
                    }}
                    uomWarning={true}
                />
                <RequireSuccessModal
                    visible={this.state.requiredSuccessModalVisible}
                    heading={"You've successfully added all of the required information."}
                    subHeading={
                        "Thank you for adding all the required information! To continue adding optional information, select Continue. To view the account, select View Account."
                    }
                    onClose={() => {
                        this.showRequiredSuccessModal(false);
                    }}
                    onOK={() => {
                        this.showRequiredSuccessModal(false);
                        history.push(
                            reverse(routes.dashboard.customer_account.view, {
                                id: account.id,
                            })
                        );
                    }}
                />
                {/* <RequiredWarningModal
                    visible={this.state.requiredWarningModalVisible}
                    heading={"You haven't added all of the required information."}
                    subHeading={"Not add the required information may cause issues down the line.If you'd like to continue adding information, select Continue.If you would like to exit anyway, select Exit."}
                    onClose={() => { this.showRequiredWarningModal(false) }}
                    onOK={() => { this.showRequiredWarningModal(false); history.push(reverse(routes.dashboard.customer_account.view, { id: account.id })) }}
                /> */}
            </React.Fragment>
        );
    }
}

export default connect(null, { setBreadcrumb })(
    withRouter(CreateCustomerAccount)
);
