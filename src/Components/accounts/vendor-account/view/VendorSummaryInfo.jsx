import React, {Component} from 'react';
import {Button, Collapse,} from "antd";
import {CaretRightOutlined} from "@ant-design/icons";
import {Image as Images} from "../../../Images";
import VendorAddressInfo from "./VendorAddressInfo";
import VendorGeneralInfo from "./VendorGeneralInfo";
import { withRouter } from 'react-router-dom';
import { getVendorAccountById } from '../../../../Controller/api/vendorAccountServices';
import { handleError } from '../../../../Controller/Global';
import { reverse } from 'named-urls/src';
import { routes } from '../../../../Controller/Routes';
import { history } from '../../../../Controller/history';
import { checkAccountRequired } from '../../../../Controller/utils';
const { Panel } = Collapse;

class VendorSummaryInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loading: false,
        vendor: null
    }
}

componentDidMount() {
    this.fetchVendorData()
}

fetchVendorData = () => {
    this.setState({loading: true})
    getVendorAccountById(this.props.match.params.id).then(res => {
        this.setState({vendor: res.data, loading: false})
    }).catch(err => {
        this.setState({loading: false})
        handleError(err)
    })
}
    render() {
      const {vendor, loading} = this.state;
        return (
        <React.Fragment>
                <div className="row summary-info-row-main">
                  <div className="col-12 p-0">
                    <div className="row mx-0 steps-main-div-inn mt-3">
                      <div className="col-12">
          <div className="row summary-info-inner-row">
            <div className="col-12">
              <Collapse
                defaultActiveKey={["1"]}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
              >
                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        General Information <sup>*</sup>
                      </span>
                      <Button
                        onClick={() =>
                          history.push({
                            pathname: reverse(
                              routes.dashboard.vendor_account.edit,
                              { id: this.props.match.params.id }
                            ),
                            // ,
                            editTab:"1"
                        
                          })
                        }
                        className="edit-btn-summary"
                      >
                        <img
                          src={Images.pencil_green}
                          alt=""
                          className="img-fluid"
                        />
                        Edit
                      </Button>
                    </div>
                  }
                  key="1"
                >
                  <VendorGeneralInfo vendor={vendor} loading={loading} />
                </Panel>
                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        Address Information 
                      </span>
                      <div className="d-flex align-items-center">
                      {/* {checkAccountRequired(vendor,"ADDRESS") && (
                        <p className="mb-0 info-signifire mr-3">
                          Please complete required information to avoid issues
                        </p>)} */}
                      <Button
                        onClick={() =>
                          history.push({
                            pathname: reverse(
                              routes.dashboard.vendor_account.edit,
                              { id: this.props.match.params.id }
                            ),
                            // ,
                            editTab: "2",
                          })
                        }
                        className="edit-btn-summary"
                      >
                        <img
                          src={Images.pencil_green}
                          alt=""
                          className="img-fluid"
                        />
                        Edit
                      </Button>
                      </div>
                    </div>
                  }
                  key="2"
                >
                    <VendorAddressInfo hideTitle={true} vendor={vendor} />
                </Panel>


                {/*<Panel*/}
                {/*  header={*/}
                {/*    <div className="opportunity_info-collapse d-flex align-items-center">*/}
                {/*      <span>Documents </span>*/}
                {/*    </div>*/}
                {/*  }*/}
                {/*  key="5"*/}
                {/*>*/}
                {/*  <DocumentsInfo {...this.props} hideTitle={true} />*/}
                {/*</Panel>*/}
              </Collapse>
            </div>
          </div>
        </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
        );
    }
}

export default withRouter(VendorSummaryInfo);