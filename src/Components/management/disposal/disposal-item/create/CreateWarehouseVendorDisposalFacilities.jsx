import React, { Component } from "react";
import {
  Button,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  message,
  Select,
} from "antd";
import { Image as Images } from "../../../../Images";
import { getInternalLocation } from "../../../../../Controller/api/labourServices";
import {
  calculatePercentage,
  formatPhone,
} from "../../../../../Controller/utils";
import {
  createDisposalLocation,
  createDisposalVendor,
  deleteDisposalPrice,
  deleteLocationDisposal,
  deleteVendorDisposal,
  getDisposalLocationById,
  getDisposalVendorById,
  updateLocationQty,
  updateVendorQty,
} from "../../../../../Controller/api/disposalServices";
import { withRouter } from "react-router-dom";
import { handleError } from "../../../../../Controller/Global";
import AddWarehouseDisposal from "./popup/AddWarehouseDisposal";
import AddVendorDisposal from "./popup/AddVendorDisposal";
import { getVendorAccount } from "../../../../../Controller/api/vendorAccountServices";
import CreateVendor from "../../../../drawers/disposal/CreateVendor";
import CommonWarningModal from "../../../../modals/CommonWarningModal";
import   CreateWarehouseForms from "./createWarehouseForms";
import CreateVendorForms from "./createVendorForms";
// import CreateVendorDrawer from "../../../inventory/inventory-items/create/CreateVendorDrawer";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;

class CreateWarehouseVendorDisposalFacilities extends Component {
  formRef = React.createRef();
  state = {
    visible: false,
    location: [],
    selectValue: null,
    sites: [],
    newSites: [],
    visibleWarehouse: false,
    visibleVendor: false,
    visibleVendorDrawer: false,
    // visibleVendors: false,
    newLoc: [],
    unitPrice: [],
    unitData: "",
    unitCost: "",
  };

  showWareHouse = (visible) => {
    this.setState({
      visibleWarehouse: visible,
    });
  };
  showVendor = (visible) => {
    this.setState({
      visibleVendor: visible,
      editVendor: false,
      editVendorData:null
    });
  };
  // showEditVendor = (visible) => {
  //   this.setState({
  //     visibleVendors: visible,
  //   })
  // }
  showFacility = (visible) => {
    this.setState({
      visible: visible,
    });
  };

  handleRemovePopup = (data,visible) => {
    this.setState({warningVisible: visible, item: data})

  }
  showWarningModal = (visible) => {
    this.setState({warningVisible: visible})

  }   
  showWarningVendorModal = (visible) => {
    this.setState({warningVendorVisible: visible})
  }

  menu = (item, index) => (
    <Menu>
      <Menu.Item key="0">
        <Button
          className="border-0 p-0 shadow-none bg-transparent"
          // onClick={() => this.handleRemove(item.id,true)}
          onClick={() => this.handleRemovePopup(item.id,true)}
        >
          Remove
        </Button>
      </Menu.Item>
      <Menu.Item key="1">
        <Button
          className="border-0 p-0 shadow-none bg-transparent"
          onClick={() => this.handleEdit(item.internal_location)}
        >
          Edit
        </Button>
      </Menu.Item>
    </Menu>
  );

  // priceMenu = (item) => (
  //   <Menu>
  //     <Menu.Item key="0">
  //       <Button
  //         className="w-100 p-0 text-left bg-transparent border-0 shadow-none"
  //         // onClick={() => this.showCustomUnitCreate(true)}
  //       >
  //         Edit
  //       </Button>
  //     </Menu.Item>
  //     <Menu.Item key="1">
  //       <Button
  //         className="w-100 p-0 text-left bg-transparent border-0 shadow-none"
  //         onClick={() => this.handleDeletePrice(item)}
  //       >
  //         Remove
  //       </Button>
  //     </Menu.Item>
  //   </Menu>
  // );


  componentDidMount() {
    if (this.props.match.params.id) {
      this.getDisposalLocation();
      this.getDisposalVendor();
    }
  }

  getDisposalLocation = () => {
    getDisposalLocationById({ disposal: this.props.match.params.id || this.props.disposal?.id})
      .then((res) => {
        // console.log(res.data.results)
        this.setState({
          newSites: res.data.results[0].location,
          // , selectValue: res.data.results[0].uom.id
        });
        // this.formRef.current.setFieldsValue({
        //     // internal_locations: this.state.newSites?.map(value => {
        //     //     return {value: value.internal_location.id, label: value.internal_location.name}
        //     // }),
        //     uom: {value: res.data.results[0].uom.id, label: res.data.results[0].uom.name}
        // })
      })
      .catch((err) => {
        handleError(err);
      });
  };

  getDisposalVendor = () => {
    getDisposalVendorById({ disposal: this.props.match.params.id || this.props.disposal?.id})
      .then((res) => {
        // console.log(res.data.results)
        this.setState({
          newLoc: res.data.results[0].vendor,
          // selectValue: res.data.results[0].uom?.id
        });
        // this.formRef.current.setFieldsValue({
        //     // vendors: this.state.newLoc?.map(value => {
        //     //     // console.log(value, "--==--")
        //     //     return {value: value.vendor.id, label: value.vendor.name}
        //     // }),
        //     uom: {value: res.data.results[0].uom?.id, label: res.data.results[0].uom?.name}
        // })
      })
      .catch((err) => {
        handleError(err);
      });
  };

  fetchContacts = (params = {}) => {
    const data = {
      ...params,
      // inventory_id: this.props.match.params.id,
      // type: "DISPOSAL"
    };
    getInternalLocation(data)
      .then((res) => {
        this.setState({ contacts: res.data.results });
      })
      .catch((err) => { });
  };

  handleEdit = (item) => {
    this.setState({ editData: item, visible: true });
  };

  handleEditVendor = (item) => {
    this.setState({ editVendorData: item, editVendor: true , visibleVendorDrawer: true});
  }

  // handleEditVendor = (item) => {
  //   console.log(item,"item data")
  //   this.setState({editVendorData: item, visibleVendors: true})
  // }

  handleRemove = () => {
   const { item } = this.state
    deleteLocationDisposal(item)
      .then((res) => {
        let newSites = [...this.state.newSites];
        let newArr = newSites.filter((i) => {
          return item !== i.id;
        });
        this.setState({ newSites: newArr }, () => {
          this.props.getDisposalItem();
        });
        // , () => {
        // this.formRef.current.setFieldsValue({
        //     internal_locations: this.state.newSites?.map(value => {
        //         return {value: value.internal_location.id, label: value.internal_location.name}
        //     }),
        //     // uom: {value: res.data.uom.id, label: res.data.uom.name}
        // })
        // })
        message.success("deleted successfully!");
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handleSubmit = () => {
    this.props.setDisposal(this.props.disposal, 6);
    this.props.getDisposalItem();
    message.success("Disposal updated successfully!");
  };

  showContact = () => {
    this.setState({ visible: false, editData: null });
  };

  showVendorContact = () => {
    this.setState({ visibleVendor: false , editVendorData: null})
  }

  modalClose = () => {
    this.setState({visibleVendor : false})
  }

  handleSelect = (e) => {
    const Id = this.props.match.params.id
      ? this.props.match.params.id
      : this.props.disposal.id;
    // console.log(e)
    // const locationId = this.state.contacts.find(i => i.id === e.value).id;
    // this.formRef.current.setFieldsValue({
    //   internal_locations: null,
    // });
    let sites = this.state.newSites.map((i) => i.internal_location.id);
    let newItem = this.state.contacts.find((i) => e == i.id);
    sites.push(newItem.id);
    this.setState({ sites });
    const data = {
      disposal: Id,
      uom: this.state.selectValue,
      internal_location_id: sites.map((i) => i),
      location: [],
    };
    createDisposalLocation(data)
      .then((res) => {
        this.props.getDisposalItem();
        this.setState({ newSites: res.data.location });
        this.showWareHouse(false)
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };

  // handleDeselect = e => {
  //     const deleteItem = this.state.newSites.find(i => i.internal_location.id === e.value);
  //       deleteLocationDisposal(deleteItem.id).then(res => {
  //         let newSites = [...this.state.newSites];
  //         let newArr = newSites.drawer(i => {
  //             return (
  //                 e.value !== i.internal_location.id
  //             )
  //         })
  //         this.setState({newSites: newArr})
  //         // message.success('deleted!');
  //     }).catch(err => {
  //         handleError(err)
  //     })
  // }

  // handleVendorContact = (item, newItem) => {
  //   if(newItem) {
  //     let newArr = this.state.newLoc.map((i) => i.vendor);
  //     newArr.push(item);
  //     const data = {
  //       disposal: this.props.match.params.id,
  //       uom: this.state.selectValue,
  //       vendor_id: newArr.map((i) => i.id),
  //       location: [],
  //     };
  //     createDisposalVendor(data).then((res) => {
  //       this.setState({newLoc: res.data.vendor})
  //       this.showVendorContact();
  //     })
  //     .catch((err) => {
  //       if (err.response) {
  //         Object.keys(err.response.data).map((e) => {
  //           message.error(err.response.data[e]);
  //         });
  //       }
  //     });
  // } else {
  //   const Index = this.state.newLoc.findIndex(
  //     (i) => i.vendor.id == item.id
  //   );
  //   const newArr = this.state.newLoc.slice();
  //   newArr[Index].vendor = item;
  //   this.setState({ newLoc: newArr });
  //   }
  // }

  handleVendorInfo = (item, newVendor) => {
    if (newVendor) {
      let newArr = this.state.newLoc.map((i) => i.vendor);
      newArr.push(item);
      
      const data = {
        disposal: this.props.match.params.id || this.props.disposal.id,
        uom: this.state.selectValue,
        vendor_id: newArr.map((i) => i.id),
        vendor: [],
      };
      createDisposalVendor(data).then((res) => {
        this.setState({ newLoc: res.data?.vendor })
        this.showVendorContact();
      })
        .catch((err) => {
          if (err.response.data && err.response.status !== 500) {
            Object.keys(err.response.data).map((e) => {
              message.error(err.response.data[e]);
            });
          }
        }
        )
        .finally(() => { return });
    } else {
      const Index = this.state.newLoc.findIndex(
        (i) => i.vendor.id == item.id
      );
      const newArr2 = this.state.newLoc.slice();
      newArr2[Index].vendor = item;
      this.setState({ newLoc: newArr2 });
    }
  }

  handleVendorAddress = (main, billing, newItem) => {
    const newArr = this.state.newLoc.slice();
    if (newItem) {
      const Index = this.state.newLoc.findIndex(
        (i) => i.vendor?.id == main.account
      );
      newArr[Index].vendor.main_address = main;
      newArr[Index].vendor.billing_address = billing;
    }
    else {
      if (main) {
        const Index = this.state.newLoc.findIndex(
          (i) => i.vendor?.main_address?.id == main.id
        );
        newArr[Index].vendor.main_address = main;
      }

      if (billing) {
        const Index = this.state.newLoc.findIndex(
          (i) => i.vendor?.billing_address?.id == billing.id
        );
        newArr[Index].vendor.billing_address = billing;
      }
    }
    this.setState({ newLoc: newArr });
  }


  // handleVendorContact = (item, newItem) => {
  //   if(newItem) {
  //     let newArr = this.state.newLoc.map((i) => i.vendor);
  //     newArr.push(item);
  //     const data = {
  //       disposal: this.props.match.params.id,
  //       uom: this.state.selectValue,
  //       vendor_id: newArr.map((i) => i.id),
  //       location: [],
  //     };
  //     createDisposalVendor(data).then((res) => {
  //       this.setState({newLoc: res.data.vendor})
  //       this.showVendorContact();
  //     })
  //     .catch((err) => {
  //       if (err.response) {
  //         Object.keys(err.response.data).map((e) => {
  //           message.error(err.response.data[e]);
  //         });
  //       }
  //     });
  // } else {
  //   const Index = this.state.newLoc.findIndex(
  //     (i) => i.vendor.id == item.id
  //   );
  //   const newArr = this.state.newLoc.slice();
  //   newArr[Index].vendor = item;
  //   this.setState({ newLoc: newArr });
  //   }
  // }

  callbackContact = (item, newItem) => {
    // console.log(item, newItem, "----")
    if (newItem) {
      let newArr = this.state.newSites.map((i) => i.internal_location);
      newArr.push(item);
      // this.setState({newSites: newArr})
      // console.log("ndsbchnds")
      const data = {
        disposal: this.props.match.params.id || this.props.disposal.id,
        uom: this.state.selectValue,
        internal_location_id: newArr.map((i) => i.id),
        location: [],
      };
      createDisposalLocation(data)
        .then((res) => {
          //    message.success('success')
          this.setState({ newSites: res.data.location });
          this.showContact();
          this.showWareHouse(false);
          //     ,() => {
          //     this.formRef.current.setFieldsValue({
          //         internal_locations: this.state.newSites?.map(value => {
          //             return {value: value.internal_location.id, label: value.internal_location.name}
          //         }),
          //         // uom: {value: res.data.uom.id, label: res.data.uom.name}
          //     })
          //    })
        })
        .catch((err) => {
          if (err.response) {
            Object.keys(err.response.data).map((e) => {
              message.error(err.response.data[e]);
            });
          }
        });
    } else {
      const Index = this.state.newSites.findIndex(
        (i) => i.internal_location.id == item.id
      );
      const newArr = this.state.newSites.slice();
      newArr[Index].internal_location = item;
      this.setState({ newSites: newArr });
      //     , () => {
      //     this.formRef.current.setFieldsValue({
      //         internal_locations: this.state.newSites.map(value => {
      //             return {value: value.internal_location.id, label: value.internal_location.name}
      //         })
      //     })
      // })
    }
  };

  handleQtyChange = (e, item, index) => {
    let value = e.target.value;
    if (value) {
      var newArr = this.state.newSites.slice();
      newArr[index].qty = value;
      this.setState({ newSites: newArr });
      const params = {
        qty: value,
        type: "DISPOSAL",
        id: item.id,
        disposal_id: this.props.match.params.id,
      };
      this.updateLocation(params, item);
    }
  };

  handleMinQtyChange = (e, item, index) => {
    let value = e.target.value;
    if (value) {
      var newArr = this.state.newSites.slice();
      newArr[index].min_qty = value;
      this.setState({ newSites: newArr });
      const params = {
        min_qty: value,
        type: "DISPOSAL",
        id: item.id,
        disposal_id: this.props.match.params.id,
      };
      this.updateLocation(params, item);
    }
  };

  handleMaxQtyChange = (e, item, index) => {
    let value = e.target.value;
    if (value) {
      var newArr = this.state.newSites.slice();
      newArr[index].max_qty = value;
      this.setState({ newSites: newArr });
      const params = {
        max_qty: value,
        type: "DISPOSAL",
        id: item.id,
        disposal_id: this.props.match.params.id,
      };
      this.updateLocation(params, item);
    }
  };

  handleRefNumChange = (e, item, index) => {
    let value = e.target.value;
    if (value) {
      var newArr = this.state.newSites.slice();
      newArr[index].reference_number = value;
      this.setState({ newSites: newArr });
      const params = {
        reference_number: value,
        type: "DISPOSAL",
        id: item.id,
        disposal_id: this.props.match.params.id,
      };
      this.updateLocation(params, item);
    }
  };

  handleNoteChange = (e, item, index) => {
    let value = e.target.value;
    if (value) {
      var newArr = this.state.newSites.slice();
      newArr[index].note = value;
      this.setState({ newSites: newArr });
      const params = {
        note: value,
        type: "DISPOSAL",
        id: item.id,
        disposal_id: this.props.match.params.id,
      };
      this.updateLocation(params, item);
    }
  };

  handleMarginChange = (e, item, index) => {
    let value = e.target.value.replace("%", "");
    if (value) {
      var newArr = this.state.newSites.slice();
      newArr[index].margin = value;
      this.setState({ newSites: newArr });
      const params = {
        margin: value,
        type: "DISPOSAL",
        id: item.id,
        disposal_id: this.props.match.params.id, // handleVendorContact = (item, newItem) => {
        //   if(newItem) {
        //     let newArr = this.state.newLoc.map((i) => i.vendor);
        //     newArr.push(item);
        //     const data = {
        //       disposal: this.props.match.params.id,
        //       uom: this.state.selectValue,
        //       vendor_id: newArr.map((i) => i.id),
        //       location: [],
        //     };
        //     createDisposalVendor(data).then((res) => {
        //       this.setState({newLoc: res.data.vendor})
        //       this.showVendorContact();
        //     })
        //     .catch((err) => {
        //       if (err.response) {
        //         Object.keys(err.response.data).map((e) => {
        //           message.error(err.response.data[e]);
        //         });
        //       }
        //     });
        // } else {
        //   const Index = this.state.newLoc.findIndex(
        //     (i) => i.vendor.id == item.id
        //   );
        //   const newArr = this.state.newLoc.slice();
        //   newArr[Index].vendor = item;
        //   this.setState({ newLoc: newArr });
        //   }
        // }
      };
      this.updateLocation(params, item);
    }
  };

  handleVendorMarginChange = (e, item, index) => {
    let value = e.target.value.replace("%", "");
    if (value) {
      var newArr = this.state.newLoc.slice();
      newArr[index].margin = value;
      this.setState({ newLoc: newArr });
      const params = {
        margin: value,
        type: "DISPOSAL",
        id: item.id,
        disposal_id: this.props.match.params.id,
      };
      this.updateVendorMeasurement(params, item);
    }
  };

  handleUnitCostChange = (e, item, index) => {
    let value = e.target.value;
    if (value) {
      var newArr = this.state.newSites.slice();
      newArr[index].unit_cost = value;
      this.setState({ newSites: newArr });
      const params = {
        unit_cost: value,
        type: "DISPOSAL",
        id: item.id,
        disposal_id: this.props.match.params.id,
      };
      this.setState({unitCost: params.unit_cost})
      // this.updateLocation(params, item);
    }
  };

  handleItemSelectChange = (value, item, index) => {
    if (value) {
      let unit_type = (typeof(value) === 'string' && value.includes('COM')) ? 'COM' : 'UOM';
      let selectableValue;
      let params = {};
      var newArr = this.state.newSites.slice();
      if(unit_type === 'COM') {
        let splittedArr = value?.split('_');
        selectableValue = splittedArr[splittedArr.length - 1];
        newArr[index].com = selectableValue;
        newArr[index].unit_type = unit_type;
        params.com = selectableValue;
      }
      else {
        selectableValue = value;
        newArr[index].uom = selectableValue;
        newArr[index].unit_type = unit_type;
        params.uom = selectableValue;
      }
      this.setState({ newSites: newArr });
       params = {
        ...params,
        id: item.id,
        type: "DISPOSAL",
        unit_type,
        disposal_id: this.props.match.params.id,
      };
      this.setState({unitData: params})
      // this.updateLocation(params, item);
    }
  };

  updateLocation = (params, item) => {
    this.setState({unitData: params})
    updateLocationQty(item.id, params)
      .then((res) => {
        // console.log("success")
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };
  handleSelectChange = () => {
    this.setState({
      selectValue: this.formRef.current.getFieldValue("uom").value,
    });
  };

  getAllAccounts = (params) => {
    getVendorAccount(params)
      .then((res) => {
        this.setState({ location: res.data.results });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };

  updateVendorMeasurement = (params, item) => {
    updateVendorQty(item.id, params)
      .then((res) => {
        // console.log("success")
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };

  handleVendorRefNumChange = (e, item, index) => {
    let value = e.target.value;
    if (value) {
      var newArr = this.state.newLoc.slice();
      newArr[index].reference_number = value;
      this.setState({ newLoc: newArr });
      const params = {
        reference_number: value,
        id: item.id,
        disposal_id: this.props.match.params.id,
      };
      this.updateVendorMeasurement(params, item);
    }
  };

  handleVendorNoteChange = (e, item, index) => {
    let value = e.target.value;
    if (value) {
      var newArr = this.state.newLoc.slice();
      newArr[index].note = value;
      this.setState({ newLoc: newArr });
      const params = {
        note: value,
        id: item.id,
        disposal_id: this.props.match.params.id,
      };
      this.updateVendorMeasurement(params, item);
    }
  };

  handleVendorUnitCostChange = (e, item, index) => {
    let value = e.target.value;
    if (value) {
      var newArr = this.state.newLoc.slice();
      newArr[index].unit_cost = value;
      this.setState({ newLoc: newArr });
      const params = {
        unit_cost: value,
        id: item.id,
        disposal_id: this.props.match.params.id,
      };
      this.updateVendorMeasurement(params, item);
    }
  };

  handleVendorItemSelectChange = (value, item, index) => {
    // let value = e.target.value;
    if (value) {
      let unit_type = (typeof(value) === 'string' && value.includes('COM')) ? 'COM' : 'UOM';
      let selectableValue;
      let params = {};
      var newArr = this.state.newLoc.slice();
      if(unit_type === 'COM') {
        let splittedArr = value?.split('_');
        selectableValue = splittedArr[splittedArr.length - 1];
        newArr[index].vendor_com = selectableValue;
        newArr[index].unit_type = unit_type;
        params.vendor_com = selectableValue;
      }
      else {
        selectableValue = value;
        newArr[index].vendor_uom = selectableValue;
        newArr[index].unit_type = unit_type;
        params.vendor_uom = selectableValue;
      }
      this.setState({ newLoc: newArr });
       params = {
        ...params,
        id: item.id,
        type: "DISPOSAL",
        unit_type,
        disposal_id: this.props.match.params.id,
      };
      this.updateVendorMeasurement(params, item);
    }
    // if (value) {
    //   var newArr = this.state.newLoc.slice();
    //   newArr[index].vendor_uom = value;
    //   this.setState({ newLoc: newArr });
    //   const params = {
    //     vendor_uom: value,
    //     id: item.id,
    //     disposal_id: this.props.match.params.id,
    //   };
    //   this.updateVendorMeasurement(params, item);
    // }
  };

  handleSelectVendor = (e) => {
    const Id = this.props.match.params.id
      ? this.props.match.params.id
      : this.props.disposal.id;
    // this.formRef.current.setFieldsValue({
    //   vendors: null,
    // });
    let sites = this.state.newLoc.map((i) => i.vendor.id);
    let newItem = this.state.location.find((i) => e == i.id);
    sites.push(newItem.id);
    const data = {
      disposal: Number(Id),
      uom: this.state.selectValue,
      vendor_id: sites.map((i) => i),
      vendor: [],
    };
    createDisposalVendor(data)
      .then((res) => {
        //    message.success('success')
        this.setState({ newLoc: res.data.vendor });
        this.showVendor(false)
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };

  showVendorDrawer = (visible) => {
    this.setState({
      visibleVendorDrawer: visible,
      // editVendor: visible,
      // visibleVendor: visible
    });
  };

  handleVendorRemove = (data,visible) => {
    this.setState({vendorItem: data, warningVendorVisible: visible })

  }

  vendor_menu = (item, index) => (
    <Menu>
      <Menu.Item key="0">
        <Button
          className="border-0 p-0 shadow-none bg-transparent"
          // onClick={() => this.handleRemoveVendor(item.id)}
          onClick={() => this.handleVendorRemove(item.id, true)}
        >
          Remove
        </Button>
      </Menu.Item>
      <Menu.Item key="1">
        <Button
          className="border-0 p-0 shadow-none bg-transparent"
          onClick={() => {
            this.handleEditVendor(item.vendor)
          }}
        >
          Edit
        </Button>
      </Menu.Item>
    </Menu>
  );

  handleRemoveVendor = () => {
    const { vendorItem } = this.state
    deleteVendorDisposal(vendorItem)
      .then((res) => {
        let newLoc = [...this.state.newLoc];
        let newArr = newLoc.filter((i) => {
          return vendorItem !== i.id;
        });
        this.setState({ newLoc: newArr });
        // , () => {
        // this.formRef.current.setFieldsValue({
        //     vendors: this.state.newLoc?.map(value => {
        //         // console.log(value, "--==--")
        //         return {value: value.vendor.id, label: value.vendor.name}
        //     }),
        //     // uom: {value: res.data.uom.id, label: res.data.uom.name}
        // })
        // })
        message.success("deleted successfully!");
      })
      .catch((err) => {
        handleError(err);
      });
  };

  render() {
    // let selectName = this.props.disposal?.uom_array?.find(i => i.id === this.state.selectValue)?.symbol;
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12 px-0">
            {/* <Form
              ref={this.formRef}
              // onFinish={this.handleSubmit}
              onFinish = {this.handleAddData}
              {...layout}
              hideRequiredMark={true}
              className="main-inner-form"
            > */}
              <div className="row col-12-12">
                <div className="col-12">
                  <div className="row mb-0 mx-0 info-gray-div align-items-center">
                    <h6 className="mb-0">
                      Please add warehouses and vendors to this disposal.
                    </h6>
                  </div>
                </div>
                <div className="col-12 margin-tb-30">
                  <div className="row">
                    <div className="col-12 col-sm-6">
                      <Button
                        onClick={() => this.showWareHouse(true)}
                        className="edit-create-btn w-100 text-uppercase"
                      >
                        Add warehouse
                      </Button>
                    </div>
                    <div className="col-12 col-sm-6">
                      <Button
                        onClick={() => this.showVendor(true)}
                        className="edit-create-btn w-100 text-uppercase"
                      >
                        Add vendor
                      </Button>
                    </div>
                  </div>
                </div>
                {/*<div className="col-12 col-sm-6">*/}
                {/*    <Form.Item name="uom" label={"Unit of Measurement *"} rules={[{*/}
                {/*        required: true,*/}
                {/*        message: 'Please select Universal UOM'*/}
                {/*    }]}>*/}

                {/*        <Select*/}
                {/*            labelInValue*/}
                {/*            suffixIcon={*/}
                {/*                <img alt="" src={Images.caret_down_small_select}*/}
                {/*                     className="img-fluid"/>*/}
                {/*            }*/}
                {/*            placeholder="Select Option"*/}
                {/*            onChange={this.handleSelectChange}*/}
                {/*        >*/}
                {/*            {this.props.disposal?.uom_array?.map(i => {*/}
                {/*                return (*/}
                {/*                    <Select.Option key={i.id}*/}
                {/*                                   value={i.id}>{i.name} ({i.symbol})</Select.Option>*/}
                {/*                )*/}
                {/*            })}*/}
                {/*        </Select>*/}
                {/*    </Form.Item>*/}
                {/*</div>*/}

                {this.state.newSites.length > 0 ?
                  this.state.newSites.map((item, index) => {
                    const selectName = this.props.disposal?.uom_array?.find(
                      (i) => i.id === item.uom
                    )?.symbol;
                    return (
                      <CreateWarehouseForms 
                      warehouseData = {item}
                      menu = {this.menu}
                      index={index}
                      handleRefNumChange={this.handleRefNumChange}
                      handleNoteChange={this.handleNoteChange}
                      handleItemSelectChange={this.handleItemSelectChange}
                      getDisposalLocation={this.getDisposalLocation}
                      handleUnitCostChange={this.handleUnitCostChange}
                      unitData={this.state.unitData}
                      disposal={this.props.disposal}
                      unitCost={this.state.unitCost}
                      selectName={selectName}
                       />
                    );
                  })
                  :
                    <div className="col-12">
                      <div className="row mx-0 common-card-upload">
                        <div className="col-12 text-center">
                          <img
                            src={Images.location_gray}
                            alt={""}
                            className="img-fluid"
                          />
                          <h6 className="mb-0 color-gray-3">
                            No Warehouses
                          </h6>
                        </div>
                      </div>
                    </div>
                }

                <div className="col-12 divider-line mt-4" />

                {this.state.newLoc.length > 0 ?
                  this.state.newLoc.map((item, index) => {
                    const selectName = this.props.disposal?.uom_array?.find(
                      (n) => n.id === item.vendor_uom
                    )?.symbol;
                    return (
                     <CreateVendorForms 
                       vendorData = {item}
                       index = {index}
                       disposal = {this.props.disposal}
                       getDisposalVendor = {this.getDisposalVendor}
                       vendor_menu = {this.vendor_menu}
                     />
                    );
                  })
                  :
                    <div className="col-12">
                      <div className="row mx-0 common-card-upload">
                        <div className="col-12 text-center">
                          <img
                            src={Images.vendor_gray_icon}
                            alt={""}
                            className="img-fluid"
                          />
                          <h6 className="mb-0 color-gray-3">
                            No Vendor
                          </h6>
                        </div>
                      </div>
                    </div>

                }
                {/*{this.state.newLoc.length == 0 &&
                  this.state.newSites.length == 0 && (
                    <div className="col-12">
                      <div className="row mx-0 common-card-upload">
                        <div className="col-12 text-center">
                          <img
                            src={Images.location_gray}
                            alt={""}
                            className="img-fluid"
                          />
                          <h6 className="mb-0 color-gray-3">
                            No Warehouses & No Vendor
                          </h6>
                        </div>
                      </div>
                    </div>
                  )}*/}
              </div>
              <div className="col-12 p-0 validate-div-col text-md-right mt-0">
                <Form.Item>
                  <Button htmlType="submit" className="validate-btn-main">
                    Save and Continue
                  </Button>
                </Form.Item>
              </div>
            {/* </Form> */}
          </div>
        </div>

        {/*more-black*/}

        <AddWarehouseDisposal
          visible={this.state.visibleWarehouse}
          onClose={() => this.showWareHouse(false)}
          handleSelect={this.handleSelect}
          contacts={this.state.contacts}
          selectValue={this.state.selectValue}
          showFacility={(visible) => this.showFacility(visible)}
          visibleInternal={this.state.visible}
          editData={this.state.editData}
          showContact={this.showContact}
          callbackContact={this.callbackContact}
          fetchContacts={this.fetchContacts}
        />

        <AddVendorDisposal
          visible={this.state.visibleVendor}
          editVendor = {this.state.editVendor}
          onClose={() => this.showVendor(false)}
          visibleVendor={this.state.visibleVendorDrawer}
          // onClose ={() => {this.showEditVendor(false)}}
          showVendorDrawer={(value) => this.showVendorDrawer(value)}
          getAllAccounts={this.getAllAccounts}
          location={this.state.location}
          modalClose = {this.modalClose}
          // visibleVendors = {this.state.visibleVendors}
          handleSelectVendor={this.handleSelectVendor}
          // visibleInternal = {this.state.visibleVendor}
          editVendorData={this.state.editVendorData}
          handleVendorInfo={this.handleVendorInfo}
          handleVendorAddress={this.handleVendorAddress}
        />
        {/*         
        <CreateVendor
        // showVendorContact = {this.showVendorContact}
        // visibleVendors =  {this.state.visibleVendors}
        // visible= {this.state.visibleVendors}
        // onClose ={() => {this.showEditVendor(false)}}
        // visibleInternal = {this.state.visibleVendors}
        // editVendorData = {this.state.editVendorData}
        // handleVendorInfo = {this.handleVendorInfo}
        // handleVendorAddress={this.handleVendorAddress}
        /> */}

         <CommonWarningModal
          visible={this.state.warningVisible}
          onClose={() => this.showWarningModal(false)}
          heading={"Are you sure you want to remove this Warehouse?"}
          subHeadingUOM={
            "If you choose to remove this Warehouse, and you already have service variants set up, this might cause issues"
          }
          common
          commonFunc={() => {
            this.handleRemove();
            this.showWarningModal(false);
          }}
        />      
        <CommonWarningModal
          visible={this.state.warningVendorVisible}
          onClose={() => this.showWarningVendorModal(false)}
          heading={"Are you sure you want to remove this Vendor?"}
          subHeadingUOM={
            "If you choose to remove this Vendor, and you already have service variants set up, this might cause issues"
          }
          common
          commonFunc={() => {
            this.handleRemoveVendor();
            this.showWarningVendorModal(false);
          }}
        />      
      </React.Fragment>
    );
  }
}

export default withRouter(CreateWarehouseVendorDisposalFacilities);
