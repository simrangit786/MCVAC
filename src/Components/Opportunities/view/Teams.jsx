import React, {useEffect} from "react";
import {getShortName, titleCase} from "../../../Controller/utils";
import {Image as Images} from "../../Images";

const Teams = props => {
    // handleChange = (v) => {
    //     updateOpportunity(props.match.params.id, {status: v}).then(res => {
    //         props.opportunityDetailAction(props.match.params.id)
    //     }).catch(err => {

    //     })
    // }

    useEffect(() => {
        const opp = props.opportunity;
        if (
            opp.sales_person.id ||
            opp.sales_manager.id ||
            opp.sales_assistant.id == opp.point_opportunity
        ) {
            console.log("point of contact");
        }
    }, [])

    const opp = props.opportunity;
    if (!opp.id) return <div/>;
    return (
        <React.Fragment>
            {/* <Button onClick={() => showCreateOpportunity(true)}
                        className="edit-btn-summary">
                  <img src={Images.pencil_green} alt="" className="img-fluid"/>
                 Edit
                </Button> */}
            <div className="row summary-collapse-inner-row-main">
                <div className="col-12 p-0">
                    <div className="row summary-info-cr">
                        <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <div className="row">
                                <div className="col-12">
                                    <h5 className="text-uppercase">SALES MANAGERS</h5>
                                </div>
                                {opp.sales_manager.length > 0 ? (
                                    <div className="col-12">
                                        <div className="row">
                                            {opp.sales_manager.map((manager, index) => {
                                                return (
                                                    <div className="col-12" key={index}>
                                                        <div
                                                            style={{minHeight: "85px", height: "85px"}}
                                                            className={`row mx-0 align-items-center user-info-div-main opportunity-info-div-main ${
                                                                opp.point_opportunity === manager.id
                                                                    ? "active"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <div className="col-12">
                                                                <div className="user-icons-div">
                                    <span
                                        className="d-flex align-items-center justify-content-center rounded-circle text-uppercase">
                                      {getShortName(
                                          manager.first_name,
                                          manager.last_name
                                      )}
                                    </span>
                                                                </div>
                                                                <div className="user-info-div">
                                                                    <h6>
                                                                        {manager.first_name} {manager.last_name}
                                                                    </h6>
                                                                    <p className="mb-0">
                                                                        {titleCase(manager.role)}
                                                                    </p>
                                                                    <span
                                                                        className="point-details font-weight-bold position-absolute m-auto d-flex align-items-center">
                                      {opp.point_opportunity === manager.id
                                          ? "point of contact"
                                          : ""}
                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="col-12">
                                        <div
                                            className="row mx-0 no-data-card-row teams-update-no-teams-card align-items-center justify-content-center">
                                            <div className="col-12 text-center">
                                                <img
                                                    alt={""}
                                                    className="img-fluid"
                                                    src={Images.teams_labor_no_data_icon}
                                                />
                                                <h6 className="mb-0">No Sales Managers</h6>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <div className="row">
                                <div className="col-12">
                                    <h5 className="text-uppercase">SALES ASSISTANTS</h5>
                                </div>
                                {opp.sales_assistant.length > 0 ? (
                                    <div className="col-12">
                                        <div className="row">
                                            {opp.sales_assistant.map((assitant, index) => {
                                                return (
                                                    <div className="col-12" key={index}>
                                                        <div
                                                            style={{minHeight: "85px", height: "85px"}}
                                                            className={`row mx-0 align-items-center user-info-div-main opportunity-info-div-main ${
                                                                opp.point_opportunity === assitant.id
                                                                    ? "active"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <div className="col-12">
                                                                <div className="user-icons-div">
                                    <span
                                        className="d-flex align-items-center justify-content-center rounded-circle text-uppercase">
                                      {getShortName(
                                          assitant.first_name,
                                          assitant.last_name
                                      )}
                                    </span>
                                                                </div>
                                                                <div className="user-info-div">
                                                                    <h6>
                                                                        {assitant.first_name} {assitant.last_name}
                                                                    </h6>
                                                                    <p className="mb-0">
                                                                        {titleCase(assitant.role)}
                                                                    </p>
                                                                    <span
                                                                        className="point-details font-weight-bold position-absolute m-auto d-flex align-items-center">
                                      {opp.point_opportunity === assitant.id
                                          ? "point of contact"
                                          : ""}
                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="col-12">
                                        <div
                                            className="row mx-0 no-data-card-row teams-update-no-teams-card align-items-center justify-content-center">
                                            <div className="col-12 text-center">
                                                <img
                                                    alt={""}
                                                    className="img-fluid"
                                                    src={Images.teams_labor_no_data_icon}
                                                />
                                                <h6 className="mb-0">No Sales Assistants</h6>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <div className="row">
                                <div className="col-12">
                                    <h5 className="text-uppercase">SALESPEOPLE</h5>
                                </div>
                                {opp.sales_person.length > 0 ? (
                                    <div className="col-12">
                                        <div className="row">
                                            {opp.sales_person.map((person, index) => {
                                                return (
                                                    <div className="col-12">
                                                        <div
                                                            style={{minHeight: "85px", height: "85px"}}
                                                            className={`row mx-0 align-items-center user-info-div-main opportunity-info-div-main ${
                                                                opp.point_opportunity === person.id
                                                                    ? "active"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <div className="col-12">
                                                                <div className="user-icons-div">
                                    <span
                                        className="d-flex align-items-center justify-content-center rounded-circle text-uppercase">
                                      {getShortName(
                                          person.first_name,
                                          person.last_name
                                      )}
                                    </span>
                                                                </div>
                                                                <div className="user-info-div">
                                                                    <h6>
                                                                        {person.first_name} {person.last_name}
                                                                    </h6>
                                                                    <p className="mb-0">
                                                                        Salesperson
                                                                    </p>
                                                                    <span
                                                                        className="point-details font-weight-bold position-absolute m-auto d-flex align-items-center">
                                      {opp.point_opportunity === person.id
                                          ? "point of contact"
                                          : ""}
                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="col-12">
                                        <div
                                            className="row mx-0 no-data-card-row teams-update-no-teams-card align-items-center justify-content-center">
                                            <div className="col-12 text-center">
                                                <img
                                                    alt={""}
                                                    className="img-fluid"
                                                    src={Images.teams_labor_no_data_icon}
                                                />
                                                <h6 className="mb-0">No Salespeople</h6>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Teams;
