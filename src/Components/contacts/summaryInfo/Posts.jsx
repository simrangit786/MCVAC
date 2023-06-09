import React, { Component } from "react";
import { Button, Checkbox, Form, Input, message, Table } from "antd";
import { Image as Images } from "../../Images";
import ContactPostDrawer from "../../drawers/contact/ContactPostDrawer";
import {
  getContactPost,
  updateContactPost,
} from "../../../Controller/api/contactsServices";
import { withRouter } from "react-router-dom";
import moment from "moment";
import { getShortName } from "../../../Controller/utils";

// function onChange(e) {
//     console.log(`checked = ${e.target.checked}`);
// }

class Posts extends Component {
  state = {
    visible: false,
    posts: [],
    selectedData: null,
    pagination: {
      current: 1,
      pageSize: 15,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
    },
    loading: false,
  };
  postColumns = [
    {
      title: "POST NAME",
      sorter: true,
      render: (data) => (
        <div className="name-id-details">
          <Checkbox
            checked={data.completed}
            onChange={() => this.changePostStatus(data, !data.completed)}
            className="post-checkbox-opacity"
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
        <div className="text-capitalize">
          {data?.split("_").join(" ").toLowerCase() || "-"}
        </div>
      ),
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
                ? { backgroundColor: "#eb8357" }
                : data === "LOW"
                ? { backgroundColor: "#7fd4ba" }
                : data === "NORMAL"
                ? { backgroundColor: "#fcd966" }
                : null
            }
            className="priority-card-tag rounded-circle"
          />
          {data?.toLowerCase() || "-"}
        </div>
      ),
    },
    {
      title: "Assignee",
      dataIndex: "assignee",
      sorter: true,
      render: (data) => (
        <div className="d-flex align-items-center text-capitalize">
        {data?.first_name ?
       <span className="assign-tag-card d-flex align-items-center justify-content-center text-uppercase rounded-circle">
         {getShortName(data?.first_name,data?.last_name)}
       </span> : " "
 }
       {`${data?.first_name || ""} ${data?.last_name || "-"}`}
     </div>
      ),
    },
    {
      title: <div className="position-relative">Due Date</div>,
      sorter: true,
      render: (data) => (
        <span
          className="main-status-btn approved-btn"
          style={{ color: this.getPostDateColor(data) }}
        >
          {this.getPostDateText(data)}
        </span>
      ),
    },
  ];

  changePostStatus = (data, completed) => {
    const { posts } = this.state;
    updateContactPost(data.id, { completed }).then((response) => {
      const postIndex = posts.findIndex((i) => i.id === data.id);
      posts[postIndex].completed = completed;
      this.setState({ posts });
      message.success("Updated post status");
    });
  };

  showPost = (visible, data = null) => {
    this.setState({
      visible: visible,
      selectedData: data,
    });
  };

  getPostDateColor = (data) => {
    const date = data.due_date;
    const completed = data.completed;
    let currentDate = new moment();
    if(date) {
    if (completed) return "gray";
    else if (currentDate.isSame(date, "day")) return "#F2994A";
    // today
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
    if(date) {
    if (completed) return moment(date).format("MM/DD/YYYY");
    if (currentDate.isSame(date, "day")) return "Due Today";
    // today
    else if (
      currentDate.diff(date, "hours") >= -24 &&
      currentDate.diff(date, "hours") < 0
    )
      return "Tomorrow"; // tommorow
    return moment(date).format("MMMM D, YYYY");
    } else {
      return "No Due Date";
    }
  };

  componentDidMount() {
    this.getPosts();
  }

  getPosts = (params = {}) => {
    this.setState({ loading: true });
    getContactPost({ contact: this.props.match.params.id, ...params })
      .then((res) => {
        this.setState({
          posts: this.props.hideTitle ? res.data.results.slice(0,10) : res.data.results,
          loading: false,
          pagination: {
            ...this.state.pagination,
            current: params.page || 1,
            total: this.props.hideTitle ? 10 : res.data.count,
          },
        });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };

  onSearch = (e) => {
    this.getPosts({ search: e.target.value, page: 1 });
  };

  handleChange = (pagination) => {
    this.getPosts({page: pagination.current})
  }

  render() {
    let { pagination, loading } = this.state;
    if (!this.props.pagination) {
      pagination = false;
    }
    return (
      <React.Fragment>
        <div
          className={`row mx-0 ${
            !this.props.hideTitle ? "mt-30 no-data-card-row-new" : ""
          }`}
        >
          {/* {!this.props.hideSearch && */}
          <div className="col-12">
            <div className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center  carpet-cleaning-mini-header">
              <div className="search-bar-div">
                <Form className="position-relative">
                  <Input placeholder="Search" onChange={this.onSearch} />
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
                <Button
                  onClick={() => this.showPost(true)}
                  className="new-opportunity-btn"
                >
                  + Create
                </Button>
              </div>
              {this.props.hideButton && (
                <Button
                  className="view-all-btn text-uppercase ml-auto"
                  onClick={() => this.props.tabChange("8")}
                >
                  VIEW ALL
                </Button>
              )}
            </div>
          </div>
          {/* }  */}
          {this.state.posts.length > 0 ? (
            <div className="col-12 table-responsive main-table-div post-table">
              <Table
                className="carpet-cleaning-table border-0"
                columns={this.postColumns}
                dataSource={this.state.posts}
                size="middle"
                loading={loading}
                onChange={this.handleChange}
                pagination={!this.props.hideTitle && this.state.pagination}
                rowKey={(record) => record.id}
                onRow={(record, index) => {
                  return {
                    onClick: (e) => {
                      this.showPost(true, record);
                    },
                  };
                }}
                rowClassName={(record) => {
                  if (record.completed) {
                    return "post-opacity";
                  }
                }}
                // locale={{emptyText:
                //         (
                //         <div style={{textAlign:"center"}}>
                //             <img src={Images.add_new_notes_icon} alt={"new post"} className={"img-fluid"}/>
                //             <h6 style={{color:"#1ba652",padding:5,fontSize:"13px"}}> Add Post </h6>
                //         </div>
                //         )}}
              />
            </div>
          ) : (
            <div className="col-12">
              <div className="row no-data-upload-screens no-data-second m-0 border-0">
                <div className="col-12 text-center">
                  <img
                    src={Images.note_add_new_create_icon}
                    alt=""
                    className="img-fluid"
                  />
                  <h6
                    onClick={() => this.showPost(true)}
                    className="mb-0 approved-btn"
                    style={{ cursor: "pointer" }}
                  >
                    Create Post
                  </h6>
                </div>
              </div>
            </div>
          )}
        </div>
        <ContactPostDrawer
          data={this.state.selectedData}
          onSuccess={async () => {
            await this.showPost(false);
            await this.getPosts();
          }}
          visible={this.state.visible}
          onClose={() => this.showPost(false)}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(Posts);
