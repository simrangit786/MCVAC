import React, { Component } from "react";
import { Button, Table } from "antd";
import { Image as Images } from "../../Images";

class AllTabs extends Component {
  columns = [
    {
      title: "ID / Name",
      dataIndex: "id_name",
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: true,
    },
    {
      title: "Team",
      dataIndex: "team",
      sorter: true,
    },
    {
      title: (
        <div
          className="position-relative"
          style={{ width: "100%", float: "left" }}
        >
          Last Activity Date
          <Button className="border-0 bg-transparent p-0 add-plus-icon position-absolute">
            <img
              src={Images.add_plus_icon_green}
              className="img-fluid"
              alt="plus icon"
            />
          </Button>
        </div>
      ),
      dataIndex: "last_activity_date",
      sorter: true,
    },
  ];
  data = [
    {
      key: "1",
      id_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.work_tab_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">WO67555</div>
        </div>
      ),
      status: (
        <Button className="main-status-btn font-weight-normal progress-btn border-0 bg-transparent">
          Created
        </Button>
      ),
      team: (
        <div className="add-team-div">
          {/*<Button className="add-user-btn">*/}
          {/*    <img src={Images.add_team_user_icon} alt="" className="img-fluid"/>*/}
          {/*</Button>*/}
          <ul className="list-inline mb-0">
            <li className="list-inline-item d-flex align-items-center">
              <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-1 text-uppercase">
                js
              </span>
              <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-2 text-uppercase">
                dl
              </span>
              <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-3 text-uppercase">
                us
              </span>
            </li>
          </ul>
        </div>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
    },
    {
      key: "2",
      id_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.proposals_tab_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">North Shor Spill Mar. 2020</div>
        </div>
      ),
      status: (
        <Button className="main-status-btn font-weight-normal approved-btn border-0 bg-transparent">
          Approved
        </Button>
      ),
      team: (
        <div className="add-team-div">
          <Button className="add-user-btn">
            <img src={Images.add_team_user_icon} alt="" className="img-fluid" />
          </Button>
          {/*<ul className="list-inline mb-0">*/}
          {/*    <li className="list-inline-item d-flex align-items-center">*/}
          {/*        <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-1 text-uppercase">js</span>*/}
          {/*        <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-2 text-uppercase">dl</span>*/}
          {/*        <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-3 text-uppercase">us</span>*/}
          {/*    </li>*/}
          {/*</ul>*/}
        </div>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
    },
    {
      key: "3",
      id_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.folder_tab_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">Hudson Cleanup</div>
        </div>
      ),
      status: (
        <Button className="main-status-btn approved-btn font-weight-normal border-0 bg-transparent">
          In Progress
        </Button>
      ),
      team: (
        <div className="add-team-div">
          {/*<Button className="add-user-btn">*/}
          {/*    <img src={Images.add_team_user_icon} alt="" className="img-fluid"/>*/}
          {/*</Button>*/}
          <ul className="list-inline mb-0">
            <li className="list-inline-item  d-flex align-items-center">
              <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-1 text-uppercase">
                js
              </span>
              <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-2 text-uppercase">
                dl
              </span>
              <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-3 text-uppercase">
                +4
              </span>
            </li>
          </ul>
        </div>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
    },
    {
      key: "4",
      id_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.leads_tab_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">Albertson’s</div>
        </div>
      ),
      status: (
        <div className="status-progress-btn d-flex align-items-center">
          <Button className="main-status-btn border-0 mr-3 font-weight-normal bg-transparent">
            {" "}
            Prospect
          </Button>
          <div className="status-bar-main">
            <span className="status-line active" />
            <span className="status-line" />
            <span className="status-line" />
            <span className="status-line" />
            <span className="status-line" />
          </div>
        </div>
      ),
      team: (
        <div className="add-team-div">
          {/*<Button className="add-user-btn">*/}
          {/*    <img src={Images.add_team_user_icon} alt="" className="img-fluid"/>*/}
          {/*</Button>*/}
          <ul className="list-inline mb-0">
            <li className="list-inline-item d-flex align-items-center">
              <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-1 text-uppercase">
                js
              </span>
              <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-2 text-uppercase">
                dl
              </span>
              <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-3 text-uppercase">
                us
              </span>
            </li>
          </ul>
        </div>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
    },
    {
      key: "5",
      id_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.work_tab_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">WO67555</div>
        </div>
      ),
      status: (
        <Button className="main-status-btn progress-btn font-weight-normal border-0 bg-transparent">
          Created
        </Button>
      ),
      team: (
        <div className="add-team-div">
          {/*<Button className="add-user-btn">*/}
          {/*    <img src={Images.add_team_user_icon} alt="" className="img-fluid"/>*/}
          {/*</Button>*/}
          <ul className="list-inline mb-0">
            <li className="list-inline-item d-flex align-items-center">
              <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-1 text-uppercase">
                js
              </span>
              <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-2 text-uppercase">
                dl
              </span>
              <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-3 text-uppercase">
                us
              </span>
            </li>
          </ul>
        </div>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
    },
    {
      key: "6",
      id_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.proposals_tab_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">North Shor Spill Mar. 2020</div>
        </div>
      ),
      status: (
        <Button className="main-status-btn approved-btn font-weight-normal border-0 bg-transparent">
          Approved
        </Button>
      ),
      team: (
        <div className="add-team-div">
          <Button className="add-user-btn">
            <img src={Images.add_team_user_icon} alt="" className="img-fluid" />
          </Button>
          {/*<ul className="list-inline mb-0">*/}
          {/*    <li className="list-inline-item d-flex align-items-center">*/}
          {/*        <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-1 text-uppercase">js</span>*/}
          {/*        <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-2 text-uppercase">dl</span>*/}
          {/*        <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-3 text-uppercase">us</span>*/}
          {/*    </li>*/}
          {/*</ul>*/}
        </div>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
    },
    {
      key: "7",
      id_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.folder_tab_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">Hudson Cleanup</div>
        </div>
      ),
      status: (
        <Button className="main-status-btn approved-btn font-weight-normal border-0 bg-transparent">
          In Progress
        </Button>
      ),
      team: (
        <div className="add-team-div">
          {/*<Button className="add-user-btn">*/}
          {/*    <img src={Images.add_team_user_icon} alt="" className="img-fluid"/>*/}
          {/*</Button>*/}
          <ul className="list-inline mb-0">
            <li className="list-inline-item  d-flex align-items-center">
              <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-1 text-uppercase">
                js
              </span>
              <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-2 text-uppercase">
                dl
              </span>
              <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-3 text-uppercase">
                +4
              </span>
            </li>
          </ul>
        </div>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
    },
    {
      key: "8",
      id_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.leads_tab_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">Albertson’s</div>
        </div>
      ),
      status: (
        <div className="status-progress-btn d-flex align-items-center">
          <Button className="main-status-btn border-0 mr-3 font-weight-normal bg-transparent">
            {" "}
            Prospect
          </Button>
          <div className="status-bar-main">
            <span className="status-line active" />
            <span className="status-line" />
            <span className="status-line" />
            <span className="status-line" />
            <span className="status-line" />
          </div>
        </div>
      ),
      team: (
        <div className="add-team-div">
          {/*<Button className="add-user-btn">*/}
          {/*    <img src={Images.add_team_user_icon} alt="" className="img-fluid"/>*/}
          {/*</Button>*/}
          <ul className="list-inline mb-0">
            <li className="list-inline-item d-flex align-items-center">
              <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-1 text-uppercase">
                js
              </span>
              <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-2 text-uppercase">
                dl
              </span>
              <span className="team-tag-m d-flex align-items-center justify-content-center rounded-circle team-tag-m-3 text-uppercase">
                us
              </span>
            </li>
          </ul>
        </div>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
    },
  ];

  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-12 table-responsive main-table-div">
            <Table
              className="main-table-all all-tabs-details"
              columns={this.columns}
              dataSource={this.data}
              size="middle"
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AllTabs;
