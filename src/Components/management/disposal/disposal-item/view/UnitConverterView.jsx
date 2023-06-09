import React, { Component } from "react";
import { Image as Images } from "../../../../Images";
import { Button, Form, Input, InputNumber, Select } from "antd";
import { getBaseUnitrate } from "../../../../../Controller/unitConversion";

const { Option } = Select;

class UnitConverterView extends Component {
  state = {
    uom: false,
    uomValue: null,
    comValue: null,
    calc: 1,
    comInputVal: 1
  };

  componentDidMount() {
    const { disposal } = this.props;
    if(disposal?.com[0]) {
        this.setState({comValue: disposal?.com[0]?.id}, () => {
          this.handleComChange(this.state.comValue)
        })
      }
    if(disposal?.uom_array &&
      disposal?.uom_array[0]) {
        this.setState({uomValue: disposal?.uom_array[0]?.id})
      }
  }

  handleUomChange = value => {
    const { uomValue, comValue, comInputVal } = this.state;
    let {com} = this.props?.disposal;
    let foundItem = com.find(i => i.id === comValue);
    if(foundItem && foundItem.uom.id === value) {
        this.setState({uomValue: value, calc: comInputVal * foundItem?.factor})
    }
    else {
    let baseValue = getBaseUnitrate[uomValue];
    let calc = (this.state.calc * (baseValue || 1) / getBaseUnitrate[value]);
    this.setState({uomValue: value, calc})
    }
  }

  handleComChange = value => {
    const {com} = this.props?.disposal;
    const {comInputVal, uomValue} = this.state;
    let foundItem = com.find(i => i.id === value);
    if(foundItem && foundItem.uom.id === this.state.uomValue) {
        this.setState({calc: comInputVal * foundItem?.factor})
    }
    else {
        if(foundItem.uom) {
          // console.log("inn")
            let baseValue = comInputVal * foundItem?.factor;
            let calc = (baseValue || 1) / getBaseUnitrate[uomValue]
            // console.log(calc, 'calc')
            this.setState({calc})
        }
        else {
            this.setState({calc: comInputVal * getBaseUnitrate[uomValue]})
        }
    }
    this.setState({comValue: value })
  }

  handleComInputChange = comInputVal => {
     this.setState(prevState => {
       return {comInputVal: comInputVal || 1, calc: (prevState.calc * (comInputVal || 1)) / prevState.comInputVal}
    })
  }

  render() {
    const {comValue, uomValue, calc, comInputVal} = this.state;
    const { disposal } = this.props;
    return (
      <React.Fragment>
        <div className="row mx-0">
          <div className="col-12">
            <div className="row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">
              <div className="search-bar-div">
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
              {/* <Button className="view-all-btn text-uppercase">VIEW ALL </Button> */}
            </div>
            <div className="row mx-0">
              {disposal?.uom_array?.length > 0 && disposal?.com?.length > 0 ? (
                <div className="col-12 my-3">
                  <Form className="main-inner-form">
                    <div className="row">
                      <div className="col-12 col-sm-3 position-relative">
                        <div className="row custom-unit-converter-row">
                          <div className="col-12">
                            <Select
                              className="custom-pound-select"
                              style={{ width: "100%" }}
                              suffixIcon={
                                <img
                                  src={Images.caret_down_small_select}
                                  alt=""
                                  className="img-fluid"
                                />
                              }
                              onChange={this.handleComChange}
                              value={comValue}
                              // defaultValue={
                              //   disposal?.com &&
                              //   disposal?.com[0] &&
                              //   disposal?.com[0]?.id
                              // }
                            >
                              {disposal?.com?.map((i) => {
                                return <Option value={i.id}>{i.name}</Option>;
                              })}
                            </Select>
                          </div>
                          <div className="col-12">
                            <InputNumber value={comInputVal || 1} onChange={this.handleComInputChange} type={"number"} placeholder="1" />
                          </div>
                        </div>
                        <span className="equal-sign position-absolute">=</span>
                      </div>
                      <div className="col-12 col-sm-3">
                        <div className="row custom-unit-converter-row">
                          <div className="col-12">
                            <Select
                              className="custom-pound-select"
                              style={{ width: "100%" }}
                              onChange={this.handleUomChange}
                              value={uomValue}
                              suffixIcon={
                                <img
                                  src={Images.caret_down_small_select}
                                  alt=""
                                  className="img-fluid"
                                />
                              }
                              // defaultValue={
                              //   disposal?.uom_array &&
                              //   disposal?.uom_array[0] &&
                              //   disposal?.uom_array[0].id
                              // }
                            >
                              {disposal?.uom_array?.map((i) => {
                                return <Option value={i.id}>{i.name}</Option>;
                              })}
                            </Select>
                          </div>
                          <div className="col-12">
                            <InputNumber type={"number"} onChange={calc => this.setState({calc})} value={calc} placeholder="1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              ) : (
                <div className="col-12 mt-3">
                  <div className="row mx-0 no-data-card-row bg-transparent align-items-center justify-content-center">
                    <div className="col-12 text-center">
                      <img
                        src={Images.universalm}
                        alt=""
                        className="img-fluid"
                      />
                      <h6 className="mb-0">No Unit Converter</h6>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default UnitConverterView;
