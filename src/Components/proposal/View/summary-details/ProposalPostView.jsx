import React, { Component } from "react";
import { Button, Form, Input, Table } from "antd";
import { Image as Images } from "../../../Images";
import CreateProposalPost from "../../../drawers/proposals/CreateProposalPost";
import { getProposalPost } from "../../../../Controller/api/proposalServices";
import { handleError } from "../../../../Controller/Global";
import { formatDate } from "../../../../Controller/utils";
import { withRouter } from "react-router-dom";

class ProposalPostView extends Component {
  state = {
    visible: false,
    drawerData: null,
    posts: [],
  };
  postColumns = [
    {
      title: "Post name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "TYPE",
      dataIndex: "post_type",
    },
    {
      title: "Assignee",
      dataIndex: "assignee",
      render: (data) => <div>{`${data.first_name} ${data.last_name}`}</div>,
    },
    {
      title: <div className="position-relative">DUe Date</div>,
      dataIndex: "due_date",
      render: (data) => <div>{formatDate(data)}</div>,
      sorter: true,
    },
  ];

  showPostDrawer = (visible, data = null) => {
    this.setState({
      visible: visible,
      drawerData: data,
    });
  };

  componentDidMount() {
    console.log("call");
    this.fetchPosts();
  }

  fetchPosts = (params = {}) => {
    params.proposal = this.props.match.params.id;
    getProposalPost({ params })
      .then((res) => {
        this.setState({ posts: res.data.results });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  render() {
    let { posts } = this.state;
    return (
      <React.Fragment>
        <div className="row mx-0">
          <div className="col-12">
            <div className="row mx-0 new-opportunity-header-row align-items-center carpet-cleaning-mini-header">
              <h6 className="mb-0 d-flex align-items-center">
                <aside>Posts</aside>
                {/*<Button className="edit-btn-summary ml-2">*/}
                {/*    <img src={Images.pencil_green} alt="" className="img-fluid"/>*/}
                {/*    Edit*/}
                {/*</Button>*/}
              </h6>
            </div>
          </div>
          <div className="col-12">
            <div className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center  carpet-cleaning-mini-header">
              <div className="search-bar-div d-flex align-items-center">
                <Form className="position-relative">
                  <Input placeholder="Search Post" />
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
                  className="add-btn-collapse ml-2 text-uppercase"
                >
                  CREATE
                </Button>
              </div>
              <div className="new-opportunity-btn-div">
                {/*<Button className="new-opportunity-btn text-capitalize">ADD</Button>*/}
              </div>
            </div>
          </div>
        </div>
        <div className="row mx-0 mt-4">
          <div className="col-12">
            {posts.length > 0 ? (
              <div className="row">
                <div className="col-12 table-responsive main-table-div">
                  <Table
                    onRow={(record, rowIndex) => {
                      return {
                        onClick: (event) => {
                          this.showPostDrawer(true, record);
                        },
                      };
                    }}
                    className="main-table-all"
                    scroll={{ y: 240 }}
                    columns={this.postColumns}
                    dataSource={posts}
                    size="middle"
                    pagination={false}
                  />
                </div>
              </div>
            ) : (
              <div className="row mx-0 bg-transparent border-0 no-data-card-row align-items-center justify-content-center">
                <div className="col-12 text-center cursor-pointer">
                  <img
                    src={Images.add_new_notes_icon}
                    className="img-fluid"
                    alt="search icon"
                  />
                  <h6 className="mb-0 text-green-tag">Create Post</h6>
                </div>
              </div>
            )}
          </div>
        </div>
        <CreateProposalPost
          data={this.state.drawerData}
          visible={this.state.visible}
          onClose={() => this.showPostDrawer(false)}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(ProposalPostView);
