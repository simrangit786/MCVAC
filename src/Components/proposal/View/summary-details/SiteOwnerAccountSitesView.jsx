import React, { Component } from "react";
import { Image as Images } from "../../../Images";
import { Button, Form, Input } from "antd";

class SiteOwnerAccountSitesView extends Component {
  state = {
    sites: [],
  };

  render() {
    let { sites } = this.state;
    return (
      <React.Fragment>
        <div className="row mx-0">
          <div className="col-12">
            <div className="row mx-0 new-opportunity-header-row align-items-center carpet-cleaning-mini-header">
              <h6 className="mb-0 d-flex align-items-center">
                <aside>
                  Site Account & Sites
                  {/*<span>(6)</span>*/}
                </aside>
                <Button className="edit-btn-summary ml-2">
                  <img src={Images.pencil_green} alt="" className="img-fluid" />
                  Edit
                </Button>
              </h6>
            </div>
          </div>
          <div className="col-12">
            <div className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center  carpet-cleaning-mini-header">
              <div className="search-bar-div">
                <Form className="position-relative">
                  <Input placeholder="Search Site" />
                  <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                    <img
                      src={Images.search_icon_gray}
                      className="img-fluid"
                      alt="search icon"
                    />
                  </Button>
                </Form>
              </div>
              <div className="new-opportunity-btn-div">
                {/*<Button className="new-opportunity-btn text-capitalize">ADD</Button>*/}
              </div>
            </div>
          </div>
        </div>
        <div className="row mx-0 no-data-card-row mt-4 align-items-center justify-content-center">
          <div className="col-12">
            <div className="row bg-transparent border-0 mb-0 align-items-center user-info-div-main position-relative">
              <div className="col-12">
                <div className="user-icons-div">
                  <img
                    src={Images.person_black_icon}
                    alt=""
                    className="img-fluid"
                  />
                </div>
                <div className="user-info-div">
                  <h6>Site Manager Name</h6>
                  <p className="mb-0">Site Manager Account</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {sites.length > 0 ? (
          <div className="row mx-0 pb-lg-4 pb-md-4 pb-sm-3">
            <div className="col-12">
              <div className="row site-details-row-card active position-relative">
                <div className="col-12 col-sm-2 bg-gray-main p-0">
                  <div className="row mx-0 pt-lg-3 pt-md-3 pt-3">
                    <div className="col-12 col-sm-3 pr-lg-0 pr-md-0">
                      <img
                        src={Images.location_black_icon}
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                    <div className="col-12 col-sm-9 pl-lg-2">
                      <span>The Morgan Library & Museum</span>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-7 px-3 py-0">
                  <div className="row pt-lg-3 pt-md-3 pt-3">
                    <div className="col-12 col-sm-4">
                      <h6 className="text-uppercase">ADDRESS</h6>
                      <p className="mb-0">
                        12233 Vose St. New York, New York 10001 USA
                      </p>
                    </div>
                    <div className="col-12 col-sm-4">
                      <h6 className="text-uppercase">EMAIL ADDRESS</h6>
                      <p className="mb-0">email@email.com</p>
                    </div>
                    <div className="col-12 col-sm-4">
                      <h6 className="text-uppercase">PHONE NUMBER</h6>
                      <p className="mb-0">111-111-1111</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-3 py-0 px-3">
                  <div className="row mx-0 h-100 align-items-center">
                    <div className="col-12 text-right">
                      <h5
                        className="mb-1 text-green-tag"
                        style={{ fontSize: "16px", fontWeight: "500" }}
                      >
                        Tax basis
                      </h5>
                      <h6 className="mb-0">New York | 8.875%</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="row site-details-row-card position-relative">
                <div className="col-12 col-sm-2 bg-gray-main p-0">
                  <div className="row mx-0 pt-lg-3 pt-md-3 pt-3">
                    <div className="col-12 col-sm-3 pr-lg-0 pr-md-0">
                      <img
                        src={Images.location_black_icon}
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                    <div className="col-12 col-sm-9 pl-lg-2">
                      <span>The Morgan Library & Museum</span>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-7 px-3 py-0">
                  <div className="row pt-lg-3 pt-md-3 pt-3">
                    <div className="col-12 col-sm-4">
                      <h6 className="text-uppercase">ADDRESS</h6>
                      <p className="mb-0">
                        12233 Vose St. New York, New York 10001 USA
                      </p>
                    </div>
                    <div className="col-12 col-sm-4">
                      <h6 className="text-uppercase">EMAIL ADDRESS</h6>
                      <p className="mb-0">email@email.com</p>
                    </div>
                    <div className="col-12 col-sm-4">
                      <h6 className="text-uppercase">PHONE NUMBER</h6>
                      <p className="mb-0">111-111-1111</p>
                    </div>
                  </div>
                </div>
                {/*<div className="col-12 col-sm-3 py-0 px-3">*/}
                {/*    <div className="row mx-0 h-100 align-items-center">*/}
                {/*        <div className="col-12 text-right">*/}
                {/*            <h5 className="mb-1 text-green-tag" style={{fontSize:'16px', fontWeight:'500'}}>Tax basis</h5>*/}
                {/*            <h6 className="mb-0">New York | 8.875%</h6>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
              </div>
            </div>
          </div>
        ) : (
          <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
            <div className="col-12 text-center cursor-pointer">
              <h6 className="mb-0">Sites</h6>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default SiteOwnerAccountSitesView;
