import React, { Component } from "react";
import { Button, Checkbox, Col, Form, Input, Popover, Row } from "antd";
import { Image as Images } from "../Images";
import { Link } from "react-router-dom";
import { routes } from "../../Controller/Routes";

function onChangeCheckbox(checkedValues) {
  // console.log("checked = ", checkedValues);
}

// function callback(key) {
//     console.log(key);
// }

class OpportunitiesMiniHeader extends Component {
  state = {
    visible: false,
  };
  filterDataPop = [
    <React.Fragment>
      <div className="filter-main-card row mx-0">
        <div className="col-12">
          <div className="row mx-0 type-working-checkbox">
            <div className="col-12">
              <h6 className="d-flex align-items-center justify-content-between">
                Filter Opportunities
              </h6>
            </div>
            <div className="col-12">
              <Checkbox.Group onChange={onChangeCheckbox}>
                <Row>
                  <Col span={24}>
                    <Checkbox value="A">Only my opportunities</Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="B">Prospect</Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="C">Contacted</Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="D">Nurturing</Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="E">Negotiating</Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="F">Converted</Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="G">Closed / Dead</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </div>
          </div>
        </div>
        {/*<div className="col-12 col-sm-6">*/}
        {/*    <div className="row mx-0 date-created-row">*/}
        {/*        <Collapse*/}
        {/*            defaultActiveKey={['1']}*/}
        {/*            onChange={callback}*/}
        {/*            expandIcon={false}*/}
        {/*        >*/}
        {/*            <Panel header="Creation Date" key="1">*/}
        {/*                <RangePicker/>*/}
        {/*            </Panel>*/}
        {/*        </Collapse>*/}
        {/*    </div>*/}
        {/*</div>*/}
      </div>
      <div className="footer-row-main-fix border-0 mt-0 row mx-0">
        {/*<Button>Clear</Button>*/}
        <Button type={"primary"}>Apply Filter</Button>
      </div>
    </React.Fragment>,
  ];

  hide = () => {
    this.setState({
      visible: false,
    });
  };

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  };

  render() {
    return (
      <React.Fragment>
        <div className="row mx-0 align-items-center mini-header-filter-list-grid-row">
          <div className="col-12">
            <div className="row mx-0 new-opportunity-header-row">
              <div className="d-flex align-items-center">
                {/*<div className="small-heading">15 Opportunities</div>*/}
                <div className="search-opportunities-div">
                  <div className="search-bar-div">
                    <Form className="position-relative">
                      <Input
                        placeholder="Search"
                        onChange={this.props.onSearch}
                      />
                      <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                        <img
                          src={Images.search_icon_gray}
                          className="img-fluid"
                          alt="search icon"
                        />
                      </Button>
                    </Form>
                  </div>
                </div>
                <div className="filters-div">
                  {/* <Popover
                    overlayClassName="popover-main-all opportunities-popover-main-all"
                    content={this.filterDataPop}
                    title={false}
                    trigger="click"
                    visible={this.state.visible}
                    placement="bottom"
                    onVisibleChange={this.handleVisibleChange}
                  >
                    <Button className="drawer-btn text-capitalize">
                      <img
                        alt=""
                        className="img-fluid"
                        src={Images.filter_icon}
                      />
                      Filter
                    </Button>
                  </Popover> */}
                </div>
              </div>
              <div className="new-opportunity-btn-div">
                <Link
                  to={routes.dashboard.opportunities.create}
                  className="new-opportunity-btn d-flex align-items-center justify-content-center text-capitalize"
                >
                  + Create Opportunity
                </Link>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default OpportunitiesMiniHeader;
