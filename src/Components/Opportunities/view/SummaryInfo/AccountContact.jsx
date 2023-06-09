import React, { Component } from "react";
import { Button, Collapse, Dropdown, Spin } from "antd";
import { Image as Images } from "../../../Images";
import { connect } from "react-redux";
import { CaretRightOutlined } from "@ant-design/icons";
import AccountViewContact from "../account-view/AccountViewContact";
const { Panel } = Collapse;
class AccountContact extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="col-12 account-contact-collapse-div">
          <Collapse
            // accordion
            defaultActiveKey={["1"]}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
          >
            <Panel
              header={
                <div className="row mx-0 site-details-row-card no-data-card-row align-items-center position-relative">
                  <div className="col-11 col-sm-11 p-0">
                    <div className="row mx-0 align-items-center">
                      <div className="pl-3 pr-2">
                        <img
                          src={Images.person_black_icon}
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                      <div className="">
                        <h5 className="text-capitalize">Erdos Technologies</h5>
                        <h6 className="mb-0">Billing Account</h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-1 col-sm-1 p-0">
                    <div className="row mx-0 align-items-center justify-content-end h-100">
                      <Dropdown
                        overlayClassName="add-remove-dropdown-main"
                        placement="bottomCenter"
                        overlay={this.menu}
                        trigger={["click"]}
                      >
                        <Button
                          className="bg-transparent p-0 border-0 elipsis-btn-card ant-dropdown-link"
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            src={Images.black_dots_elipsis}
                            alt=""
                            className="img-fluid"
                          />
                        </Button>
                      </Dropdown>
                    </div>
                  </div>
                </div>
              }
              key="1"
              forceRender
            >
              <AccountViewContact opportunity={this.props.opportunity} />
            </Panel>
            <Panel
              header={
                <div className="row mx-0 site-details-row-card no-data-card-row align-items-center position-relative">
                  <div className="col-11 col-sm-11 p-0">
                    <div className="row mx-0 align-items-center">
                      <div className="pl-3 pr-2">
                        <img
                          src={Images.person_black_icon}
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                      <div className="">
                        <h5 className="text-capitalize">Erdos Technologies</h5>
                        <h6 className="mb-0">Billing Account</h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-1 col-sm-1 p-0">
                    <div className="row mx-0 align-items-center justify-content-end h-100">
                      <Dropdown
                        overlayClassName="add-remove-dropdown-main"
                        placement="bottomCenter"
                        overlay={this.menu}
                        trigger={["click"]}
                      >
                        <Button
                          className="bg-transparent p-0 border-0 elipsis-btn-card ant-dropdown-link"
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            src={Images.black_dots_elipsis}
                            alt=""
                            className="img-fluid"
                          />
                        </Button>
                      </Dropdown>
                    </div>
                  </div>
                </div>
              }
              key="2"
              forceRender
            >
              <AccountViewContact opportunity={this.props.opportunity} />
            </Panel>
          </Collapse>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { ...state };
}

export default connect(mapStateToProps)(AccountContact);
