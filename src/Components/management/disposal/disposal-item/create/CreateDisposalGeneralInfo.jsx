import React, { Component } from "react";
import { Button, Form, Input, Select, Spin, message, InputNumber } from "antd";
import { Image as Images } from "../../../../Images";
import {
  createDisposal,
  updateDisposal,
  getDisposalFamily,
  getDisposal,
} from "../../../../../Controller/api/disposalServices";
import { handleError } from "../../../../../Controller/Global";
import CustomSelectOption from "../../../../CustomSelectOption";
import { DISPOSAL } from "../../../../../Controller/utils";
import { debounce } from "lodash"

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;

class CreateDisposalGeneralInfo extends Component {
  state = {
    disposal_tier: [],
    fetching: false,
  };
  formRef = React.createRef();

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.disposal !== this.props.disposal) {
      this.formRef.current.setFieldsValue({
        ...this.props.disposal,
        parent: this.props?.disposal?.disposal_family?.name,
      });
    }
  }

  handleSubmit = (values) => {
    if (this.props.disposal) {
      if (typeof values.parent === "string") {
        values.parent = this.props.disposal.parent;
      }
      updateDisposal(this.props.disposal.id, values)
        .then((res) => {
          this.props.setdisposal(res.data, 2);
          message.success("Disposal Updated successfully!");
        })
        .catch((err) => {
          handleError(err);
        });
    } else {
      values.tier_type = DISPOSAL;
      createDisposal(values)
        .then((res) => {
          this.props.setdisposal(res.data, 2);
          message.success("Disposal Created successfully!");
        })
        .catch((err) => {
          handleError(err);
        });
    }
  };

  fetchDisposalTiers = (params = {}) => {
    this.setState({ fetching: true });
    getDisposal({ ...params, not_group: true })
      .then((res) => {
        this.setState({ disposal_tier: res.data.results, fetching: false });
      })
      .catch((err) => {
        handleError(err);
        this.setState({ fetching: false });
      });
  };

  onFetchDisposalTiers = (value) => {
    this.fetchDisposalTiers({search: value})
  }

  debounceEvent = (...args) => {
    this.debouncedEvent = debounce(...args);
    return (e) => {
      // e.persist();
      return this.debouncedEvent(e);
    };
  };

  render() {
    let { fetching, disposal_tier } = this.state;
    let { onChange } = this.props;
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">
                Please input the name and Disposal Family / Tier of this
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
              <div className="col-12 col-sm-6">
                  <Form.Item
                    name="disposal_code"
                    label={"Disposal Code"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input
                      placeholder={
                        "00000000"
                      }
                    />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="name"
                    label={"Disposal Name *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input
                      placeholder={
                        "Enter a nickname to distinguish the Disposal"
                      }
                    />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="parent"
                    label={"Disposal Family / Tier *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative remove-cross-icon"
                  >
                    <Select
                      // mode="multiple"
                      showSearch={true}
                      value={disposal_tier}
                      placeholder="Search Disposal Family / Tier"
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      onFocus={() => this.fetchDisposalTiers()}
                      onSearch={
                          this.debounceEvent(this.onFetchDisposalTiers,300)
                      }
                      dropdownClassName="custom-select-drop-main"
                      onChange={(v) => {
                        onChange("disposal_tier", v);
                      }}
                      optionLabelProp={"label"}
                    >
                      {this.state.disposal_tier.map((d, index) => (
                        <Option key={index} label={d.name} value={d.id}>
                          <CustomSelectOption
                            data={d}
                            img={d.tier_type ? null : Images.disposal}
                            type={
                              d.tier_type ? "Disposal Tier" : "Disposal Family"
                            }
                          />
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {/* <Button
                                        className="search-icon bg-transparent border-0 p-0 position-absolute">
                                        <img src={Images.search_small_icon} alt=''
                                            className="img-fluid" />
                                    </Button> */}
                  {/*<Button className="create-btn-main position-absolute" onClick={() => {*/}
                  {/*    this.setState({visible: true})*/}
                  {/*}}>*/}
                  {/*    Create*/}
                  {/*</Button>*/}
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

export default CreateDisposalGeneralInfo;
