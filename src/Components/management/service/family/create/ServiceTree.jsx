import React, { Component } from "react";
import { Button, Form, message } from "antd";
import CreateButtonSubTier from "./CreateButtonSubTier";
import TreeMain from "./TreeMain";
import DrawerTreeMain from "./DrawerTreeMain";
import RequireSuccessModal from "../../../../modals/requiredDataModals/RequireSuccessModal";


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

  handleSubmit = () => {
    message.success("Service Family updated successfully")  
    this.props.getPackage(this.props.packageData.id)

  }

  
  render() {
    return (
      <div className="row common-form-card-row">
        <div className="col-12">
          <Form
            ref={this.formRef}
            {...layout}
            hideRequiredMark={true}
            className="main-inner-form"
          >
            <div className="row">
              <div className="col-12">
                <div className="row info-gray-div align-items-center">
                  <h6 className="mb-0">
                    Please build your service family using tiers and services.
                  </h6>
                </div>
              </div>
              {/*{!this.props.drawerItem &&*/}
              {/*    <div className="col-12">*/}
              {/*        <div className="row mx-0 notes-all-common">*/}
              {/*            <div className="col-2 p-0">*/}
              {/*                <div*/}
              {/*                    className="row mx-0 icon-info-notes align-items-center h-100 justify-content-center">*/}
              {/*                    <img src={Images.information_green_icon} alt={""}*/}
              {/*                         className="img-fluid"/>*/}
              {/*                </div>*/}
              {/*            </div>*/}
              {/*            */}
              {/*            <div className="col-10">*/}
              {/*                <div className="row mx-0 h-100 icon-info-details align-items-center">*/}
              {/*                    <small className="small-text-main">*/}
              {/*                        Note: The sub-tiers with*/}
              {/*                        nothing inside of them will become <b*/}
              {/*                        className="text-black-50">line items</b> in the next step.*/}
              {/*                    </small>*/}
              {/*                </div>*/}
              {/*            </div>*/}

              {/*        </div>*/}
              {/*    </div>}*/}
              <div className="col-12 tree-heading">
                <div className="row mx-0">
                  <div className="col-6">
                    <span>Services</span>
                  </div>
                  <div className="col-6 text-right">
                    <span>TYPE</span>
                  </div>
                </div>
              </div>
              <div className="col-12 p-0">
                {this.props.drawerItem ? (
                  <DrawerTreeMain {...this.props} />
                ) : (
                  <TreeMain {...this.props} />
                )}
              </div>

              <div className="col-12 p-0">
                <CreateButtonSubTier {...this.props} />
              </div>
              <div className="col-12 p-0 validate-div-col text-md-right">
                <Form.Item>
                  <Button
                    // htmlType="submit"
                    className="validate-btn-main"
                    onClick={() =>
                      this.handleSubmit()
                    }
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
