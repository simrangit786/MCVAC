import React, { Component } from "react";
import ManagementHeader from "../../../ManagementHeader";
import CommonTable from "../../../../common/CommonTable";
import { handleError } from "../../../../../Controller/Global";
import { getInventoryPackageById } from "../../../../../Controller/api/inventoryServices";
import { withRouter } from "react-router-dom";
import { routes } from "../../../../../Controller/Routes";

class InventoryGroupView extends Component {
  state = {
    groups: [],
    lastChild: [],
    loading: false,
    pagination: {
      current: 1,
      pageSize: 15,
    },
  };
  inventoryGropusColumns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "inventory items",
      dataIndex: "inventory_items",
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
    getInventoryPackageById(this.props.match.params.id)
      .then((res) => {
        this.fetchLastChild(res.data.parent.children, res.data.parent.name);
        this.setState({ loading: false });
      })
      .catch((err) => {
        handleError(err);
        this.setState({ loading: false });
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
      <React.Fragment>
        <ManagementHeader
          buttonLink={
            routes.dashboard.management.inventory.inventory_groups.create
          }
          buttonName={"Add Inventory Group"}
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
                  routes.dashboard.management.inventory.inventory_groups.view
                }
                columns={this.inventoryGropusColumns}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(InventoryGroupView);
