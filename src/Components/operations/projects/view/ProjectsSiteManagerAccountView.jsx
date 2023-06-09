import React, { Component } from "react";
import { Button, Collapse } from "antd";
import { Image as Images } from "../../../Images";
import ProjectsSiteOwnerDetails from "./ProjectsSiteOwnerDetails";
import { getSiteOwnerContacts } from "../../../../Controller/api/projectServices";
import { userTypes } from '../../../../Controller/userTypes';
import { handleError } from '../../../../Controller/Global';

const { Panel } = Collapse;

class ProjectsSiteManagerAccountView extends Component {
    state = {
        data: [],
    };

    componentDidMount() {
        this.fetchSiteOwnerContact();
    }

    fetchSiteOwnerContact = (params = {}) => {
        params.project = this.props.match.params.id;
        getSiteOwnerContacts(params)
            .then((response) => {
                this.setState({ data: response.data.results });
            })
            .catch((err) => {
                handleError(err)
            });
    };
    handleChangeTab = () => {
        this.props.onChange("2");
    };

    render() {
        const { data } = this.state;
        const { viewAll } = this.props;
        return (
            <React.Fragment>
                <div className={`row mx-0 ${!this.props.viewAll ? "sales-site-design-fix" : ""}`}>
                    <div className="col-12">
                        <div
                            className={`row new-opportunity-header-row mt-0 summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header ${!this.props.viewAll ? "mt-30 border-1 d-none" : ""}`}>
                            <div className="search-bar-div d-flex align-items-center">
                                {/*<Form className="position-relative">
                  <Input
                    placeholder="Search"
                    onChange={(e) =>
                      this.fetchSiteOwnerContact({ search: e.target.value })
                    }
                  />
                  <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                    <img
                      src={Images.search_icon_gray}
                      className="img-fluid"
                      alt="search icon"
                    />
                  </Button>
                </Form>*/}
                                {/*<Upload showUploadList={false} customRequest={this.uploadFile}><Button*/}
                                {/*    className="add-btn-collapse ml-2 text-uppercase">+*/}
                                {/*    Upload</Button></Upload>*/}
                            </div>
                            {viewAll && (
                                <Button
                                    onClick={() => this.props.onTabChange("4")}
                                    className="view-all-btn text-uppercase"
                                >
                                    VIEW ALL{" "}
                                </Button>
                            )}
                        </div>
                    </div>
                    {/*{data.length > 0 ?
                        <div className="col-12">
                            {data.map((data, index) => <React.Fragment>
                                <div
                                    className="row mx-0 no-data-card-row mt-4 align-items-center justify-content-center">
                                    <div className='col-12'>
                                        <div
                                            className="row bg-transparent border-0 mb-0 align-items-center user-info-div-main position-relative">
                                            <div className="col-12">
                                                <div className="user-icons-div">
                                                    <img src={Images.person_black_icon} alt=""
                                                         className="img-fluid"/>
                                                </div>
                                                <div className="user-info-div">
                                                    <h6>{data.account?.name}</h6>
                                                    <p className="mb-0">{data.account?.account_type}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {data.site.length > 0 ?
                                    <div className="row mx-0 pb-lg-4 pb-md-4 pb-sm-3">
                                        {data.site.map((site, index) => (<div key={index} className='col-12'>
                                            <div className="row site-details-row-card active position-relative">
                                                <div className="col-12 col-sm-2 bg-gray-main p-0">
                                                    <div className="row mx-0 pt-lg-3 pt-md-3 pt-3">
                                                        <div className="col-12 col-sm-3 pr-lg-0 pr-md-0">
                                                            <img src={Images.location_black_icon} alt=""
                                                                 className="img-fluid"/>
                                                        </div>
                                                        <div className="col-12 col-sm-9 pl-lg-2">
                                                            <span>{site.name}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-7 px-3 py-0">
                                                    <div className="row pt-lg-3 pt-md-3 pt-3">
                                                        <div className="col-12 col-sm-4">
                                                            <h6 className="text-uppercase">ADDRESS</h6>
                                                            <p className="mb-0">{`${site.apartment} ${site.city} ${site.state} ${site.zip_code} ${site.country}`}</p>
                                                        </div>
                                                        <div className="col-12 col-sm-4">
                                                            <h6 className="text-uppercase">EMAIL ADDRESS</h6>
                                                            <p className="mb-0">{site.email}</p>
                                                        </div>
                                                        <div className="col-12 col-sm-4">
                                                            <h6 className="text-uppercase">PHONE NUMBER</h6>
                                                            <p className="mb-0">{formatPhone(site.phone)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-3 py-0 px-3">
                                                    <div className="row mx-0 h-100 align-items-center">
                                                        <div className="col-12 text-right">
                                                            <h5 className="mb-1 text-green-tag"
                                                                style={{fontSize: '16px', fontWeight: '500'}}>Tax
                                                                basis</h5>
                                                            <h6 className="mb-0">New York | 8.875%</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>))}
                                    </div> :
                                    <div
                                        className="row mx-0 no-data-card-row align-items-center justify-content-center">
                                        <div className="col-12 text-center cursor-pointer">
                                            <h6 className="mb-0">No Sites</h6>
                                        </div>
                                    </div>}
                            </React.Fragment>)}
                        </div> :
                        <div className="col-12 mt-3">
                            <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
                                <div className="col-12 text-center">
                                    <img src={Images.no_account_icon} alt={'contact-icon'}
                                         className="img-fluid"/>
                                    <h6 className="mb-0 mt-2">No Site Manager Accounts</h6>
                                </div>
                            </div>
                        </div>
                    }*/}

                    {data?.length > 0 ? (
                        <>
                            {data.map((item, index) => (
                                <div
                                    key={index}
                                    className="col-12 account-contact-collapse-div site-owner-div opportunity-customer-div account-contact-update"
                                >
                                    <Collapse
                                        accordion
                                        defaultActiveKey={["1"]}
                                        className="site-owner-collapse-main"
                                    // expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
                                    >
                                        <Panel
                                            header={
                                                <div
                                                    className="row mx-0 site-details-row-card m-0 no-data-card-row align-items-center position-relative">
                                                    <div className="col-8 col-sm-8 p-0">
                                                        <div className="row mx-0 align-items-center">
                                                            <div className="pl-3 pr-2">
                                                                <img
                                                                    src={Images.person_black_icon}
                                                                    alt=""
                                                                    className="img-fluid"
                                                                />
                                                            </div>
                                                            <div className="">
                                                                <h5 className="text-capitalize">
                                                                    {/* STU SMITH AUTO 16989 */}
                                                                    {" "}{item && item.account && item.account.name}{" "}
                                                                </h5>
                                                                <h6 className="mb-0">
                                                                    {item && item.account && userTypes[item.account.account_type]}{" "}
                                                                    {/* Billing Account */}
                                                                </h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-4 col-sm-4 text-right">
                                                        <ul className="list-inline contact-site-add-card mb-0">
                                                            <li className="list-inline-item">
                                                                <img
                                                                    src={Images.contacts_empty_state_icon}
                                                                    alt={""}
                                                                    className={"img-fluid"}
                                                                />
                                                                <span>
                                                                    {item.contact.length}
                                                                    {/* 2 Contacts */}
                                                                </span>
                                                            </li>
                                                            <li className="list-inline-item">
                                                                <img
                                                                    src={Images.location_gray}
                                                                    alt={""}
                                                                    className={"img-fluid"}
                                                                />
                                                                <span>
                                                                    {item.site.length}
                                                                    {/* 2 Sites */}
                                                                </span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            }
                                            key="1"
                                            forceRender
                                        >
                                            <ProjectsSiteOwnerDetails
                                                data={item}
                                            />
                                        </Panel>
                                    </Collapse>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div
                            className={`col-12 ${!this.props.viewAll ? "no-data-card-row-new" : ""
                                }`}
                        >
                            <div className="row mt-3 mx-0 no-data-card-row align-items-center justify-content-center">
                                <div className="col-12 text-center">
                                    <img
                                        src={Images.Account_no_data_icon}
                                        alt={"contact-icon"}
                                        className="img-fluid"
                                    />
                                    <h6 className="mb-0 mt-2">No Site Manager Accounts</h6>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

export default ProjectsSiteManagerAccountView;
