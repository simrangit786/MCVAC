import React, { Component } from "react";
import { Button, Form, message } from "antd";
import { Image as Images } from "../../../../Images";
import { getVehicle } from "../../../../../Controller/api/vehicleServices";
import { handleError } from "../../../../../Controller/Global";
import { withRouter } from "react-router-dom";
import CreateUniversalMeasurementDrawer from "./CreateUniversalMeasurementDrawer";
import measuring_tape_gray_black from "../../../../../assets/images/disposal/Measuring-tape-black.svg";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateUniversalMeasurement extends Component {
  state = {
    visible: false,
  };

  showUniversalType = (visible) => {
    this.setState({
      visible: visible,
    });
  };

  handleSubmit = () => {
    this.props.setInventory(this.props.inventory, 3);
    message.success("Inventory updated successfully!");
  };

  render() {
    const { uom_array } = this.props?.inventory || [];
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12 p-0">
            <Form
              ref={this.formRef}
              onFinish={this.handleSubmit}
              {...layout}
              hideRequiredMark={true}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12">
                  <div className="row mx-0 info-gray-div align-items-center">
                    <h6 className="mb-0">
                      Please select the universal unit(s) of measurement for
                      this item.
                    </h6>
                  </div>
                </div>
                {uom_array?.length > 0 ? (
                  <div className="col-12">
                    <div className="row measurement-row-details">
                      <div className="col-12 margin-tb-30">
                        <Button
                          onClick={() => this.showUniversalType(true)}
                          className="edit-create-btn text-uppercase"
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="col-12">
                        <div className="row">
                          <div className="col-12 my-3">
                            <div className="row">
                              <div className="col-12 custom-uom-table">
                                <table className="table table-bordered">
                                  <thead>
                                    <tr>
                                      <th>Unit Name</th>
                                      <th>Abbreviation</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="uom-table-small-header">
                                      <td colSpan={"2"}>
                                        {uom_array &&
                                          uom_array[0] &&
                                          uom_array[0].unit_type.name}
                                      </td>
                                    </tr>
                                    {uom_array?.map((i) => {
                                      return (
                                        <tr>
                                          <td>{i.name}</td>
                                          <td>{i.symbol}</td>
                                        </tr>
                                      );
                                    })}
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
                  <div className="col-12">
                    <div
                      onClick={() => this.showUniversalType(true)}
                      className="row mx-0 common-card-upload cursor-pointer pointer-no-card"
                    >
                      <div className="col-12 text-center">
                        <img
                          src={Images.measuring_tape_gray_new}
                          alt={""}
                          className="img-fluid"
                        />
                        <h6 className="mb-0">
                          Add Universal Units of Measurement
                        </h6>
                      </div>
                    </div>
                  </div>
                )}
                <div className="col-12 validate-div-col text-md-right">
                  <Form.Item>
                    <Button htmlType="submit" className="validate-btn-main">
                      Save and Continue
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>
        <CreateUniversalMeasurementDrawer
          inventory={this.props.inventory}
          callbackFacility={this.callbackFacility}
          visible={this.state.visible}
          onClose={() => this.showUniversalType(false)}
          setInventory={this.props.setInventory}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(CreateUniversalMeasurement);
