// import { reverse } from 'named-urls/src';
import React, {Component} from "react";
import {getShortName, titleCase} from "../../../../../Controller/utils";
// import { history } from '../../../../Controller/history';
// import { routes } from '../../../../Controller/Routes';
// import { getShortName, titleCase } from '../../../../Controller/utils';
import {Image as Images} from "../../../../Images";

class CustomerTeamInfoView extends Component {
    render() {
        const {owner} = this.props;
        if (!owner?.id) return <div/>;
        return (<React.Fragment>
            <div className="row summary-collapse-inner-row-main">
                <div className="col-12 p-0">
                    <div className="row summary-info-cr mt-3">
                        <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <div className="row">
                                <div className="col-12">
                                            <h5 className="text-uppercase">SALES MANAGERS</h5>
                                        </div>
                                {owner.sales_manager.length > 0 ? (<div className="col-12">
                                    <div className="row">
                                        {owner.sales_manager.map((manager, index) => {
                                            return (<div className="col-12" key={index}>
                                                <div
                                                    style={{minHeight: "85px", height: "85px"}}
                                                    className={`row mx-0 align-items-center user-info-div-main opportunity-info-div-main ${manager.id === this.props.customer?.point_customer && "active"}`}
                                                >
                                                    <div className="col-12">
                                                        <div className="user-icons-div">
                                    <span
                                        className="d-flex align-items-center justify-content-center rounded-circle text-uppercase">
                                      {getShortName(manager.first_name, manager.last_name)}
                                    </span>
                                                        </div>
                                                        <div className="user-info-div">
                                                            <h6>
                                                                {manager.first_name} {manager.last_name}
                                                            </h6>
                                                            <p className="mb-0">
                                                                {titleCase(manager.role)}
                                                            </p>
                                                            {manager.id === this.props.customer?.point_customer && (
                                                                <span
                                                                    className="point-details font-weight-bold position-absolute m-auto d-flex align-items-center">
                                        Point of Contact
                                      </span>)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>);
                                        })}
                                    </div>
                                </div>) : (<div className="col-12">
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
                                </div>)}
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <div className="row">
                                <div className="col-12">
                                            <h5 className="text-uppercase">SALES ASSISTANTS</h5>
                                        </div>
                                {owner.sales_assistant.length > 0 ? (<div className="col-12">
                                    <div className="row">
                                        {owner.sales_assistant.map((assitant, index) => {
                                            return (<div className="col-12" key={index}>
                                                <div
                                                    style={{minHeight: "85px", height: "85px"}}
                                                    className={`row mx-0 align-items-center user-info-div-main opportunity-info-div-main ${assitant.id === this.props.customer?.point_customer && "active"}`}
                                                >
                                                    <div className="col-12">
                                                        <div className="user-icons-div">
                                    <span
                                        className="d-flex align-items-center justify-content-center rounded-circle text-uppercase">
                                      {getShortName(assitant.first_name, assitant.last_name)}
                                    </span>
                                                        </div>
                                                        <div className="user-info-div">
                                                            <h6>
                                                                {assitant.first_name} {assitant.last_name}
                                                            </h6>
                                                            <p className="mb-0">
                                                                {titleCase(assitant.role)}
                                                            </p>
                                                            {assitant.id === this.props.customer?.point_customer && (
                                                                <span
                                                                    className="point-details font-weight-bold position-absolute m-auto d-flex align-items-center">
                                        Point of Contact
                                      </span>)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>);
                                        })}
                                    </div>
                                </div>) : (<div className="col-12">
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
                                </div>)}
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <div className="row">
                                <div className="col-12">
                                            <h5 className="text-uppercase">SALESPEOPLE</h5>
                                        </div>
                                {owner.sales_person.length > 0 ? (<div className="col-12">
                                    <div className="row">
                                        {owner.sales_person.map((person, index) => {
                                            return (<div className="col-12">
                                                <div
                                                    style={{minHeight: "85px", height: "85px"}}
                                                    className={`row mx-0 align-items-center user-info-div-main opportunity-info-div-main ${person.id === this.props.customer?.point_customer && "active"}`}
                                                >
                                                    <div className="col-12">
                                                        <div className="user-icons-div">
                                    <span
                                        className="d-flex align-items-center justify-content-center rounded-circle text-uppercase">
                                      {getShortName(person.first_name, person.last_name)}
                                    </span>
                                                        </div>
                                                        <div className="user-info-div">
                                                            <h6>
                                                                {person.first_name} {person.last_name}
                                                            </h6>
                                                            <p className="mb-0">
                                                                {titleCase(person.role)}
                                                            </p>
                                                            {person.id === this.props.customer?.point_customer && (
                                                                <span
                                                                    className="point-details font-weight-bold position-absolute m-auto d-flex align-items-center">
                                        Point of Contact
                                      </span>)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>);
                                        })}
                                    </div>
                                </div>) : (<div className="col-12">
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
                                </div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>);
    }
}

export default CustomerTeamInfoView;
