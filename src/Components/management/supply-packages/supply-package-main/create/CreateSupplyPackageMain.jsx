import React, { Component } from "react";
import { Button, Collapse } from "antd";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../../../Store/actions/breadcrumbAction";
import { routes } from "../../../../../Controller/Routes";
import { history } from "../../../../../Controller/history";
import { reverse } from "named-urls/dist/index.es";
import CommonConfirmationModal from "../../../../modals/CommonConfirmationModal";
import CommonWarningModal from "../../../../modals/CommonWarningModal";
import RequireSuccessModal from "../../../../modals/requiredDataModals/RequireSuccessModal";
import { withRouter } from "react-router-dom";
import GeneralInformation from "./GeneralInformation";
import ServiceTree from "./ServiceTree";
import { CaretRightOutlined } from "@ant-design/icons";
import { getSupplyFamilyById } from "../../../../../Controller/api/supplyServices";
import { handleError } from "../../../../../Controller/Global";
import { getActiveKey } from "../../../../../Controller/utils";
import { Image } from "../../../../Images";
import UnsavedDataPrompt from "../../../../modals/UnsavedDataPrompt";

const { Panel } = Collapse;

class CreateSupplyPackageMain extends Component {
  state = {
    current: 0,
    packageData: null,
    visible: false,
    visibleWarning: false,
    activeKey: ["1"],
    unsavedExit: false,
    requiredSuccessModalVisible: false,
  };

  showConfirmModal = (visible) => {
    this.setState({
      visible: visible,
    });
  };
  showWarningModal = (visible) => {
    this.setState({
      visibleWarning: visible,
    });
  };
  showRequiredSuccessModal = (visible) => {
    this.setState({
      requiredSuccessModalVisible: visible,
    });
  };

  prev = () => {
    this.setState({ current: this.state.current - 1 });
  };

  componentDidMount() {
    let arrCreate = [
      {
        title: "Create Supply Family",
        url: routes.dashboard.management.supply_tools.supply_packages.create,
      },
    ];
    let arrEdit = [
      {
        title: "Edit Supply Family",
        url: routes.dashboard.management.supply_tools.supply_packages.edit,
      },
    ];
    this.props.setBreadcrumb(this.props.match.params.id ? arrEdit : arrCreate);

    if (this.props.match.params.id) {
      this.getPackage(this.props.match.params.id);
      this.setState({ activeKey: this.props.location.editTab || "1" })
    }
  }

  onCompleteSupplyFamily = () => {
    // message.success('Supply Family completed!')
    history.push(
      reverse(routes.dashboard.management.supply_tools.supply_packages.view, {
        id: this.state?.packageData?.id,
      })
    );
  };

  setPackage = (packageData, num) => {
    // if (this.state.packageData?.name && this.state.packageData?.description) {
    if (this.state.packageData?.name) {
      this.setState(() => {
        return { packageData };
      });
    } else {
      this.setState(() => {
        return { packageData, unsavedExit: true };
      });
    }

    let alreadyExist = null;
    if (this.state.activeKey.length > 1) {
      alreadyExist = this.state.activeKey.find((i) => i == num);
    }
    if (!alreadyExist) {
      this.setState((prevState) => {
        return {
          packageData,
          activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "2")],
        };
      });
    }
    // this.setState({packageData, activeKey: getActiveKey(this.state.activeKey, "2")})
  };

  getPackageData = (id) => {
    this.setState({ loading: true});
    getSupplyFamilyById(id).then((res) => {
      this.setState({packageData: res.data},() => {
        this.setState({loading: false})
      })

    })
  }

  getPackage = async (id) => {
    this.setState({ loading: true });
    getSupplyFamilyById(id)
      .then((res) => {
        this.setState({ packageData: res.data }, () => {
          let pd = this.state?.packageData;
          // if (pd?.name && pd?.description) {
          if (pd?.name) {
            if (!pd?.parent?.children?.length) {
              if (this.props.match.params.id) {
                //do nothing
              } else {
                this.setState({ packageData: pd, unsavedExit: true });
              }
            } else {
              this.setState({ packageData: pd, unsavedExit: false });
              if (!this.props.match.params.id) {
                this.setState({ requiredSuccessModalVisible: true });
              }
            }
          }
        });
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        this.setState({ loading: false });
      });

    // if (this.state.packageData?.name && this.state.packageData?.description) {
    //     console.log("getPackage children", this.state.packageData.parent.children)
    //     if (!this.state.packageData?.parent?.children?.length) {
    //         if (this.props.match.params.id) {
    //             //do nothing
    //         }
    //         else {
    //             this.setState({ unsavedExit: true })
    //         }
    //     }
    //     else {
    //         this.setState({ unsavedExit: false })
    //     }
    // }
  };

  collapseOnChange = (activeKey) => {
    this.setState({ activeKey });
  };

  handleViewMainButtonCLick = () => {
    let { data } = this.state;
    if (this.props?.match?.params?.id) {
      this.onCompleteSupplyFamily();
    } else {
      this.showConfirmModal(true);
    }
  };

  render() {
    let { packageData, activeKey } = this.state;
    return (
      <React.Fragment>
        {/* <UnsavedDataPrompt unsavedExit={this.state.unsavedExit} exit={true} message={""} /> */}
        <UnsavedDataPrompt
          // unsavedExit={this.state.unsavedExit} exit={true} message={""}
          when={this.state.unsavedExit}
          title="You haven't added all of the required information."
          cancelText="Continue"
          okText="Exit"
          onOK={() => true}
          onCancel={() => false}
        />
        <div className="main-content-div">
          <div className="row mx-0 create-opportunity-row">
            <div className="col-12 col-sm-10">
              <div className="steps-content">
                <Collapse
                  //   accordion
                  expandIcon={({ isActive }) => (
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                  )}
                  // defaultActiveKey={["1"]}
                  activeKey={activeKey}
                  onChange={this.collapseOnChange}
                >
                  <Panel
                    header={
                      <div className="w-100 d-flex info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          General Information <sup>*</sup>
                        </h5>
                        {/* {
                          packageData && packageData.name != "" ? (
                            <img alt={""} src={Image.create_ac_checkmark} />
                          ) : (
                            ""
                          )
                          // <Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>
                        } */}
                      </div>
                    }
                    key="1"
                  >
                    <GeneralInformation
                      packageData={this.state.packageData}
                      setPackage={this.setPackage}
                      getPackage={this.getPackage}
                    />
                  </Panel>
                  <Panel
                    disabled={!packageData}
                    header={
                      <div className="w-100 d-flex info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          Supply Family <sup>*</sup>
                        </h5>
                        {/* {
                          packageData &&
                          packageData.parent.children.length > 0 ? (
                            <img alt={""} src={Image.create_ac_checkmark} />
                          ) : (
                            ""
                          )
                          // <Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>
                        } */}
                      </div>
                    }
                    key="2"
                  >
                    <ServiceTree
                      packageData={this.state.packageData}
                      setPackage={this.setPackage}
                      getPackage={this.getPackage}
                      getPackageData={this.getPackageData}
                    />
                  </Panel>
                </Collapse>
              </div>
              <div className="steps-action common-steps-action d-flex align-items-center justify-content-end">
                <Button
                  className="border-0 shadow-none text-center"
                  style={{ margin: "0 8px" }}
                  onClick={() => this.showWarningModal(true)}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  className="border-0 shadow-none text-center"
                  onClick={() =>
                    this.state.unsavedExit
                      ? this.onCompleteSupplyFamily()
                      : this.handleViewMainButtonCLick()
                  }
                >
                  {`View Supply Family`}
                </Button>
                {/* )} */}
              </div>
            </div>
          </div>
        </div>
        <CommonConfirmationModal
          heading={`You’ve successfully ${
            this.props.match.params.id ? "updated" : "created"
          } this Supply Family!`}
          subHeading={
            <p className="mb-0">
              To view, select{" "}
              <Button
                onClick={this.onCompleteSupplyFamily}
                className="p-0 bg-transparent shadow-none border-0"
              >
                View Supply Family
              </Button>
              .
            </p>
          }
          okTitle={"View Supply Family"}
          okAction={this.onCompleteSupplyFamily}
          visible={this.state.visible}
          onClose={() => this.showConfirmModal(false)}
        />

        <CommonWarningModal
          visible={this.state.visibleWarning}
          onClose={() => this.showWarningModal(false)}
          heading={`Are you sure you want to exit ${
            this.props.match.params.id ? "editing" : "creating"
          } this Supply Family?`}
        />
        <RequireSuccessModal
          visible={this.state.requiredSuccessModalVisible}
          heading={"You've successfully added all of the required information."}
          subHeading={
            "Thank you for adding all the required information! To continue adding optional information, select Continue. To view the supply family, select View supplyFamily."
          }
          onClose={() => {
            this.showRequiredSuccessModal(false);
          }}
          okText={"View supplyFamily"}
          onOK={() => {
            this.showRequiredSuccessModal(false);
            history.push(
              reverse(
                routes.dashboard.management.supply_tools.supply_packages.view,
                { id: this.state?.packageData?.id }
              )
            );
          }}
        />
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(
  withRouter(CreateSupplyPackageMain)
);
