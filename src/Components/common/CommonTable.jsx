import React, { Component } from "react";
import { history } from "../../Controller/history";
import { reverse } from "named-urls";
import { checkDisposalFieldsRequired, checkInventoryFieldRequired, checkLaborFieldRequired, checkSupplyFieldRequired, checkFleetFieldsRequired} from "../../Controller/utils";
import { Table } from "antd";

class CommonTable extends Component {
  render() {
    // console.log("props",this.props)
    const {
      data,
      columns,
      rowLink,
      pagination,
      loading,
      checkDisposalRequired,
      checkInventoryRequired,
      checkLaborRequired,
      checkSupplyRequired,
      checkFleetRequired,
        locale
    } = this.props;
    let paginationData = false;
    if (pagination) {
      paginationData = pagination;
    }
    return (
      <div className="col-12 table-responsive main-table-div opportunity-db-table customer-account-table">
        <Table
            scroll={{y: 450}}
          loading={loading}
            locale={locale}
          className="main-table-all"
          columns={columns}
          dataSource={data}
          pagination={paginationData}
          onChange={this.props.onTableChange}
          size="middle"
          rowKey={(record) => record.id}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                history.push(reverse(rowLink, { id: record.id }));
              },
            };
          }}
          rowClassName={(record) => {
            if (checkDisposalRequired && checkDisposalFieldsRequired(record)) {
              return "is-required";
            }
            else if(checkFleetRequired && checkFleetFieldsRequired(record)) {
              return "is-required"
            }
            else if(checkInventoryRequired && checkInventoryFieldRequired(record)) {
              return "is-required";
            }
            else if(checkLaborRequired && checkLaborFieldRequired(record)) {
              return "is-required";
            }
            else if(checkSupplyRequired && checkSupplyFieldRequired(record)) {
              return "is-required";
            }
          }}
         
        />
      </div>
    );
  }
}

export default CommonTable;
