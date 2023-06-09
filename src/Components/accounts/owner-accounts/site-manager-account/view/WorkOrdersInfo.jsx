import React, { Component } from "react";
import { Button, Form, Input } from "antd";
import { Image as Images } from "../../../../Images";

class WorkOrdersInfo extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="row mx-0 mt-30 no-data-card-row-new">
          <div className="col-12">
            <div className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center  carpet-cleaning-mini-header">
              <div className="search-bar-div">
                <Form className="position-relative">
                  <Input placeholder="Search" />
                  <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                    <img
                      src={Images.search_icon_gray}
                      className="img-fluid"
                      alt="search icon"
                    />
                  </Button>
                </Form>
              </div>
              <div className="new-opportunity-btn-div">
                <Button className="new-opportunity-btn text-capitalize">
                  CREATE
                </Button>
              </div>
            </div>
          </div>
          {/*<div className="col-12 table-responsive main-table-div">*/}
          {/*    <Table pagination={false} className="main-table-all border-0 carpet-cleaning-table"*/}
          {/*           columns={this.workOrdersColumns}*/}
          {/*           dataSource={this.workOrdersData} size="middle"/>*/}
          {/*</div>*/}
          {/*no-data-screens*/}
          <div className="col-12">
            <div className="row no-data-upload-screens">
              <div className="col-12 text-center">
                <img
                  src={Images.work_setting}
                  alt="cloud upload"
                  className="img-fluid"
                />
                <h6 className="text-gray-tag">No Work Order</h6>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default WorkOrdersInfo;
