import React, { Component } from "react";
import { Button, Form, message } from "antd";
import CreateButton from "./createButtonSubTier";
import TreeMain from "./TreeMain";
import DrawerTreeMain from "./DrawerTreeMain";
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class ServiceTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  onSubmit=(values)=>{
      if(this.props.packageData){
          message.success("Supply Group updated successfully!")
          // this.props.setPackage()
      }else{
          message.success("Supply Group created successfully!")
          // this.props.setPackage()
      }
  }

  render() {
    return (
      <div className="row common-form-card-row">
        <div className="col-12">
          <div className="row info-gray-div align-items-center">
            <h6 className="mb-0">
              Please build your supply family using tiers and supply groups.
            </h6>
          </div>
        </div>
        <div className="col-12">
          <Form
            ref={this.formRef}
            {...layout}
            hideRequiredMark={true}
            className="main-inner-form"
          >
            <div className="row">
              {/*<div className="col-12">*/}
              {/*<div className="row mx-0 ">*/}
              {/* <div className="col-2 p-0">
                                        <div
                                            className="row mx-0 icon-info-notes align-items-center h-100 justify-content-center">
                                            <img src={Images.information_green_icon} alt={""}
                                                className="img-fluid" />
                                        </div>
                                    </div>
                                    <div className="col-10">
                                        <div className="row mx-0 h-100 icon-info-details align-items-center">
                                            <small className="small-text-main">
                                                Note: The sub-tiers with
                                                nothing inside of them will become <b
                                                className="text-black-50">line items</b> in the next step.
                                            </small>
                                        </div>
                                    </div> */}
              {/*</div>*/}
              {/*</div>*/}
              <div className="col-12 tree-heading">
                <div className="row mx-0">
                  <div className="col-6">
                    <span>SUPPLIES</span>
                  </div>
                  <div className="col-6 text-right">
                    <span>TYPE</span>
                  </div>
                </div>
              </div>
              <div className="col-12 p-0">
                {/* {this.props.drawerItem ? (
                  <DrawerTreeMain {...this.props} />
                ) : ( */}
                  <TreeMain {...this.props} />
                {/* )} */}
              </div>

              <div className="col-12 p-0">
                <CreateButton {...this.props} />
              </div>
              <div className="col-12 p-0 validate-div-col text-md-right">
                <Form.Item>
                  <Button
                    htmlType="submit"
                    className="validate-btn-main"
                    onClick={this.onSubmit}
                    // onClick={() =>
                    //   message.success("Supply Family updated successfully!")
                    // }
                  >
                    Save and Continue
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default ServiceTree;
