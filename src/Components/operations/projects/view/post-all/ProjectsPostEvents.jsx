import React, {Component} from 'react';
import {Checkbox, Table} from "antd";
import moment from 'moment';
import { getShortName, titleCase } from '../../../../../Controller/utils';
import { Image as Images } from "../../../../Images";

class ProjectsPostEvents extends Component {
    getPostDateColor = (data) => {
        const date = data.due_date;
        const completed = data.completed;
        let currentDate = new moment();
        if(date) {
        if (completed) return "gray";
        else if (currentDate.isSame(date, "day")) return "#F2994A";
        // today
        else if(!date) return "gray";
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
        else if(!date) {
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
                onChange={() => this.props.changePostStatus(data, !data.completed)}
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
          title: "ASSIGNEE",
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
          title: <div className="position-relative">DUE DATE</div>,
          sorter: true,
          render: (data) => (
            <>
              {data ? (
                <span
                  className="main-status-btn approved-btn"
                  style={{ color: this.getPostDateColor(data) }}
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
        const {posts,showPostDrawer} = this.props
        return (<React.Fragment>
                {posts.length > 0 ? (
                <div className="col-12 p-0 table-responsive main-table-div mb-3">
                    <Table
                        onRow={(record, rowIndex) => {
                          return {
                            onClick: (event) => {
                              showPostDrawer(true, record);
                            },
                          };
                        }}
                        className="main-table-all"
                        columns={this.postColumns}
                        // pagination={!this.props.viewAll && this.state.pagination }
                        // onChange= {this.handleChange}
                        dataSource={this.posts}
                        size="middle"
                        rowClassName={(record) => {
                          if (record.completed) {
                            return "post-opacity";
                          }
                        }}
                    />
                </div>
                )
            :
            (
            <div className="col-12">
              <div className="row mt-3 no-data-card-row border-0 bg-transparent align-items-center justify-content-center">
                <div
                  className="col-12 text-center cursor-pointer"
                  onClick={() => showPostDrawer(true)}
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
            </React.Fragment>);
    }
}

export default ProjectsPostEvents;