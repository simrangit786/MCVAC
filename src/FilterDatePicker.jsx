import React, { Component } from "react";
import { Button, DatePicker, Form } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class FilterDatePicker extends Component {
  formRef = React.createRef();
  handleSubmit = (values) => {
    let start;
    let end;
    let start_modified;
    let end_modified;
    if (values.date_created) {
      start = moment(values.date_created[0]._d).format("YYYY-MM-DD");
      end = moment(values.date_created[1]._d).format("YYYY-MM-DD");
    }
    if (values.last_activity_date) {
      start_modified = moment(values.last_activity_date[0]._d).format(
        "YYYY-MM-DD"
      );
      end_modified = moment(values.last_activity_date[1]._d).format(
        "YYYY-MM-DD"
      );
    }
    const allDates = {
      start,
      end,
      start_modified,
      end_modified,
    };
    this.props.fetchData(allDates);
  };

  resetFields = () => {
    this.formRef.current.resetFields();
    this.props.fetchData();
  };
  render() {
    return (
      <React.Fragment>
        <div className="filter-main-card row mx-0">
          <Form
            ref={this.formRef}
            onFinish={this.handleSubmit}
            {...layout}
            hideRequiredMark={true}
            className="main-inner-form"
          >
            <div className="row mx-0 type-working-checkbox">
              <div className="col-12">
                <Form.Item
                  name="date_created"
                  label={"Date Created"}
                  rules={[
                    {
                      required: false,
                      message: "",
                    },
                  ]}
                  className="position-relative"
                >
                  <RangePicker />
                </Form.Item>
              </div>
              <div className="col-12">
                <Form.Item
                  name="last_activity_date"
                  label={"Last Activity Date"}
                  rules={[
                    {
                      required: false,
                      message: "",
                    },
                  ]}
                  className="position-relative"
                >
                  <RangePicker />
                </Form.Item>
              </div>
              <div className="col-12 p-0">
                <div className="footer-row-main-fix justify-content-between border-0 mt-0 mx-0 row">
                  <Button className="shadow-none" onClick={this.resetFields}>
                    Clear
                  </Button>
                  <Button type={"primary"} htmlType="submit">
                    Apply Filter
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </React.Fragment>
    );
  }
}

export default FilterDatePicker;
