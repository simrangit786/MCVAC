import React, { Component } from "react";
import ManagementHeader from "../../../ManagementHeader";
import CommonTable from "../../../../common/CommonTable";
import { routes } from "../../../../../Controller/Routes";
import { withRouter } from "react-router-dom";
import { getFleetFamilyPackageById } from "../../../../../Controller/api/vehicleServices";
import { handleError } from "../../../../../Controller/Global";
import {Image as Images} from "../../../../Images";

class VehiclePackageGroup extends Component {
  state = {
    lastChild: [],
    originalLastChild: [],
    loading: false,
    pagination: {
      current: 1,
      pageSize: 15,
    },
  };
  vehicleColumns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Vehicles",
      sorter: true,
      render: (data) => <div>{data.vehicle}</div>,
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
    getFleetFamilyPackageById(this.props.match.params.id)
      .then((res) => {
        this.fetchLastChild(res.data.parent.children, [], res.data.parent.name);
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        handleError(err);
      });

    // params.package = this.props.match.params.id
    // this.setState({loading: true})
    // getVehicleGroup(params).then(res => {
    //     this.setState({
    //         groups: res.data.results, loading: false, pagination: {
    //             ...this.state.pagination,
    //             current: params.page || 1,
    //             total: res.data.count,
    //         },
    //     })
    // }).catch(err => {
    //     handleError()
    //     this.setState({loading: false})
    // })
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
          originalLastChild: [...prevState.originalLastChild, item],
        }));
      } else {
        this.fetchLastChild(children, item.parent, item.name);
      }
    });
  };

  onSearch = (e) => {
    // this.getGroups({search: e.target.value})
    this.setState({
      lastChild: [...this.state.originalLastChild].filter((i) =>
        i.name?.toLowerCase().includes(e.target.value.toLowerCase())
      ),
    });
  };
  getLocaleData = () =>{
      return(
          <div className="col-12 no-data-card-row-new-table">
              <div className="row no-data-upload-screens no-data-second m-0 border-0">
                  <div className="col-12 text-center">
                      <img src={Images.Truck_empty_state_icon} alt="" className="img-fluid"/>
                      <h6 className="mb-0 no-data-main-tg">No Fleet Groups</h6>
                  </div>
              </div>
          </div>
      )
    }
  render() {
    return (
      <React.Fragment>
        <ManagementHeader
          buttonLink={routes.dashboard.management.fleet.groups.create}
          buttonName={"Add Fleet Group"}
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
                rowLink={routes.dashboard.management.fleet.groups.view}
                columns={this.vehicleColumns}
                locale={!this.state.loading ? {emptyText: this.getLocaleData()} : ""}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(VehiclePackageGroup);
