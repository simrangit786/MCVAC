import React, { Component } from "react";
import { Button, Collapse, Form, Input, Select } from "antd";
import { Image as Images } from "../../../../Images";
import { CaretRightOutlined } from "@ant-design/icons";
import { getDisposalVendorById } from "../../../../../Controller/api/disposalServices";
import { handleError } from "../../../../../Controller/Global";
import { withRouter } from "react-router-dom";

const { Option, OptGroup } = Select;
const { Panel } = Collapse;

class DropOffFacilitiesView extends Component {
  state = {
    newLoc: [],
  };

  componentDidMount() {
    getDisposalVendorById({ disposal: this.props.match.params.id })
      .then((res) => {
        // console.log(res.data.results);
        this.setState({
          newLoc: res.data.results && res.data.results[0]?.vendor,
        });
      })
      .catch((err) => {
        handleError(err);
      });
    this.setState({
      selectValue:
        this.props.disposal?.uom_array &&
        this.props.disposal?.uom_array[0] &&
        this.props.disposal?.uom_array[0]?.id,
    });
  }

  handleChange = (value, option) => {
    this.setState({ selectValue: value, selectOption: option });
  };

  render() {
    const { disposal } = this.props;
    const newItem = disposal?.uom_array?.find((i) => {
      return i.id === this.state.selectValue;
    });
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
              <li className="list-inline-item">
                <Select
                  dropdownClassName={"custom-uom-dropdown"}
                  placeholder="Unit of Measurement: pieces (pc)"
                  suffixIcon={
                    <img
                      src={Images.arrow_small_gray_icon}
                      alt={""}
                      className="img-fluid"
                    />
                  }
                  className="unit-measurement-select"
                  onChange={this.handleChange}
                  value={this.state?.selectValue}
                >
                  <OptGroup label="Universal UOM">
                    {disposal?.uom_array?.map((i) => {
                      return (
                        <Option value={i.id} key={i.id}>
                          <span className="check-icon-mark">
                            <img
                              src={Images.check_icon_green}
                              alt=""
                              className="img-fluid"
                            />
                          </span>{" "}
                          {i.name} ({i.symbol})
                        </Option>
                      );
                    })}
                  </OptGroup>
                  {/* <OptGroup label="Custom UOM">
                                        {inventory?.com?.map((i, idx) => {
                                            return (
                                                <Option value={i.id} key={i + idx}> <span className="check-icon-mark">
                                                <img src={Images.check_icon_green} alt="" className="img-fluid"/>
                                                </span>{i.name}</Option>
                                            )
                                        })}
                                    </OptGroup> */}
                </Select>
              </li>
              <li className="list-inline-item">
                {this.props.editBtn ? (
                  <Button className="edit-btn-summary">
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
          <Collapse
            className="inner-collapse-section"
            accordion
            defaultActiveKey={["1"]}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
          >
            {this.state.newLoc?.length > 0 ? (
              this.state.newLoc.map((i) => {
                return (
                  <Panel
                    header={
                      <div className="col-12">
                        <div
                          style={{ minHeight: "50px" }}
                          className="row m-0 site-details-row-card site-details-row-card-2"
                        >
                          <div className="col-12 border-0">
                            <div className="site-name-location">
                              <img
                                src={Images.waste_management_black_icon}
                                alt=""
                                className="img-fluid"
                              />
                              <span>{i?.vendor?.name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                    key={i.id}
                  >
                    <div className="row summary-collapse-inner-row-main px-0 pb-0">
                      <div className="col-12">
                        <div className="row contact-green-small-heading position-relative">
                          <h5 className="mb-0">Address Information</h5>
                        </div>
                        <div className="row site-details-row-card site-details-row-card-2  position-relative">
                          <div className="col-12 col-sm-3">
                            <div className="site-name-location">
                              <img
                                src={Images.location_black_icon}
                                alt=""
                                className="img-fluid"
                              />
                              <span>{i.vendor.main_address?.city}</span>
                            </div>
                          </div>
                          <div className="col-12 col-sm-3">
                            <h6 className="text-uppercase">ADDRESS</h6>
                            <p className="mb-0">{`${
                              i.vendor?.main_address?.street_address || ""
                            } ${i.vendor?.main_address?.name || ""} ${
                              i.vendor?.main_address?.city || ""
                            } ${i.vendor?.main_address?.state || ""} ${
                              i.vendor?.main_address?.country || ""
                            }`}</p>
                          </div>
                          <div className="col-12 col-sm-3">
                            <h6 className="text-uppercase">EMAIL ADDRESS</h6>
                            <p className="mb-0">
                              {i.vendor?.main_address?.email || "-"}
                            </p>
                          </div>
                          <div className="col-12 col-sm-3">
                            <h6 className="text-uppercase">PHONE NUMBER</h6>
                            <p className="mb-0">
                              {i.vendor?.main_address?.phone || "-"}
                            </p>
                          </div>
                        </div>
                        <div className="row contact-green-small-heading position-relative mt-3">
                          <h5 className="mb-0">Unit Cost</h5>
                        </div>
                        <div className="row mt-3 position-relative">
                          <div className="col-12 col-sm-3 p-0">
                            <h6 className="text-uppercase">
                              item reference number *
                            </h6>
                            <p className="mb-0">
                              {Math.round(i.reference_number) || "-"}
                            </p>
                          </div>
                          <div className="col-12 col-sm-3">
                            <h6 className="text-uppercase">unit cost</h6>
                            <p className="mb-0">
                              {`$${i.unit_cost}/${newItem?.symbol}` || "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Panel>
                );
              })
            ) : (
              <div className="col-12">
                <div className="row mx-0 common-card-upload">
                  <div className="col-12 text-center">
                    <img
                      src={Images.location_gray}
                      alt={""}
                      className="img-fluid"
                    />
                    <h6 className="mb-0">No External Locations</h6>
                  </div>
                </div>
              </div>
            )}
          </Collapse>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(DropOffFacilitiesView);
