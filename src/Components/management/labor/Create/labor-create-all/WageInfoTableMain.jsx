import React, { Component } from "react";
import { Button, Collapse, Dropdown, Form, InputNumber, Menu } from "antd";
import { CaretRightOutlined, EditOutlined } from "@ant-design/icons";
import { Image as Images } from "../../../../Images";
import {
  formatMoney,
  getPercentedValue,
  parseMoney,
} from "../../../../../Controller/utils";

const { Panel } = Collapse;

class WageInfoTableMain extends Component {
  handleCellChange = (value, i, name) => {
    i[name] = value;
    this.props.handleChangeFields(i);
  };
  menu = (i, e) => (
    <Menu>
      <Menu.Item
        onClick={() => {
          // this.props.handleRemove(i);
          this.props.handleVisible(true, i);
        }}
      >
        Delete
      </Menu.Item>
    </Menu>
  );
  getTotalPrices = (i) => {
    let obj = {
      straight_time_total: (
        parseFloat(i.straight_time_health) +
          parseFloat(i.straight_time_benefits) +
          parseFloat(
            getPercentedValue(0.8, i.straight_time_multiplier * i.base_rate)
          ) +
          parseFloat(
            getPercentedValue(7.65, i.straight_time_multiplier * i.base_rate)
          ) +
          parseFloat(
            getPercentedValue(7, i.straight_time_multiplier * i.base_rate)
          ) +
          parseFloat(i.straight_time_multiplier * i.base_rate) || 0
      ).toFixed(2),
      over_time_total: (
        parseFloat(i.over_time_health) +
          parseFloat(i.over_time_benefits) +
          parseFloat(
            getPercentedValue(0.8, i.over_time_multiplier * i.base_rate)
          ) +
          parseFloat(
            getPercentedValue(7.65, i.over_time_multiplier * i.base_rate)
          ) +
          parseFloat(
            getPercentedValue(7, i.over_time_multiplier * i.base_rate)
          ) +
          parseFloat(i.over_time_multiplier * i.base_rate) || 0
      ).toFixed(2),
      double_time_total: (
        parseFloat(i.double_time_health) +
          parseFloat(i.double_time_benefits) +
          parseFloat(
            getPercentedValue(0.8, i.double_time_multiplier * i.base_rate)
          ) +
          parseFloat(
            getPercentedValue(7.65, i.double_time_multiplier * i.base_rate)
          ) +
          parseFloat(
            getPercentedValue(7, i.double_time_multiplier * i.base_rate)
          ) +
          parseFloat(i.double_time_multiplier * i.base_rate) || 0
      ).toFixed(2),
      off_shift_total: (
        parseFloat(i.off_shift_health) +
          parseFloat(i.off_shift_benefits) +
          parseFloat(
            getPercentedValue(0.8, i.off_shift_multiplier * i.base_rate)
          ) +
          parseFloat(
            getPercentedValue(7.65, i.off_shift_multiplier * i.base_rate)
          ) +
          parseFloat(
            getPercentedValue(7, i.off_shift_multiplier * i.base_rate)
          ) +
          parseFloat(i.off_shift_multiplier * i.base_rate) || 0
      ).toFixed(2),
      night_time_off_shift_total: (
        parseFloat(i.night_time_off_shift_health) +
          parseFloat(i.night_time_off_shift_benefits) +
          parseFloat(
            getPercentedValue(
              0.8,
              i.night_time_off_shift_multiplier * i.base_rate
            )
          ) +
          parseFloat(
            getPercentedValue(
              7.65,
              i.night_time_off_shift_multiplier * i.base_rate
            )
          ) +
          parseFloat(
            getPercentedValue(
              7,
              i.night_time_off_shift_multiplier * i.base_rate
            )
          ) +
          parseFloat(i.night_time_off_shift_multiplier * i.base_rate) || 0
      ).toFixed(2),
    };
    return obj;
  };

  render() {
    let { labors, viewOnly } = this.props;
    labors = labors || [];
    return (
      <React.Fragment>
        <div className="col-12 table-responsive main-table-div position-relative wage-table">
          <div className="row mx-0 custom-table-main-row custom-table-main-row-wage-info-main">
            <div className="col-12 custom-table-change">
              <div className="row">
                <div className="col-12">
                  <div className="row custom-table-header">
                    <div className="custom-table-cell-th custom-table-cell-th-1">
                      <div className="custom-th-heading">Cost Type</div>
                    </div>
                    <div className="custom-table-cell-th custom-table-cell-th-2">
                      <div className="custom-th-heading">Multiplier</div>
                    </div>
                    <div className="custom-table-cell-th custom-table-cell-th-3">
                      <div className="custom-th-heading">Base Rate</div>
                    </div>
                    <div className="custom-table-cell-th custom-table-cell-th-4">
                      <div className="custom-th-heading">
                        Wc
                        <br />
                        <small>(7%)</small>
                      </div>
                    </div>
                    <div className="custom-table-cell-th custom-table-cell-th-5">
                      <div className="custom-th-heading">
                        Er Taxes
                        <br />
                        <small>(7.65%)</small>
                      </div>
                    </div>
                    <div className="custom-table-cell-th custom-table-cell-th-6">
                      <div className="custom-th-heading">
                        Suta/Futa
                        <br />
                        <small>(0.8%)</small>
                      </div>
                    </div>
                    <div className="custom-table-cell-th custom-table-cell-th-7">
                      <div className="custom-th-heading">Benefits</div>
                    </div>
                    <div className="custom-table-cell-th custom-table-cell-th-8">
                      <div className="custom-th-heading">
                        Healthcare
                        <br />
                        <small>(Hourly)</small>
                      </div>
                    </div>
                    <div style={{
                        width:'12.2%'
                    }} className="custom-table-cell-th custom-table-cell-th-9">
                      <div className="custom-th-heading">Per Hour Total</div>
                    </div>
                  </div>
                </div>
                <div className="col-12 custom-table-body p-0">
                  <Collapse
                    accordion
                    defaultActiveKey={"0"}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                    className="custom-table-collapse-main"
                  >
                    {labors.map((i, index) => (
                      <Panel
                        key={i.wage_type}
                        header={
                          <React.Fragment>
                            <div
                              className={
                                viewOnly
                                  ? "wage-table-view custom-table-row custom-table-row-level-1 row mx-0 wage-collapse"
                                  : "wage-table-edit custom-table-row custom-table-row-level-1 row mx-0 wage-collapse"
                              }
                            >
                              <div className="custom-table-cell-td wage-info-collapse-td wage-collapse-first-col">
                                <div>{i.wage_type}</div>
                              </div>
                              <div className="custom-table-cell-td custom-table-cell-td-4 background-white-div justify-content-center d-flex">
                                <div className="px-3">7%</div>
                              </div>
                              <div className="custom-table-cell-td custom-table-cell-td-5 background-white-div justify-content-center d-flex">
                                <span className="px-3">7.65%</span>
                              </div>
                              <div className="custom-table-cell-td custom-table-cell-td-6 background-white-div justify-content-center d-flex">
                                <span className="px-3">0.8%</span>
                              </div>
                              <div className="custom-table-cell-td custom-table-cell-td-7 wage-info-collapse-td-second wage-collapse-col" />
                              <div className="custom-table-cell-td custom-table-cell-td-9">
                                {!viewOnly && (
                                  <div className="px-3">
                                    <Dropdown
                                      trigger="click"
                                      overlay={this.menu(i)}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <img
                                        src={Images.eva_more_elisis}
                                        alt={""}
                                        className={"img-fluid"}
                                      />
                                    </Dropdown>
                                  </div>
                                )}
                              </div>
                            </div>
                          </React.Fragment>
                        }
                        key={index}
                      >
                        <div className="custom-table-row custom-table-row-level-1 row mx-0">
                          <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color background-white-div">
                            <div className="px-3">Straight Time</div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-2 background-white-div">
                            <div className="editalble-form-data">
                              <Form className="position-relative">
                                <InputNumber
                                  disabled={viewOnly}
                                  onChange={(e) =>
                                    this.handleCellChange(
                                      e,
                                      i,
                                      "straight_time_multiplier"
                                    )
                                  }
                                  value={i.straight_time_multiplier}
                                  placeholder={0}
                                />
                                <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                                  <EditOutlined />
                                </Button>
                              </Form>
                              {/*<span className="px-3">8</span>*/}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-3 justify-content-end d-flex">
                            <div className="px-3">
                              {formatMoney(
                                (
                                  i.straight_time_multiplier * i.base_rate
                                ).toFixed(2)
                              )}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-4 justify-content-end d-flex">
                            <div>
                              {formatMoney(
                                getPercentedValue(
                                  7,
                                  i.straight_time_multiplier * i.base_rate
                                )
                              )}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-5 justify-content-end d-flex">
                            <div className="px-3">
                              {formatMoney(
                                getPercentedValue(
                                  7.65,
                                  i.straight_time_multiplier * i.base_rate
                                )
                              )}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-6 justify-content-end d-flex">
                            <div>
                              {formatMoney(
                                getPercentedValue(
                                  0.8,
                                  i.straight_time_multiplier * i.base_rate
                                )
                              )}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-7 background-white-div">
                            <div className="editalble-form-data">
                              <Form className="position-relative">
                                <InputNumber
                                  formatter={formatMoney}
                                  parser={parseMoney}
                                  disabled={viewOnly}
                                  precision={2}
                                  onChange={(e) =>
                                    this.handleCellChange(
                                      e,
                                      i,
                                      "straight_time_benefits"
                                    )
                                  }
                                  value={i.straight_time_benefits}
                                  placeholder={0}
                                />
                                <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                                  <EditOutlined />
                                </Button>
                              </Form>
                              {/*<span className="px-3">8</span>*/}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-8 background-white-div">
                            <div className="editalble-form-data">
                              <Form className="position-relative">
                                <InputNumber
                                  formatter={formatMoney}
                                  parser={parseMoney}
                                  disabled={viewOnly}
                                  precision={2}
                                  onChange={(e) =>
                                    this.handleCellChange(
                                      e,
                                      i,
                                      "straight_time_health"
                                    )
                                  }
                                  value={i.straight_time_health}
                                  placeholder={0}
                                />
                                <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                                  <EditOutlined />
                                </Button>
                              </Form>
                              {/*<span className="px-3">8</span>*/}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-9 gray-2-color">
                            <div className="px-3">
                              {formatMoney(
                                this.getTotalPrices(i).straight_time_total
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="custom-table-row custom-table-row-level-1 row mx-0">
                          <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color background-white-div">
                            <div className="px-3">Over Time</div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-2 background-white-div">
                            <div className="editalble-form-data">
                              <Form className="position-relative">
                                <InputNumber
                                  disabled={viewOnly}
                                  onChange={(e) =>
                                    this.handleCellChange(
                                      e,
                                      i,
                                      "over_time_multiplier"
                                    )
                                  }
                                  value={i.over_time_multiplier}
                                  placeholder={0}
                                />
                                <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                                  <EditOutlined />
                                </Button>
                              </Form>
                              {/*<span className="px-3">8</span>*/}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-3 justify-content-end d-flex">
                            <div className="px-3">
                              {formatMoney(
                                (i.over_time_multiplier * i.base_rate).toFixed(
                                  2
                                )
                              )}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-4 justify-content-end d-flex">
                            <div>
                              {formatMoney(
                                getPercentedValue(
                                  7,
                                  i.over_time_multiplier * i.base_rate
                                )
                              )}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-5 justify-content-end d-flex">
                            <div className="px-3">
                              {formatMoney(
                                getPercentedValue(
                                  7.65,
                                  i.over_time_multiplier * i.base_rate
                                )
                              )}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-6 justify-content-end d-flex">
                            <div>
                              {formatMoney(
                                getPercentedValue(
                                  0.8,
                                  i.over_time_multiplier * i.base_rate
                                )
                              )}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-7 background-white-div">
                            <div className="editalble-form-data">
                              <Form className="position-relative">
                                <InputNumber
                                  formatter={formatMoney}
                                  parser={parseMoney}
                                  disabled={viewOnly}
                                  precision={2}
                                  onChange={(e) =>
                                    this.handleCellChange(
                                      e,
                                      i,
                                      "over_time_benefits"
                                    )
                                  }
                                  value={i.over_time_benefits}
                                  placeholder={0}
                                />
                                <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                                  <EditOutlined />
                                </Button>
                              </Form>
                              {/*<span className="px-3">8</span>*/}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-8 background-white-div">
                            <div className="editalble-form-data">
                              <Form className="position-relative">
                                <InputNumber
                                  formatter={formatMoney}
                                  parser={parseMoney}
                                  disabled={viewOnly}
                                  precision={2}
                                  onChange={(e) =>
                                    this.handleCellChange(
                                      e,
                                      i,
                                      "over_time_health"
                                    )
                                  }
                                  value={i.over_time_health}
                                  placeholder={0}
                                />
                                <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                                  <EditOutlined />
                                </Button>
                              </Form>
                              {/*<span className="px-3">8</span>*/}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-9 gray-2-color">
                            <div className="px-3">
                              {formatMoney(
                                this.getTotalPrices(i).over_time_total
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="custom-table-row custom-table-row-level-1 row mx-0">
                          <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color background-white-div">
                            <div className="px-3">Double Time</div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-2 background-white-div">
                            <div className="editalble-form-data">
                              <Form className="position-relative">
                                <InputNumber
                                  disabled={viewOnly}
                                  onChange={(e) =>
                                    this.handleCellChange(
                                      e,
                                      i,
                                      "double_time_multiplier"
                                    )
                                  }
                                  value={i.double_time_multiplier}
                                  placeholder={0}
                                />
                                <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                                  <EditOutlined />
                                </Button>
                              </Form>
                              {/*<span className="px-3">8</span>*/}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-3 justify-content-end d-flex">
                            <div className="px-3">
                              {formatMoney(
                                (
                                  i.double_time_multiplier * i.base_rate
                                ).toFixed(2)
                              )}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-4 justify-content-end d-flex">
                            <div>
                              {formatMoney(
                                getPercentedValue(
                                  7,
                                  i.double_time_multiplier * i.base_rate
                                )
                              )}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-5 justify-content-end d-flex">
                            <div className="px-3">
                              {formatMoney(
                                getPercentedValue(
                                  7.65,
                                  i.double_time_multiplier * i.base_rate
                                )
                              )}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-6 justify-content-end d-flex">
                            <div>
                              {formatMoney(
                                getPercentedValue(
                                  0.8,
                                  i.double_time_multiplier * i.base_rate
                                )
                              )}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-7 background-white-div">
                            <div className="editalble-form-data">
                              <Form className="position-relative">
                                <InputNumber
                                  formatter={formatMoney}
                                  parser={parseMoney}
                                  disabled={viewOnly}
                                  precision={2}
                                  onChange={(e) =>
                                    this.handleCellChange(
                                      e,
                                      i,
                                      "double_time_benefits"
                                    )
                                  }
                                  value={i.double_time_benefits}
                                  placeholder={0}
                                />
                                <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                                  <EditOutlined />
                                </Button>
                              </Form>
                              {/*<span className="px-3">8</span>*/}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-8 background-white-div">
                            <div className="editalble-form-data">
                              <Form className="position-relative">
                                <InputNumber
                                  formatter={formatMoney}
                                  parser={parseMoney}
                                  disabled={viewOnly}
                                  precision={2}
                                  onChange={(e) =>
                                    this.handleCellChange(
                                      e,
                                      i,
                                      "double_time_health"
                                    )
                                  }
                                  value={i.double_time_health}
                                  placeholder={0}
                                />
                                <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                                  <EditOutlined />
                                </Button>
                              </Form>
                              {/*<span className="px-3">8</span>*/}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-9 gray-2-color">
                            <div className="px-3">
                              {formatMoney(
                                this.getTotalPrices(i).double_time_total
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="custom-table-row custom-table-row-level-1 row mx-0">
                          <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color background-white-div">
                            <div className="px-3">Off Shift</div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-2 background-white-div">
                            <div className="editalble-form-data">
                              <Form className="position-relative">
                                <InputNumber
                                  disabled={viewOnly}
                                  onChange={(e) =>
                                    this.handleCellChange(
                                      e,
                                      i,
                                      "off_shift_multiplier"
                                    )
                                  }
                                  value={i.off_shift_multiplier}
                                  placeholder={0}
                                />
                                <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                                  <EditOutlined />
                                </Button>
                              </Form>
                              {/*<span className="px-3">8</span>*/}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-3 justify-content-end d-flex">
                            <div className="px-3">
                              {formatMoney(
                                (i.off_shift_multiplier * i.base_rate).toFixed(
                                  2
                                )
                              )}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-4 justify-content-end d-flex">
                            <div>
                              {formatMoney(
                                getPercentedValue(
                                  7,
                                  i.off_shift_multiplier * i.base_rate
                                )
                              )}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-5 justify-content-end d-flex">
                            <div className="px-3">
                              {formatMoney(
                                getPercentedValue(
                                  7.65,
                                  i.off_shift_multiplier * i.base_rate
                                )
                              )}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-6 justify-content-end d-flex">
                            <div>
                              {formatMoney(
                                getPercentedValue(
                                  0.8,
                                  i.off_shift_multiplier * i.base_rate
                                )
                              )}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-7 background-white-div">
                            <div className="editalble-form-data">
                              <Form className="position-relative">
                                <InputNumber
                                  formatter={formatMoney}
                                  parser={parseMoney}
                                  disabled={viewOnly}
                                  precision={2}
                                  onChange={(e) =>
                                    this.handleCellChange(
                                      e,
                                      i,
                                      "off_shift_benefits"
                                    )
                                  }
                                  value={i.off_shift_benefits}
                                  placeholder={0}
                                />
                                <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                                  <EditOutlined />
                                </Button>
                              </Form>
                              {/*<span className="px-3">8</span>*/}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-8 background-white-div">
                            <div className="editalble-form-data">
                              <Form className="position-relative">
                                <InputNumber
                                  formatter={formatMoney}
                                  parser={parseMoney}
                                  disabled={viewOnly}
                                  precision={2}
                                  onChange={(e) =>
                                    this.handleCellChange(
                                      e,
                                      i,
                                      "off_shift_health"
                                    )
                                  }
                                  value={i.off_shift_health}
                                  placeholder={0}
                                />
                                <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                                  <EditOutlined />
                                </Button>
                              </Form>
                              {/*<span className="px-3">8</span>*/}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-9 gray-2-color">
                            <div className="px-3">
                              {formatMoney(
                                this.getTotalPrices(i).off_shift_total
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="custom-table-row custom-table-row-level-1 row mx-0">
                          <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color background-white-div">
                            <div className="px-3">Night Time Off Shift</div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-2 background-white-div">
                            <div className="editalble-form-data">
                              <Form className="position-relative">
                                <InputNumber
                                  disabled={viewOnly}
                                  onChange={(e) =>
                                    this.handleCellChange(
                                      e,
                                      i,
                                      "night_time_off_shift_multiplier"
                                    )
                                  }
                                  value={i.night_time_off_shift_multiplier}
                                  placeholder={0}
                                />
                                <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                                  <EditOutlined />
                                </Button>
                              </Form>
                              {/*<span className="px-3">8</span>*/}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-3 justify-content-end d-flex">
                            <div className="px-3">
                              {formatMoney(
                                (
                                  i.night_time_off_shift_multiplier *
                                  i.base_rate
                                ).toFixed(2) || 0
                              )}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-4 justify-content-end d-flex">
                            <div>
                              {formatMoney(
                                getPercentedValue(
                                  7,
                                  i.night_time_off_shift_multiplier *
                                    i.base_rate
                                )
                              )}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-5 justify-content-end d-flex">
                            <div className="px-3">
                              {formatMoney(
                                getPercentedValue(
                                  7.65,
                                  i.night_time_off_shift_multiplier *
                                    i.base_rate
                                )
                              )}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-6 justify-content-end d-flex">
                            <div>
                              {formatMoney(
                                getPercentedValue(
                                  0.8,
                                  i.night_time_off_shift_multiplier *
                                    i.base_rate
                                )
                              )}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-7 background-white-div">
                            <div className="editalble-form-data">
                              <Form className="position-relative">
                                <InputNumber
                                  formatter={formatMoney}
                                  parser={parseMoney}
                                  disabled={viewOnly}
                                  precision={2}
                                  onChange={(e) =>
                                    this.handleCellChange(
                                      e,
                                      i,
                                      "night_time_off_shift_benefits"
                                    )
                                  }
                                  value={i.night_time_off_shift_benefits}
                                  placeholder={0}
                                />
                                <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                                  <EditOutlined />
                                </Button>
                              </Form>
                              {/*<span className="px-3">8</span>*/}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-8 background-white-div">
                            <div className="editalble-form-data">
                              <Form className="position-relative">
                                <InputNumber
                                  formatter={formatMoney}
                                  parser={parseMoney}
                                  disabled={viewOnly}
                                  precision={2}
                                  onChange={(e) =>
                                    this.handleCellChange(
                                      e,
                                      i,
                                      "night_time_off_shift_health"
                                    )
                                  }
                                  value={i.night_time_off_shift_health}
                                  placeholder={0}
                                />
                                <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                                  <EditOutlined />
                                </Button>
                              </Form>
                              {/*<span className="px-3">8</span>*/}
                            </div>
                          </div>
                          <div className="custom-table-cell-td custom-table-cell-td-9 gray-2-color">
                            <div className="px-3">
                              {formatMoney(
                                this.getTotalPrices(i)
                                  .night_time_off_shift_total
                              )}
                            </div>
                          </div>
                        </div>
                      </Panel>
                    ))}
                  </Collapse>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*<div className="col-12 mb-lg-3 mb-md-4 mb-sm-3">*/}
        {/*    <div className="w-100 row mx-0 price-estimated-row-table align-items-center position-absolute">*/}
        {/*        <div className="col-12 col-sm-12 col-md-9 offset-md-3 p-0">*/}
        {/*            <ul className="list-inline mb-0 pricing-estimated-ul d-flex align-items-center pl-lg-2">*/}
        {/*                <li className="list-inline-item">*/}
        {/*                        <span className="d-flex align-items-center">*/}
        {/*                            <img alt={""} className="img-fluid mr-2" src={Images.info_small}/>*/}
        {/*                            Estimated Hourly Price:*/}
        {/*                        </span>*/}
        {/*                </li>*/}
        {/*                <li className="list-inline-item">*/}
        {/*                    $1,746.00*/}
        {/*                </li>*/}
        {/*                <li className="list-inline-item pl-3">*/}
        {/*                        <span className="d-flex align-items-center">*/}
        {/*                            Estimated Daliy Price:*/}
        {/*                        </span>*/}
        {/*                </li>*/}
        {/*                <li className="list-inline-item">*/}
        {/*                    $14,175.00*/}
        {/*                </li>*/}
        {/*            </ul>*/}
        {/*        </div>*/}
        {/*    </div>*/}
        {/*</div>*/}
        {/*<div className="col-12 pb-lg-5 pb-md-4 pb-sm-3 pt-lg-3 mt-lg-5 mt-md-4 mt-sm-3">*/}
        {/*        <span className="small-text-main d-flex align-items-center">*/}
        {/*            <img src={Images.info_small} alt={""} className="img-fluid mr-2"/>*/}
        {/*            Note: Estimated total price per hour is calculated by Straight time.*/}
        {/*        </span>*/}
        {/*</div>*/}
      </React.Fragment>
    );
  }
}

export default WageInfoTableMain;
