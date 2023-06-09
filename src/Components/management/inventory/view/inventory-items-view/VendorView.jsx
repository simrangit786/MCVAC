import React, { Component } from "react";
import {
  Button,
  Collapse,
  Dropdown,
  Form,
  Input,
  Menu,
  Select,
  Table,
} from "antd";
import { Image as Images } from "../../../../Images";
import { CaretRightOutlined } from "@ant-design/icons";
import { handleError } from "../../../../../Controller/Global";
import { withRouter } from "react-router-dom";
import { getInventoryVendorById } from "../../../../../Controller/api/inventoryServices";
import { history } from '../../../../../Controller/history';
import { reverse } from 'named-urls/src';
import { routes } from '../../../../../Controller/Routes';

const { Option, OptGroup } = Select;
const { Panel } = Collapse;

class VendorView extends Component {
  state = {
    newLoc: [],
  };
  componentDidMount() {
    getInventoryVendorById({ inventory_item: this.props.match.params.id })
      .then((res) => {
        this.setState({
          newLoc: res.data.results && res.data.results[0]?.vendor,
        });
      })
      .catch((err) => {
        handleError(err);
      });
    this.setState({
      selectValue:
        this.props.inventory?.uom_array &&
        this.props.inventory?.uom_array[0] &&
        this.props.inventory?.uom_array[0]?.id,
    });
  }

  handleChange = (value, option) => {
    this.setState({ selectValue: value, selectOption: option });
  };

  render() {
    const { inventory } = this.props;
    // const newItem = inventory?.uom_array?.find(i => {
    //     return (
    //         i.id === this.state.selectValue
    //     )
    // })
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
                <Input placeholder="Search" />
                <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                  <img
                    src={Images.search_icon_gray}
                    className="img-fluid"
                    alt="search icon"
                  />
                </Button>
              </Form>
            </div>
            <ul className="mb-0 d-flex align-items-center list-inline">
              {/*<li className="list-inline-item">*/}
              {/*<Select*/}
              {/*        dropdownClassName={'custom-uom-dropdown'}*/}
              {/*        placeholder="Unit of Measurement: pieces (pc)"*/}
              {/*        suffixIcon={*/}
              {/*            <img src={Images.arrow_small_gray_icon} alt={""} className="img-fluid"/>*/}
              {/*        }*/}
              {/*        className="unit-measurement-select"*/}
              {/*        onChange={this.handleChange}*/}
              {/*        value={this.state?.selectValue}*/}
              {/*    >*/}
              {/*        <OptGroup label="Universal UOM">*/}
              {/*            {inventory?.uom_array?.map(i => {*/}
              {/*                return (*/}
              {/*                    <Option value={i.id} key={i.id}><span className="check-icon-mark">*/}
              {/*                <img src={Images.check_icon_green} alt="" className="img-fluid"/>*/}
              {/*            </span> {i.name} ({i.symbol})</Option>*/}
              {/*                )*/}
              {/*            })}*/}
              {/*        </OptGroup>*/}
              {/*        /!* <OptGroup label="Custom UOM">*/}
              {/*            {inventory?.com?.map((i, idx) => {*/}
              {/*                return (*/}
              {/*                    <Option value={i.id} key={i + idx}> <span className="check-icon-mark">*/}
              {/*                    <img src={Images.check_icon_green} alt="" className="img-fluid"/>*/}
              {/*                    </span>{i.name}</Option>*/}
              {/*                )*/}
              {/*            })}*/}
              {/*        </OptGroup> *!/*/}
              {/*    </Select>*/}
              {/*</li>*/}
              <li className="list-inline-item">
                {this.props.editBtn ? (
                  <Button className="edit-btn-summary"
                  onClick={() =>
                    history.push({
                      pathname: reverse(routes.dashboard.management.inventory.inventory_items.edit,
                        { id: this.props.match.params.id }
                      ),
                      editTab: "6"
                    })
                  }
                  >
                    <img
                      src={Images.pencil_green}
                      alt=""
                      className="img-fluid"
                    />
                    Edit
                  </Button>
                ) : (
                  <Button
                    onClick={() => this.props.tabChange("4")}
                    className="view-all-btn text-uppercase"
                  >
                    VIEW ALL{" "}
                  </Button>
                )}
              </li>
            </ul>
          </div>
        </div>
        <div
          className={`col-12 my-3 ${
            this.props.editBtn ? "design-update-collapse" : ""
          }`}
        >
          {/*<Collapse*/}
          {/*    className="inner-collapse-section"*/}
          {/*    accordion*/}
          {/*    defaultActiveKey={['1']}*/}
          {/*    expandIcon={({isActive}) => <CaretRightOutlined*/}
          {/*        rotate={isActive ? 90 : 0}/>}*/}

          {/*>*/}
          {this.state.newLoc?.length > 0 ? (
            this.state.newLoc?.map((i) => {
              const foundItem = this.props.inventory?.uom_array?.find(
                (n) => n.id === i.vendor_uom
              );
              // console.log(foundItem, "foundItem");
              return (
                <div className="row mx-0 margin-btn-30">
                  <div className="col-12">
                    <div className="row m-0  site-details-row-card site-details-row-card-2  position-relative">
                      <div className="col-12 col-sm-3">
                        <div className="site-name-location">
                          <img
                            src={Images.waste_management_black_icon}
                            alt=""
                            className="img-fluid"
                          />
                          <span>{i?.vendor?.name}</span>
                        </div>
                      </div>
                      <div className="col-12 col-sm-9 pb-0">
                        <div className="row">
                          <div className="col-12 col-sm-4">
                            <h6 className="text-uppercase">ADDRESS</h6>
                            <p className="mb-0">{`${
                              i.vendor?.main_address?.street_address || ""
                            } ${i.vendor?.main_address?.name || ""} ${
                              i.vendor?.main_address?.city || ""
                            } ${i.vendor?.main_address?.state || ""} ${
                              i.vendor?.main_address?.country || ""
                            }`}</p>
                          </div>
                          <div className="col-12 col-sm-4">
                            <h6 className="text-uppercase">EMAIL ADDRESS</h6>
                            <p className="mb-0">
                              {i.vendor?.main_address?.email || "-"}
                            </p>
                          </div>
                          <div className="col-12 col-sm-4">
                            <h6 className="text-uppercase">PHONE NUMBER</h6>
                            <p className="mb-0">
                              {i.vendor?.main_address?.phone || "-"}
                            </p>
                          </div>
                          <div className="col-12 Quantities-details-div">
                            <h6 className="text-uppercase">COSTS</h6>
                            <ul className="list-inline mb-0">
                              <li className="list-inline-item">
                                Reference Number:
                              </li>
                              <li className="list-inline-item">
                                {Math.round(i.reference_number) || "-"}
                              </li>
                            </ul>
                            <ul className="list-inline mb-0">
                              <li className="list-inline-item">
                                Unit of Measurement:
                              </li>
                              <li className="list-inline-item">
                                {foundItem?.symbol}
                              </li>
                            </ul>
                            <ul className="list-inline mb-0">
                              <li className="list-inline-item">Unit Cost:</li>
                              <li className="list-inline-item font-weight-bold">
                                ${i.unit_cost || "-"}
                                {foundItem?.symbol && "/"}
                                {foundItem?.symbol && foundItem?.symbol}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      {/* <Dropdown overlayClassName="add-remove-dropdown-main" overlay={this.menu}
                                                      trigger={['click']}>
                                                <Button
                                                    className="ant-dropdown-link ant-dropdown-link-2 border-0 p-0 bg-transparent shadow-none"
                                                    onClick={e => e.preventDefault()}>
                                                    <img src={Images.more_black} alt="" className="img-fluid"/>
                                                </Button>
                                            </Dropdown> */}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-12">
              <div className="row mx-0 common-card-upload">
                <div className="col-12 text-center">
                  <img
                    src={Images.vendor_gray_icon}
                    alt={""}
                    className="img-fluid"
                  />
                  <h6 className="mb-0 color-gray-3">No Vendors</h6>
                </div>
              </div>
            </div>
          )}
          {/*</Collapse>*/}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(VendorView);
