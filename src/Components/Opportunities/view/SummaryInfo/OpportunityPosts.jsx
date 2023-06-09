import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Button, Checkbox, Form, Input, Table, message } from "antd";
import { Image as Images } from "../../../Images";
import {
  getOpportunityPost,
  updateOpportunityPost,
} from "../../../../Controller/api/opportunityServices";
import { getShortName, titleCase } from "../../../../Controller/utils";
import CreatePostsDrawer from "../../../drawers/CreatePostsDrawer";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { handleError } from "../../../../Controller/Global";

const OpportunityPosts = props => {
 const  getPostDateColor = (data) => {
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
    }
    else {
      return "gray";
   }
    // completed remaining
  };

  const getPostDateText = (data) => {
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
    }
    else {
      return "No Due Date"
    }
  };

  const postColumns = [
    {
      title: "POST NAME",
      render: (data) => (
        <div className="name-id-details">
          <Checkbox
            checked={data.completed}
            onChange={() => changePostStatus(data, !data.completed)}
            className="post-checkbox-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            {data.name}
          </Checkbox>
        </div>
      ),
      // sorter: true
    },
    {
      title: "TYPE",
      dataIndex: "post_type",
      // sorter: true,
      render: (type) => <div>{titleCase(type)}</div>,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      // sorter: true,
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
      // sorter: true,
      render: (assignee) => (
        <div className="d-flex align-items-center">
          {assignee && (
            <span className="assign-tag-card d-flex align-items-center justify-content-center text-uppercase rounded-circle">
              {getShortName(assignee?.first_name, assignee?.last_name)}
            </span>
          )}
          {assignee?.first_name || ""} {assignee?.last_name || "-"}
        </div>
      ),
    },
    {
      title: "POST SOURCE",
      dataIndex: "post_source",
      render: (source) => <div>{source}</div>,
    },
    {
      title: <div className="position-relative">Due Date</div>,
      sorter: true,
      render: (data) => (
        <span
          className="main-status-btn approved-btn"
          style={{ color: getPostDateColor(data) }}
        >
          {getPostDateText(data)}
        </span>
      ),
    },
  ];

  const [visible, setVisible] = useState(false);
  const [postData, setPostData] = useState([])
  const [selectedData, setSelectedData] = useState(null)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
  })
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOpportunityPosts()
  }, []) 

  const fetchOpportunityPosts = (params = {}) => {
    setLoading(true)
    getOpportunityPost({ opportunity: props.match.params.id, ...params })
      .then((response) => {
        const paginate = {
          ...pagination,
          current: params.page || 1,
          total: !props.viewAll ? 10 : response.data.count,
        }
        setPostData(!props.viewAll ? response.data.results.slice(0,10) : response.data.results)
        setPagination(paginate)
        setLoading(false)
      })
      .catch((err) => {
        handleError(err)
        setLoading(false)
      });
  };
  const showPost = (visible, data = null) => {
    setVisible(visible)
    setSelectedData(data);
  };

  const changePostStatus = (data, completed) => {
    updateOpportunityPost(data.id, { completed }).then((response) => {
      const newArr = [...postData]
      const postIndex = newArr.findIndex((i) => i.id === data.id);
      newArr[postIndex].completed = completed;
      setPostData(newArr)
      message.success("Updated post status");
    });
  };

  const handleChange = (pagination) => {
    fetchOpportunityPosts({page: pagination.current})
  }

  const { hideTitle } = props;
    return (
      <>
        <div className="col-12 p-0">
          <div
            className={`row mx-0 new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header ${
              props.hideTitle ? "border-1" : ""
            }`}
          >
            <div className="d-flex align-items-center">
              <div className="search-bar-div">
                <Form className="position-relative">
                  <Input
                    placeholder="Search"
                    onChange={(e) =>
                      fetchOpportunityPosts({ search: e.target.value })
                    }
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
              <Button
                onClick={() => showPost(true)}
                className="add-btn-collapse"
              >
                + Create
              </Button>
            </div>
            {!hideTitle && (
              <Button
                onClick={() => props.onTabChange("6")}
                className="view-all-btn text-uppercase"
              >
                VIEW ALL{" "}
              </Button>
            )}
          </div>
          <div className="row summary-collapse-inner-row-main px-0 pb-0">
            {postData?.length !== 0 ? (
              <div className="col-12 p-0 table-responsive main-table-div post-table">
                <Table
                  className="main-table-all"
                  columns={postColumns}
                  loading={loading}
                  dataSource={postData}
                  size="middle"
                  rowKey={(record) => record.id}
                  rowClassName={(record) => {
                    if (record.completed) {
                      return "post-opacity";
                    }
                  }}
                  locale={{
                    emptyText: (
                      <div className="col-12">
                        <div className="row no-data-upload-screens no-data-second m-0 border-0">
                          <div className="col-12 text-center">
                            <img
                              src={Images.create_post_icon_gray}
                              alt=""
                              className="img-fluid"
                            />
                            <h6 className="mb-0 text-green-tag">Create Post</h6>
                          </div>
                        </div>
                      </div>
                    ),
                  }}
                  pagination={props.viewAll && pagination}
                  onChange={handleChange}
                  onRow={(record, index) => {
                    return {
                      onClick: (e) => {
                        showPost(true, record)
                      },
                    };
                  }}
                />
              </div>
            ) : (
              <div className="col-12">
                <div className="row no-data-upload-screens no-data-second m-0 border-0">
                  <div
                    onClick={() => showPost(true)}
                    className="col-12 cursor-pointer text-center"
                  >
                    <img
                      src={Images.note_add_new_create_icon}
                      alt=""
                      className="img-fluid"
                    />
                    <h6 className="mb-0 text-green-tag">Create Post</h6>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <CreatePostsDrawer
          data={selectedData}
          onSuccess={async () => {
            await showPost(false);
            await fetchOpportunityPosts();
          }}
          visible={visible}
          onClose={() => showPost(false)}
        />
      </>
    );
}

function mapStateToProps(state) {
  return { ...state };
}

export default connect(mapStateToProps)(withRouter(OpportunityPosts));
