import React, { Component } from "react";
import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  TimePicker,
} from "antd";
import { withRouter } from "react-router-dom";
import { handleError } from '../../../../Controller/Global';
import moment from "moment";
import { updateWorkOrder } from "../../../../Controller/api/workOrderServices";
const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class DispatchUpdateTimeDrawer extends Component {
  state = {
    data: null,
    buttonLoading: false,
    visibleConfirm: false,
    county: [],
    updateMainState: null,
  };
  formRef = React.createRef();

  onSubmit = (values) => {

      const params = {
        ...values,
        new_en_route_time: values.new_en_route_time || null,
        new_leave_site_time: values.new_leave_site_time || null,
        new_on_site_time: values.new_on_site_time || null,
        new_completed_order_time: values.new_completed_order_time  || null
      };
      updateWorkOrder(this.props.workOrder.id, params)
        .then((res) => {
          message.success("Time Updated successfully");
          this.props.fetchWorkOrder()
          this.props.onClose()
        })
        .catch((err) => {
            handleError(err)
        });
  }

  componentDidMount() {
    if(this.props.workOrder) {
        this.formRef.current.setFieldsValue({
            ...this.props.workOrder,
            new_en_route_time : this.props.workOrder.new_en_route_time ? moment(this.props.workOrder.new_en_route_time): "",
            new_leave_site_time: this.props.workOrder.new_leave_site_time ? moment(this.props.workOrder.new_leave_site_time): "",
            new_on_site_time: this.props.workOrder.new_on_site_time ? moment(this.props.workOrder.new_on_site_time) : "",
            new_completed_order_time: this.props.workOrder.new_completed_order_time ? moment(this.props.workOrder.new_completed_order_time) : ""
        })
    }
  }

  componentDidUpdate() {
      if(this.props.visible) {
        this.formRef.current.setFieldsValue({
            ...this.props.workOrder,
            new_en_route_time : this.props.workOrder.new_en_route_time ? moment(this.props.workOrder.new_en_route_time): "",
            new_leave_site_time: this.props.workOrder.new_leave_site_time ? moment(this.props.workOrder.new_leave_site_time): "",
            new_on_site_time: this.props.workOrder.new_on_site_time ? moment(this.props.workOrder.new_on_site_time) : "",
            new_completed_order_time: this.props.workOrder.new_completed_order_time ? moment(this.props.workOrder.new_completed_order_time) : "" 
        })     
      }
  }

  render() {

    return (
      <React.Fragment>
        <Drawer
          centered
          destroyOnClose={true}
          title={"Update Time"}
          visible={this.props.visible}
          onClose={this.props.onClose}
          onOk={this.props.onClose}
          onCancel={this.props.onClose}
          className="main-all-form-modal main-drawer-div internal-location drawer-update"
          width={"625px"}
          placement={"right"}
          footer={
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Button
                onClick={() => this.props.onClose()}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  this.formRef.current.submit();
                }}
                type="primary"
              >
                {"Update Time"}
              </Button>
            </div>
          }
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <Form
                 ref={this.formRef}
                 onFinish={this.onSubmit}
                 {...layout}
                 hideRequiredMark={true}
                 className="main-inner-form"
              >
                <div className="row">
                <div className="col-12">
                                    <Form.Item
                                        name="new_en_route_time"
                                        label={"Start Time"}
                                    >
                                        <TimePicker format={"HH:mm:ss"} placeholder={'Start Time'} />
                                    </Form.Item>
                                </div>
                                <div className="col-12">
                                    <Form.Item
                                        name="new_on_site_time"
                                        label={"On Site Time"}
                                    >
                                        <TimePicker placeholder={'On Site Time'} />
                                    </Form.Item>
                                </div>
                                <div className="col-12">
                                    <Form.Item
                                        name="new_leave_site_time"
                                        label={"Leave Site Time"}
                                    >
                                        <TimePicker placeholder={'Leave Site Time'} />
                                    </Form.Item>
                                </div>
                                <div className="col-12">
                                    <Form.Item
                                        name="new_completed_order_time"
                                        label={"End Time"}
                                    //    rules={[{
                                    //        required: true,
                                    //        message: 'this field is required'
                                    //    }]}

                                    >
                                        <TimePicker placeholder={'End Time'} />
                                    </Form.Item>
                                </div>
                                </div>
              </Form>
            </div>
          </div>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default withRouter(DispatchUpdateTimeDrawer);
