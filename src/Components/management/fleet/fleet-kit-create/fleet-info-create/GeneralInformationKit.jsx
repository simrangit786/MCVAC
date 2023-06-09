import React, { Component } from "react";
import { Button, Form, Input, message, Select, Spin } from "antd";
import { withRouter } from "react-router-dom";
import { Image as Images } from "../../../../Images";
import { handleError } from "../../../../../Controller/Global";
import {
  createFleetGroup,
  createFleetKit,
  getFleetGroup,
  updateFleetGroup,
  updateFleetKit,
} from "../../../../../Controller/api/vehicleServices";
import CustomSelectOption from "../../../../CustomSelectOption";
import { FLEET_GROUP } from "../../../../../Controller/utils";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;

class GeneralInformationKit extends Component {
  state = {
    // fleetkit: [],
    fetching: false,
    fleetData: null,
    fleetName: ""
  };
  formRef = React.createRef();

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.fleetKit !== this.props.fleetKit) {
      this.formRef.current.setFieldsValue({
        name: this.props.fleetKit?.name,
      });
    }
  }

    handleSubmit = (values) => {
      if (this.props.fleetKit) {
        const Id = this.props.match.params.id ? this.props.match.params.id : this.props.fleetKit
        updateFleetKit(Id, values)
          .then((res) => {
            // this.props.setVehicle(res.data, 2);
            this.props.handleFleetKit(res.data,2)
            message.success("Fleet Kit updated successfully");
          })
          .catch((err) => {
            handleError(err);
          });
        }else {
        createFleetKit(values)
        .then((res) => {
          this.props.handleFleetKit(res.data,2)
          // this.props.setVehicle(res.data, 2);
          message.success("Fleet Kit created successfully");
        })
        .catch((err) => {
          handleError(err);
        });
      }
    }

//   fetchSubTiers = (params = {}) => {
//     this.setState({ fetching: true });
//     getFleetGroup({ ...params, not_group: true })
//       .then((res) => {
//         this.setState({ subtiers: res.data.results, fetching: false });
//       })
//       .catch((err) => {
//         handleError(err);
//         this.setState({ fetching: false });
//       });
//   };

//   async componentDidUpdate(prevProps, prevState, snapshot) {
//     if (prevProps.data !== this.props.data) {
//       await this.fetchSubTiers({ search: this.props.name });
//       this.formRef.current.setFieldsValue({
//         name: this.props.name,
//         parent: {
//           label: this.props?.subtier?.name || this.props?.subtier?.label,
//           value: this.props?.subtier?.id || this.props?.subtier?.key,
//         },
//         // parent: { label: this.props.subtier.label, value: this.props.subtier.key }
//       });
//     }
//   }

//   handleSubmit = (values) => {
//     // console.log(values, "check parent");
//     const newValues = {
//       ...values,
//       parent: values.parent.value,
//       tier_type: FLEET_GROUP,
//     };
//     if (this.props.data) {
//       updateFleetGroup(this.props.data.id, newValues)
//         .then((res) => {
//           // this.setState({data: res.data})
//           this.props.setData(res.data, 2);
//           message.success("Fleet Group updated successfully!");
//         })
//         .catch((err) => {
//           handleError(err);
//         });
//     } else {
//       createFleetGroup(newValues)
//         .then((res) => {
//           // this.setState({data: res.data})
//           this.props.setData(res.data, 2);
//           message.success("Fleet Group created successfully!");
//         })
//         .catch((err) => {
//           handleError(err);
//         });
//     }
//   };

  render() {
    const { fetching, subtiers, fleetName } = this.state;
    const { name, subtier, onChange } = this.props;
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">
              Please input inventory kit name and choose unit of measurement.
              </h6>
            </div>
          </div>
          <div className="col-12 p-0">
            <Form
              onFinish={this.handleSubmit}
              ref={this.formRef}
              {...layout}
              hideRequiredMark={true}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="name"
                    label={"Fleet Kit Name *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input
                      // value={fleetName}
                      // onChange={(e) => onChange("name", e.target.value)}
                      placeholder={"Enter Fleet Kit Name"}
                    />
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

export default withRouter(GeneralInformationKit);
