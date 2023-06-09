import React, { Component } from "react";
import { Button, Form, Input } from "antd";
import { Image as Images } from "../../../../Images";

class UniversalMeasurementInVentoryView extends Component {
  render() {
    const { inventory } = this.props;
    return (
      <React.Fragment>
        <div className="col-12">
          <div className="row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">
            <div className="search-bar-div">
              <Form className="position-relative">
                <Input placeholder="Search" />
                <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                  <img
                    src={Images.search_icon_gray}
                    className="img-fluid"
                    alt="search icon"
                  />
                </Button>
              </Form>
            </div>
            {/* <Button className="view-all-btn text-uppercase">VIEW ALL </Button> */}
          </div>
          {inventory?.uom_array?.length > 0 ? (
            <div className="row">
              <div className="col-12 my-3">
                <div className="row">
                  <div className="col-12 custom-uom-table">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Unit Name</th>
                          <th>Abbreviation</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="uom-table-small-header">
                          <td colSpan={"2"}>
                            {inventory?.uom_array &&
                              inventory?.uom_array[0] &&
                              inventory?.uom_array[0].unit_type.name}
                          </td>
                        </tr>
                        {inventory?.uom_array?.map((i) => {
                          return (
                            <tr>
                              <td>{i.name}</td>
                              <td>{i.symbol}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="row mx-0 mt-3 no-data-card-row align-items-center justify-content-center">
              <div className="col-12 text-center">
                <img
                  src={Images.measuring_tape_gray_new}
                  alt=""
                  className="img-fluid"
                />
                <h6 className="mb-0">No Universal Units of Measurement</h6>
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}
export default UniversalMeasurementInVentoryView;
