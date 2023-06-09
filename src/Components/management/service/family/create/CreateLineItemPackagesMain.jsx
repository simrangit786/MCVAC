import React, { Component } from "react";
import { Button, Collapse } from "antd";
import { history } from "../../../../../Controller/history";
import { reverse } from "named-urls/src";
import { routes } from "../../../../../Controller/Routes";
import CommonConfirmationModal from "../../../../modals/CommonConfirmationModal";
import CommonWarningModal from "../../../../modals/CommonWarningModal";
import RequireSuccessModal from "../../../../modals/requiredDataModals/RequireSuccessModal";
import { CaretRightOutlined } from "@ant-design/icons";
import GeneralInformation from "./GeneralInformation";
import ServiceTree from "./ServiceTree";
import { getServiceFamilyById } from "../../../../../Controller/api/lineItemsServices";
import { handleError } from "../../../../../Controller/Global";
import { getActiveKey } from "../../../../../Controller/utils";
import UnsavedDataPrompt from "../../../../modals/UnsavedDataPrompt";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../../../Store/actions/breadcrumbAction";

const { Panel } = Collapse;

class CreateLineItemPackagesMain extends Component {
  state = {
    current: 0,
    packageData: null,
    visible: false,
    warningVisible: false,
    activeKey: "1",
    unsavedExit: false,
    requiredSuccessModalVisible: false,
  };
  showConfirmModal = (visible) => {
    this.setState({
      visible: visible,
    });
  };
  showWarningM = (visible) => {
    this.setState({
      warningVisible: visible,
    });
  };
  showRequiredSuccessModal = (visible) => {
    this.setState({
      requiredSuccessModalVisible: visible,
    });
  };
  next = () => {
    this.setState({ current: this.state.current + 1 });
  };

  prev = () => {
    this.setState({ current: this.state.current - 1 });
  };

  setPackage = (packageData, num) => {
    //  if (this.state.packageData?.name && this.state.packageData?.description) {
    if (this.state.packageData?.name) {
      this.setState(() => {
        return { packageData};
      });
    } else {
      this.setState(() => {
        return { packageData, unsavedExit: true };
      });
      // if(!this.props.match.params.id) {
      //     this.setState({requiredSuccessModalVisible:true})
      // }
    }

    let alreadyExist = null;
    if (this.state.activeKey.length > 1) {
      alreadyExist = this.state.activeKey.find((i) => i == num);
    }
    if (alreadyExist) {
      return null;
    } else {
      this.setState((prevState) => {
        let findLastKey = "";
        for (let i = 0; i <= this.state.activeKey.length; i++) {
          if (i == this.state.activeKey.length) {
            findLastKey = i.toString();
          }
        }
        return {
          packageData,
          activeKey: [
            ...prevState.activeKey,
            ...getActiveKey(findLastKey, "2"),
          ],
        };
      });
    }
    // this.setState({packageData, activeKey: getActiveKey(this.state.activeKey, "2")})
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      let arrEdit = [{ title: "Edit Service Family", url: "#" }];
      this.props.setBreadcrumb(arrEdit);
      this.getPackage(this.props.match.params.id);
      this.setState({ activeKey: this.props.location.editTab || "1" })
    } else {
      let arr = [
        {
          title: "Create Service Family",
          url: "#",
        },
      ];
      this.props.setBreadcrumb(arr);
    }
  }

  getPackageData = (id) => {
    this.setState({loading: true});
    getServiceFamilyById(id)
      .then((res) => {
        this.setState({packageData: res.data})
      })
  }

  getPackage = (id) => {
    this.setState({ loading: true });
    getServiceFamilyById(id)
      .then((res) => {
        this.setState({ packageData: res.data }, () => {
          let pd = this.state.packageData;
          // if (pd?.name && pd?.description) {
          if (pd?.name) {
            if (!pd?.parent?.children?.length) {
              if (this.props.match.params.id) {
                //do nothing
              } else {
                this.setState({ unsavedExit: true });

              }
            } else {
              this.setState({ unsavedExit: false });
              if (!this.props.match.params.id) {
                this.setState({ requiredSuccessModalVisible: true });
              }
              // if(pd.parent.children.length > 1) {
              //     this.setState({
              //         requiredSuccessModalVisible: false
              //     }

              //     )
              // }
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
  };

  collapseOnChange = (activeKey) => {
    this.setState({ activeKey });
  };

  handleViewMainButtonCLick = () => {
    let { packageData } = this.state;
    if (this.props?.match?.params?.id) {
      history.push(
        reverse(routes.dashboard.management.service.family.view, {
          id: packageData.id,
        })
      );
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
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
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
                          Service Family <sup>*</sup>
                        </h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                      </div>
                    }
                    key="2"
                  >
                    <ServiceTree
                      packageData={this.state.packageData}
                      setPackage={this.setPackage}
                      getPackage={this.getPackage}
                      getPackageData = {this.getPackageData}
                    />
                  </Panel>
                </Collapse>
              </div>
              <div className="steps-action common-steps-action d-flex align-items-center justify-content-end">
                <Button
                  className="border-0 shadow-none text-center"
                  style={{ margin: "0 8px" }}
                  onClick={() => this.showWarningM(true)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!packageData}
                  type="primary"
                  className="border-0 shadow-none text-center"
                  onClick={() =>
                    this.state.unsavedExit
                      ? history.push(
                          reverse(
                            routes.dashboard.management.service.family.view,
                            { id: packageData.id }
                          )
                        )
                      : this.handleViewMainButtonCLick()
                  }
                >
                  {`View Service Family`}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <CommonConfirmationModal
          heading={`You’ve successfully ${
            this.props.match.params.id ? "updated" : "created"
          } this Service Family!`}
          subHeading={
            <p className="mb-0">
              To view, select &nbsp;
              <Button
                onClick={() =>
                  history.push(
                    reverse(routes.dashboard.management.service.family.view, {
                      id: packageData.id,
                    })
                  )
                }
                className="bg-transparent border-0 shadow-none p-0"
              >
                View Service Family
              </Button>
              .
            </p>
          }
          okTitle={"View Service Family"}
          okAction={() =>
            history.push(
              reverse(routes.dashboard.management.service.family.view, {
                id: packageData.id,
              })
            )
          }
          visible={this.state.visible}
          onClose={() => this.showConfirmModal(false)}
        />

        <CommonWarningModal
          visible={this.state.warningVisible}
          onClose={() => this.showWarningM(false)}
          heading={`Are you sure you want to exit ${
            this.props.match.params.id ? "editing" : "creating"
          } this Service Family?`}
        />
        <RequireSuccessModal
          visible={this.state.requiredSuccessModalVisible}
          heading={"You've successfully added all of the required information."}
          subHeading={
            "Thank you for adding all the required information! To continue adding optional information, select Continue. To view the service family, select View Service Family."
          }
          onClose={() => {
            this.showRequiredSuccessModal(false);
          }}
          okText={"View Service Family"}
          onOK={() => {
            this.showRequiredSuccessModal(false);
            history.push(
              reverse(routes.dashboard.management.service.family.view, {
                id: packageData.id,
              })
            );
          }}
        />
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(CreateLineItemPackagesMain);
