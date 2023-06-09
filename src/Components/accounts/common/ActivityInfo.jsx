import React, { Component } from "react";
import { Button, Form, Input, message, Table } from "antd";
import { Image as Images } from "../../Images";
import { getOneAccountActivity } from "../../../Controller/api/customerAccountServices";
import { withRouter } from "react-router-dom";
import moment from "moment";

class ActivityInfo extends Component {
  state = {
    activity: [],
    loading: false,
    pagination: {
      current: 1,
      pageSize: 15,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
    },
  };
  activityColumns = [
    {
      title: "DATE",
      dataIndex: "date",
      sorter: true,
      render: (modified) => (
        <div className="font-weight-normal">
          {moment(modified).format("MMM DD, YYYY hh:mm A")}
        </div>
      ),
    },
    {
      title: "ACTION",
      dataIndex: "action",
      sorter: true,
    },
    {
      title: "EMPLOYEE",
      dataIndex: "user",
      sorter: true,
      render: (user) => (
        <div className="d-flex align-items-center">
          {user &&
          <span className="assign-tag-card d-flex align-items-center justify-content-center text-uppercase rounded-circle">
            {user.split(" ")[0].split("")[0]}
            {user.split(" ")[1].split("")[0]}
          </span>
    }
          {user}
        </div>
      ),
    },
  ];

  componentDidMount() {
    this.fetchActivity();
  }

  fetchActivity = (params = {}) => {
    this.setState({ loading: true });
    getOneAccountActivity(this.props.match.params.id)
      .then((response) => {
        this.setState({ 
          activity: this.props.hideTitle ? response.data.data.slice(0,10) : response.data.data,
          loading: false,
          pagination: {
            ...this.state.pagination,
            current: params.page || 1,
            total: this.props.hideTitle ? 10 : response.data.count,
          },
        });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).forEach((e) => {
            message.error(err.response.data[e]);
          });
        }
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  handleChange = (pagination) => {
    this.fetchActivity({page: pagination.current})
  }

  render() {
    const { activity, loading } = this.state;
    return (
      <React.Fragment>
        <div
          className={`row mx-0 ${
            !this.props.hideTitle ? "mt-30 no-data-card-row-new" : ""
          }`}
        >
          {this.props.hideSearch && (
            <div className="col-12">
              <div className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center carpet-cleaning-mini-header">
                {/* <div className="search-bar-div">
                                    <Form className="position-relative">
                                      <Input placeholder="Search"/>
                                      <Button
                                        className='search-btn position-absolute p-0 border-0 bg-transparent m-auto'>
                                        <img src={Images.search_icon_gray} className="img-fluid"
                                             alt="search icon"/>
                                      </Button>
                                    </Form>
                            </div> */}
                <Button
                  onClick={() => {
                    if (!window.location.href.includes("billing")) {
                      this.props.tabChange("11");
                    } else {
                      this.props.tabChange("10");
                    }
                  }}
                  className="view-all-btn text-uppercase ml-auto"
                >
                  VIEW ALL{" "}
                </Button>
              </div>
            </div>
          )}
          {/* {!this.props.hideSearch &&
                    <div className="col-12">
                        <div className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center carpet-cleaning-mini-header">
                            {/* <div className="search-bar-div">
                                    <Form className="position-relative">
                                      <Input placeholder="Search"/>
                                      <Button
                                        className='search-btn position-absolute p-0 border-0 bg-transparent m-auto'>
                                        <img src={Images.search_icon_gray} className="img-fluid"
                                             alt="search icon"/>
                                      </Button>
                                    </Form>
                            </div> */}
          {/*} <Button onClick={() => this.props.tabChange("10")} className="view-all-btn text-uppercase ml-auto">VIEW ALL </Button>
                        </div>
                    </div>
                    } */}
          {activity ? (
            <div className="col-12 table-responsive main-table-div">
              <Table
                  // scroll={{ y: 450}}
                className="main-table-all"
                columns={this.activityColumns}
                dataSource={activity}
                size="middle"
                onChange={this.handleChange}
                pagination={!this.props.hideTitle && this.state.pagination}
                loading={loading}
              />
            </div>
          ) : (
            <div className="col-12">
              <div className="row no-data-upload-screens no-data-second m-0 border-0">
                <div className="col-12 text-center">
                  <img
                    src={Images.Time_empty_state_icon}
                    alt=""
                    className="img-fluid"
                  />
                  <h6
                    className="mb-0 approved-btn"
                    // style={{ cursor: "pointer" }}
                  >
                    No Activity
                  </h6>
                </div>
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(ActivityInfo);
