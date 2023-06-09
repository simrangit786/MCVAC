import React, { Component } from "react";
import { Table } from "antd";
import { history } from "../../../Controller/history";
import { reverse } from "named-urls";
import { routes } from "../../../Controller/Routes";
import moment from "moment";

const CustomerAccountTableMain = (props) => {
   

  const columns = [
    {
      title: "Account Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      defaultSortOrder: 'ascend',
      render: (name) => (
        <div className="name-id-details">{name}</div>
      )
    },
    {
      title: "Industry",
      dataIndex: "industry",
      key: "industry",
      sorter: true,
      render: (data) => (
        <div className="name-id-details">{data?.title || "-"}</div>
      ),
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
      title: "Primary Team Member",
      dataIndex: "point_customer",
      render: (data) => <div>{data|| "-"}</div>,
      sorter: true,
      key: "point_project",
    },
    {
      title: "Last Activity Date",
      dataIndex: "modified",
      key: "modified",
      sorter: true,
      render: (modified) => (
        <div className="font-weight-normal">
          {moment(modified).format("MMM DD,YYYY hh:mm A")}
        </div>
      ),
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    let symbol = "";
    if (sorter.order === "descend") symbol = "-";
    let params = {
      page: pagination.current,
    };
    if (sorter.columnKey) {
      params.ordering = `${symbol}${sorter.columnKey}`;
    } else {
      params.ordering = "-modified";
    }
    props.fetchTableData(params);
  };

  return (
    <React.Fragment>
      <div className="col-12 table-responsive main-table-div opportunity-db-table customer-account-table">
        <Table
          scroll={{ y: 500 }}
          className="main-table-all"
          columns={columns}
          dataSource={props.data}
          size="middle"
          loading={props.loading}
          pagination={props.pagination}
          locale={props.locale}
          onChange={handleTableChange}
          rowKey={(record) => record.id}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                history.push(
                  reverse(routes.dashboard.customer_account.view, {
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



export default CustomerAccountTableMain;
