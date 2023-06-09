import React, { Component } from "react";
import { history } from "../../../../Controller/history";
import { routes } from "../../../../Controller/Routes";
import { reverse } from "named-urls";
import moment from "moment";
import { Table } from "antd";

const OwnerAccountTableMain = (props) => {
 const columns = [
    {
      title: "Account Name",
      dataIndex: "name",
      render: (name) => <div className="name-id-details">{name}</div>,
      defaultSortOrder: 'ascend',
      sorter: true,
      key: "name",
    },
    {
      title: "City",
      dataIndex: "main_address",
      key: "city",
      sorter: true,
      render: (data) => (
        <div className="name-id-details">{data?.city || "-"}</div>
      )
    },
    {
      title: "State",
      dataIndex: "main_address",
      key: "state",
      sorter: true,
      render: (data) => (
        <div className="name-id-details">{data?.state || "-"}</div>
      )
    },

    {
      title: "Last Activity Date",
      dataIndex: "modified",
      render: (modified) => (
        <div className="font-weight-normal">
          {moment(modified).format("MMM DD,YYYY hh:mm A")}
        </div>
      ),
      sorter: true,
      key: "modified",
    },
  ];


    return (
      <React.Fragment>
        <div className="col-12 table-responsive main-table-div opportunity-db-table">
          <Table
              scroll={{ y: 450}}
              className="main-table-all"
              columns={columns}
              dataSource={props.data}
              pagination={props.pagination}
              onChange={props.handleTableChange}
              size="middle"
              loading={props.loading}
              locale={props.locale}
              rowKey={(record) => record.id}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    history.push(
                      reverse(routes.dashboard.owner_account.view, {
                        id: record.id,
                      })
                    );
                  },
                };
              }}
          />
        </div>
      </React.Fragment>
    );
  
}

export default OwnerAccountTableMain;
