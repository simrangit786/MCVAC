import React, { useEffect, useState } from "react";
import OpportunitiesMiniHeader from "../min-header/OpportunitiesMiniHeader";
import OpportunitiesTableDashboard from "./OpportunitiesTableDashboard";
import { getOpportunities } from "../../Controller/api/opportunityServices";
import { routes } from "../../Controller/Routes";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../Store/actions/breadcrumbAction";
import { debounce } from "lodash";
import {Image as Images} from "../Images";
import { handleError } from "../../Controller/Global";
import { debounceEvent } from "../../Controller/utils";

const OpportunitiesDashboard = props => {
  const [pagination, setPagination] = useState({
    search: "",
    current: 1,
    pageSize: 15,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`
  })
  const [search, setSearch] = useState("");
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let arr = [
      {
        title: "Opportunities",
        url: routes.dashboard.opportunities.self,
      },
    ];
    props.setBreadcrumb(arr);
    fetchTableData();
  }, [search])

  const fetchTableData = (params = {}) => {
    setLoading(true)
    if (!params.ordering) {
      params.ordering = "-modified";
    }
    getOpportunities({...params, search})
      .then((res) => {
        setData(res.data.results);
        setPagination(prevState => {
          return {...prevState, 
                  current: params.page || 1,
                  total: res.data.count}
        })
        setLoading(false)
      })
      .catch((err) => handleError(err));
  };

  // const debounceEvent = (...args) => {
  //   this.debouncedEvent = debounce(...args);
  //   return (e) => {
  //     e.persist();
  //     return this.debouncedEvent(e);
  //   };
  // };
  const onSearch = (e) => {
    // this.setState({search: e.target.value}, () => {
    //   fetchTableData()
    // })
    setSearch(e.target.value)
    // fetchTableData()
  };
  const getLocateData = () =>{
    return (
        <div className="col-12 no-data-card-row-new-table">
            <div className="row no-data-upload-screens no-data-second m-0 border-0">
                <div className="col-12 text-center">
                    <img src={Images.no_opportunities_icon} alt="" className="img-fluid"/>
                    <h6 className="no-data-main-tg mb-0">No Opportunities</h6>
                </div>
            </div>
        </div>
    )
    
  }
  // render() {
    // const { data, pagination, loading } = this.state;
    return (
      <div className="main-content-div">
        <OpportunitiesMiniHeader onSearch={debounceEvent(onSearch,1000)} />
        <div className="row mx-0 opportunities-table-main-dashboard width-160-id">
          <OpportunitiesTableDashboard
            loading={loading}
            fetchTableData={fetchTableData}
            data={data}
            locale={!loading ? {emptyText: getLocateData()}: {emptyText:" "}}
            pagination={pagination}
          />
        </div>
      </div>
    );
  // }
}

export default connect(null, { setBreadcrumb })(OpportunitiesDashboard);
