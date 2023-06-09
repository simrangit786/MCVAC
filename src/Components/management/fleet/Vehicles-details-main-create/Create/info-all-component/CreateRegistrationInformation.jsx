import React, { Component } from "react";
import { Button, Form, Input, message, Select } from "antd";
import { withRouter } from "react-router-dom";
import { getVehicleById, updateVehicle } from "../../../../../../Controller/api/vehicleServices";
import { handleError } from "../../../../../../Controller/Global";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;

class CreateRegistrationInformation extends Component {
  formRef = React.createRef();

  componentDidMount() {
    // this.formRef.current.setFieldsValue({
    //   ...this.props.vehicle,
    // });

    if (this.props.match.params.id) {
      getVehicleById(this.props.match.params.id)
      .then((res)=>{
        this.formRef.current.setFieldsValue({
          ...res.data,
        });
      }).catch(err=>{
        handleError(err)
      })
    }
  }

  handleSubmit = (values) => {
    updateVehicle(this.props.vehicle.id, values)
      .then((res) => {
        this.props.setVehicle(res.data, 5);
        message.success("Vehicle updated successfully");
      })
      .catch((err) => {
        handleError(err);
      });
  };

  render() {
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">
                Please input this vehicle’s registration information.
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
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="vin_sin"
                    label={"VIN/SN"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input
                      style={{ textTransform: "uppercase" }}
                      placeholder="JTHKD5BH3B2016342"
                    />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="license_plate"
                    label={"License Plate"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input
                      style={{ textTransform: "uppercase" }}
                      placeholder="A50 GLU"
                    />
                  </Form.Item>
                </div>

                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="state"
                    label={"Registration State/Province"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder="State" />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="ownership"
                    label={"Ownership"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder="Ownership" />
                  </Form.Item>
                </div>
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
      </React.Fragment>
    );
  }
}

export default withRouter(CreateRegistrationInformation);
