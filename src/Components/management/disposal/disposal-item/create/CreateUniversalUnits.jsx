import React, { Component } from "react";
import { Button, Form, message } from "antd";
import { Image as Images } from "../../../../Images";
import { withRouter } from "react-router-dom";
import UniversalMeasurementType from "../../../../drawers/disposal/UniversalMeasurementType";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateUniversalUnits extends Component {
  state = {
    // selectedMeasurement: [],
    // universal: [],
    // loading: false,
    visible: false,
  };

  // componentDidMount() {
  //     this.fetchVehicle()
  // }
  //
  // fetchVehicle = (params = {}) => {
  //     this.setState({loading: true});
  //     params.vehicle_package_item = this.props.match.params.id;
  //     getVehicle(params).then(res => {
  //         this.setState({universal: res.data.results, loading: false})
  //     }).catch(err => {
  //         handleError(err);
  //         this.setState({loading: false})
  //     })
  // };
  // Changevisible = () => {
  //     this.setState({visible: true})
  // }
  // showDrawer = (visible) => {
  //     this.setState({visible: visible})
  // }
  //
  // handleSelect = (e) => {
  //     let selectedMeasurement = this.state.universal.drawer(i => e.includes(i.id));
  //     this.setState({selectedMeasurement})
  // };
  //
  // callbackFacility = (data) => {
  //     let {selectedMeasurement} = this.state;
  //     selectedMeasurement = [...selectedMeasurement, data]
  //     this.setState({selectedMeasurement, universal: selectedMeasurement})
  //     this.formRef.current.setFieldsValue({
  //         universal: selectedMeasurement.map(i => i.id)
  //     })
  // }
  showUniversalType = (visible) => {
    this.setState({
      visible: visible,
    });
  };

  handleSubmit = () => {
    this.props.setDisposal(this.props.disposal, 3);
    message.success("Disposal updated successfully!");
  };

  render() {
    const { uom_array } = this.props?.disposal || [];
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">
                Please select the universal unit(s) of measurement for this
                disposal.
              </h6>
            </div>
          </div>
          <div className="col-12 p-0">
            <Form
              ref={this.formRef}
              onFinish={this.handleSubmit}
              {...layout}
              hideRequiredMark={true}
              className="main-inner-form"
            >
              <div className="row">
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
                      className="row mx-0 common-card-upload cursor-pointer"
                    >
                      <div className="col-12 text-center">
                        <img src={Images.universalm} alt={""} className="img-fluid"
                        />
                        <h6 className="mb-0 text-green-tag">
                          Add Units of Measurement
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
        <UniversalMeasurementType
          // disposal={this.props.disposal}
          visible={this.state.visible}
          onClose={() => this.showUniversalType(false)}
          setDisposal={this.props.setDisposal}
          disposal={this.props.disposal}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(CreateUniversalUnits);
