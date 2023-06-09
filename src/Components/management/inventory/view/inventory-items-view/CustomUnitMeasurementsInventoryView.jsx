import React, {Component} from "react";
import {Breadcrumb, Button, Form, Input, Select} from "antd";
import {Image as Images} from "../../../../Images";
import {Link} from "react-router-dom";
import { reverse } from 'named-urls';
import { routes } from '../../../../../Controller/Routes';
import { history } from '../../../../../Controller/history';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';

// const InputGroup = Input.Group;
// const {Option} = Select;

class CustomUnitMeasurementsInventoryView extends Component {
    render() {
        const {inventory} = this.props;
        return (
            <React.Fragment>
                <div className="col-12">
                    <div
                        className={`row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header ${
                            this.props.editBtn ? "design-update-bar" : ""
                        }`}
                    >
                        <div className="search-bar-div d-flex align-items-center">
                            <Form className="position-relative">
                                <Input placeholder="Search"/>
                                <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto" 
                                 
                                >
                                    <img
                                        src={Images.search_icon_gray}
                                        className="img-fluid"
                                        alt="search icon"
                                    />
                                </Button>
                            </Form>
                        </div>
                        <ul className="mb-0 d-flex align-items-center list-inline">
                            <li className="list-inline-item">
                                {this.props.editBtn ? (
                                    <Button className="edit-btn-summary" 
                                    onClick={() =>
                                      history.push({
                                        pathname: reverse(routes.dashboard.management.inventory.inventory_items.edit,
                                          { id: this.props.match.params.id }
                                        ),
                                        editTab: "2"
                                      })
                                    }>
                                        <img
                                            src={Images.pencil_green}
                                            alt=""
                                            className="img-fluid"
                                        />
                                        Edit
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => this.props.tabChange("2")}
                                        className="view-all-btn text-uppercase"
                                    >
                                        VIEW ALL{" "}
                                    </Button>
                                )}
                            </li>
                        </ul>
                    </div>

                    <div className="row summary-collapse-inner-row-main pb-0 px-0">
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <h6 className="text-uppercase">Base Unit Of Measurement</h6>
                            <h5>-</h5>
                        </div>
                    </div>

                    {inventory?.com?.length > 0 ? (
                            <div className="row">
                                <div className="col-12 mt-2 mb-3">
                                     {/*<div className="row mx-0 measurement-unit-card main-inner-form">
                                       <div className="unit-card-head">
                                         <h6 className="mb-0 text-uppercase">
                                         <img
                                             src={Images.measuring_tape_black}
                                             alt=""
                                             className="img-fluid"
                                           />
                                           <span>{i.name}</span>
                                         </h6>
                                       </div>
                                       <div className="unit-card-details position-relative">
                                         <div className="row">
                                           <div className="col-12">
                                             <h6>Conversion</h6>
                                           </div>
                                         </div>
                                         <div className="row">
                                           <div className="col-12 col-sm-4 position-relative">
                                             <InputGroup compact>
                                               <Input
                                                 disabled={true}
                                                 style={{
                                                   width: "40%",
                                                   borderRight: "0",
                                                   borderRadius: "6px 0 0 6px",
                                                 }}
                                                 defaultValue="1"
                                              />
                                               <Input
                                                 disabled={true}
                                                 style={{
                                                   width: "50%",
                                                   borderLeft: "0",
                                                   borderRadius: "0 6px 6px 0",
                                                 }}
                                                 defaultValue={i.abbreviation}
                                               />
                                             </InputGroup>
                                             <span className="equal-sign position-absolute">
                                               =
                                             </span>
                                           </div>
                                           <div className="col-12 col-sm-4">
                                             <InputGroup compact>
                                               <Input
                                                 disabled={true}
                                                 style={{
                                                   width: "25%",
                                                   borderRight: "0",
                                                   borderRadius: "6px 0 0 6px",
                                                 }}
                                                 defaultValue={i.factor}
                                               />
                                               <Select
                                                 className="custom-pound-select"
                                                 disabled={true}
                                                 style={{ width: "60%" }}
                                                 suffixIcon={
                                                   <img
                                                     src={Images.caret_down_small_select}
                                                     alt=""
                                                     className="img-fluid"
                                                   />
                                                 }
                                                 defaultValue="a"
                                               >
                                                 <Option value="a">{i.uom.symbol}</Option>
                                               </Select>
                                             </InputGroup>
                                           </div>
                                         </div>
                                       </div>
                                     </div>*/}
                                    <div className="col-12">
                                                <div className="row">
                                                    <div className="col-12 my-3">
                                                        <div className="row">
                                                            <div className="col-12 custom-uom-table custom-uom-table-2">
                                                                <table className="table table-bordered">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>custom uom name</th>
                                                                            <th>abbreviation</th>
                                                                            <th>conversion</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                    {inventory?.com?.map((i) => {
                                                                        return(
                                                                             <tr>
                                                                        <td>{i.name}</td>
                                                                        <td>U</td>
                                                                        <td>
                                                                            <div
                                                                                className="w-100 d-flex align-items-center justify-content-between">
                                        <span>
                                          1{i.abbreviation} = {i.factor}
                                            {i.uom.symbol}
                                        </span>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                        );
                                                                    })}
                                                                    {/* <tr>
                                                                    <td>My UOM 1</td>
                                                                    <td>U</td>
                                                                    <td>
                                                                        <div
                                                                            className="w-100 d-flex align-items-center justify-content-between">
                                                                            <span>
                                                                            1U = 1.5 g
                                                                        </span>
                                                                        </div>
                                                                    </td>
                                                                </tr> */}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                </div>
                            </div>
                        ) : (
                            <div className="row mx-0 mt-3 no-data-card-row align-items-center justify-content-center">
                                <div className="col-12 text-center">
                                    <img
                                        src={Images.measuring_tape_gray_new}
                                        alt=""
                                        className="img-fluid"
                                    />
                                    <h6 className="mb-0 color-gray-3">No Custom Units of Measurement</h6>
                                </div>
                            </div>
                        )}
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(CustomUnitMeasurementsInventoryView);
