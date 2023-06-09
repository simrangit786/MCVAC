import React, { Component } from "react";
import ManagementHeader from "../../../ManagementHeader";
import CommonTable from "../../../../common/CommonTable";
import { routes } from "../../../../../Controller/Routes";
import { handleError } from "../../../../../Controller/Global";
import { getSupplyFamilyById } from "../../../../../Controller/api/supplyServices";
import { withRouter } from "react-router-dom";

class SupplyGroup extends Component {
  state = {
    lastChild: [],
    loading: false,
    pagination: {
      current: 1,
      pageSize: 15,
    },
  };
  supplyGroupColumns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Supplies / Small Tools",
      dataIndex: "supply",
      sorter: true,
    },
  ];

  componentDidMount() {
    this.getGroups();
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.getGroups({ page: pagination.current });
  };

  getGroups = (params = {}) => {
    this.setState({ loading: true });
    getSupplyFamilyById(this.props.match.params.id, params)
      .then((res) => {
        this.fetchLastChild(res.data.parent.children, [], res.data.parent.name);
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        handleError(err);
      });
  };

  fetchLastChild = (data, prevArr, parent) => {
    data.forEach((item) => {
      item.parent = [...prevArr];
      item.parent.push(parent);
      let children = item.children.filter((i) => !i.type);
      if (children.length === 0) {
        delete item.children;
        this.setState((prevState) => ({
          lastChild: [...prevState.lastChild, item],
        }));
      } else {
        this.fetchLastChild(children, item.parent, item.name);
      }
    });
  };

  onSearch = (e) => {
    this.getGroups({ search: e.target.value });
  };

  render() {
    return (
      <div className="row">
        <div className="col-12">
          <ManagementHeader
            buttonLink={
              routes.dashboard.management.supply_tools.supply_groups.create
            }
            buttonName={"Create Supply Group"}
            onSearch={this.onSearch}
          />
          <div className="row mt-4 mx-0 opportunities-table-main-dashboard">
            <div className="col-12">
              <div className="row">
                <CommonTable
                  data={this.state.lastChild}
                  loading={this.state.loading}
                  pagination={false}
                  onTableChange={this.handleTableChange}
                  rowLink={
                    routes.dashboard.management.supply_tools.supply_groups.view
                  }
                  columns={this.supplyGroupColumns}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SupplyGroup);
