import React, { Component } from "react";
import { Button, Checkbox, Form, Input, message, Table } from "antd";
import { Image as Images } from "../../../Images";
import CreateProposalPost from "../../../drawers/proposals/CreateProposalPost";
import CreateInvoicePost from "../../../drawers/invoice/CreateInvoicePost";
import { getInvoicePost, updateInvoicePost } from "../../../../Controller/api/invoiceServices";
import { handleError } from "../../../../Controller/Global";
import { data } from "jquery";
import { getShortName, titleCase } from "../../../../Controller/utils";
import moment from "moment/moment";

class ViewInvoicingPost extends Component {
  state = {
    posts: [],
    drawerData: null,
    loading: false,
    pagination: {
      current: 1,
      pageSize: 15,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
    }
  };

  showPostDrawer = (visible, data = null) => {
    this.setState({
      visibleDrawer: visible,
      drawerData: data,
    });
  };

  componentDidMount() {
    this.fetchPosts();
  }

  fetchPosts = (params = {}) => {
    this.setState({loading: true});
    getInvoicePost({invoice: this.props.Invoice?.id, ...params})
        .then((res) => {
            this.setState({
                posts: res.data.results, loading: false,
            });
        })
        .catch((err) => {
            handleError(err)
        });
};

changePostStatus = (data, completed) => {
  const {posts} = this.state;
  updateInvoicePost(data.id, {completed}).then((response) => {
      const postIndex = posts.findIndex((i) => i.id === data.id);
      posts[postIndex].completed = completed;
      this.setState({posts});
      message.success("Updated post status");
  }).catch(err => {
      handleError(err)
  })
};

getPostDateColor = (data) => {
  const date = data.due_date;
  const completed = data.completed;
  let currentDate = new moment();
  if (date) {
      if (completed) return "gray";
      else if (currentDate.isSame(date, "day")) return "#F2994A";
      // today
      else if (!date) return "gray";
      else if (
          currentDate.diff(date, "hours") >= -24 &&
          currentDate.diff(date, "hours") < 0
      )
          return "#38BC94";
      // tommorow
      else if (currentDate.isAfter(date)) return "#EB5757";
      // past
      else if (currentDate.isBefore(date)) return "#4F4F4F"; // future

      // completed remaining
  } else {
      return "gray";
  }
};
getPostDateText = (data) => {
  const date = data.due_date;
  const completed = data.completed;
  let currentDate = new moment();
  if (date) {
      if (completed) return moment(date).format("MM/DD/YYYY");
      if (currentDate.isSame(date, "day")) return "Due Today";
      else if (!date) {
          return 'No Due Date';
      }
      // today
      else if (
          currentDate.diff(date, "hours") >= -24 &&
          currentDate.diff(date, "hours") < 0
      )
          return "Tomorrow"; // tommorow
      return moment(date).format("MM/DD/YYYY");
  } else {
      return "No Due Date";
  }
};

  postColumns = [
    {
      title: "POST NAME",
      sorter: true,
      render: (data) => (
          <div className="name-id-details">
              <Checkbox
                  className="post-checkbox-opacity"
                  checked={data.completed}
                  onChange={() => this.changePostStatus(data, !data.completed)}
                  onClick={(e) => e.stopPropagation()}
              >
                  {data.name}
              </Checkbox>
          </div>
      ),
  },
    {
      title: "TYPE",
      dataIndex: "post_type",
      sorter: true,
      render: (data) => (
        <div>{titleCase(data) || "-"}</div>

      ) 
    },
    {
      title: "PRIORITY",
      dataIndex: "priority",
      sorter: true,
      render: (data) => (
          <div className="d-flex align-items-center text-capitalize">
          <span
              style={
                  data === "HIGH"
                      ? {backgroundColor: "#eb8357"}
                      : data === "LOW"
                          ? {backgroundColor: "#7fd4ba"}
                          : data === "NORMAL"
                              ? {backgroundColor: "#fcd966"}
                              : null
              }
              className="priority-card-tag rounded-circle"
          />
              {data?.toLowerCase() || "-"}
          </div>
      ),
  },
  {
    title: "ASSIGNEE",
    dataIndex: "assignee",
    sorter: true,
    render: (data) => (
        <div className="d-flex align-items-center text-capitalize">
            {data?.first_name ?
                <span
                    className="assign-tag-card d-flex align-items-center justify-content-center text-uppercase rounded-circle">
          {getShortName(data?.first_name, data?.last_name)}
        </span> : " "
            }
            {`${data?.first_name || ""} ${data?.last_name || "-"}`}
        </div>
    ),
},
    {
      title: "Post Source",
      dataIndex: "post_source",
      sorter: true,
      render: () => (
        <div className="d-flex align-items-center">Opportunity</div>
      ),
    },
    {
      title: <div className="position-relative">DUE DATE</div>,
      sorter: true,
      render: (data) => (
          <>
              {data ? (
                  <span
                      className="main-status-btn approved-btn"
                      style={{color: this.getPostDateColor(data)}}
                  >
              {this.getPostDateText(data)}
            </span>
              ) : (
                  "-"
              )}
          </>
      ),
  },
  ];

  render() {
    const { posts, drawerData } = this.state;
    const { viewAll } = this.props;
    return (
      <div
        className={`col-12 ${!this.props.viewAll ? "mt-30 no-data-card-row-new" : ""
          }`}
      >
        <div
          className={`row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header border-1 ${!this.props.viewAll ? "border-1" : ""
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
            <Button
              onClick={() => this.showPostDrawer(true)}
              className="add-btn-collapse ml-2 text-capitalize"
            >
              + Create
            </Button>
          </div>
          {viewAll && (
            <Button
              // onClick={() => this.props.onTabChange("6")}
              className="view-all-btn text-uppercase"
            >
              VIEW ALL{" "}
            </Button>
          )}
        </div>
        <div className="row">
          {posts.length > 0 ? (
            <div className="col-12 p-0 table-responsive main-table-div mb-3 post-table">
              <Table
                onRow={(record) => {
                  return {
                    onClick: () => {
                      this.showPostDrawer(true, record);
                    },
                  };
                }}
                className="main-table-all"
                columns={this.postColumns}
                pagination={true}
                // onChange={this.handleChange}
                dataSource={posts}
                size="middle"
                // rowClassName={(record) => {
                //   if (record.completed) {
                //     return "post-opacity";
                //   }
                // }}
              />
            </div>
          ) : (
            <div className="col-12">
              <div className="row mt-3 no-data-card-row border-0 bg-transparent align-items-center justify-content-center">
                <div
                  className="col-12 text-center cursor-pointer"
                  onClick={() => this.showPostDrawer(true)}
                >
                  <img
                    src={Images.note_add_new_create_icon}
                    className="img-fluid"
                    alt="search icon"
                  />
                  <h6 className="mb-0 text-green-tag">Create Post</h6>
                </div>
              </div>
            </div>
          )}
        </div>
        <CreateInvoicePost
          data={drawerData}
          visible={this.state.visibleDrawer}
          onSuccess={async () => {
            await this.showPostDrawer(false);
            await this.fetchPosts();
          }}
          onClose={() => this.showPostDrawer(false)}
        />
      </div>
    );
  }
}

export default ViewInvoicingPost;
