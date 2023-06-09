import React, { Component } from "react";
import { Form, Input, InputNumber, Modal, Select, Button, Spin } from "antd";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;
function handleChange(value) {
  // console.log(`selected ${value}`);
}

class OpportunityStatusModal extends Component {
  formRef = React.createRef();

  state = {
    optValue: null,
  }

  handleSubmit = (values) => {
    console.log(values, "dsfds")
    this.props.handleUpdate({ ...values, status: 12 });
    this.props.onClose();
  };

  render() {
    const {reasons, reasonLoading, getReasons} = this.props;
    const {optValue} = this.state;
    return (
      <React.Fragment>
        <Modal
          centered
          title="Status"
          visible={this.props.visible}
          onOk={this.handleSubmit}
          onCancel={this.props.onClose}
          className="main-all-form-modal"
          okText={"Apply"}
          width={"548px"}
          footer={
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Button onClick={this.props.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button
                onClick={() => this.formRef.current.submit()}
                type="primary"
              >
                Apply
              </Button>
            </div>
          }
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <Form
                {...layout}
                onFinish={this.handleSubmit}
                className="main-inner-form"
                ref={this.formRef}
              >
                <div className="row">
                  <div className="col-12">
                    <Form.Item
                      name="status"
                      label={"Status"}
                      rules={[
                        {
                          required: false,
                          message: "",
                        },
                      ]}
                    >
                      <Select disabled={true} defaultValue={1}>
                        <Option value={1}>Lost</Option>
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="competitor_name"
                      label={"Competitor Name *"}
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <Input placeholder="Competitor Name" />
                    </Form.Item>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="bid_amount"
                      label={"Winning Bid Amount"}
                      rules={[
                        {
                          required: false,
                          message: "",
                        },
                      ]}
                    >
                      <InputNumber placeholder="Winning Bid Amount" />
                    </Form.Item>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="reason_options"
                      label={"Reason"}
                      rules={[
                        {
                          required: false,
                          message: "",
                        },
                      ]}
                    >
                      <Select onFocus={getReasons} onChange={e => this.setState({optValue: e})} value={optValue} placeholder="Select"
                       notFoundContent={reasonLoading && <Spin />} 
                       >
                        {reasons.map(i => {
                          return (
                            <Option value={i.id}>{i.title}</Option>
                          )
                        })}
                      </Select>
                    </Form.Item>
                  </div>
                  {optValue === 10 &&
                  <div className="col-12">
                    <Form.Item
                      name="reason"
                      label={"Please Provide Other Reason"}
                      rules={[
                        {
                          required: false,
                          message: "",
                        },
                      ]}
                    >
                      <Input.TextArea
                        className="text-area-main"
                        placeholder="Type something"
                      />
                    </Form.Item>
                  </div>
                }
                </div>
              </Form>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default OpportunityStatusModal;
