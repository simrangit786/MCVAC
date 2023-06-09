import React, {Component} from "react";
import {Breadcrumb, Button, Dropdown, Form, Input, Menu, Select} from "antd";
import {Image as Images} from "./Images";
import {Link, withRouter} from "react-router-dom";
import {routes} from "../Controller/Routes";
import AccountCreateTypeModal from "./modals/AccountCreateTypeModal";
import {connect} from "react-redux";
import {globalSearchAction} from "../../src/Store/actions/customerAccountAction";
import {userDataAction} from "../../src/Store/actions/userdataAction";
import {debounce} from "lodash";
import {GoogleOutlined} from "@ant-design/icons";
import {getGoogleAuthenticateURL, getUserData} from "../Controller/api/authServices";
import {Tooltip} from "antd";
import CommonWarningModal from "./modals/CommonWarningModal";
import {getShortName} from "../Controller/utils";
import { handleError } from "../Controller/Global";
import { setUserToken } from "../Controller/localStorageHandler";

class CustomHeader extends Component {
    state = {
        visible: false, googleModalVisible: false
    };
    handleGoogleBtnClick = () => {
        getGoogleAuthenticateURL({redirect_url: window.location.href}).then((r) => {
            window.location.href = r.data.url;
        });
    };

    handleModalVisible = () => {
        this.setState({googleModalVisible: true})
    }
    
    componentDidMount() {
        const {userdata} = this.props;
        if(!userdata?.google_authorised_email) {
            this.getUserDetails()
        }
    }
    
    getUserDetails = () => {
       this.props.userDataAction();
    } 

    menu2 = () => {
        const user = this.props.userdata;
        return (<Menu>
                <Menu.Item key={'0'}>
                    <div className="row">
                        <div className="col-12 profile-details-div">
                            <div
                                className="profile-avatar-div text-uppercase">{getShortName(user.first_name, user.last_name)}</div>
                            <h6>{user.first_name} {user.last_name}</h6>
                            <p>{user.email}</p>
                        </div>
                    </div>
                </Menu.Item>
                <Menu.Item>
                    <div>
                        {!user.google_authorised_email ? (<div className="sign-with-google-btn d-inline-block">
                                <div className="sign-with-icon">
                                    <img alt={''} className="img-fluid" src={Images.google_logo}/>
                                </div>
                                <div className="sign-with-content">
                                        <span
                                            onClick={this.handleModalVisible}
                                            className="d-flex align-items-center ml-3"
                                        >
                                      Sign in with Google
                                    </span>
                                </div>
                            </div>) : (<>
            <span className={'sign-with-google-btn d-inline-block'}>
              {/* <Tooltip
                  className="sign-with-google-btn"
                placement="left"
                title={user?.google_authorised_email}
                overlayStyle={{ fontSize: 11 }}
                arrowPointAtCenter={true}
              > */}
                <div className="sign-with-icon">
                  <img alt={''} className="img-fluid" src={Images.google_logo}/>
               </div>
                <div className="sign-with-content">
                  <span className="d-inline-block w-100 mb-1">Signed in with google</span>
                  <span className="email-custom d-inline-block w-100">{user?.google_authorised_email || ""}</span>
                </div>
                {/* </Tooltip> */}
            </span>
                            </>)}
                    </div>
                </Menu.Item>
                <Menu.Item key="1">
                    <Link
                        className="d-flex align-items-center logout-btn"
                        to={routes.logout}
                    >
                        <img alt={''} className="img-fluid" src={Images.logout_icon}/>
                        Log Out
                    </Link>
                </Menu.Item>
            </Menu>);
    };

    showAccountTypeModal = (visible) => {
        this.setState({
            visible: visible,
        });
    };

    // componentDidMount() {
    //     if(this.props.match.url.includes('global-search')) {
    //         this.props.globalSearchAction({search: ""})
    //     }
    // }

    menu = (<Menu>
            <Menu.Item key="0">
                <div
                    onClick={() => this.showAccountTypeModal(true)}
                    className="d-flex align-items-center w-100 font-weight-bold"
                >
                    Account
                </div>
            </Menu.Item>
            <Menu.Item key="1">
                <Link
                    className="d-flex align-items-center font-weight-bold"
                    to={routes.dashboard.contacts.create}
                >
                    Contact
                </Link>
            </Menu.Item>
            <Menu.Item key="3">
                <Link
                    className="d-flex align-items-center font-weight-bold"
                    to={routes.dashboard.opportunities.create}
                >
                    Opportunity
                </Link>
            </Menu.Item>
            <Menu.Item key="4">
                <Link className="d-flex align-items-center font-weight-bold" 
                 to={routes.dashboard.sales.proposal.create}>
                    Proposal
                </Link>
            </Menu.Item>
            <Menu.Item key="5">
                <Link className="d-flex align-items-center font-weight-bold" to={routes.dashboard.operations.projects.create}>
                    Project
                </Link>
            </Menu.Item>
            <Menu.Item key="6">
                <Link className="d-flex align-items-center font-weight-bold" to={routes.dashboard.operations.work_order.create}>
                    Work Order
                </Link>
            </Menu.Item>
        </Menu>);

    getUrl = (link) => {
        if (link === "#") {
            return "";
        }
        let url = this.props.location.pathname;
        if (url.includes("view")) {
            if (url.includes("packages")) {
                return "?tab=packages";
            } else if (url.includes("groups")) {
                return "?tab=groups";
            } else if (url.includes("items")) {
                return "?tab=items";
            } else if (url.includes("kits")) {
                return "?tab=kits";
            } else if (url.includes("labor/labor-group")) {
                return "?tab=labor";
            } else if (url.includes("labor/employee")) {
                return "?tab=employee";
            } else if (url.includes("supply-tools/supply-tools")) {
                return "?tab=tools";
            } else if (url.includes("vehicles/vehicle")) {
                return "?tab=vehicles";
            } else {
                return "";
            }
        } else {
            return "";
        }
    };

    pushToGlobal = () => {
        this.props.history.push(routes.dashboard.global_search);
    };

    debounceEvent = (...args) => {
        this.debouncedEvent = debounce(...args);
        return (e) => {
            e.persist();
            return this.debouncedEvent(e);
        };
    };

    onSearch = (e) => {
        const txtLength = e.target.value.length;
        if (txtLength > 3 || txtLength === 3) {
            this.props.globalSearchAction({search: e.target.value});
        }
    };

    render() {
        const {googleModalVisible} = this.state;
        const user = this.props.userdata;
        let breadcrumb = this.props.breadcrumb || [];
        return (<React.Fragment>
                <div className="custom-header-main d-flex align-items-center position-fixed">
                    <div className="row w-100 align-items-center justify-content-between">
                        <div className="col-12 col-sm-6">
                            <div className="heading-header-main">
                                <Breadcrumb
                                    separator={<img
                                        src={Images.breadcrumb_right_arrow}
                                        alt=""
                                        className="img-fluid"
                                    />}
                                >
                                    {this.props.location.pathname == "/dashboard/" ? (
                                        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>) : (breadcrumb.map((b, index) => (
                                            <Breadcrumb.Item key={index}>
                                                {!b.url || b.url === this.props.location.pathname ? (
                                                    <span>{b.title}</span>) : (<Link
                                                        to={b.url + (index === 0 ? "" : this.getUrl(b.url))}
                                                    >
                                                        {b.title}
                                                    </Link>)}
                                            </Breadcrumb.Item>)))}
                                    {/*<Breadcrumb.Item>*/}
                                    {/*    <Link to={""}>Opportunities <span>(100)</span></Link>*/}
                                    {/*</Breadcrumb.Item>*/}
                                    {/*<Breadcrumb.Item>Carpet Cleaning</Breadcrumb.Item>*/}
                                </Breadcrumb>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 pr-0">
                            <div className="header-right-details">
                                <ul className="list-inline mb-0 d-flex align-items-center justify-content-end">
                                    <li className="list-inline-item">
                                        <div className="search-bar-div">
                                            {this.props.match.url.indexOf("create") !== -1 || this.props.match.url.indexOf("edit") !== -1 ? ("") : (
                                                <Form className="position-relative">
                                                    <Input
                                                        allowClear
                                                        // showSearch
                                                        className="search-input-header"
                                                        placeholder="Search (minimum 3 characters required)"
                                                        onFocus={this.pushToGlobal}
                                                        autoFocus={this.props.match.url.includes("global-search") ? true : false}
                                                        onChange={this.debounceEvent(this.onSearch, 1000)}
                                                    />
                                                    {/* <option>"placeholder"</option>
                            </Select> */}

                                                    <Button
                                                        className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                                                        <img
                                                            src={Images.search_icon_gray}
                                                            className="img-fluid"
                                                            alt="search icon"
                                                        />
                                                    </Button>

                                                </Form>)}
                                        </div>
                                    </li>
                                    <li className="list-inline-item">
                                        {this.props.match.url.indexOf("create") !== -1 || this.props.match.url.indexOf("edit") !== -1 ? ("") : (
                                            <div className="create-div">
                                                <Dropdown
                                                    overlayClassName="create-dropdown-main"
                                                    overlay={this.menu}
                                                    trigger={["click"]}
                                                    placement={'bottomCenter'}
                                                >
                                                    <Button
                                                        onClick={(e) => e.preventDefault()}
                                                        className="ant-dropdown-link"
                                                    >
                                                        {/*<img className="img-fluid" alt="white plus icon"*/}
                                                        {/*    src={Images.white_plus_icon} />*/}
                                                        <span>+ Create</span>
                                                    </Button>
                                                </Dropdown>
                                            </div>)}
                                    </li>
                                    <li className="list-inline-item">
                                        <div className="account-user-details position-relative">
                                            <Dropdown overlayClassName="profile-fix-dropdown" trigger={'click'}
                                                      overlay={this.menu2}>
                                                <Button
                                                    className="rounded-circle border-0 p-0 text-uppercase position-relative shadow-none d-flex align-items-center justify-content-center">
                                                    {/*<img*/}
                                                    {/*  src={Images.account_admin_img}*/}
                                                    {/*  className="img-fluid"*/}
                                                    {/*  alt="account admin"*/}
                                                    {/*/>*/}
                                                    {getShortName(user.first_name, user.last_name)}
                                                    <span
                                                        className="position-absolute rounded-circle"/>
                                                </Button>
                                            </Dropdown>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <AccountCreateTypeModal
                    ALL_TYPES
                    visible={this.state.visible}
                    onClose={() => this.showAccountTypeModal(false)}
                />
                <CommonWarningModal
                    heading={"You need to sign in with Google to move forward. Would you like to sign in?"}
                    subHeadingUOM={`If you would like to sign in with Google, you would be redirected to Google's sign in page. After signing in, you would be brought back to the dashboard.`}
                    handleGoogleBtnClick={() => {
                        this.handleGoogleBtnClick();
                    }}
                    visible={googleModalVisible}
                    onClose={() => {
                        this.setState({googleModalVisible: false});
                    }}
                    googleSigninModal
                />
            </React.Fragment>);
    }
}

const mapStateToProps = (state) => {
    return {
        ...state, breadcrumb: state.breadcrumb,
    };
};

const actionCreators = {
    globalSearchAction,
    userDataAction
};
export default connect(mapStateToProps, actionCreators)(withRouter(CustomHeader));
