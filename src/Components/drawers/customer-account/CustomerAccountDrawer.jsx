import React, { Component } from 'react';
import { Drawer, Form, Input, message, Select } from 'antd';
import { Button } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import PaymentInformation from '../../accounts/customer-account/create/PaymentInformation';
import AddressInformation from '../../accounts/customer-account/create/AddressInformation';
import { getActiveKey } from '../../../Controller/utils';
import { withRouter } from 'react-router-dom';
import { createCustomerAccount } from '../../../Controller/api/customerAccountServices';
import { handleError } from '../../../Controller/Global';
import { Image as Images } from "../../Images";
import { getIndustries } from '../../../Controller/api/ownerAccountServices';
import DrawersUnsavedExitModal from '../../modals/DrawersUnsavedExitModal';



const { Panel } = Collapse;
const { Option } = Select;
const { TextArea } = Input;

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};
class CustomerAccountDrawer extends Component {
    state = {
        account: null,
        payment: null,
        address: null,
        warningModalVisible: false,
        visibleConfirm: false,
        unsavedExit: false,
        activeKey: ["1"],
        buttonLoading: false,
        industry: [],
        page: 1,
    }
    formRef = React.createRef();

    setAccount = (account, num) => {
        if (this.state.account?.name) {
            this.setState(() => {
                return { account };
            });
        } else {
            this.setState(() => {
                // return { account, unsavedExit: true };
                return { account};
            });
        }

        let alreadyExist = null;
        if (this.state.activeKey.length > 1) {
            alreadyExist = this.state.activeKey.find((i) => i == num);
        }
        if (!alreadyExist) {
            this.setState((prevState) => {
                return {
                    account,
                    activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "")],
                };
            });
        }
    };

    handleCollapseChange = (activeKey) => {
        this.setState({ activeKey });
    };
    setAddress = (address) => {
        this.setState({ address, unsavedExit: false });
        if (!this.props.match.params.id) {
            this.setState({ requiredSuccessModalVisible: true });
        }
    };
    setPayment = (payment, num) => {
        let alreadyExist = null;
        if (this.state.activeKey.length > 1) {
            alreadyExist = this.state.activeKey.find((i) => i == num);
        }
        if (!alreadyExist) {
            this.setState((prevState) => {
                return {
                    payment,
                    activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "3")],
                };
            });
        }
    };

    componentDidMount() {
        this.fetchIndustries();
    }

    componentDidUpdate(prevProps, prevState) {
        if((prevProps.visible != this.props.visible) && this.formRef.current) {
            this.formRef.current.setFieldsValue({
                account_type: this.props.createAccountType || "CUSTOMER"
            })
        }
    }
    handleSubmit = (values) => {
        const createValues = {
            ...values,
            industry: values.industry ? values.industry.value : null,
            account_source: values.account_source ? values.account_source : null,
            // account_type: 'CUSTOMER'
        };
        createCustomerAccount(createValues)
            .then((res) => {
                message.success("Account Created Successfully");
                this.setAccount(res.data, 2);
                this.setState({ buttonLoading: false });
                    this.props.callbackCustomerAccount(res.data)
            })
            .catch((err) => {
                handleError(err)
                this.setState({ buttonLoading: false });
            });
    }

    fetchIndustries = () => {
        const params = {
            page: this.state.page,
        };
        getIndustries(params).then((res) => {
            if (this.state.page === 1) {
                this.setState({ industry: res.data.results });
            } else {
                this.setState((prevState) => {
                    return { industry: [...prevState.industry, ...res.data.results] };
                });
            }
        });
    }

    handleClose = () => {
        this.setState({
            payment: [], address: null, account: null, activeKey: ["1"]
        })
        this.props.onClose()
    }

    resetAccountsFields =()=>{
        if (this.state.unsavedExit) {
            this.setState({ drawerVisible: true })
        } else {
            this.props.onClose()
            this.setState({ payment: [], address: null, account: null, activeKey: ["1"] })
        }
    }

    render() {
        let { account, payment, address, activeKey, buttonLoading } = this.state;
        return (
            <>
                <DrawersUnsavedExitModal
                    visible={this.state.drawerVisible}
                    title="You haven't added all of the required information."
                    cancelText="Continue"
                    okText="Exit"
                    onOK={() => {
                        this.props.onClose();
                        this.setState({
                            drawerVisible: false, payment: [], address: null, account: null, activeKey: ["1"]
                        });
                    }}
                    onCancel={() => {
                        this.setState({ drawerVisible: false });
                    }}
                />

                <Drawer
                    centered
                    destroyOnClose={true}
                    title="Create Account"
                    visible={this.props.visible}
                    width={"625px"}
                    placement={"right"}
                    maskClosable={false}
                    className="main-all-form-modal main-drawer-div drawer-update"
                    onClose={() => {
                        this.state.unsavedExit
                            ? this.setState({ drawerVisible: true })
                            : this.handleClose();
                    }}
                    onCancel={() => {
                        this.state.unsavedExit
                            ? this.setState({ drawerVisible: true })
                            : this.props.onClose();
                    }
                    }
                    footer={
                        <div
                            style={{
                                textAlign: "right",
                            }}
                        >
                            <Button
                                onClick={() => {
                                    (this.state.unsavedExit ? (this.setState({ drawerVisible: true })) : (this.props.onClose()))
                                }}
                                style={{ marginRight: 8 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={!(account)}
                                onClick={() => {
                                    this.resetAccountsFields()
                                }}
                                type="primary"
                            >
                                Continue
                            </Button>
                        </div>
                    }
                >
                    <div className="row mx-0 inner-modal-main-row">
                        <div className="col-12">

                            <div className="row summary-info-inner-row">
                                <div className="col-12">
                                    <div className="row mx-0 info-gray-div align-items-center">
                                        <h6 className="mb-0">
                                            Below is the required information to create an account. To add more information, please modify the account from the Accounts & Contacts section.
                                        </h6>
                                    </div>
                                    <Collapse
                                        // accordion
                                        defaultActiveKey={["1"]}
                                        onChange={this.handleCollapseChange}
                                        activeKey={activeKey}
                                        expandIcon={({ isActive }) => (
                                            <CaretRightOutlined rotate={isActive ? 90 : 0} />
                                        )}
                                    >
                                        <Panel
                                            header={
                                                <div className="col-12">
                                                    <div
                                                        className="info-card-heading-row row d-flex align-items-center justify-content-between">
                                                        <span>General Information *</span>
                                                    </div>
                                                </div>
                                            }
                                            key="1"
                                        >
                                            <div className="row common-form-card-row">
                                                <div className="col-12 p-0">
                                                    <Form
                                                        ref={this.formRef}
                                                        onFinish={this.handleSubmit}
                                                        {...layout}
                                                        hideRequiredMark={true}
                                                        className="main-inner-form"
                                                    >
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <div className="row mx-0 info-gray-div align-items-center">
                                                                    <h6 className="mb-0">
                                                                        Please input general information here.
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 ">
                                                                <Form.Item
                                                                    name="name"
                                                                    label={"Account Name *"}
                                                                    rules={[
                                                                        {
                                                                            required: true,
                                                                            message: "this field is required",
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Input placeholder="Account Name" />
                                                                </Form.Item>
                                                            </div>
                                                            <div className="col-12 ">
                                                                <div className="row">
                                                                    <div className="col-12">
                                                                        <Form.Item
                                                                            initialValue={!this.props.createAccountType ? "CUSTOMER":'CUSTOMER_OWNER'}
                                                                            name="account_type"
                                                                            label={"Account Type *"}
                                                                            rules={[
                                                                                {
                                                                                    required: true,
                                                                                    message: "this field is required",
                                                                                },
                                                                            ]}
                                                                            className="position-relative"
                                                                        >
                                                                            <Select
                                                                                disabled={true}
                                                                                showArrow={false}
                                                                                suffixIcon={
                                                                                    <img
                                                                                        alt=""
                                                                                        src={Images.caret_down_small_select}
                                                                                        className="img-fluid"
                                                                                    />
                                                                                }
                                                                                placeholder="Select Payment Term"
                                                                            >
                                                                                <Option value={"CUSTOMER"}>Billing</Option>
                                                                                <Option value={"SITE_OWNER"}>Site Manager</Option>
                                                                                <Option value={"CUSTOMER_OWNER"}>
                                                                                    Billing, Site Manager
                                                                                </Option>
                                                                            </Select>
                                                                        </Form.Item>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 ">
                                                                <div className="row">
                                                                    <div className="col-12">
                                                                        <Form.Item
                                                                            name="industry"
                                                                            label={"Industry"}
                                                                            rules={[
                                                                                {
                                                                                    required: false,
                                                                                    message: "",
                                                                                },
                                                                            ]}
                                                                            className="position-relative remove-padding-placeholder"
                                                                        >
                                                                            <Select
                                                                                labelInValue
                                                                                suffixIcon={
                                                                                    <img
                                                                                        alt=""
                                                                                        src={Images.caret_down_small_select}
                                                                                        className="img-fluid"
                                                                                    />
                                                                                }
                                                                                placeholder="Select"
                                                                                onPopupScroll={(e) => {
                                                                                    e.persist();
                                                                                    let target = e.target;
                                                                                    if (
                                                                                        target.scrollTop + target.offsetHeight ===
                                                                                        target.scrollHeight &&
                                                                                        this.state.page < 3
                                                                                    ) {
                                                                                        this.setState({ page: this.state.page + 1 }, () =>
                                                                                            this.fetchIndustries()
                                                                                        );
                                                                                    }
                                                                                }}
                                                                            >
                                                                                {" "}
                                                                                {this.state.industry.map((i) => {
                                                                                    return <Option value={i.id}>{i.title}</Option>;
                                                                                })}
                                                                            </Select>
                                                                        </Form.Item>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 ">
                                                                <Form.Item
                                                                    name="website"
                                                                    label={"Website"}
                                                                    rules={[
                                                                        {
                                                                            required: false,
                                                                            message: "",
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Input placeholder="www.website.com" />
                                                                </Form.Item>
                                                            </div>

                                                            <div className="col-12 ">
                                                                <div className="row">
                                                                    <div className="col-12">
                                                                        <Form.Item
                                                                            name="account_source"
                                                                            label={"Account Source"}
                                                                            rules={[
                                                                                {
                                                                                    required: false,
                                                                                    message: "",
                                                                                },
                                                                            ]}
                                                                            className="position-relative remove-padding-placeholder account-source-div"
                                                                        >
                                                                            <Select
                                                                                // labelInValue
                                                                                suffixIcon={
                                                                                    <img
                                                                                        alt=""
                                                                                        src={Images.caret_down_small_select}
                                                                                        className="img-fluid"
                                                                                    />
                                                                                }
                                                                                placeholder="Select"
                                                                            >
                                                                                <Option value={"ADVERTISEMENT"}>Advertisement</Option>
                                                                                <Option value={"CONSTRUCTCONNECT"}>
                                                                                    ConstructConnect
                                                                                </Option>
                                                                                <Option value={"WORD_OF_MOUTH"}>Word of Mouth</Option>
                                                                                <Option value={"MARKETING_ASSISTANT"}>
                                                                                    Marketing Assistant
                                                                                </Option>
                                                                            </Select>
                                                                        </Form.Item>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="col-12 ">
                                                                <Form.Item
                                                                    name="epa_id"
                                                                    label={"EPA ID"}
                                                                    rules={[
                                                                        {
                                                                            required: false,
                                                                            message: "",
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Input
                                                                        placeholder="ABC123456789"
                                                                    />
                                                                </Form.Item>
                                                            </div>

                                                            <div className="col-12">
                                                                <Form.Item
                                                                    name="note"
                                                                    label={"Note"}
                                                                    rules={[
                                                                        {
                                                                            // required: true,
                                                                            message: "this field is required",
                                                                        },
                                                                    ]}
                                                                >
                                                                    <TextArea
                                                                        placeholder="Type something"
                                                                        rows={6}
                                                                        style={{ height: "auto", paddingTop: 15 }}
                                                                    />
                                                                </Form.Item>
                                                            </div>
                                                            <div className="col-12 validate-div-col text-md-right">
                                                                <Form.Item>
                                                                    <Button
                                                                        loading={buttonLoading}
                                                                        htmlType="submit"
                                                                        className="validate-btn-main"
                                                                    >
                                                                        Save and Continue
                                                                    </Button>
                                                                </Form.Item>
                                                            </div>
                                                        </div>
                                                    </Form>
                                                </div>
                                            </div>

                                        </Panel>

                                        {/* payment information******************************** */}
                                        <Panel
                                            disabled={!account}
                                            header={
                                                <div className="col-12">
                                                    <div
                                                        className="info-card-heading-row row d-flex align-items-center justify-content-between">
                                                        <span>Payment Information</span>
                                                        {/* <Button
                                                        className="border-0 shadow-none p-0 bg-transparent text-uppercase">required</Button> */}
                                                    </div>
                                                </div>
                                            }
                                            key="2"
                                        >

                                            <PaymentInformation
                                                account={account}
                                                payment={payment}
                                                setPayment={this.setPayment}
                                                gridsm={true}
                                            />
                                        </Panel>

                                        {/* addresss information***************** */}
                                        <Panel
                                            disabled={!account}

                                            header={
                                                <div className="col-12">
                                                    <div
                                                        className="info-card-heading-row row d-flex align-items-center justify-content-between">
                                                        <span>Address Information</span>
                                                        {/* <Button
                                                        className="border-0 shadow-none p-0 bg-transparent text-uppercase">required</Button> */}
                                                    </div>
                                                </div>
                                            }
                                            key="3"
                                        >
                                            <AddressInformation
                                                account={account}
                                                address={address}
                                                setAddress={this.setAddress}
                                                gridsm={true}
                                            />
                                        </Panel>
                                    </Collapse>
                                </div>
                            </div>
                        </div>
                    </div>
                </Drawer>
            </>
        );
    }
}

export default withRouter(CustomerAccountDrawer);