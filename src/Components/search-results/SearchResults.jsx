import React, { Component } from "react";
import { Button, Collapse, Select, Breadcrumb, Table } from "antd";
import { Image as Images } from "../Images";
import { connect } from "react-redux";
import moment from "moment";
import { routes } from "../../Controller/Routes";
import { CaretRightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { reverse } from "named-urls/src";
import { history } from "../../Controller/history";
import { setBreadcrumb } from "../../Store/actions/breadcrumbAction";
import { isAccessible, Role } from "../../Controller/utils";

const { Panel } = Collapse;
const { Option } = Select;

function handleChange(value) {
  console.log(`selected ${value}`);
}

class SearchResults extends Component {
  accountColumns = [
    {
      title: "Account Name",
      dataIndex: "name",
      sorter: {
        compare: (a, b) => a - b,
      },
    },
    {
      title: "Type",
      dataIndex: "account_type",
      render: (data) =>
        data === "CUSTOMER_OWNER"
          ? "Billing, Site Manager"
          : data === "SITE_OWNER"
          ? "Site Manager"
          : data === "VENDOR"
          ? "Vendor"
          : "Billing",
      sorter: {
        compare: (a, b) => a - b,
      },
    },
    {
      title: <div>Last Activity date</div>,
      dataIndex: "modified",
      render: (data) => moment(data).format("MMM DD,YYYY hh:mm A"),
      sorter: {
        compare: (a, b) => a - b,
      },
    },
  ];

  accountContactColumns = [
    {
      title: "Account Name / Contact Name",
      render: (data) => (data.first_name ? data.first_name : data.name),
      sorter: {
        compare: (a, b) => a - b,
      },
    },
    {
      title: "Type",
      render: (data) =>
        data.account_type === "CUSTOMER_OWNER"
          ? "Billing, Site Manager"
          : data.account_type === "SITE_OWNER"
          ? "Site Manager"
          : data.account_type === "VENDOR"
          ? "Vendor"
          : data.account_type === "CUSTOMER"
          ? "Billing"
          : data.account_type === "contact" ? "Contact" : "Site",
          //  data?.phone_numbers[0]?.phone_number || "-",
      sorter: {
        compare: (a, b) => a - b,
      },
    },
    {
      title: <div>Last Activity date</div>,
      dataIndex: "modified",
      render: (data) => moment(data).format("MMM DD,YYYY hh:mm A"),
      sorter: {
        compare: (a, b) => a - b,
      },
    },
  ];
  contactColumns = [
    {
      title: "Contact Name",
      dataIndex: "full_name",
      sorter: {
        compare: (a, b) => a - b,
      },
    },
    {
      title: "Phone number",
      render: (number) => number[0]?.phone_number || "-",
      dataIndex: "phone_numbers",
      sorter: {
        compare: (a, b) => a - b?.phone_number || 1 - b[0]?.phone_number || 1,
      },
    },
    {
      title: "Email",
      render: (email) => email[0]?.email || "-",
      dataIndex: "emails",
      sorter: {
        compare: (a, b) => a - b?.email || 1 - b[0]?.email || 1,
      },
    },
  ];

      siteColumns = [
        {
            title: "Site Name",
            dataIndex: "name",
            sorter: true,
            render: (name) => name || "-",
            key: "name",
        },
        {
            title: "Site manager Account",
            dataIndex: "account",
            sorter: true,
            key: "account",
            render: (accountName) => <div>{accountName}</div>,
        },
        {
            title: "Address",
            render: (data) => (
                <div>
                    {`${data?.apartment || ""}`} {data.street_address || "-"}
                    <br />
                    {data.city || "-"} {data.city && `${data.city || ""},`}{" "}
                    {data.state || ""}
                    <br />
                    {data.zip_code || ""} {data.country || ""}
                </div>
            ),
        },
        {
            title: "Email Address",
            dataIndex: "email",
            sorter: true,
            key: "email",
            render: (email) => <div>{email || "-"}</div>,
        },
        {
            title: "Phone Number",
            dataIndex: "phone",
            sorter: true,
            key: "phone",
            render: (phone) => <div>{phone || "-"}</div>,
        },
    ];

    ManagementColumns = [
    {
      title: "Name",
      // dataIndex: 'name',
      sorter: true,
      render: (data) =>
        data.name
          ? data.name
          : data.first_name
          ? data.first_name
          : data.labor_group_name
          ? data.labor_group_name
          : "-",
    },
    {
      title: "Type",
      sorter: true,
      render: (item) => {
        const type = item?.type;
        return (
        <div>
          {
            type === 'line_item' ? 'Service' : type === 'service_family' ? 'Service Family' : type === 'supply' ? 'Supply/Small Tools' 
            : type === "supply_family" ? 'Supply Family' : type === "supply_group" ? 'Supply Group' : type === 'employee' ? 'Employee' : type === "labor_group" ? 'Labor Group'
            : type === "inventory_family" ? 'Inventory Family' : type === 'inventory_item' ? 'Inventory Item' : type === 'inventory_kit' ? 'Inventory Kit' : type === 'fleet_family' ? 
            'Fleet Family' : type === 'fleet_group' ? 'Fleet Group' : type === "vehicle" ? 'Vehicle' : type === 'disposal_family' ? 'Disposal Family' : type === 'disposal' ? 'Disposal'
            : ''
          }
        </div>
        )
      }
        // console.log(item)
        // <>
        //   {item?.breadcrumb ? (
        //     <Breadcrumb
        //       separator={
        //         <img
        //           src={Images.arrow_small_breadcrumb}
        //           alt={""}
        //           className="img-fluid"
        //         />
        //       }
        //     >
        //       {item.breadcrumb?.map((name) => {
        //         return (
        //           <Breadcrumb.Item key={name}>
        //             <Link>{name}</Link>
        //           </Breadcrumb.Item>
        //         );
        //       })}
        //       <Breadcrumb.Item key={item.name || ""}>
        //         <Link>{item.name || ""}</Link>
        //       </Breadcrumb.Item>
        //     </Breadcrumb>
        //   ) : (
        //     "-"
        //   )}
        // </>
    },
    {
      title: "Last Activity Date",
      dataIndex: "modified",
      sorter: true,
      render: (date) =>
        moment(date?.modified).format("MMM DD,YYYY hh:mm A") || "-",
    },
  ];
  AllManagementColumns = [
    {
      title: "Name",
      sorter: true,
      render: (data) =>
        data.name
          ? data.name
          : data.first_name
          ? data.first_name
          : data.labor_group_name
          ? data.labor_group_name
          : "-",
    },
    {
      title: "Type",
      sorter: true,
      render: (item) => {
        // console.log(type, "fsdfs")
        const type = item?.type;
        return (
        <div>
          {
            type === 'line_item' ? 'Service' : type === 'service_family' ? 'Service Family' : type === 'supply' ? 'Supply/Small Tools' 
            : type === "supply_family" ? 'Supply Family' : type === "supply_group" ? 'Supply Group' : type === 'employee' ? 'Employee' : type === "labor_group" ? 'Labor Group'
            : type === "inventory_family" ? 'Inventory Family' : type === 'inventory_item' ? 'Inventory Item' : type === 'inventory_kit' ? 'Inventory Kit' : type === 'fleet_family' ? 
            'Fleet Family' : type === 'fleet_group' ? 'Fleet Group' : type === "vehicle" ? 'Vehicle' : type === 'disposal_family' ? 'Disposal Family' : type === 'disposal' ? 'Disposal'
            : ''
          }
        </div>
        )
      }
    },
                      // <>
        //   {item?.breadcrumb ? (
        //     <Breadcrumb
        //       separator={
        //         <img
        //           src={Images.arrow_small_breadcrumb}
        //           alt={""}
        //           className="img-fluid"
        //         />
        //       }
        //     >
        //       {item.breadcrumb?.map((name) => {
        //         return (
        //           <Breadcrumb.Item key={name}>
        //             <Link>{name}</Link>
        //           </Breadcrumb.Item>
        //         );
        //       })}
        //     </Breadcrumb>
        //   ) : (
        //     "-"
        //   )}
        // </>
    {
      title: "Last Activity Date",
      dataIndex: "modified",
      sorter: true,
      render: (date) => moment(date?.modified).format("MMM DD,YYYY hh:mm A"),
    },
  ];

  opportunityColumns = [
    {
      title: "Opportunity name",
      dataIndex: "name",
      sorter: {
        compare: (a, b) => a - b,
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: {
        compare: (a, b) => a - b,
      },
    },
    {
      title: "OPPORTUNITY SOURCE",
      dataIndex: "source",
      render: (data) => <div>{data.name}</div>,
      sorter: {
        compare: (a, b) => a.name?.localeCompare(b.name),
      },
    },
    {
      title: <div className="position-relative">Last Activity Date</div>,
      dataIndex: "modified",
      render: (data) => <div>{moment(data).format("MMM DD,YYYY hh:mm A")}</div>,
      sorter: {
        compare: (a, b) => a - b,
      },
    },
  ];
  proposalColumns = [
    {
      title: "Proposal name",
      dataIndex: "name",
      sorter: {
        compare: (a, b) => a - b,
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: {
        compare: (a, b) => a - b,
      },
      render: (data) => <div className="text-capitalize">{data}</div>,
    },
    {
      title: "Activity",
      dataIndex: "modified",
      sorter: {
        compare: (a, b) => a - b,
      },
      render: (data) => moment(data).format("MMM DD,YYYY hh:mm A"),
    },
  ];
  proposalOpprtunityColumns = [
    {
      title: "Proposal/opportunity name",
      dataIndex: "name",
      sorter: {
        compare: (a, b) => a - b,
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: {
        compare: (a, b) => a - b,
      },
      render: (data) => <div className="text-capitalize">{data}</div>,
    },
    {
      title: "Activity",
      dataIndex: "modified",
      sorter: {
        compare: (a, b) => a - b,
      },
      render: (data) => moment(data).format("MMM DD,YYYY hh:mm A"),
    },
  ];
  leadsColumns = [
    {
      title: "Contact Name",
      dataIndex: "contact_name",
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: true,
    },
    {
      title: "Contact",
      dataIndex: "contact",
      sorter: true,
    },
    {
      title: "Salesperson",
      dataIndex: "salesperson",
      sorter: true,
    },
    {
      title: "Last Activity date",
      dataIndex: "last_activity_date",
      sorter: true,
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      tabPosition: "left",
      accountsData: [],
      accountsColumns: [],
      salesData: [],
      salesColumns: [],
      managementData: [],
      a: this.props.global_search,
      currentSection: "",
      showall: true,
      selectedResult: "all",
      heading: "Accounts & Contacts",
      count: 0,
      salesHeading: "Sales",
      managementHeading: "Management",
      managementColumns: [],
      sitesData: [],
      siteColumns: [],
    };
  }

  componentDidMount() {
    this.setSectionsToAll()
    let arr = [
      {
        title: "Global Search",
        url: "",
      },
    ];
    this.props.setBreadcrumb(arr);
    this.getTotalResults()
  }

  componentDidUpdate(prevProps) {
    if (this.props.global_search !== prevProps.global_search) {
        this.setSectionsToAll()
    }
  }

  setSectionsToAll = () => {
    this.handleSalesSubsectionSearch("all", true);
    this.handleAccountSubsectionSearch("all", true);
    this.handleManagementsectionSearch("all", true);
  }

  changeTabPosition = (e) => {
    this.setState({ tabPosition: e.target.value });
  };

  handleAccountSubsectionSearch = (type, flag) => {
    const { global_search } = this.props;
    let accounts =
      global_search?.accounts_contacts?.accounts.length > 0
        ? global_search?.accounts_contacts?.accounts
        : [];
    let contacts =
      global_search?.accounts_contacts?.contacts.length > 0
        ? global_search?.accounts_contacts?.contacts.map(i => {
          return {...i, account_type: "contact"}
        })
        : [];
    let sitesData = global_search?.accounts_contacts?.sites.length > 0 
        ? global_search?.accounts_contacts?.sites.map(i => {
          return {...i, account_type: 'site'}
        }) : [];

    if (!flag) {
      this.setState({ currentSection: "accounts", showall: false });
    }
    if (type === "all") {
      this.setState({
        accountsData: [...accounts, ...contacts, ...sitesData],
        accountsColumns: this.accountContactColumns,
        heading: "Accounts & Contacts",
        count:
          (global_search?.accounts_contacts?.accounts?.length +
            global_search?.accounts_contacts?.contacts?.length + global_search?.accounts_contacts?.sites?.length) || 0,
      });
      return;
    }
    if (type === "SITES") {
      this.setState({
        accountsData: sitesData,
        accountsColumns: this.siteColumns,
        selectedResult: "SITES",
        heading: "Sites",
        count: sitesData?.length
      });
      return;
    }
    if (type === "CONTACTS") {
      this.setState({
        accountsData: contacts,
        accountsColumns: this.contactColumns,
        selectedResult: "contacts",
        heading: "Contacts",
        count: global_search?.accounts_contacts?.contacts.length || 0,
      });
      return;
    }
    const commonAcc =
      type !== "VENDOR"
        ? accounts?.filter((i) => i.account_type.includes("CUSTOMER_OWNER"))
        : [];
    this.setState({
      accountsData: [
        ...accounts?.filter((i) => i.account_type === type),
        ...commonAcc,
      ],
      accountsColumns: this.accountColumns,
      selectedResult: type,
      heading:
        type === "CUSTOMER"
          ? "Billing Accounts"
          : type === "SITE_OWNER"
          ? "Site Manager Accounts"
          : type === "VENDOR"
          ? "Vendor accounts"
          : "Accounts & Contacts",
      count:
        type === "CUSTOMER"
          ? global_search?.accounts_contacts?.accounts?.filter(
              (i) => i.account_type === "CUSTOMER"
            )?.length +
            global_search?.accounts_contacts?.accounts?.filter((i) =>
              i.account_type.includes("CUSTOMER_OWNER")
            )?.length
          : type === "SITE_OWNER"
          ? global_search?.accounts_contacts?.accounts?.filter((i) =>
              i.account_type.includes("SITE_OWNER")
            )?.length +
            global_search?.accounts_contacts?.accounts?.filter((i) =>
              i.account_type.includes("CUSTOMER_OWNER")
            )?.length
          : type === "VENDOR"
          ? global_search?.accounts_contacts?.accounts?.filter((i) =>
              i.account_type.includes("VENDOR")
            )?.length
          : global_search?.accounts_contacts?.accounts?.length +
            global_search?.accounts_contacts?.contacts?.length,
    });
  };

  handleSalesSubsectionSearch = (type, flag) => {
    const { global_search } = this.props;
    const proposalData =
      global_search?.sales?.proposal.length > 0
        ? global_search?.sales?.proposal.map((i) => {
            return { ...i, type: "proposal" };
          })
        : [];
    const opportunityData =
      global_search?.sales?.opportunity.length > 0
        ? global_search?.sales?.opportunity.map((i) => {
            return { ...i, type: "opportunity" };
          })
        : [];
    if (!flag) {
      this.setState({ currentSection: "sales", showall: false });
    }

    // if(this.state.salesData?.length > 0) {
    if (type === "all") {
      this.setState({
        salesData: [...proposalData, ...opportunityData],
        salesColumns: this.proposalOpprtunityColumns,
        salesHeading: "Sales",
      });
      return;
    }
    if (type === "proposals") {
      this.setState({
        salesData: proposalData,
        salesColumns: this.proposalColumns,
        selectedResult: "proposals",
        salesHeading: "Proposals",
      });
      return;
    }
    if (type === "opportunities") {
      this.setState({
        salesData: opportunityData,
        salesColumns: this.opportunityColumns,
        selectedResult: "opportunities",
        salesHeading: "Opportunities",
      });

      // }
    }
  };

  handleManagementsectionSearch = (type, flag) => {
    const { global_search } = this.props;
    let management = { ...global_search.management };
    // const {disposal, fleet, inventory, labor, supply, service} = global_search.management;
    let alldata = [];
    for (let section in management) {
      //eslint-disable-next-line
      Object.entries(global_search.management[section]).forEach(
        ([key, value]) => {
          value.map((item) => {
            item.breadcrumb = [section, key];
            item.type = key;
          });
          alldata = [...alldata, ...value];
        }
      );
    }
    if (!flag) {
      this.setState({
        currentSection: "management",
        showall: false,
        selectedResult: type,
      });
    }

    if (type === "all") {
      this.setState({
        managementData: alldata,
        managementColumns: this.AllManagementColumns,
        managementHeading: "Management",
      });
      return;
    }

    if (type === "service_family") {
      this.setState({
        managementData: global_search?.management?.service.service_family,
        managementColumns: this.ManagementColumns,
        managementHeading: "Service Family",
      });
      return;
    }
    if (type === "line_items") {
      this.setState({
        managementData: global_search?.management?.service.line_item,
        managementColumns: this.ManagementColumns,
        managementHeading: "Line Items",
      });
      return;
    }
    if (type === "labor_group") {
      this.setState({
        managementData: global_search?.management?.labor.labor_group,
        managementColumns: this.ManagementColumns,
        managementHeading: "Labor Groups",
      });
      return;
    }
    if (type === "employee") {
      this.setState({
        managementData: global_search?.management?.labor.employee,
        managementColumns: this.ManagementColumns,
        managementHeading: "Employees",
      });
      return;
    }
    if (type === "fleet_families") {
      this.setState({
        managementData: global_search?.management?.fleet.fleet_family,
        managementColumns: this.ManagementColumns,
        managementHeading: "Fleet Families",
      });
      return;
    }
    if (type === "fleet_groups") {
      this.setState({
        managementData: global_search?.management?.fleet.fleet_group,
        managementColumns: this.ManagementColumns,
        managementHeading: "Fleet Groups",
      });
      return;
    }
    if (type === "vehicles") {
      this.setState({
        managementData: global_search?.management?.fleet.vehicle,
        managementColumns: this.ManagementColumns,
        managementHeading: "Vehicles",
      });
      return;
    }
    if (type === "inventory_family") {
      this.setState({
        managementData: global_search?.management?.inventory.inventory_family,
        managementColumns: this.ManagementColumns,
        managementHeading: "Inventory Family",
      });
      return;
    }
    if (type === "inventory_kit") {
      this.setState({
        managementData: global_search?.management?.inventory.inventory_kit,
        managementColumns: this.ManagementColumns,
        managementHeading: "Inventory Kit",
      });
      return;
    }
    if (type === "inventory_item") {
      this.setState({
        managementData: global_search?.management?.inventory.inventory_item,
        managementColumns: this.ManagementColumns,
        managementHeading: "Inventory Item",
      });
      return;
    }
    if (type === "supply") {
      this.setState({
        managementData: global_search?.management?.supply.supply,
        managementColumns: this.ManagementColumns,
        managementHeading: "Supply/small Tools",
      });
      return;
    }
    if (type === "supply_family") {
      this.setState({
        managementData: global_search?.management?.supply.supply_family,
        managementColumns: this.ManagementColumns,
        managementHeading: "Supply Families",
      });
      return;
    }
    if (type === "supply_group") {
      this.setState({
        managementData: global_search?.management?.supply.supply_group,
        managementColumns: this.ManagementColumns,
        managementHeading: "Supply Groups",
      });
      return;
    }
    if (type === "disposal") {
      this.setState({
        managementData: global_search?.management?.disposal.disposal,
        managementColumns: this.ManagementColumns,
        managementHeading: "Disposals",
      });
      return;
    }
    if (type === "disposal_family") {
      this.setState({
        managementData: global_search?.management?.disposal.disposal_family,
        managementColumns: this.ManagementColumns,
        managementHeading: "Disposal Family",
      });
    }
  };

  handleOperationsSectionSearch = () => {
    this.setState({currentSection:"ops", showall: false })
  }

  getTotalResults = () => {
    const { global_search } = this.props;
    const totalLength =
      global_search?.accounts_contacts?.accounts?.length +
        global_search?.accounts_contacts?.contacts?.length +
        global_search?.accounts_contacts?.sites?.length +
        global_search?.sales?.proposal.length +
        global_search?.sales?.opportunity.length +
        global_search?.management?.service?.service_family?.length +
        global_search?.management?.service?.line_item?.length +
        global_search?.management?.labor?.labor_group.length +
        global_search?.management?.labor?.employee.length +
        global_search?.management?.fleet?.fleet_family.length +
        global_search?.management?.fleet?.fleet_group.length +
        global_search?.management?.fleet?.vehicle.length +
        global_search?.management?.supply?.supply_family.length +
        global_search?.management?.supply?.supply_group.length +
        global_search?.management?.supply?.supply.length +
        global_search?.management?.inventory?.inventory_family.length +
        global_search?.management?.inventory?.inventory_item.length +
        global_search?.management?.inventory?.inventory_kit.length +
        global_search?.management?.disposal?.disposal_family.length +
        global_search?.management?.disposal?.disposal.length || 0;

    
    return totalLength;

  };
  
  onPanelChange = (key) => {
    switch (key) {
      case "1":
        this.handleAccountSubsectionSearch("all");
        return;
      case "2":
        this.handleSalesSubsectionSearch("all");
        return;
      case "3":
        this.handleOperationsSectionSearch()
        return;
      case "4":
        this.handleManagementsectionSearch("all");
        return;
    }
  };

  redirect = (record, type) => {
    switch (type) {
      case "CUSTOMER":
        return history.push(
          reverse(routes.dashboard.customer_account.view, { id: record.id })
        );
      case "SITE_OWNER":
        return history.push(
          reverse(routes.dashboard.owner_account.view, { id: record.id })
        );
      case ("site"):
        return history.push(
          reverse(routes.dashboard.owner_account.site_account.view, {
            id: record.id,
          })
        );
      case "contact": 
          return history.push(
            reverse(routes.dashboard.contacts.view, {
              id: record.id
            })
          )
      case "CUSTOMER_OWNER":
        return history.push(
          reverse(
            this.state.selectedResult === "CUSTOMER"
              ? routes.dashboard.customer_account.view
              : routes.dashboard.owner_account.view,
            { id: record.id }
          )
        );
      case "proposal":
        return history.push(
          reverse(routes.dashboard.sales.proposal.view, { id: record.id })
        );
      case "opportunity":
        return history.push(
          reverse(routes.dashboard.opportunities.view, { id: record.id })
        );
      case "service_family":
        return history.push(
          reverse(routes.dashboard.management.service.family.view, {
            id: record.id,
          })
        );
      case "line_item":
        return history.push(
          reverse(routes.dashboard.management.service.line_items.view, {
            id: record.id,
          })
        );
      case "supply_group":
        return history.push(
          reverse(routes.dashboard.management.supply_tools.supply_groups.view, {
            id: record.id,
          })
        );
      case "supply_family":
        return history.push(
          reverse(
            routes.dashboard.management.supply_tools.supply_packages.view,
            { id: record.id }
          )
        );
      case "supply":
        return history.push(
          reverse(routes.dashboard.management.supply_tools.supply_tools.view, {
            id: record.id,
          })
        );
      case "fleet_family":
        return history.push(
          reverse(routes.dashboard.management.fleet.fleet_family.view, {
            id: record.id,
          })
        );
      case "fleet_group":
        return history.push(
          reverse(routes.dashboard.management.fleet.groups.view, {
            id: record.id,
          })
        );
      case "vehicle":
        return history.push(
          reverse(routes.dashboard.management.fleet.vehicle.view, {
            id: record.id,
          })
        );
      case "labor_group":
        return history.push(
          reverse(routes.dashboard.management.labor.labor_group.view, {
            id: record.id,
          })
        );
      case "employee":
        return history.push(
          reverse(routes.dashboard.management.labor.employee.view, {
            id: record.id,
          })
        );
      case "inventory_family":
        return history.push(
          reverse(
            routes.dashboard.management.inventory.inventory_packages.view,
            { id: record.id }
          )
        );
      case "inventory_item":
        return history.push(
          reverse(routes.dashboard.management.inventory.inventory_items.view, {
            id: record.id,
          })
        );
      case "inventory_kit":
        return history.push(
          reverse(routes.dashboard.management.inventory.inventory_kits.view, {
            id: record.id,
          })
        );
      case "disposal_family":
        return history.push(
          reverse(routes.dashboard.management.disposal.family.view, {
            id: record.id,
          })
        );
      case "disposal":
        return history.push(
          reverse(routes.dashboard.management.disposal.items.view, {
            id: record.id,
          })
        );
    }
  };

  // showAll  = () => {
  //   let data = this.getTotalResults()
  //   console.log(data,"data")
  //  if (data) {
  //    this.setState({showall: true, selectedResult: "all"})
  //  }
  //  else {
  //    this.setState({showall: false, selectedResult: "all"})
  //  }
  // }

  render() {
    const { global_search } = this.props;
    const { showall, selectedResult } = this.state;
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="search-results-main mx-0 row">
            <div className="col-12">
              <div className="search-results-tab-data-main">
                <div className="row mx-0">
                  <div className="search-results-div">
                    <div className="row">
                      <div className="col-12">
                        <h6>Search Results</h6>
                      </div>
                      <div className="col-12">
                        <div
                          onClick={() => {
                            this.setSectionsToAll();
                            this.setState({
                              showall: true,
                              selectedResult: "all",
                            })
                          }}
                          className={`search-tab-head  d-flex w-100 align-items-center justify-content-between 
                                                    all-results ${
                                                      showall
                                                        ? "highlighted-search"
                                                        : ""
                                                    }`}
                          style={{ paddingLeft: 15 }}
                        >
                          All Results
                          <span className="count-tag-col-h">
                            {this.getTotalResults() }
                          </span>
                        </div>
                       </div>
                      <div className="col-12">
                        <Collapse
                          accordion
                          bordered={false}
                          // defaultActiveKey={['1']}
                          expandIcon={({ isActive }) => (
                            <CaretRightOutlined rotate={isActive ? 90 : 0} />
                          )}
                          onChange={this.onPanelChange}
                          className="custom-collapse-results global-search-cats"
                        >
                          <Panel
                            header={
                              <div
                                id="accontant"
                                className={
                                  "search-tab-head d-flex w-100 align-items-center justify-content-between"
                                }
                              >
                                Accounts & Contacts
                                <span className="count-tag-col-x">
                                  {(global_search?.accounts_contacts?.accounts
                                    ?.length +
                                    global_search?.accounts_contacts?.contacts
                                      ?.length + global_search?.accounts_contacts?.sites?.length)|| 0}
                                </span>
                              </div>
                            }
                            key="1"
                          >
                            <ul className="list-inline mb-0 custom-results-list">
                              <li className="sub-head-search-sidebar">
                                Site Manager Accounts
                              </li>
                              <li>
                                <Button
                                  className={`search-tab-head d-flex w-100 align-items-center 
                                  justify-content-between ${
                                    selectedResult === "SITE_OWNER"
                                      ? "highlighted-search"
                                      : ""
                                  }`}
                                  onClick={(e) =>
                                    this.handleAccountSubsectionSearch(
                                      "SITE_OWNER"
                                    )
                                  }
                                >
                                  <span className="dot-icon" />
                                  Site Manager Accounts
                                  <span className={"count-tag-col-h"}>
                                    {global_search?.accounts_contacts?.accounts?.filter(
                                      (i) =>
                                        i.account_type.includes("SITE_OWNER")
                                    )?.length +
                                      global_search?.accounts_contacts?.accounts?.filter(
                                        (i) =>
                                          i.account_type.includes(
                                            "CUSTOMER_OWNER"
                                          )
                                      ).length || 0}
                                  </span>
                                </Button>
                              </li>
                              <li>
                                <Button
                                  className={`search-tab-head d-flex w-100 align-items-center 
                                                                    justify-content-between ${
                                                                      selectedResult ===
                                                                      "SITES"
                                                                        ? "highlighted-search"
                                                                        : ""
                                                                    }`}
                                  onClick={(e) =>
                                    this.handleAccountSubsectionSearch("SITES")
                                  }
                                >
                                  <span className="dot-icon" />
                                  Sites
                                  <span className={"count-tag-col-h"}>{global_search?.accounts_contacts?.sites?.length || 0}</span>
                                </Button>
                              </li>
                              <li className="sub-head-search-sidebar">
                                Billing Accounts
                              </li>
                              <li>
                                <Button
                                  className={`search-tab-head active d-flex w-100 align-items-center 
                                                                    justify-content-between ${
                                                                      selectedResult ===
                                                                      "CUSTOMER"
                                                                        ? "highlighted-search"
                                                                        : ""
                                                                    }`}
                                  onClick={(e) =>
                                    this.handleAccountSubsectionSearch(
                                      "CUSTOMER"
                                    )
                                  }
                                >
                                  <span className="dot-icon" />
                                  Billing Accounts
                                  <span className={"count-tag-col-h"}>
                                    {global_search?.accounts_contacts?.accounts?.filter(
                                      (i) => i.account_type === "CUSTOMER"
                                    )?.length +
                                      global_search?.accounts_contacts?.accounts?.filter(
                                        (i) =>
                                          i.account_type === "CUSTOMER_OWNER"
                                      )?.length || 0}
                                  </span>
                                </Button>
                              </li>
                              <li className="sub-head-search-sidebar">
                                Vendor Accounts
                              </li>
                              <li>
                                <Button
                                  className={`search-tab-head d-flex w-100 align-items-center justify-content-between
                                  ${
                                    selectedResult === "VENDOR"
                                      ? "highlighted-search"
                                      : ""
                                  }`}
                                  onClick={(e) =>
                                    this.handleAccountSubsectionSearch("VENDOR")
                                  }
                                >
                                  <span className="dot-icon" />
                                  Vendor Accounts
                                  <span className={"count-tag-col-h"}>
                                    {global_search?.accounts_contacts?.accounts?.filter(
                                      (i) => i.account_type.includes("VENDOR")
                                    )?.length || 0}
                                  </span>
                                </Button>
                              </li>
                              <li className="sub-head-search-sidebar">
                                Contacts
                              </li>
                              <li>
                                <Button
                                  className={`search-tab-head d-flex w-100 align-items-center justify-content-between
                                  ${
                                    selectedResult === "contacts"
                                      ? "highlighted-search"
                                      : ""
                                  }`}
                                  onClick={(e) =>
                                    this.handleAccountSubsectionSearch(
                                      "CONTACTS"
                                    )
                                  }
                                >
                                  <span className="dot-icon" />
                                  Contacts
                                  <span className={"count-tag-col-h"}>
                                    {global_search?.accounts_contacts?.contacts
                                      ?.length || 0}
                                  </span>
                                </Button>
                              </li>
                            </ul>
                          </Panel>

                          <Panel
                            header={
                              <div className="search-tab-head d-flex w-100 align-items-center justify-content-between">
                                Sales
                                <span className="count-tag-col-x">
                                  {global_search?.sales?.proposal.length +
                                    global_search?.sales?.opportunity.length ||
                                    0}
                                </span>
                              </div>
                            }
                            key="2"
                          >
                            <ul className="list-inline mb-0 custom-results-list">
                              <li>
                                <Button
                                  className={`search-tab-head d-flex w-100 align-items-center justify-content-between
                                  ${
                                    selectedResult === "proposals"
                                      ? "highlighted-search"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    this.handleSalesSubsectionSearch(
                                      "proposals"
                                    )
                                  }
                                >
                                  <span className="dot-icon" />
                                  Proposals
                                  <span className={"count-tag-col-h"}>
                                    {global_search?.sales?.proposal.length || 0}
                                  </span>
                                </Button>
                              </li>
                              <li>
                                <Button
                                  className={`search-tab-head d-flex w-100 align-items-center justify-content-between
                                  ${
                                    selectedResult === "opportunities"
                                      ? "highlighted-search"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    this.handleSalesSubsectionSearch(
                                      "opportunities"
                                    )
                                  }
                                >
                                  <span className="dot-icon" />
                                  Opportunities
                                  <span className={"count-tag-col-h"}>
                                    {global_search?.sales?.opportunity.length ||
                                      0}
                                  </span>
                                </Button>
                              </li>
                            </ul>
                          </Panel>

                          <Panel
                            header={
                              <div className="search-tab-head d-flex w-100 align-items-center justify-content-between">
                                Operations
                                <span className="count-tag-col-x">0</span>
                              </div>
                            }
                            key="3"
                          >
                            <ul className="list-inline mb-0 custom-results-list">
                              <li>
                                <Button className="search-tab-head d-flex w-100 align-items-center justify-content-between">
                                  <span className="dot-icon" />
                                  Projects
                                  <span className={"count-tag-col-h"}>0</span>
                                </Button>
                              </li>
                              <li>
                                <Button className="search-tab-head d-flex w-100 align-items-center justify-content-between">
                                  <span className="dot-icon" />
                                  Work Orders
                                  <span className={"count-tag-col-h"}>0</span>
                                </Button>
                              </li>
                              <li>
                                <Button className="search-tab-head d-flex w-100 align-items-center justify-content-between">
                                  <span className="dot-icon" />
                                  Analytics
                                  <span className={"count-tag-col-h"}>0</span>
                                </Button>
                              </li>
                              <li>
                                <Button className="search-tab-head d-flex w-100 align-items-center justify-content-between">
                                  <span className="dot-icon" />
                                  Dispatch
                                  <span className={"count-tag-col-h"}>0</span>
                                </Button>
                              </li>
                            </ul>
                          </Panel>
                          {
                          // <Role role={['ADMIN']}>
                          isAccessible(['ADMIN']) &&
                          <Panel
                            header={
                              <div className="search-tab-head d-flex w-100 align-items-center justify-content-between">
                                Management
                                <span className="count-tag-col-x">
                                  {global_search?.management?.service
                                    ?.service_family?.length +
                                    global_search?.management?.service
                                      ?.line_item?.length +
                                    global_search?.management?.labor
                                      ?.labor_group.length +
                                    global_search?.management?.labor?.employee
                                      .length +
                                    global_search?.management?.fleet
                                      ?.fleet_family.length +
                                    global_search?.management?.fleet
                                      ?.fleet_group.length +
                                    global_search?.management?.fleet?.vehicle
                                      .length +
                                    global_search?.management?.supply
                                      ?.supply_family.length +
                                    global_search?.management?.supply
                                      ?.supply_group.length +
                                    global_search?.management?.supply?.supply
                                      .length +
                                    global_search?.management?.inventory
                                      ?.inventory_family.length +
                                    global_search?.management?.inventory
                                      ?.inventory_item.length +
                                    global_search?.management?.inventory
                                      ?.inventory_kit.length +
                                    global_search?.management?.disposal
                                      ?.disposal_family.length +
                                    global_search?.management?.disposal
                                      ?.disposal.length || 0}
                                </span>
                              </div>
                            }
                            key="4"
                          >
                            <ul className="list-inline mb-0 custom-results-list custom-results-list-managements-div">
                              <li className="sub-head-search-sidebar">
                                Services
                              </li>
                              <li>
                                <Button
                                  className={`search-tab-head d-flex w-100 align-items-center justify-content-between
                                  ${
                                    selectedResult === "service_family"
                                      ? "highlighted-search"
                                      : ""
                                  }`}
                                  onClick={(e) =>
                                    this.handleManagementsectionSearch(
                                      "service_family"
                                    )
                                  }
                                >
                                  <span className="dot-icon" />
                                  Service Family
                                  <span className={"count-tag-col-h"}>
                                    {global_search?.management?.service
                                      ?.service_family?.length || 0}
                                  </span>
                                </Button>
                              </li>
                              <li>
                                <Button
                                  className={`search-tab-head d-flex w-100 align-items-center justify-content-between
                                  ${
                                    selectedResult === "line_items"
                                      ? "highlighted-search"
                                      : ""
                                  }`}
                                  onClick={(e) =>
                                    this.handleManagementsectionSearch(
                                      "line_items"
                                    )
                                  }
                                >
                                  <span className="dot-icon" />
                                  Line Items
                                  <span className={"count-tag-col-h"}>
                                    {global_search?.management?.service
                                      ?.line_item?.length || 0}
                                  </span>
                                </Button>
                              </li>
                              <li className="sub-head-search-sidebar">Labor</li>
                              <li>
                                <Button
                                  className={`search-tab-head d-flex w-100 align-items-center justify-content-between
                                  ${
                                    selectedResult === "labor_group"
                                      ? "highlighted-search"
                                      : ""
                                  }`}
                                  onClick={(e) =>
                                    this.handleManagementsectionSearch(
                                      "labor_group"
                                    )
                                  }
                                >
                                  <span className="dot-icon" />
                                  Labor Groups
                                  <span className={"count-tag-col-h"}>
                                    {global_search?.management?.labor
                                      ?.labor_group.length || 0}
                                  </span>
                                </Button>
                              </li>
                              <li>
                                <Button
                                  className={`search-tab-head d-flex w-100 align-items-center justify-content-between
                                  ${
                                    selectedResult === "employee"
                                      ? "highlighted-search"
                                      : ""
                                  }`}
                                  onClick={(e) =>
                                    this.handleManagementsectionSearch(
                                      "employee"
                                    )
                                  }
                                >
                                  <span className="dot-icon" />
                                  Employees
                                  <span className={"count-tag-col-h"}>
                                    {global_search?.management?.labor?.employee
                                      .length || 0}
                                  </span>
                                </Button>
                              </li>
                              <li className="sub-head-search-sidebar">Fleet</li>
                              <li>
                                <Button
                                  className={`search-tab-head d-flex w-100 align-items-center justify-content-between
                                  ${
                                    selectedResult === "fleet_families"
                                      ? "highlighted-search"
                                      : ""
                                  }`}
                                  onClick={(e) =>
                                    this.handleManagementsectionSearch(
                                      "fleet_families"
                                    )
                                  }
                                >
                                  <span className="dot-icon" />
                                  Fleet Families
                                  <span className={"count-tag-col-h"}>
                                    {global_search?.management?.fleet
                                      ?.fleet_family.length || 0}
                                  </span>
                                </Button>
                              </li>
                              <li>
                                <Button
                                  className={`search-tab-head d-flex w-100 align-items-center justify-content-between
                                  ${
                                    selectedResult === "fleet_groups"
                                      ? "highlighted-search"
                                      : ""
                                  }`}
                                  onClick={(e) =>
                                    this.handleManagementsectionSearch(
                                      "fleet_groups"
                                    )
                                  }
                                >
                                  <span className="dot-icon" />
                                  Fleet Groups
                                  <span className={"count-tag-col-h"}>
                                    {global_search?.management?.fleet
                                      ?.fleet_group.length || 0}
                                  </span>
                                </Button>
                              </li>
                              <li>
                                <Button
                                  className={`search-tab-head d-flex w-100 align-items-center justify-content-between
                                  ${
                                    selectedResult === "vehicles"
                                      ? "highlighted-search"
                                      : ""
                                  }`}
                                  onClick={(e) =>
                                    this.handleManagementsectionSearch(
                                      "vehicles"
                                    )
                                  }
                                >
                                  <span className="dot-icon" />
                                  Vehicles
                                  <span className={"count-tag-col-h"}>
                                    {global_search?.management?.fleet?.vehicle
                                      .length || 0}
                                  </span>
                                </Button>
                              </li>
                              <li className="sub-head-search-sidebar">
                                Supplies/Small tools
                              </li>
                              <li>
                                <Button
                                  className={`search-tab-head d-flex w-100 align-items-center justify-content-between
                                  ${
                                    selectedResult === "supply_family"
                                      ? "highlighted-search"
                                      : ""
                                  }`}
                                  onClick={(e) =>
                                    this.handleManagementsectionSearch(
                                      "supply_family"
                                    )
                                  }
                                >
                                  <span className="dot-icon" />
                                  Supply Families
                                  <span className={"count-tag-col-h"}>
                                    {global_search?.management?.supply
                                      ?.supply_family.length || 0}
                                  </span>
                                </Button>
                              </li>
                              <li>
                                <Button
                                  className={`search-tab-head d-flex w-100 align-items-center justify-content-between
                                  ${
                                    selectedResult === "supply_group"
                                      ? "highlighted-search"
                                      : ""
                                  }`}
                                  onClick={(e) =>
                                    this.handleManagementsectionSearch(
                                      "supply_group"
                                    )
                                  }
                                >
                                  <span className="dot-icon" />
                                  Supply Groups
                                  <span className={"count-tag-col-h"}>
                                    {global_search?.management?.supply
                                      ?.supply_group.length || 0}
                                  </span>
                                </Button>
                              </li>
                              <li>
                                <Button
                                  className={`search-tab-head d-flex w-100 align-items-center justify-content-between
                                                                    ${
                                                                      selectedResult ===
                                                                      "supply"
                                                                        ? "highlighted-search"
                                                                        : ""
                                                                    }`}
                                  onClick={(e) =>
                                    this.handleManagementsectionSearch("supply")
                                  }
                                >
                                  <span className="dot-icon" />
                                  Supplies/Small tools
                                  <span className={"count-tag-col-h"}>
                                    {global_search?.management?.supply?.supply
                                      .length || 0}
                                  </span>
                                </Button>
                              </li>
                              <li className="sub-head-search-sidebar">
                                Inventory
                              </li>
                              <li>
                                <Button
                                  className={`search-tab-head d-flex w-100 align-items-center justify-content-between
                                                                    ${
                                                                      selectedResult ===
                                                                      "inventory_family"
                                                                        ? "highlighted-search"
                                                                        : ""
                                                                    }`}
                                  onClick={(e) =>
                                    this.handleManagementsectionSearch(
                                      "inventory_family"
                                    )
                                  }
                                >
                                  <span className="dot-icon" />
                                  Inventory Families
                                  <span className={"count-tag-col-h"}>
                                    {global_search?.management?.inventory
                                      ?.inventory_family.length || 0}
                                  </span>
                                </Button>
                              </li>
                              <li>
                                <Button
                                  className={`search-tab-head d-flex w-100 align-items-center justify-content-between
                                                                    ${
                                                                      selectedResult ===
                                                                      "inventory_item"
                                                                        ? "highlighted-search"
                                                                        : ""
                                                                    }`}
                                  onClick={(e) =>
                                    this.handleManagementsectionSearch(
                                      "inventory_item"
                                    )
                                  }
                                >
                                  <span className="dot-icon" />
                                  Inventory Items
                                  <span className={"count-tag-col-h"}>
                                    {global_search?.management?.inventory
                                      ?.inventory_item.length || 0}
                                  </span>
                                </Button>
                              </li>
                              <li>
                                <Button
                                  className={`search-tab-head d-flex w-100 align-items-center justify-content-between
                                                                    ${
                                                                      selectedResult ===
                                                                      "inventory_kit"
                                                                        ? "highlighted-search"
                                                                        : ""
                                                                    }`}
                                  onClick={(e) =>
                                    this.handleManagementsectionSearch(
                                      "inventory_kit"
                                    )
                                  }
                                >
                                  <span className="dot-icon" />
                                  Inventory Kits
                                  <span className={"count-tag-col-h"}>
                                    {global_search?.management?.inventory
                                      ?.inventory_kit.length || 0}
                                  </span>
                                </Button>
                              </li>
                              <li className="sub-head-search-sidebar">
                                Disposal
                              </li>
                              <li>
                                <Button
                                  className={`search-tab-head d-flex w-100 align-items-center justify-content-between
                                                                    ${
                                                                      selectedResult ===
                                                                      "disposal_family"
                                                                        ? "highlighted-search"
                                                                        : ""
                                                                    }`}
                                  onClick={(e) =>
                                    this.handleManagementsectionSearch(
                                      "disposal_family"
                                    )
                                  }
                                >
                                  <span className="dot-icon" />
                                  Disposal Families
                                  <span className={"count-tag-col-h"}>
                                    {global_search?.management?.disposal
                                      ?.disposal_family.length || 0}
                                  </span>
                                </Button>
                              </li>
                              <li>
                                <Button
                                  className={`search-tab-head d-flex w-100 align-items-center justify-content-between
                                                                    ${
                                                                      selectedResult ===
                                                                      "disposal"
                                                                        ? "highlighted-search"
                                                                        : ""
                                                                    }`}
                                  onClick={(e) =>
                                    this.handleManagementsectionSearch(
                                      "disposal"
                                    )
                                  }
                                >
                                  <span className="dot-icon" />
                                  Disposal
                                  <span className={"count-tag-col-h"}>
                                    {global_search?.management?.disposal
                                      ?.disposal.length || 0}
                                  </span>
                                </Button>
                              </li>
                            </ul>
                          </Panel>
                          // </Role>
                          }
                        </Collapse>
                      </div>
                    </div>
                  </div>
                  <div className="search-results-right-details">
                    <div className="row">
                      <div
                        className={`col-12 ${
                          this.state.currentSection === "accounts" || showall
                            ? ""
                            : "hide"
                        }`}
                      >
                        <div className="row search-table-card-row mx-0">
                          <div className="col-12">
                            <div
                              className={`row search-main-header-table align-items-center justify-content-between`}
                            >
                              <div className="results-div-head d-flex align-items-center w-100 justify-content-between">
                                {this.state.heading}
                                <div className="d-flex align-items-center">
                                  <span className="mr-3">
                                    {this.state.count} Results
                                  </span>
                                  <button
                                    className="ant-btn edit-btn-summary"
                                    onClick={(e) =>
                                      this.handleAccountSubsectionSearch("all")
                                    }
                                  >
                                    View All
                                  </button>
                                </div>
                              </div>
                              {/*<div className="sorted-select-view d-flex align-items-center">*/}
                              {/*    <Select*/}
                              {/*        suffixIcon={*/}
                              {/*            <img src={Images.green_small_caret_down}*/}
                              {/*                 alt="" className="img-fluid"/>*/}
                              {/*        }*/}
                              {/*        defaultValue={*/}
                              {/*            <div*/}
                              {/*                className="select-div-head-default d-flex align-items-center">*/}
                              {/*                <span className="text-uppercase">Sorted by </span>*/}
                              {/*                Relevance*/}
                              {/*            </div>*/}
                              {/*        }*/}
                              {/*        onChange={handleChange}>*/}
                              {/*        <Option value="a">Relevance</Option>*/}
                              {/*        <Option value="b">Relevance</Option>*/}
                              {/*        <Option value="c">Relevance</Option>*/}
                              {/*    </Select>*/}
                              {/*    <Button className="text-uppercase view-all-btn" onClick={() => this.props.history.push(routes.dashboard.account_contact)}>VIEW*/}
                              {/*        ALL</Button>*/}
                              {/*</div>*/}
                            </div>
                          </div>
                          <div className="col-12 table-responsive main-table-div">
                            <Table
                              pagination={false}
                              scroll={{ y: 450 }}
                              className="main-table-all search-result-table search-table-second border-0"
                              columns={this.state.accountsColumns}
                              onRow={(record, rowIndex) => {
                                return {
                                  onClick: (e) =>
                                    // selectedResult === "SITES"
                                    //   ? this.redirect(record, "SITES")
                                      // : selectedResult === "contacts" || record?.account_type === "contact" ?
                                      //   this.redirect(
                                      //     record, "CONTACTS"
                                      // ) 
                                      this.redirect(
                                          record,
                                          record.account_type
                                        ),
                                };
                              }}
                              dataSource={this.state.accountsData}
                              size="middle"
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className={`col-12 ${
                          this.state.currentSection === "sales" || showall
                            ? ""
                            : "hide"
                        }`}
                      >
                        <div className="row search-table-card-row mx-0">
                          <div className="col-12">
                            <div className="row search-main-header-table align-items-center justify-content-between">
                              <div className="results-div-head d-flex align-items-center w-100 justify-content-between">
                                {this.state.salesHeading}
                                <div className="d-flex align-items-center">
                                <span className="mr-3">
                                  {this.state.salesData?.length || 0} Results
                                </span>
                                <button
                                  className="ant-btn edit-btn-summary"
                                  onClick={(e) =>
                                    this.handleSalesSubsectionSearch("all")
                                  }
                                >
                                  View All
                                </button>
                                </div>
                              </div>
                              {/*<div className="sorted-select-view d-flex align-items-center">*/}
                              {/*    <Select*/}
                              {/*        suffixIcon={*/}
                              {/*            <img*/}
                              {/*                src={Images.green_small_caret_down}*/}
                              {/*                alt=""*/}
                              {/*                className="img-fluid"/>*/}
                              {/*        }*/}
                              {/*        defaultValue={*/}
                              {/*            <div*/}
                              {/*                className="select-div-head-default d-flex align-items-center">*/}
                              {/*                                <span*/}
                              {/*                                    className="text-uppercase">Sorted by </span>*/}
                              {/*                Relevance*/}
                              {/*            </div>*/}
                              {/*        }*/}
                              {/*        onChange={handleChange}>*/}
                              {/*        <Option value="a">Relevance</Option>*/}
                              {/*        <Option value="b">Relevance</Option>*/}
                              {/*        <Option value="c">Relevance</Option>*/}
                              {/*    </Select>*/}
                              {/*    <Button*/}
                              {/*        className="text-uppercase view-all-btn"*/}
                              {/*        onClick={() => this.props.history.push(routes.dashboard.contacts.self)}>VIEW*/}
                              {/*        ALL</Button>*/}
                              {/*</div>*/}
                            </div>
                          </div>
                          <div className="col-12 table-responsive main-table-div">
                            <Table
                            // locale={{emptyText:'No Sales'}}
                              pagination={false}
                              className="main-table-all search-result-table search-table-second border-0"
                              columns={this.state.salesColumns}
                              scroll={{ y: 266 }}
                              onRow={(record, rowIndex) => {
                                // console.log(record, "rec")
                                return {
                                  onClick: (e) =>
                                    this.redirect(record, record.type),
                                };
                              }}
                              dataSource={this.state.salesData}
                              size="middle"
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className={`col-12 ${
                          this.state.currentSection === "ops" || showall
                            ? ""
                            : "hide"
                        }`}
                      >
                        <div className="row search-table-card-row mx-0">
                          <div className="col-12">
                            <div className="row search-main-header-table align-items-center justify-content-between">
                              <div className="results-div-head d-flex align-items-center w-100 justify-content-between">
                                Operations
                                <span>0 Results</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 table-responsive main-table-div">
                            <Table
                              pagination={false}
                              scroll={{ y: 266 }}
                              className="main-table-all search-result-table border-0"
                              columns={[]}
                              dataSource={[]}
                              size="middle"
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className={`col-12 ${
                          this.state.currentSection === "management" || showall
                            ? ""
                            : "hide"
                        }`}
                      >
                        {isAccessible(['ADMIN']) &&
                        <div className="row search-table-card-row mx-0">
                          <div className="col-12">
                            <div className="row search-main-header-table align-items-center justify-content-between">
                              <div className="results-div-head d-flex align-items-center w-100 justify-content-between">
                                {this.state.managementHeading}
                                <div className="d-flex align-items-center">
                                <span className="mr-3">
                                {this.state.managementData?.length || 0}{" "}
                                  Results
                                </span>
                                <button
                                  className="ant-btn edit-btn-summary"
                                  onClick={(e) =>
                                    this.handleManagementsectionSearch("all")
                                  }
                                >
                                  View All
                                </button>
                              </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 table-responsive main-table-div">
                            <Table
                              // locale={{emptyText:'No Management'}}
                              pagination={false}
                              scroll={{ y: 266 }}
                              className="main-table-all search-result-table border-0"
                              columns={this.state.managementColumns}
                              onRow={(record, rowIndex) => {
                                return {
                                  onClick: (e) =>
                                    this.redirect(record, record.type),
                                };
                              }}
                              dataSource={this.state.managementData}
                              size="middle"
                            />
                          </div>
                        </div>
                        }
                      </div>
                    </div>
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

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps, { setBreadcrumb })(SearchResults);
