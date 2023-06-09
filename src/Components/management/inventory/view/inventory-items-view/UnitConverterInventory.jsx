import React, { Component } from "react";
import { Button, Form, Input, InputNumber, Select } from "antd";
import { Image as Images } from "../../../../Images";
import { getBaseUnitrate } from "../../../../../Controller/unitConversion";

const { Option } = Select;

class UnitConverterInventory extends Component {
  state = {
    comData: null,
    uomData: null,
    calc: 1,
    inputValue: 1
  }

  componentDidMount() {
    let data = this.props.inventory;
    if(data?.com[0]) {
      this.setState({comData: data?.com[0].id}, () => {
        this.handleComData(this.state.comData)
      })
    }

    if(data?.uom_array && 
      data?.uom_array[0]) {
      this.setState({uomData: data.uom_array[0].id})
  }
}

  handleComData = val => {
    let data = this.props.inventory;
    let findItem = data.com.find(i => i.id === val)
    if(findItem.uom.id === this.state.uomData ) {
      this.setState({calc: this.state.inputValue * findItem.factor})

    }
    else {
      if(findItem.uom) {
        let baseValue = this.state.inputValue * findItem.factor
        let calc = baseValue / getBaseUnitrate[this.state.uomData]
        this.setState({calc})
      }
      else {
      this.setState({calc: this.state.inputValue * getBaseUnitrate[this.state.uomData]})
      }
    }
    this.setState({comData: val})

  }
  handleUomData = val => {
    let data = this.props.inventory;
    let findItem = data.com.find(i => i.id === this.state.comData)
    if(findItem.uom.id === val ) {
      this.setState({uomData: val , calc: this.state.inputValue * findItem?.factor})

    }
    else {
      let baseValue = getBaseUnitrate[this.state.uomData];
      let calc = ( this.state.calc * (baseValue || 1) / getBaseUnitrate[val]).toFixed(2)
      this.setState({uomData: val, calc})
    }

  }
  handleInput = inputValue => {
    this.setState(prevState => {
      return {inputValue: inputValue || 1 , calc: (prevState.calc * (inputValue || 1)) / prevState.inputValue}
    })
  }
  render() {
    const { inventory } = this.props;
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
              {inventory.uom_array?.length > 0 && inventory?.com?.length > 0 ? (
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
                              // defaultValue={
                              //   inventory?.com &&
                              //   inventory?.com[0] &&
                              //   inventory?.com[0]?.id
                              // }
                              onChange={this.handleComData}
                              value={this.state.comData}
                            >
                              {inventory?.com?.map((i) => {
                                return <Option value={i.id}>{i.name}</Option>;
                              })}
                            </Select>
                          </div>
                          <div className="col-12">
                            <InputNumber type={"number"} placeholder="1" value={this.state.inputValue || 1} onChange={this.handleInput}/>
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
                              suffixIcon={
                                <img
                                  src={Images.caret_down_small_select}
                                  alt=""
                                  className="img-fluid"
                                />
                              }
                              // defaultValue={
                              //   inventory?.uom_array &&
                              //   inventory?.uom_array[0] &&
                              //   inventory?.uom_array[0].id
                              // }
                              onChange={this.handleUomData}
                              value={this.state.uomData}
                            >
                              {inventory?.uom_array?.map((i) => {
                                return <Option value={i.id}>{i.name}</Option>;
                              })}
                            </Select>
                          </div>
                          <div className="col-12">
                            <InputNumber type={"number"} placeholder="1" onChange={calc => this.setState({calc})} value={this.state.calc} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              ) : (
                <div className="col-12 mt-3">
                  <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
                    <div className="col-12 text-center">
                      <img
                        src={Images.measuring_tape_gray_new}
                        alt=""
                        className="img-fluid"
                      />
                      <h6 className="mb-0 color-gray-3">No Unit Converter</h6>
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

export default UnitConverterInventory;
