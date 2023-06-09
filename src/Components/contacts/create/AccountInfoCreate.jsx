import React, { Component } from "react";
import { Button, Dropdown, Form, Input, Menu, message, Select, Spin, } from "antd";
import { withRouter } from "react-router-dom";
import { Image as Images } from "../../Images";
import { getAccount } from "../../../Controller/api/customerAccountServices";
import { getContactPositions, getOneContact, updateContact } from "../../../Controller/api/contactsServices";
import { CUSTOMER, CUSTOMER_OWNER, userTypes } from "../../../Controller/userTypes";
import CreatePositionDrawer from "../../drawers/contact/CreatePositionDrawer";
import { handleError } from "../../../Controller/Global";
import { debounce } from 'lodash';
import AccountCreateTypeModal from '../../modals/AccountCreateTypeModal';
import CustomerAccountDrawer from "../../drawers/customer-account/CustomerAccountDrawer";
import SiteManagerAccountDrawer from "../../drawers/site-manager/SiteManagerAccountDrawer";

const { Option } = Select;
const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

class AccountInfoCreate extends Component {
    state = {
        accounts: [],
        selected: null,
        fetching: false,
        buttonLoading: false,
        positionVisible: false,
        positions: [],
        page: 1,
        totalCount: 0
    };
    formRef = React.createRef();
    menu = (
        <Menu>
            <Menu.Item key="0">
                <Button
                    onClick={() => {
                        this.formRef.current.resetFields();
                        this.setState({ selected: null });
                    }}
                    className="border-0 p-0 shadow-none bg-transparent"
                >
                    Remove
                </Button>
            </Menu.Item>
            <Menu.Item key="1">
                <Button className="border-0 p-0 shadow-none bg-transparent">
                    Edit
                </Button>
            </Menu.Item>
        </Menu>
    );

    fetchAccount = (params = {}) => {
        this.setState({ fetching: true });
        getAccount(params)
            .then((res) => {
                this.setState({ accounts: res.data.results, fetching: false }, () => {
                    this.formRef.current.setFieldsValue({
                        account: null,
                    });
                });
            })
            .catch((err) => {
                if (err.response) {
                    Object.keys(err.response.data).map((e) => {
                        message.error(err.response.data[e]);
                    });
                }
                this.setState({ fetching: false });
            });
    };

    handleChange = (v) => {
        this.formRef.current.setFieldsValue({
            account: null,
        });
        let selectedAcc = this.state.accounts.find((item) => item.id === v);
        this.setState({ selected: selectedAcc });
    };

    onSubmit = (values) => {
        const newValues = {
            ...values,
            account: this.state.selected?.id || null,
        };
        this.setState({ buttonLoading: true });
        updateContact(newValues, this.props.contact.id)
            .then((res) => {
                message.success("Account linked successfully");
                this.props.setContact(res.data, 3);
                this.props.fetchContacts();
                this.setState({ buttonLoading: false });
            })
            .catch((err) => {
                if (err.response) {
                    Object.keys(err.response.data).map((e) => {
                        message.error(err.response.data[e]);
                    });
                }
                this.setState({ buttonLoading: false });
            });
    };

    componentDidMount() {
        if (this.props.match.params.id) {
            getOneContact(this.props.match.params.id)
                .then(res => {
                    this.fetchAccount({
                        search: res.data.account
                            ? res.data.account.name
                            : "",
                    });
                    this.formRef.current.setFieldsValue({
                        // account: this.props.contact.account ? this.props.contact.account.id : "",
                        role: res.data.role,
                    });
                    this.setState({ selected: res.data.account });
                })
                .catch(err => {
                    handleError(err)
                })
        }
    }

    fetchPositions = () => {
        const { page, search } = this.state;
        const params = {
            page, search
        }
        this.setState({ fetching: true })
        getContactPositions(params).then(res => {
            if (page === 1) {
                this.setState({ positions: res.data.results, totalCount: res.data.count })
            }
            else {
                this.setState(prevState => {
                    return { positions: [...prevState.positions, ...res.data.results] }
                })
            }
        }).catch(err => {
            handleError(err)
        }).finally(() => {
            this.setState({ fetching: false })
        })
    }

    showPosition = (visible) => {
        this.setState({
            positionVisible: visible
        })
    }
    debounceEvent = (...args) => {
        this.debouncedEvent = debounce(...args);
        return (e) => {
            return this.debouncedEvent(e);
        };
    };

    handleAccountModal = () => {
        this.setState({ AccountModalVisible: false });
    }

    callbackAccount = (data) => {
        let selectedAcc = data;
        this.setState({ selected: selectedAcc });
    }

    showCustomerAccount = () => {
        this.setState({ customerModalVisible: false });
    };
    
    showSitemanagerAccount = () => {
        this.setState({ ownerModalVisible: false });
    };

    setAccountTypeOrVisible = (createAccountType, visible) => {
        if(createAccountType === CUSTOMER || createAccountType === CUSTOMER_OWNER) {
            this.setState({createAccountType, customerModalVisible: visible})
        }
        else {
            this.setState({createAccountType, ownerModalVisible: visible})
        }
    }

    render() {
        const { fetching, accounts, selected, buttonLoading, positions, totalCount } = this.state;
        return (
            <React.Fragment>
                <div className="row common-form-card-row">
                    <div className="col-12">
                        <div className="row info-gray-div align-items-center">
                            <h6 className="mb-0">
                                Each contact can only be associated with one account.
                            </h6>
                        </div>
                    </div>
                    <div className="col-12 p-0">
                        <Form
                            onFinish={this.onSubmit}
                            hideRequiredMark={true}
                            ref={this.formRef}
                            {...layout}
                            className="main-inner-form"
                        >
                            <div className="row">
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-12">
                                            <Form.Item
                                                name="account"
                                                label={"Account"}
                                                rules={[
                                                    {
                                                        required: false,
                                                        message: "",
                                                    },
                                                ]}
                                                className="position-relative ant-select-single-placeholder"
                                            >
                                                <Select
                                                    placeholder={"Search"}
                                                    notFoundContent={
                                                        fetching ? <Spin size="small" /> : null
                                                    }
                                                    filterOption={false}
                                                    onFocus={() => this.fetchAccount()}
                                                    showSearch={true}
                                                    disabled={selected ? true : false}
                                                    onSearch={this.debounceEvent((e) => this.fetchAccount({ search: e }), 1000)}
                                                    onChange={this.handleChange}
                                                >
                                                    {accounts.map((d) => (
                                                        <Select.Option key={d.id} value={d.id}>
                                                            <div
                                                                className="row mx-0 custom-tree-row align-items-center justify-content-between">
                                                                <div className="common-select-option-row">
                                                                    <div
                                                                        className="select-option-details d-flex align-items-center">
                                                                        <div className={"select-option-icon"}>
                                                                            <img
                                                                                src={Images.account_black_icon}
                                                                                alt=""
                                                                                className="img-fluid"
                                                                            />
                                                                        </div>
                                                                        <h6 className="mb-0">{d.name}</h6>
                                                                    </div>
                                                                </div>
                                                                <div className="text-green-tag select-text-tier">
                                                                    {userTypes[d.account_type]}
                                                                </div>
                                                            </div>
                                                        </Select.Option>
                                                    ))}
                                                </Select>

                                                {/*<Button className="create-btn-main position-absolute">Create</Button>*/}
                                            </Form.Item>
                                            <Button
                                                className="search-icon bg-transparent border-0 p-0 position-absolute">
                                                <img
                                                    src={Images.search_small_icon}
                                                    alt=""
                                                    className="img-fluid"
                                                />
                                            </Button>
                                            <Button
                                                className="create-btn-main position-absolute text-capitalize"
                                                disabled={selected ? true : false}
                                                onClick={() => {
                                                    this.setState({ AccountModalVisible: true });
                                                }}
                                            >
                                                + Create
                                            </Button>
                                        </div>
                                        {!selected && (
                                            <div className="col-12">
                                                <div
                                                    className="row mx-0 no-data-card-row align-items-center justify-content-center contacts-account-empty">
                                                    <div className="col-12 text-center">
                                                        <img
                                                            src={Images.Account_no_data_icon}
                                                            alt=""
                                                            className="img-fluid"
                                                        />
                                                        <h6 className="mb-0 text-gray-tag">No Account</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {selected && (
                                            <div className="col-12">
                                                <div className="row contact-row-line">
                                                    <div className="col-12 col-sm-6">
                                                        <div
                                                            style={{ minHeight: "85px", height: "85px" }}
                                                            className="row mx-0 align-items-center user-info-div-main position-relative opportunity-info-div-main"
                                                        >
                                                            <div className="col-12">
                                                                <div className="user-icons-div">
                                                                    <img
                                                                        src={Images.person_black_icon}
                                                                        alt=""
                                                                        className="img-fluid"
                                                                    />
                                                                </div>
                                                                <div className="user-info-div">
                                                                    <h6>{selected.name}</h6>
                                                                    <p className="mb-0">
                                                                        {userTypes[selected.account_type]}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Dropdown
                                                                overlayClassName="add-remove-dropdown-main"
                                                                overlay={this.menu}
                                                                trigger={["click"]}
                                                            >
                                                                <Button
                                                                    className="ant-dropdown-link ant-dropdown-link-2 border-0 p-0 bg-transparent shadow-none"
                                                                    onClick={(e) => e.preventDefault()}
                                                                >
                                                                    <img
                                                                        src={Images.more_black}
                                                                        alt=""
                                                                        className="img-fluid"
                                                                    />
                                                                </Button>
                                                            </Dropdown>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-sm-6">
                                                        <Form.Item
                                                            name="role"
                                                            label={"Position"}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: "this field is required",
                                                                },
                                                            ]}
                                                        >
                                                            {/* <Input placeholder="Manager"/> */}
                                                            <Select
                                                                placeholder="Search and Select"
                                                                notFoundContent={null}
                                                                filterOption={false}
                                                                onSearch={(e) => {
                                                                    this.setState({ page: 1, search: e }, () => {
                                                                        this.fetchPositions()
                                                                    })
                                                                }}
                                                                showSearch={true}
                                                                onFocus={() => this.fetchPositions()}
                                                                dropdownRender={options => (
                                                                    <>
                                                                        {options}
                                                                        {fetching &&
                                                                            <div className="text-center">
                                                                                <Spin />
                                                                            </div>}
                                                                    </>
                                                                )}
                                                                onPopupScroll={(e) => {
                                                                    e.persist();
                                                                    let target = e.target;
                                                                    if (
                                                                        target.scrollTop + target.offsetHeight ===
                                                                        target.scrollHeight && (totalCount != positions.length)
                                                                    ) {
                                                                        this.setState({ page: this.state.page + 1 }, () =>
                                                                            this.fetchPositions()
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                {positions.map((i, index) => {
                                                                    return (
                                                                        <Option value={i.name} key={`${i.name + index}`}>{i.name}</Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                        </Form.Item>
                                                        <Button
                                                            className="create-btn-main create-btn-main-update position-absolute"
                                                            onClick={() => this.showPosition(true)}
                                                        >
                                                            + Create
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
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
                <CreatePositionDrawer visible={this.state.positionVisible} onClose={() => this.showPosition(false)} />

                <AccountCreateTypeModal
                    PARTIAL_BILLING
                    PARTIAL_MANAGER
                    setAccountType={this.setAccountTypeOrVisible}
                    visible={this.state.AccountModalVisible}
                    // callbackAccount={this.callbackAccount}
                    onClose={() => this.handleAccountModal(false)}
                    // createAccount={true}
                />

                {this.state.customerModalVisible? 
                        <CustomerAccountDrawer 
                        createAccountType={this.state.createAccountType}
                        visible={this.state.customerModalVisible}
                        callbackCustomerAccount={this.callbackAccount}
                        onClose={() => this.showCustomerAccount(false)}
                        // acc_type={this.state.acc_type}
                        />
                        : ""}
                        {this.state.ownerModalVisible?
                        <SiteManagerAccountDrawer
                        createAccountType={this.state.createAccountType}
                        visible={this.state.ownerModalVisible}
                        callbackOwnerAccount={this.callbackAccount}
                        onClose={() => this.showSitemanagerAccount(false)}
                        />
                        : ""}
            </React.Fragment>
        );
    }
}

export default withRouter(AccountInfoCreate);
