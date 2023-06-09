import React, { Component } from "react";
import { Button, Form, Input, message, Table } from "antd";
import { Image as Images } from "../../Images";
import { getOneContactActivity } from "../../../Controller/api/contactsServices";
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
        <div>{moment(modified).format("MMM DD,YYYY hh:mm A")}</div>
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
        <div className='className="d-flex align-items-center"'>
          <span className="assign-tag-card d-flex float-left align-items-center justify-content-center text-uppercase rounded-circle">
            {user.split(" ")[0].split("")[0]}
            {user.split(" ")[1].split("")[0]}
          </span>
          {user}
        </div>
      ),
    },
  ];
  componentDidMount() {
    this.fetchActivity();
  }
  // activityData = [
  //     {
  //         key: '1',
  //         activity_date: <div>Dec 01, 2019 11:21 AM</div>,
  //         action: <div>Created Work Order : 123-4567-890</div>,
  //         employee: <div className="d-flex align-items-center">
  //             <span
  //                 className="assign-tag-card d-flex align-items-center justify-content-center text-uppercase rounded-circle">MM</span>
  //             Mike Malone</div>
  //     }, {
  //         key: '2',
  //         activity_date: <div>Dec 01, 2019 11:21 AM</div>,
  //         action: <div>Created Work Order : 123-4567-890</div>,
  //         employee: <div className="d-flex align-items-center">
  //             <span
  //                 className="assign-tag-card d-flex align-items-center justify-content-center text-uppercase rounded-circle">MM</span>
  //             Mike Malone</div>
  //     }, {
  //         key: '3',
  //         activity_date: <div>Dec 01, 2019 11:21 AM</div>,
  //         action: <div>Created Work Order : 123-4567-890</div>,
  //         employee: <div className="d-flex align-items-center">
  //             <span
  //                 className="assign-tag-card d-flex align-items-center justify-content-center text-uppercase rounded-circle">MM</span>
  //             Mike Malone</div>
  //     }, {
  //         key: '4',
  //         activity_date: <div>Dec 01, 2019 11:21 AM</div>,
  //         action: <div>Created Work Order : 123-4567-890</div>,
  //         employee: <div className="d-flex align-items-center">
  //             <span
  //                 className="assign-tag-card d-flex align-items-center justify-content-center text-uppercase rounded-circle">MM</span>
  //             Mike Malone</div>
  //     },
  // ];

  fetchActivity = (params = {}) => {
    this.setState({ loading: true });
    getOneContactActivity(this.props.match?.params.id)
      .then((response) => {
        // console.log(response, "response data");
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
          Object.keys(err.response.data).forEach((e) =>
            message.error(err.response.data[e])
          );
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
            <div className="col-12 p-0">
              <div className="row mx-0 new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center carpet-cleaning-mini-header">
                <Button
                  onClick={() => {
                    this.props.tabChange("9");
                  }}
                  className="view-all-btn text-uppercase ml-auto"
                >
                  VIEW ALL
                </Button>
              </div>
            </div>
          )}
          {/* <div className="col-12">
                        <div
                            className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center carpet-cleaning-mini-header">
                            <div className="search-bar-div">
                                <Form className="position-relative">
                                    <Input placeholder="Search Activity"/>
                                    <Button
                                        className='search-btn position-absolute p-0 border-0 bg-transparent m-auto'>
                                        <img src={Images.search_icon_gray} className="img-fluid"
                                             alt="search icon"/>
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </div> */}
          {/*<div className="col-12 table-responsive main-table-div">*/}
          {/*    <Table*/}
          {/*        className="main-table-all carpet-cleaning-table border-0"*/}
          {/*        columns={this.activityColumns}*/}
          {/*        dataSource={this.activityData}*/}
          {/*        size="middle"*/}
          {/*        pagination={true}*/}
          {/*    />*/}
          {/*</div>*/}
          {/*no-data-screens*/}
          {activity ? (
            <div className="col-12 table-responsive main-table-div p-0">
              <Table
                className=" border-0 carpet-cleaning-table"
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
              <div className="row no-data-upload-screens">
                <div className="col-12 text-center">
                  <img
                    src={Images.Time_empty_state_icon}
                    alt="cloud upload"
                    className="img-fluid"
                  />
                  <h6 className="mb-0 mt-1">No Activity</h6>
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
