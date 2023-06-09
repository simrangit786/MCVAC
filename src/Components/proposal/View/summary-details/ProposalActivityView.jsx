import React, { Component } from "react";
import { Button, Form, message, Input, Table } from "antd";
import { Image as Images } from "../../../Images";
import { getProposalActivityInfo } from "../../../../Controller/api/proposalServices";
import { withRouter } from "react-router";
import moment from "moment";
import { UserAddOutlined } from "@ant-design/icons";

// function onChange(e) {
//     console.log(`checked = ${e.target.checked}`);
// }

class ProposalActivityView extends Component {
  state = {
    dataActivity: [],
    loading: false,
    pagination: {
      current: 1,
      pageSize: 15,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
    }
  };
  activityColumns = [
    {
      title: "Date",
      dataIndex: "date",
      sorter: true,
      render: (modified) => (
        <div className="font-weight-normal">
          {moment(modified).format("MMM DD, YYYY hh:mm A")}
        </div>
      ),
    },
    {
      title: "Action",
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
  activityData = [
    {
      key: "1",
      activity_date: "a",
      action: "b",
      employee: "c",
    },
  ];

  componentDidMount() {
    this.fetchActivity();
  }

  fetchActivity = (params = {}) => {
    this.setState({ loading: true });
    getProposalActivityInfo(this.props.match.params.id)
      .then((response) => {
        this.setState({
          dataActivity: this.props.viewAll ? response.data.data.slice(0, 10) : response.data.data,
          loading: false,
          pagination: {
            ...this.state.pagination,
            current: params.page || 1,
            total: this.props.viewAll ? 10 : response.data.count

          }
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
    this.fetchActivity({ page: pagination.current })
  }
  //   onSearch = (e) => {
  //     this.fetchActivity({search: e.target.value})
  //   }

  render() {
    let { dataActivity, loading } = this.state;
    const { viewAll } = this.props;
    return (
      <React.Fragment>
        <div className={`col-12 ${!viewAll ? "mt-30" : ""}`}>
          <div
            className={`row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header border-1 ${!viewAll ? "border-1" : ""
              }`}
          >
            <div className="search-bar-div d-flex align-items-center">
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
            {viewAll && (
              <Button
                onClick={() => this.props.onTabChange("7")}
                className="view-all-btn text-uppercase"
              >
                VIEW ALL{" "}
              </Button>
            )}
          </div>
          <div className="col-12 p-0">
            <div className="row">
              <div className="col-12">
                {dataActivity.length > 0 ? (
                  <div className="row">
                    <div className="col-12 table-responsive main-table-div">
                      <Table
                        className="main-table-all"
                        scroll={{ y: 240 }}
                        columns={this.activityColumns}
                        dataSource={dataActivity}
                        size="middle"
                        pagination={!this.props.viewAll && this.state.pagination}
                        onChange={this.handleChange}
                        loading={loading}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="row mx-0 mt-3 bg-transparent border-0 no-data-card-row align-items-center justify-content-center">
                    <div className="col-12 text-center cursor-pointer">
                      <img
                        src={Images.Time_empty_state_icon}
                        className="img-fluid"
                        alt="search icon"
                      />
                      <h6 className="mb-0 text-gray-tag">No Activity</h6>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(ProposalActivityView);
