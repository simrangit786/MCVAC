import React, { Component } from "react";
import { Button, Collapse, message } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import GeneralInformation from "./GeneralInformation";
import ContactInformation from "./ContactInformation";
import DocsInfo from "./DocsInfo";
import CommonConfirmationModal from "../../modals/CommonConfirmationModal";
import CommonWarningModal from "../../modals/CommonWarningModal";
import AccountInfoCreate from "./AccountInfoCreate";
import AddressInfoContact from "./AddressInfoContact";
import OpportunitiesCreate from "./OpportunitiesCreate";
import { connect } from "react-redux";
import { getContactEmails, getContactPhones, getOneContact, } from "../../../Controller/api/contactsServices";
import { setBreadcrumb } from "../../../Store/actions/breadcrumbAction";
import { routes } from "../../../Controller/Routes";
import { history } from "../../../Controller/history";
import { reverse } from "named-urls/src";
import { withRouter } from "react-router-dom";
import { checkAccountRequired, getActiveKey } from "../../../Controller/utils";
import UnsavedDataPrompt from "../../modals/UnsavedDataPrompt";
import RequireSuccessModal from "../../modals/requiredDataModals/RequireSuccessModal";
import { getAccountCounty } from '../../../Controller/api/customerAccountServices';
import { handleError } from '../../../Controller/Global';

const { Panel } = Collapse;

class CreateContact extends Component {
    state = {
        contact: null,
        visibleConfirm: false,
        unsavedExit: false,
        address: null,
        activeKey: ["1"],
        requiredSuccessModalVisible: false,
        requiredWarningModalVisible: false,
        required: false,
        emails: [],
        phones: []

    };
    showContactInfo = (visible) => {
        this.setState({
            contactVisible: visible,
        });
    };

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

    setAddress = (address, num) => {
        if (address.city && address.state && address.country &&
            address.street_address && address.zip_code) {
            this.setState(() => {
                return { address, unsavedExit: false };
            });

            if (!this.props.match.params.id) {
                this.setState({ requiredSuccessModalVisible: true });
            }
        } else {
            this.setState(() => {
                return { address };
            });
        }

        let alreadyExist = null;
        if (this.state.activeKey.length > 1) {
            alreadyExist = this.state.activeKey.find((i) => i == num);
        }
        if (!alreadyExist) {
            this.setState((prevState) => {
                return {
                    address,
                    activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "6")],
                };
            });
        }
    };
    setContact = (contact, num) => {
        let cont = this.state?.contact;
        if (cont?.first_name && cont?.last_name) {
            if (
                this.state?.phones?.length &&
                this.state?.emails?.length
            ) {
                this.setState(() => {
                    return { contact, unsavedExit: false };
                });
                // if (!this.props.match.params.id) {
                //   this.setState({ requiredSuccessModalVisible: true });
                // }
            } else {
                this.setState(() => {
                    return { contact };
                });
            }
        } else {
            this.setState(() => {
                // return { contact, unsavedExit: true };
                return { contact };
            });
        }

        let alreadyExist = null;
        if (this.state.activeKey.length > 1) {
            alreadyExist = this.state.activeKey.find((i) => i == num);
        }
        if (!alreadyExist) {
            this.setState((prevState) => {
                return {
                    contact,
                    activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "6")],
                };
            });
        }
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

    componentDidMount() {
        let createArr = [
            {
                title: "Create Contact",
                url: routes.dashboard.contacts.create,
            },
        ];
        let editArr = [
            {
                title: "Edit Contact",
                url: routes.dashboard.contacts.edit,
            },
        ];
        if (this.props.match.params.id) {
            this.props.setBreadcrumb(editArr);
            getOneContact(this.props.match.params.id)
                .then((res) => {
                    this.setState({ contact: res.data, address: res.data.contact_address });
                })
                .catch((err) => {
                });
            this.fetchPhones();
            this.fetchEmails();
      this.setState({ activeKey: this.props.location.editTab || "1" })

        } else {
            this.props.setBreadcrumb(createArr);
        }
    }

    fetchContacts = () => {
        let ID = this.props.match.params.id || this.state.contact.id;
        getOneContact(ID)
            .then((res) => {
                this.setState({ contact: res.data }, () => {
                    let cont = this.state?.contact;
                    if (cont?.first_name && cont?.last_name) {
                        if (!this.props.match.params?.id) {
                            if (
                                cont?.account &&
                                this.state?.phones?.length &&
                                this.state?.emails?.length
                            ) {
                                this.setState(() => {
                                    return { contact: cont, unsavedExit: false };
                                });
                                if (!this.props.match.params.id) {
                                    this.setState({ requiredSuccessModalVisible: true });
                                }
                            } else {
                                this.setState(() => {
                                    // return { contact: cont, unsavedExit: true };
                                    return { contact: cont };
                                });
                            }
                        }
                    }
                });
            })
            .catch((err) => {
            });
    };

    fetchEmails = () => {
        const Id = this.state.contact?.id
            ? this.state.contact?.id
            : this.props.match.params.id;
        getContactEmails({ contact: Id })
            .then((res) => {
                this.setState({ emails: res.data.results });
                this.fetchContacts();
            })
            .catch((err) => {
                if (err.response) {
                    Object.keys(err.response.data).map((e) => {
                        message.error(err.response.data[e]);
                    });
                }
            });
    };
    fetchPhones = () => {
        const Id = this.state.contact?.id
            ? this.state.contact?.id
            : this.props.match.params.id;
        getContactPhones({ contact: Id })
            .then((res) => {
                this.setState({ phones: res.data.results });
                this.fetchContacts();
            })
            .catch((err) => {
                if (err.response) {
                    Object.keys(err.response.data).map((e) => {
                        message.error(err.response.data[e]);
                    });
                }
            });
    };

    collapseOnChange = (activeKey) => {
        this.setState({ activeKey });
    };
    handleViewMainButtonCLick = () => {
        let { contact } = this.state;
        if (this.props?.match?.params?.id) {
            this.setState(
                { unsavedExit: false },
                history.push(
                    reverse(routes.dashboard.contacts.view, { id: contact.id })
                )
            );
        } else {
            this.showConfirmModal(true);
        }
    };
    
    handleCancel = () => {

    }




    render() {
        let { contact, emails, phones, activeKey, address } = this.state;
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
                    setCancel= {()=>{this.setState({required:true})}}
                />
                <div className="main-content-div">
                    <div className="row mx-0 create-opportunity-row">
                        <div className="col-12 col-sm-10">
                            <Collapse
                                //   accordion
                                activeKey={activeKey}
                                onChange={this.collapseOnChange}
                                expandIcon={({ isActive }) => (
                                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                                )}
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
                                    <GeneralInformation
                                        setContact={this.setContact}
                                        contact={contact}
                                    />
                                </Panel>
                                <Panel
                                    disabled={!contact}
                                    header={
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0">
                                                    Contact Information
                                                </h5>
                                                {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                                                {/* {(this.state.required || this.props.match.params.id) && checkAccountRequired(contact, "CONTACT") && (
                                                    <p className="mb-0 info-signifire">
                                                        Please complete required information to avoid issues
                                                    </p>)} */}
                                            </div>
                                        </div>
                                    }
                                    key="2"
                                >
                                    <ContactInformation
                                        setContact={this.setContact}
                                        contact={contact}
                                        emails={emails}
                                        phones={phones}
                                        fetchEmails={this.fetchEmails}
                                        fetchPhones={this.fetchPhones}
                                    />
                                </Panel>
                                <Panel
                                    disabled={!contact}
                                    header={
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0">
                                                    Address Information
                                                </h5>
                                                {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                                                {/* {(this.state.required || this.props.match.params.id) && checkAccountRequired(address, "CONTACT_ADDRESS") && (
                                                    <p className="mb-0 info-signifire">
                                                        Please complete required information to avoid issues
                                                    </p>)} */}
                                            </div>
                                        </div>
                                    }
                                    key="6"
                                >
                                    <AddressInfoContact
                                        // setContact={this.setContact}
                                        contact={contact}
                                        address={address}
                                        setAddress={this.setAddress}
                                    />
                                </Panel>
                                <Panel
                                    disabled={!contact}
                                    header={
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0">
                                                    Account
                                                </h5>
                                                {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                                            </div>
                                        </div>
                                    }
                                    key="3"
                                >
                                    <AccountInfoCreate
                                        setContact={this.setContact}
                                        contact={contact}
                                        fetchContacts={this.fetchContacts}
                                    />
                                </Panel>
                                {/* <Panel
                                    disabled={!contact}
                                    header={
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0">Opportunities</h5>
                                                {/*<Button className="border-0 p-0 bg-transparent text-uppercase">OPTIONAL</Button>
                                            </div>
                                        </div>
                                    }
                                    key="4"
                                >
                                    <OpportunitiesCreate
                                        contact={contact}
                                        setContact={this.setContact}
                                        fetchContacts={this.fetchContacts}
                                    />
                                </Panel> */}
                                <Panel
                                    disabled={!contact}
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
                                    <DocsInfo contact={contact} />
                                </Panel>
                                {/*<Panel header={*/}
                                {/*    <div className="col-12">*/}
                                {/*        <div*/}
                                {/*            className="row info-card-heading-row align-items-center justify-content-between">*/}
                                {/*            <h5 className="mb-0">Proposals</h5>*/}
                                {/*            <Button*/}
                                {/*                className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*} key="6">*/}
                                {/*</Panel>*/}
                                {/*<Panel header={*/}
                                {/*    <div className="col-12">*/}
                                {/*        <div*/}
                                {/*            className="row info-card-heading-row align-items-center justify-content-between">*/}
                                {/*            <h5 className="mb-0">Projects</h5>*/}
                                {/*            <Button*/}
                                {/*                className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*} key="7">*/}
                                {/*</Panel>*/}
                                {/*<Panel header={*/}
                                {/*    <div className="col-12">*/}
                                {/*        <div*/}
                                {/*            className="row info-card-heading-row align-items-center justify-content-between">*/}
                                {/*            <h5 className="mb-0">Work Orders</h5>*/}
                                {/*            <Button*/}
                                {/*                className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*} key="8">*/}
                                {/*</Panel>*/}
                            </Collapse>
                            <div className="row">
                                <div className="col-12">
                                    <div className="row mx-0 justify-content-end common-form-btn-row">
                                        <Button
                                            style={{ marginRight: 10 }}
                                            onClick={() => {
                                                this.state.unsavedExit
                                                    ? history.push(routes.dashboard.contacts.self)
                                                    : this.showWarningModal(true);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            disabled={!contact}
                                            onClick={() => {
                                                this.state.unsavedExit
                                                    ? history.push(
                                                        reverse(routes.dashboard.contacts.view, {
                                                            id: contact.id,
                                                        })
                                                    )
                                                    : this.handleViewMainButtonCLick();
                                            }}
                                            type={"primary"}
                                        >
                                            View Contact
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <CommonConfirmationModal
                    heading={"You’ve successfully created this contact!"}
                    subHeading={
                        <p className="mb-0">
                            To view this contact,{" "}
                            <Button
                                className="border-0 shadow-none p-0 bg-transparent"
                                onClick={() =>
                                    history.push(
                                        reverse(routes.dashboard.contacts.view, { id: contact.id })
                                    )
                                }
                            >
                                {" "}
                                select View Contact{" "}
                            </Button>
                            .
                        </p>
                    }
                    okTitle={"View Contact"}
                    okAction={() => {
                        this.setState(
                            { unsavedExit: false },
                            history.push(
                                reverse(routes.dashboard.contacts.view, { id: contact.id })
                            )
                        );
                    }}
                    visible={this.state.visibleConfirm}
                    onClose={() => this.showConfirmModal(false)}
                />
                <CommonWarningModal
                    heading={
                        this.props.match.params.id
                            ? "Are you sure you want to exit editing this contact?"
                            : "Are you sure you want to exit creating this contact?"
                    }
                    okAction={() => {
                        this.setState(
                            { unsavedExit: false },
                            history.push(routes.dashboard.contacts.self)
                        );
                    }}
                    visible={this.state.warningModalVisible}
                    onClose={() => this.showWarningModal(false)}
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
                            reverse(routes.dashboard.contacts.view, { id: contact.id })
                        );
                    }}
                />
                {/* <RequiredWarningModal
                    visible={this.state.requiredWarningModalVisible}
                    heading={"You haven't added all of the required information."}
                    subHeading={"Not add the required information may cause issues down the line.If you'd like to continue adding information, select Continue.If you would like to exit anyway, select Exit."}
                    onClose={() => { this.showRequiredWarningModal(false) }}
                    onOK={() => { this.setState({ unsavedExit: false }, () => { this.showRequiredWarningModal(false); history.push(reverse(routes.dashboard.contacts.view, { id: contact.id })) }) }}
                /> */}
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

const actionCreators = {
    setBreadcrumb,
};

export default connect(
    mapStateToProps,
    actionCreators
)(withRouter(CreateContact));
