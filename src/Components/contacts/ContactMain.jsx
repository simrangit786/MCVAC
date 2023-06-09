import React, {Component} from "react";
import ContactMinHeader from "../min-header/ContactMinHeader";
import ContactMainTable from "./ContactMainTable";
import {getContact} from "../../Controller/api/contactsServices";
import {connect} from "react-redux";
import {setBreadcrumb} from "../../Store/actions/breadcrumbAction";
import {routes} from "../../Controller/Routes";
import {debounce} from "lodash";
import {Image as Images} from "../Images";

class ContactMain extends Component {
    state = {
        date: {
            start: "",
            end: "",
            start_modified: "",
            end_modified: ""
        },
        pagination: {
            current: 1,
            pageSize: 15,
            showSizeChanger: false,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        }, data: [], loading: false,
    };

    componentDidMount() {
        let arr = [{
            title: "Contacts", url: routes.dashboard.contacts.self,
        },];
        this.props.setBreadcrumb(arr);
        let params = {
            ordering: 'first_name'
        }
        this.fetchTableData(params);
    }

    fetchTableData = (params = {}) => {
        const { search , date} = this.state
        this.setState({loading: true});
        if (!params.ordering) {
            params.ordering = "-modified";
        }
        getContact({...params,page: params.page || 1, search, ...date})
            .then((res) => {
                this.setState({
                    loading: false, data: res.data.results, pagination: {
                        ...this.state.pagination, current: params.page || 1, total: res.data.count,
                    },
                })
            })
            .catch((err) => {
            });
    };

    debounceEvent = (...args) => {
        this.debouncedEvent = debounce(...args);
        return (e) => {
            return this.debouncedEvent(e);
        };
    };

    onSearch = (e) => {
        this.setState({search: e.target.value}, () => {
        this.fetchTableData();
        })
    };

    getLocaleData = () => {
        return (<div className="col-12 no-data-card-row-new-table">
                <div className="row no-data-upload-screens no-data-second m-0 border-0">
                    <div className="col-12 text-center">
                        <img src={Images.person_gray_icon_carve} alt="" className="img-fluid"/>
                        <h6 className="mb-0 no-data-main-tg">No Billing Accounts</h6>
                    </div>
                </div>
            </div>)
    }

    handleDateFilter = (data) => {
        this.setState({date:{...this.state.date,...data}},() => {
            this.fetchTableData()
        })
        
    }

    render() {
        const {data, pagination, loading} = this.state;
        return (<React.Fragment>
                <div className="main-content-div">
                    <ContactMinHeader
                        onSearch={this.debounceEvent(this.onSearch, 1000)}
                        fetchData={(data) => this.handleDateFilter(data)}
                    />
                    <div className="row mx-0 opportunities-table-main-dashboard">
                        <ContactMainTable
                            loading={loading}
                            fetchTableData={this.fetchTableData}
                            data={data}
                            locale={!loading ? {emptyText: this.getLocaleData()}: {emptyText:" "}}
                            pagination={pagination}
                        />

                    </div>
                </div>
            </React.Fragment>);
    }
}

export default connect(null, {setBreadcrumb})(ContactMain);
