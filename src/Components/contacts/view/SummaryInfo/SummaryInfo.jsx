import React, {Component} from "react";
import {Button, Collapse, Form, Input} from "antd";
import {CaretRightOutlined} from "@ant-design/icons";
import {Image as Images} from "../../../Images";
import ContactInfo from "./ContactInfo";
import {connect} from "react-redux";
import OpportunitiesInfo from "../../summaryInfo/OpportunitiesInfo";
import DocumentsInfo from "../../summaryInfo/DocumentsInfo";
import Posts from "../../summaryInfo/Posts";
import ContactsInfo from "../../summaryInfo/ContactsInfo";
import ProposalsInfo from "../../summaryInfo/ProposalsInfo";
import {history} from "../../../../Controller/history";
import {reverse} from "named-urls/dist/index.es";
import {routes} from "../../../../Controller/Routes";
import {CUSTOMER, CUSTOMER_OWNER, SITE_OWNER, userTypes} from "../../../../Controller/userTypes";
import ActivityInfo from "../../summaryInfo/ActivityInfo";
import AddressInfo from "../../summaryInfo/AddressInfo";
import AccountInfo from "../../summaryInfo/AccountInfo";
import {checkAccountRequired} from "../../../../Controller/utils";

const {Panel} = Collapse;

function callback(key) {
    // console.log(key);
}

class SummaryInfo extends Component {
    proposalsColumns = [{
        title: "Name", dataIndex: "name",
    }, {
        title: "TYPE", dataIndex: "type",
    }, {
        title: "Assignee", dataIndex: "assignee",
    }, {
        title: <div className="position-relative">Due Date</div>, dataIndex: "due_date", sorter: true,
    },];

    render() {
        let {contact} = this.props;
        if (!contact.id) return <div/>;
        return (<React.Fragment>
                <div className="col-12">
                    <div className="row summary-info-inner-row">
                        <div className="col-12">
                            <Collapse
                                // accordion
                                defaultActiveKey={["1"]}
                                onChange={callback}
                                expandIcon={({isActive}) => (<CaretRightOutlined rotate={isActive ? 90 : 0}/>)}
                            >
                                <Panel
                                    header={<div
                                        className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                                            <span>
                                                General Information <sup>*</sup>
                                            </span>
                                        <Button
                                            // onClick={() =>
                                            //     history.push(
                                            //         reverse(routes.dashboard.contacts.edit, {
                                            //             id: contact.id,
                                            //         })
                                            //     )
                                            // }
                                            onClick={() => history.push({
                                                pathname: reverse(routes.dashboard.contacts.edit, {id: contact.id}),
                                                editTab: "1"
                                            })}
                                            className="edit-btn-summary"
                                        >
                                            <img
                                                src={Images.pencil_green}
                                                alt=""
                                                className="img-fluid"
                                            />
                                            Edit
                                        </Button>
                                    </div>}
                                    key="1"
                                >
                                    <ContactInfo/>
                                </Panel>

                                <Panel
                                    header={<div
                                        className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                                            <span>
                                                Contact Information
                                            </span>
                                        <div className="d-flex align-items-center">
                                            {/* {checkAccountRequired(contact, "CONTACT") && (
                                                    <p className="mb-0 info-signifire mr-3">
                                                        Please complete required information to avoid issues
                                                    </p>)} */}
                                            <Button
                                                onClick={() => history.push({
                                                    pathname: reverse(routes.dashboard.contacts.edit, {id: contact.id}),
                                                    editTab: "2"
                                                })}
                                                className="edit-btn-summary"
                                            >
                                                <img
                                                    src={Images.pencil_green}
                                                    alt=""
                                                    className="img-fluid"
                                                />
                                                Edit
                                            </Button>
                                        </div>
                                    </div>}
                                    key="3"
                                >
                                    <ContactsInfo {...this.props} hideTitle={true}/>
                                </Panel>

                                <Panel
                                    header={<div
                                        className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                                            <span>
                                                Address Information
                                            </span>
                                        <div className="d-flex align-items-center">
                                            {/* {checkAccountRequired(contact.contact_address, "CONTACT_ADDRESS") && (
                                                    <p className="mb-0 info-signifire mr-3">
                                                        Please complete required information to avoid issues
                                                    </p>)} */}
                                            <Button
                                                onClick={() => history.push({
                                                    pathname: reverse(routes.dashboard.contacts.edit, {id: contact.id}),
                                                    editTab: "6"
                                                })}
                                                className="edit-btn-summary"
                                            >
                                                <img
                                                    src={Images.pencil_green}
                                                    alt=""
                                                    className="img-fluid"
                                                />
                                                Edit
                                            </Button>
                                        </div>
                                    </div>}
                                    key="4"
                                >
                                    {/* <AddressInfo{...this.props} hideTitle={true} /> */}
                                    <AddressInfo {...this.props} hideTitle={true}/>
                                </Panel>

                                <Panel
                                    header={<div className="opportunity_info-collapse d-flex align-items-center">
                                        <span>Posts</span>
                                    </div>}
                                    key="9"
                                >
                                    <Posts
                                        hideTitle={true}
                                        {...this.props}
                                        hideButton
                                        hideSearch
                                    />
                                </Panel>

                                <Panel
                                    header={<div className="opportunity_info-collapse d-flex align-items-center">
                                        <span>Activity</span>
                                    </div>}
                                    key="10"
                                >
                                    <div className="col-12 p-0">
                                        <div
                                            className="row mx-0 new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">
                                            {/* <div className="d-flex align-items-center">
                                                <div className="search-bar-div">
                                                    <Form className="position-relative">
                                                        <Input placeholder="Search"/>
                                                        <Button
                                                            className='search-btn position-absolute p-0 border-0 bg-transparent m-auto'>
                                                            <img src={Images.search_icon_gray} className="img-fluid"
                                                                 alt="search icon"/>
                                                        </Button>
                                                    </Form>
                                                </div>
                                            </div> */}
                                            <Button
                                                onClick={() => this.props.tabChange("9")}
                                                className="view-all-btn text-uppercase ml-auto"
                                            >
                                                VIEW ALL{" "}
                                            </Button>
                                        </div>
                                        {/* <div className="row summary-collapse-inner-row-main px-0 pb-0">
                                            {/*when-no-data-is-available
                                            <div className="col-12">
                                                <div className="row no-data-upload-screens no-data-second m-0 border-0">
                                                    <div className="col-12 text-center">
                                                        <img src={Images.folder_icon_main} alt=""
                                                             className="img-fluid"/>
                                                        {/* <h6 className="mb-0">Coming Soon</h6> 
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                                        <ActivityInfo pagination hideTitle={true}/>
                                    </div>
                                </Panel>

                                <Panel
                                    header={<div
                                        className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                                            <span>
                                                Account
                                            </span>
                                        <Button
                                            onClick={() => history.push({
                                                pathname: reverse(routes.dashboard.contacts.edit, {id: contact.id}),
                                                editTab: "3"
                                            })}
                                            className="edit-btn-summary"
                                        >
                                            <img
                                                src={Images.pencil_green}
                                                alt=""
                                                className="img-fluid"
                                            />
                                            Edit
                                        </Button>
                                    </div>}
                                    key="2"
                                >
                                    <div className="col-12 p-0">
                                        <div
                                            className="row mx-0 new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">
                                            <Button
                                                onClick={() => this.props.tabChange("10")}
                                                className="view-all-btn text-uppercase ml-auto"
                                            >
                                                VIEW ALL{" "}
                                            </Button>
                                        </div>
                                        {/* <div className="row summary-collapse-inner-row-main">
                                        {!contact.account ? (
                                            <div className="col-12">
                                                <div
                                                    className="row mx-0 no-data-card-row align-items-center justify-content-center contacts-account-empty">
                                                    <div className="col-12 text-center">
                                                        <img
                                                            src={Images.Account_no_data_icon}
                                                            alt=""
                                                            className="img-fluid"
                                                        />
                                                        <h6 className="mb-0 text-gray-tag">No Account</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 mb-15-bt">
                                                    {contact.account.account_type === CUSTOMER_OWNER ? (
                                                        <div>
                                                            <div
                                                                style={{minHeight: "85px", height: "85px"}}
                                                                className="row mx-0 align-items-center user-info-div-main mb-3 position-relative opportunity-info-div-main"
                                                            >
                                                                <div
                                                                    className="col-12"
                                                                    style={{cursor: "pointer"}}
                                                                    onClick={() =>
                                                                        history.push(
                                                                            reverse(
                                                                                routes.dashboard.customer_account.view,
                                                                                {id: contact.account.id}
                                                                            )
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="user-icons-div">
                                                                        <img
                                                                            src={Images.person_black_icon}
                                                                            alt=""
                                                                            className="img-fluid"
                                                                        />
                                                                    </div>
                                                                    <div className="user-info-div">
                                                                        <h6>{contact.account.name}</h6>
                                                                        <p className="mb-0">{userTypes.CUSTOMER_OWNER}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                          
                                                        </div>
                                                    ) : contact.account.account_type === SITE_OWNER ? (
                                                        <div
                                                            style={{minHeight: "85px", height: "85px"}}
                                                            className="row mx-0 align-items-center user-info-div-main mb-3 position-relative opportunity-info-div-main"
                                                        >
                                                            <div className="col-12"
                                                                 style={{cursor: "pointer"}}
                                                                 onClick={() =>
                                                                     history.push(
                                                                         reverse(
                                                                             routes.dashboard.owner_account.view,
                                                                             {id: contact.account.id}
                                                                         )
                                                                     )
                                                                 }
                                                            >
                                                                <div className="user-icons-div">
                                                                    <img
                                                                        src={Images.person_black_icon}
                                                                        alt=""
                                                                        className="img-fluid"
                                                                    />
                                                                </div>
                                                                <div className="user-info-div">
                                                                    <h6>{contact.account.name}</h6>
                                                                    <p className="mb-0">
                                                                        {userTypes.SITE_OWNER}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : contact.account.account_type === CUSTOMER ? (
                                                        <div
                                                            style={{minHeight: "85px", height: "85px"}}
                                                            className="row mx-0 align-items-center user-info-div-main mb-3 position-relative opportunity-info-div-main"
                                                        >
                                                            <div className="col-12"
                                                                 style={{cursor: "pointer"}}
                                                                 onClick={() =>
                                                                     history.push(
                                                                         reverse(
                                                                             routes.dashboard.customer_account.view,
                                                                             {id: contact.account.id}
                                                                         )
                                                                     )
                                                                 }
                                                            >
                                                                <div className="user-icons-div">
                                                                    <img
                                                                        src={Images.person_black_icon}
                                                                        alt=""
                                                                        className="img-fluid"
                                                                    />
                                                                </div>
                                                                <div className="user-info-div">
                                                                    <h6>{contact.account.name}</h6>
                                                                    <p className="mb-0">
                                                                        {userTypes.CUSTOMER}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            style={{minHeight: "85px", height: "85px"}}
                                                            className="row mx-0 align-items-center user-info-div-main mb-3 position-relative opportunity-info-div-main"
                                                        >
                                                            <div className="col-12">
                                                                <div className="user-icons-div">
                                                                    <img
                                                                        src={Images.person_black_icon}
                                                                        alt=""
                                                                        className="img-fluid"
                                                                    />
                                                                </div>
                                                                <div className="user-info-div">
                                                                    <h6>{contact.account.name}</h6>
                                                                    <p className="mb-0">{userTypes.VENDOR}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                    }

                                                </div>
                                                <div
                                                    className="col-12 col-sm-6 col-md-6 col-lg-6 mb-15-bt"
                                                    style={{marginTop: "2.3vh"}}
                                                >
                                                    <h6 className="text-uppercase">Position</h6>
                                                    <h5 className="mb-0">{contact.role || "-"}</h5>
                                                </div>
                                            </>
                                        )}
                                    </div> */}
                                        <AccountInfo contact={this.props.contact}/>
                                    </div>
                                </Panel>
                                <Panel
                                    header={<div className="opportunity_info-collapse d-flex align-items-center">
                                        <span>Documents </span>
                                    </div>}
                                    key="11"
                                >
                                    <DocumentsInfo {...this.props} hideTitle={true} hideSearch/>
                                </Panel>

                                <Panel
                                    header={<div
                                        className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                                        <span>Opportunities</span>
                                        {/* <Button
                                                onClick={() =>
                                                    history.push({
                                                        pathname: reverse(routes.dashboard.contacts.edit,
                                                            { id: contact.id }
                                                        ),
                                                        editTab: "4"
                                                    })
                                                }
                                                className="edit-btn-summary"
                                            >
                                                <img
                                                    src={Images.pencil_green}
                                                    alt=""
                                                    className="img-fluid"
                                                />
                                                Edit
                                            </Button> */}
                                    </div>}
                                    key="5"
                                >
                                    <OpportunitiesInfo
                                        {...this.props}
                                        hideTitle={true}
                                        hideSearch={true}
                                    />
                                </Panel>
                                <Panel
                                    header={<div className="opportunity_info-collapse d-flex align-items-center">
                                        <span>Proposals</span>
                                    </div>}
                                    key="6"
                                >
                                    <ProposalsInfo {...this.props} hideTitle={true}/>
                                </Panel>

                                <Panel
                                    header={<div className="opportunity_info-collapse d-flex align-items-center">
                                        <span>Projects</span>
                                    </div>}
                                    key="7"
                                >
                                    <div className="col-12">
                                        <div
                                            className="row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">
                                            <div className="d-flex align-items-center">
                                                <div className="search-bar-div">
                                                    <Form className="position-relative">
                                                        <Input placeholder="Search"/>
                                                        <Button
                                                            className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                                                            <img
                                                                src={Images.search_icon_gray}
                                                                className="img-fluid"
                                                                alt="search icon"
                                                            />
                                                        </Button>
                                                    </Form>
                                                </div>
                                                {/* <Button className="add-btn-collapse text-uppercase">Create</Button> */}
                                            </div>
                                            <Button
                                                onClick={() => this.props.tabChange("6")}
                                                className="view-all-btn text-uppercase ml-auto"
                                            >
                                                VIEW ALL{" "}
                                            </Button>
                                        </div>
                                        <div className="row summary-collapse-inner-row-main px-0 pb-0">
                                            {/*when-no-data-is-available*/}
                                            <div className="col-12">
                                                <div className="row no-data-upload-screens no-data-second m-0 border-0">
                                                    <div className="col-12 text-center">
                                                        <img
                                                            src={Images.folder_gray_no_data}
                                                            alt=""
                                                            className="img-fluid"
                                                        />
                                                        <h6 className="mb-0 text-gray-tag">No Projects</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Panel>

                                <Panel
                                    header={<div className="opportunity_info-collapse d-flex align-items-center">
                                        <span>Work Orders</span>
                                    </div>}
                                    key="8"
                                >
                                    <div className="col-12">
                                        <div
                                            className="row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">
                                            <div className="d-flex align-items-center">
                                                <div className="search-bar-div">
                                                    <Form className="position-relative">
                                                        <Input placeholder="Search"/>
                                                        <Button
                                                            className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                                                            <img
                                                                src={Images.search_icon_gray}
                                                                className="img-fluid"
                                                                alt="search icon"
                                                            />
                                                        </Button>
                                                    </Form>
                                                </div>
                                                {/* <Button className="add-btn-collapse text-uppercase">
                                                    Create
                                                </Button> */}
                                            </div>
                                            <Button
                                                onClick={() => this.props.tabChange("7")}
                                                className="view-all-btn text-uppercase ml-auto"
                                            >
                                                VIEW ALL{" "}
                                            </Button>
                                        </div>
                                        <div className="row summary-collapse-inner-row-main px-0 pb-0">
                                            {/*when-no-data-is-available*/}
                                            <div className="col-12">
                                                <div className="row no-data-upload-screens no-data-second m-0 border-0">
                                                    <div className="col-12 text-center">
                                                        <img
                                                            src={Images.work_setting}
                                                            alt=""
                                                            className="img-fluid"
                                                        />
                                                        <h6 className="mb-0 text-gray-tag">
                                                            No Work Order
                                                        </h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Panel>
                            </Collapse>
                        </div>
                    </div>
                </div>
            </React.Fragment>);
    }
}

const mapStateToProps = (state) => {
    return {...state};
};
export default connect(mapStateToProps, {})(SummaryInfo);
