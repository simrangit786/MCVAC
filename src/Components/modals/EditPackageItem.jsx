import React, { Component } from "react";
import { Form, Input, message, Modal } from "antd";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class EditPackageItem extends Component {
  formRef = React.createRef();

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.data !== this.props.data) {
      this.formRef.current.setFieldsValue({
        ...this.props.data,
      });
    }
  }

  handleSubmit = () => {
    let name = this.formRef.current.getFieldValue("name");
    if (!name) {
      message.error("Name is required");
      return;
    }
    this.props.onUpdate(this.props.data.id, { name });
    this.props.onClose();
  };

  render() {
    return (
      <React.Fragment>
        <Modal
          centered
          title="Edit Package Item"
          visible={this.props.visible}
          onOk={this.handleSubmit}
          onCancel={this.props.onClose}
          className="main-all-form-modal"
          cancelText={"Cancel"}
          okText={"Update"}
          width={"575px"}
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <Form
                hideRequiredMark={true}
                ref={this.formRef}
                {...layout}
                className="main-inner-form"
              >
                <div className="row mt-3">
                  <div className="col-12">
                    <Form.Item
                      name="name"
                      label={""}
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <Input placeholder="Package Item Name" />
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default EditPackageItem;
