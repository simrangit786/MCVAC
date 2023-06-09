import React, { Component } from "react";
import { Button, Form, Input, Popover } from "antd";
import { Image as Images } from "../Images";
import { Link } from "react-router-dom";
import { routes } from "../../Controller/Routes";
import FilterDatePicker from "../../FilterDatePicker";

class OwnerAccountMinHeader extends Component {
  state = {
    visible: false,
  };

  filterDataPop = () => {
    return <FilterDatePicker fetchData={this.props.fetchData} />;
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
              </div>
              <div className="new-opportunity-btn-div ml-3">
                <Popover
                  overlayClassName="popover-main-all filter-popover"
                  content={this.filterDataPop}
                  title={false}
                  trigger="click"
                  visible={this.state.visible}
                  placement="bottom"
                  onVisibleChange={this.handleVisibleChange}
                >
                  <Button
                    // onClick={createButtonAction ? createButtonAction : ''}
                    className="filter-btn d-flex align-items-center justify-content-center text-capitalize"
                  >
                    <img alt={" "} src={Images.filter_icon} /> Filter
                  </Button>
                </Popover>
              </div>
              <div className="new-opportunity-btn-div ml-3">
                <Link
                  to={routes.dashboard.owner_account.create}
                  className="new-opportunity-btn d-flex align-items-center justify-content-center text-capitalize"
                >
                  + Create Site Manager Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default OwnerAccountMinHeader;
