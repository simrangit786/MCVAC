import React, { Component } from "react";
import { Image as Images } from "../../Images";
import {CUSTOMER, CUSTOMER_OWNER, SITE_OWNER, userTypes} from "../../../Controller/userTypes";
import { withRouter } from "react-router-dom";
import {history} from "../../../Controller/history";
import { reverse } from "named-urls/dist/index.es";
import { routes } from "../../../Controller/Routes";

const AccountInfo = props => {

    return (
      <React.Fragment>
        <div className="row summary-collapse-inner-row-main">
                                        {!props.contact.account ? (
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
                                                    {props.contact.account.account_type === CUSTOMER_OWNER ? (
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
                                                                                {id: props.contact.account.id}
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
                                                                        <h6>{props.contact.account.name}</h6>
                                                                        <p className="mb-0">{userTypes.CUSTOMER_OWNER}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : props.contact.account.account_type === SITE_OWNER ? (
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
                                                                             {id: props.contact.account.id}
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
                                                                    <h6>{props.contact.account.name}</h6>
                                                                    <p className="mb-0">
                                                                        {userTypes.SITE_OWNER}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : props.contact.account.account_type === CUSTOMER ? (
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
                                                                             {id: props.contact.account.id}
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
                                                                    <h6>{props.contact.account.name}</h6>
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
                                                                    <h6>{props.contact.account.name}</h6>
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
                                                    <h5 className="mb-0">{props.contact.role || "-"}</h5>
                                                </div>
                                            </>
                                        )}
                                    </div>
      </React.Fragment>
    );
  }


export default withRouter(AccountInfo);
