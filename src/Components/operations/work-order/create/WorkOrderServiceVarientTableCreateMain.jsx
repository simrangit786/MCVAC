// import React, {Component} from 'react';
// import {Checkbox, Collapse, Select} from "antd";
// import {CaretDownOutlined, CaretRightOutlined} from '@ant-design/icons';
// import {Image as Images} from '../../../Images'

// function onChange(e) {
//     console.log(`checked = ${e.target.checked}`);
// }

// const {Option} = Select;

// function handleChange(value) {
//     console.log(`selected ${value}`);
// }

// const {Panel} = Collapse;

// class LineItemsTableCustomMain extends Component {
//     render() {
//         return (
//             <React.Fragment>
//                 <div className="col-12 table-responsive main-table-div position-relative">
//                     <div
//                         className="row mx-0 custom-table-main-row custom-table-main-row-wage-info-main proposals-table-line-item">
//                         <div className="col-12">
//                             <div className="row">
//                                 <div className="col-12">
//                                     <div className="row custom-table-header">
//                                         <div className="custom-table-cell-th custom-table-cell-th-1">
//                                             <div className="custom-th-heading">Type</div>
//                                         </div>
//                                         <div className="custom-table-cell-th custom-table-cell-th-2">
//                                             <div className="custom-th-heading">Name/Info</div>
//                                         </div>
//                                         <div className="custom-table-cell-th custom-table-cell-th-3">
//                                             <div className="custom-th-heading">Qty</div>
//                                         </div>
//                                         <div className="custom-table-cell-th custom-table-cell-th-4">
//                                             <div className="custom-th-heading">Uom</div>
//                                         </div>
//                                         <div className="custom-table-cell-th custom-table-cell-th-5">
//                                             <div className="custom-th-heading">Price <br/> Per Unit</div>
//                                         </div>
//                                         <div className="custom-table-cell-th custom-table-cell-th-6">
//                                             <div className="custom-th-heading">Taxable</div>
//                                         </div>
//                                         <div className="custom-table-cell-th custom-table-cell-th-7">
//                                             <div className="custom-th-heading">Include <br/> In Subtotal</div>
//                                         </div>
//                                         {/* <div className="custom-table-cell-th custom-table-cell-th-8">
//                                             <div className="custom-th-heading">add <br/> to total</div>
//                                         </div> */}
//                                         <div className="custom-table-cell-th custom-table-cell-th-8">
//                                             <div className="custom-th-heading">Total Price</div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="col-12 custom-table-body p-0">
//                                     <Collapse
//                                         accordion
//                                         defaultActiveKey={['1']}
//                                         expandIcon={({isActive}) => <CaretRightOutlined
//                                             rotate={isActive ? 90 : 0}/>}
//                                         className="custom-table-collapse-main"
//                                     >
//                                         <Panel header={
//                                             <React.Fragment>
//                                                 <div className="custom-table-row custom-table-row-level-1 row mx-0">
//                                                     <div
//                                                         className="custom-table-cell-td wage-info-collapse-td gray-2-color">
//                                                         <div className="d-flex align-items-center">
//                                                             <img alt={""} src={Images.line_item_icon_green}
//                                                                  className="img-fluid mr-2"/>
//                                                             Pneumatic Vac / CT Union 201
//                                                         </div>
//                                                     </div>
//                                                     <div
//                                                         className="custom-table-cell-td custom-table-cell-td-3 background-white-div gray-2-color">
//                                                         <div className="px-3 d-inline-block w-100 text-right">6</div>
//                                                     </div>
//                                                     <div
//                                                         className="custom-table-cell-td custom-table-cell-td-4 gray-2-color">
//                                                         <Select
//                                                             className="edit-select-box"
//                                                             suffixIcon={
//                                                                 <CaretDownOutlined/>
//                                                             }
//                                                             onChange={handleChange}>
//                                                             <Option value="a">Uom</Option>
//                                                             <Option value="b">Daily</Option>
//                                                             <Option value="c">Hourly</Option>
//                                                         </Select>
//                                                     </div>
//                                                     <div
//                                                         className="custom-table-cell-td custom-table-cell-td-5 justify-content-end d-flex gray-2-color">
//                                                         <span className="px-3 d-inline-block w-100">$1,183.33</span>
//                                                     </div>
//                                                     {/* <div
//                                                         className="custom-table-cell-td custom-table-cell-td-6 justify-content-end d-flex gray-2-color">
//                                                         <span>50%</span>
//                                                     </div> */}
//                                                     <div
//                                                         className="custom-table-cell-td custom-table-cell-td-6 justify-content-end d-flex gray-2-color">
//                                                         <Checkbox checked onChange={onChange}/>
//                                                     </div>
//                                                     <div
//                                                         className="custom-table-cell-td custom-table-cell-td-7 justify-content-center gray-2-color">
//                                                         <Checkbox checked onChange={onChange}/>
//                                                     </div>
//                                                     <div
//                                                         className="custom-table-cell-td custom-table-cell-td-8 gray-2-color">
//                                                         <div className="px-3 d-inline-block w-100">
//                                                             $10,706.04
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </React.Fragment>
//                                         } key="1">
//                                             <div className="custom-table-row custom-table-row-level-1 row mx-0">
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-1 gray-2-color background-white-div">
//                                                     <div className="px-3 d-inline-block w-100">Labor</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-2 gray-2-color background-white-div">
//                                                     <div className="px-3 d-inline-block w-100">Operator</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-3 justify-content-end d-flex">
//                                                     <div className="editalble-form-data">
//                                                         {/*<Form className="position-relative">*/}
//                                                         {/*    <InputNumber placeholder={"6"}/>*/}
//                                                         {/*    <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">*/}
//                                                         {/*        <EditOutlined/>*/}
//                                                         {/*    </Button>*/}
//                                                         {/*</Form>*/}
//                                                         <span className="px-3 d-inline-block w-100">6</span>
//                                                     </div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-4 justify-content-end d-flex">
//                                                     <div>Hours</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-5 justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">$133.33</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-6 background-white-div justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">50%</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-7 background-white-div justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">$200</div>
//                                                 </div>
//                                                 <div className="custom-table-cell-td custom-table-cell-td-8"/>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-9 gray-2-color">
//                                                     <div className="px-3 d-inline-block w-100">$1,200.00</div>
//                                                 </div>
//                                             </div>
//                                             <div className="custom-table-row custom-table-row-level-1 row mx-0">
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-1 gray-2-color background-white-div">
//                                                     <div className="px-3 d-inline-block w-100">Supply Group</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-2 background-white-div">
//                                                     <div className="px-3 d-inline-block w-100">Power Washer</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-3 justify-content-end d-flex">
//                                                     <div className="editalble-form-data">
//                                                         {/*<Form className="position-relative">*/}
//                                                         {/*    <InputNumber placeholder={"6"}/>*/}
//                                                         {/*    <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">*/}
//                                                         {/*        <EditOutlined/>*/}
//                                                         {/*    </Button>*/}
//                                                         {/*</Form>*/}
//                                                         <span className="px-3 d-inline-block w-100">6</span>
//                                                     </div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-4 justify-content-end d-flex">
//                                                     <div>Hours</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-5 justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">$133.33</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-6 background-white-div justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">50%</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-7 background-white-div justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">$200</div>
//                                                 </div>
//                                                 <div className="custom-table-cell-td custom-table-cell-td-8"/>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-9 gray-2-color">
//                                                     <div className="px-3 d-inline-block w-100">$1,200.00</div>
//                                                 </div>
//                                             </div>
//                                             <div className="custom-table-row custom-table-row-level-1 row mx-0">
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-1 gray-2-color background-white-div">
//                                                     <div className="px-3 d-inline-block w-100">Vehicle Group</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-2 background-white-div">
//                                                     <div className="px-3 d-inline-block w-100">Mercedes</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-3 justify-content-end d-flex">
//                                                     <div className="editalble-form-data">
//                                                         {/*<Form className="position-relative">*/}
//                                                         {/*    <InputNumber placeholder={"6"}/>*/}
//                                                         {/*    <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">*/}
//                                                         {/*        <EditOutlined/>*/}
//                                                         {/*    </Button>*/}
//                                                         {/*</Form>*/}
//                                                         <span className="px-3 d-inline-block w-100">6</span>
//                                                     </div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-4 justify-content-end d-flex">
//                                                     <div>Hours</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-5 justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">$133.33</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-6 background-white-div justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">50%</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-7 background-white-div justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">$200</div>
//                                                 </div>
//                                                 <div className="custom-table-cell-td custom-table-cell-td-8"/>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-9 gray-2-color">
//                                                     <div className="px-3 d-inline-block w-100">$1,200.00</div>
//                                                 </div>
//                                             </div>
//                                             <div className="custom-table-row custom-table-row-level-1 row mx-0">
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-1 gray-2-color background-white-div">
//                                                     <div className="px-3 d-inline-block w-100">Inventory Group</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-2 background-white-div">
//                                                     <div className="px-3 d-inline-block w-100">Tubing</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-3 background-white-div justify-content-end d-flex">
//                                                     <div className="editalble-form-data">
//                                                         {/*<Form className="position-relative">*/}
//                                                         {/*    <InputNumber placeholder={"6"}/>*/}
//                                                         {/*    <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">*/}
//                                                         {/*        <EditOutlined/>*/}
//                                                         {/*    </Button>*/}
//                                                         {/*</Form>*/}
//                                                         <span className="px-3 d-inline-block w-100">1</span>
//                                                     </div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-4 justify-content-end d-flex">
//                                                     <div>Feet</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-5 justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">$200.00</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-6 background-white-div justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">5%</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-7 background-white-div justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">$21.00</div>
//                                                 </div>
//                                                 <div className="custom-table-cell-td custom-table-cell-td-8"/>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-9 gray-2-color">
//                                                     <div className="px-3 d-inline-block w-100">$1,200.00</div>
//                                                 </div>
//                                             </div>
//                                             <div className="custom-table-row custom-table-row-level-1 row mx-0">
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-1 gray-2-color background-white-div">
//                                                     <div className="px-3 d-inline-block w-100">Inventory Kit</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-2 background-white-div">
//                                                     <div className="px-3 d-inline-block w-100">Nails</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-3 background-white-div justify-content-end d-flex">
//                                                     <div className="editalble-form-data">
//                                                         {/*<Form className="position-relative">*/}
//                                                         {/*    <InputNumber placeholder={"6"}/>*/}
//                                                         {/*    <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">*/}
//                                                         {/*        <EditOutlined/>*/}
//                                                         {/*    </Button>*/}
//                                                         {/*</Form>*/}
//                                                         <span className="px-3 d-inline-block w-100">1</span>
//                                                     </div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-4 justify-content-end d-flex">
//                                                     <div>Amount</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-5 justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">$2.00</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-6 justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">2%</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-7 justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">$2.40</div>
//                                                 </div>
//                                                 <div className="custom-table-cell-td custom-table-cell-td-8"/>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-9 gray-2-color">
//                                                     <div className="px-3 d-inline-block w-100">$1,200.00</div>
//                                                 </div>
//                                             </div>
//                                             <div className="custom-table-row custom-table-row-level-1 row mx-0">
//                                                 <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color background-white-div">
//                                                     <div className="px-3 d-inline-block w-100">Inventory Group</div>
//                                                 </div>
//                                                 <div className="custom-table-cell-td custom-table-cell-td-2 background-white-div">
//                                                     <div
//                                                         className="custom-table-cell-td custom-table-cell-td-2 custom-table-cell-td-name-info">
//                                                         <div className="name-info-div position-relative">
//                                                             <span className="rectangle-icon-div position-absolute">
//                                                                 <img src={Images.rectangle_gray_icon} alt="" className={"img-fluid"}/>
//                                                             </span>
//                                                             <span>4" Gold Nails</span>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-3 justify-content-end d-flex">
//                                                     <div className="editalble-form-data">
//                                                         {/*<Form className="position-relative">*/}
//                                                         {/*    <InputNumber placeholder={"6"}/>*/}
//                                                         {/*    <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">*/}
//                                                         {/*        <EditOutlined/>*/}
//                                                         {/*    </Button>*/}
//                                                         {/*</Form>*/}
//                                                         <span className="px-3 d-inline-block w-100">2</span>
//                                                     </div>
//                                                 </div>
//                                                 <div className="custom-table-cell-td custom-table-cell-td-4 justify-content-end d-flex">
//                                                     <div>Amount</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-5 justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">$100.00</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-6 background-white-div justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">2%</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-7 background-white-div justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">$21.00</div>
//                                                 </div>
//                                                 <div className="custom-table-cell-td custom-table-cell-td-8"/>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-9 gray-2-color">
//                                                     <div className="px-3 d-inline-block w-100">$1,200.00</div>
//                                                 </div>
//                                             </div>
//                                             <div className="custom-table-row custom-table-row-level-1 row mx-0">
//                                                 <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color background-white-div">
//                                                     <div className="px-3 d-inline-block w-100">Inventory Group</div>
//                                                 </div>
//                                                 <div className="custom-table-cell-td custom-table-cell-td-2 background-white-div">
//                                                     <div
//                                                         className="custom-table-cell-td custom-table-cell-td-2 custom-table-cell-td-name-info">
//                                                         <div className="name-info-div position-relative">
//                                                             <span className="rectangle-icon-div d-none-rectangle-before position-absolute">
//                                                                 <img src={Images.rectangle_gray_icon} alt="" className={"img-fluid"}/>
//                                                             </span>
//                                                             <span>4" Silver Nails</span>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-3 justify-content-end d-flex">
//                                                     <div className="editalble-form-data">
//                                                         {/*<Form className="position-relative">*/}
//                                                         {/*    <InputNumber placeholder={"6"}/>*/}
//                                                         {/*    <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">*/}
//                                                         {/*        <EditOutlined/>*/}
//                                                         {/*    </Button>*/}
//                                                         {/*</Form>*/}
//                                                         <span className="px-3 d-inline-block w-100">2</span>
//                                                     </div>
//                                                 </div>
//                                                 <div className="custom-table-cell-td custom-table-cell-td-4 justify-content-end d-flex">
//                                                     <div>Amount</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-5 justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">$100.00</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-6 background-white-div justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">2%</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-7 background-white-div justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">$21.00</div>
//                                                 </div>
//                                                 <div className="custom-table-cell-td custom-table-cell-td-8"/>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-9 gray-2-color">
//                                                     <div className="px-3 d-inline-block w-100">$1,200.00</div>
//                                                 </div>
//                                             </div>
//                                             <div className="custom-table-row custom-table-row-level-1 row mx-0">
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-1 gray-2-color background-white-div">
//                                                     <div className="px-3 d-inline-block w-100">Inventory Sub-tier</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-2 background-white-div">
//                                                     <div className="px-3 d-inline-block w-100">Fencing</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-3 background-white-div justify-content-end d-flex">
//                                                     <div className="editalble-form-data">
//                                                         {/*<Form className="position-relative">*/}
//                                                         {/*    <InputNumber placeholder={"6"}/>*/}
//                                                         {/*    <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">*/}
//                                                         {/*        <EditOutlined/>*/}
//                                                         {/*    </Button>*/}
//                                                         {/*</Form>*/}
//                                                         <span className="px-3 d-inline-block w-100">1</span>
//                                                     </div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-4 justify-content-end d-flex">
//                                                     <div>Feet</div>
//                                                 </div>
//                                                 <div className="custom-table-cell-td custom-table-cell-td-5 justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">$2.00</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-6 background-white-div justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">2%</div>
//                                                 </div>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-7 background-white-div justify-content-end d-flex">
//                                                     <div className="px-3 d-inline-block w-100">$2.40</div>
//                                                 </div>
//                                                 <div className="custom-table-cell-td custom-table-cell-td-8"/>
//                                                 <div
//                                                     className="custom-table-cell-td custom-table-cell-td-9 gray-2-color">
//                                                     <div className="px-3 d-inline-block w-100">$1,200.00</div>
//                                                 </div>
//                                             </div>
//                                         </Panel>
//                                     </Collapse>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/*<div className="col-12 mb-lg-3 mb-md-4 mb-sm-3">*/}
//                 {/*    <div className="w-100 row mx-0 price-estimated-row-table align-items-center position-absolute">*/}
//                 {/*        <div className="col-12 col-sm-12 col-md-9 offset-md-3 p-0">*/}
//                 {/*            <ul className="list-inline mb-0 pricing-estimated-ul d-flex align-items-center pl-lg-2">*/}
//                 {/*                <li className="list-inline-item">*/}
//                 {/*                        <span className="d-flex align-items-center">*/}
//                 {/*                            <img alt={""} className="img-fluid mr-2" src={Images.info_small}/>*/}
//                 {/*                            Estimated Hourly Price:*/}
//                 {/*                        </span>*/}
//                 {/*                </li>*/}
//                 {/*                <li className="list-inline-item">*/}
//                 {/*                    $1,746.00*/}
//                 {/*                </li>*/}
//                 {/*                <li className="list-inline-item pl-3">*/}
//                 {/*                        <span className="d-flex align-items-center">*/}
//                 {/*                            Estimated Daliy Price:*/}
//                 {/*                        </span>*/}
//                 {/*                </li>*/}
//                 {/*                <li className="list-inline-item">*/}
//                 {/*                    $14,175.00*/}
//                 {/*                </li>*/}
//                 {/*            </ul>*/}
//                 {/*        </div>*/}
//                 {/*    </div>*/}
//                 {/*</div>*/}
//                 {/*<div className="col-12 pb-lg-5 pb-md-4 pb-sm-3 pt-lg-3 mt-lg-5 mt-md-4 mt-sm-3">*/}
//                 {/*        <span className="small-text-main d-flex align-items-center">*/}
//                 {/*            <img src={Images.info_small} alt={""} className="img-fluid mr-2"/>*/}
//                 {/*            Note: Estimated total price per hour is calculated by Straight time.*/}
//                 {/*        </span>*/}
//                 {/*</div>*/}
//             </React.Fragment>
//         );
//     }
// }

// export default LineItemsTableCustomMain;

import React, {Component} from "react";
import {Collapse, Dropdown, InputNumber, Menu, Select, Spin} from "antd";
import {CaretDownOutlined, CaretRightOutlined} from "@ant-design/icons";
import {Image as Images} from "../../../Images";
// import GeneratePriceForm from "./GeneratePriceForm";
import Checkbox from "antd/lib/checkbox/Checkbox";
import {
    FLEET_GROUP, formatPrice, LABOR, MANAGEMENT_TREE_TYPES, SUPPLY_GROUP, TYPES
} from "../../../../Controller/utils";
import { addWorkOrderContainerData } from "../../../../Controller/api/workOrderServices";
import { handleError } from "../../../../Controller/Global";

const { Option } = Select;
const {Panel} = Collapse;

class WorkOrderServiceVarientTableCreateMain extends Component {
    state = {
        rows: [], groups: [], loading: true, qty: 1, warningVisible: false, pricingUom: []
    };
    menu = (<Menu>
        <Menu.Item key="0" onClick={() => this.props.handleRemoveWarning(true, this.props.newPricing?.id)}>
            Remove
        </Menu.Item>
    </Menu>);

    componentDidMount() {
        const {newPricing} = this.props
        this.handleData();
        this.setState({qty: this.props.newPricing.workorder_qty || 1});
    }

    formatVal = (val, UPDATE_PPU) => {
        const { newPricing } = this.props;
        const PRICE_PER_UNIT = Number(newPricing?.price_per_unit).toFixed(2);
        let value = val?.toString() || "0";
        let parseVal = value
          ?.replace(/\$\s?|(,*)/g, "")
          .toLocaleString(undefined, { minimumFractionDigits: 2 });
        let moneyFormatter = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        });
        this.setState({ priceUnit: moneyFormatter.format(parseVal) }, () => {
          if (UPDATE_PPU) {
            // debounceEvent((e)=> {
            const parsedVal = this.state.priceUnit
              ?.replace(/\$\s?|(,*)/g, "")
              .toLocaleString(undefined, { minimumFractionDigits: 2 });
            console.log(parsedVal, PRICE_PER_UNIT);
            if (!newPricing?.edited && parsedVal != PRICE_PER_UNIT) {
              this.props.handlePricePerUnitChange(parsedVal, newPricing?.id);
              return;
            } else if (newPricing?.edited && parsedVal != PRICE_PER_UNIT) {
              this.props.handlePricePerUnitChange(parsedVal, newPricing?.id);
            }
            // },1000)
          }
        });
      };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {newPricing} = this.props
        if (prevProps.newPricing.price_per_unit !== newPricing.price_per_unit) {
            this.formatVal(newPricing.price_per_unit)
        }
        if (prevProps.margin !== this.props.margin) {
            this.handleData();
        }
        if(prevProps.child !== this.props.child) {
            this.handleData();
        }
    }

    handleChangeContainer = (value,disposalid,variantid) => {
        let params ;
        if(value.container) {
            params = {
                container_type: value.container,
                disposal_id: disposalid,
                variant_id: variantid
            } 
        } else {
            params = {
                container_quantity: value.cont_qty,
                disposal_id: disposalid,
                variant_id: variantid
            }
        }
        addWorkOrderContainerData(params).then(res => {
             this.props.fetchworkorder(this.props.workorder.id)
             this.props.getSelectedServiceVariants()
             this.handleData()
        }).catch((err) => {
            handleError(err);
        })
    }

    handleFleetKit = (item, kit_child, kitRow) => {
        return (<div className="custom-table-row custom-table-row-level-1 row mx-0">
            <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                <div>Fleet Group</div>
            </div>
            <div className={`custom-table-cell-td custom-table-cell-td-2` + (!kitRow ? " last-child " : "")}>
                <div className="name-info-div p-0 position-relative">
                    {kit_child && (<span className="rectangle-icon-div position-absolute">
                    <img
                        src={Images.rectangle_gray_icon}
                        alt=""
                        className={"img-fluid"}
                    />
                  </span>)}
                    <span style={kit_child && {paddingLeft: "30px"}}>
                  {item?.kit_child ? item?.item?.name : item.name || "-"}
                </span>
                </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-3">
                <span className="px-3">-</span>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-4">
                <span className="px-3">
                  -
                </span>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-4">
                <span className="px-3">
                  -
                </span>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-4">
                <div className="editalble-form-data d-flex align-items-center justify-content-center">
                <span className="px-3">
                  {

                      item.qty || 1}
                </span>
                </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-5 px-0">
                <div className="editalble-form-data editalble-form-data-select d-flex align-items-center px-3">
                    {item?.kit_child ? (<span className="text-capitalize">
                      {item?.kit_uom?.name || "-"}
                    </span>) : (<span className="text-capitalize">
                      {item?.uom?.name || "-"}
                    </span>)}
                </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-6">
                <div>{item.price_unit ? `$${item.price_unit}` : "-"}</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-7">
                <div>-</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-8">
                <div>-</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-9">
                <div>{item.total_price ? `$${item.total_price}` : "-"}</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-9">
                <div>-</div>
            </div>
        </div>);
    }

    handleData = async () => {
        // this.fetchGroup();
        let a = [...this.props.child];
        this.setState({rows: a, loading: false});
    };

    handleAddMore = (item, i) => {
        // console.log(item, "name")
        let a = this.state.rows;
        let obj = {item_type: "labor_child", id: "child" + i, name: item.name};
        a.splice(i, 0, obj);
        this.setState({rows: a});
    };

    updateTable = () => {
        let rows = this.state.rows
            .map((item) => {
                delete item.data;
                delete item.pricing;
                return {...item};
            })
            .drawer((p) => p.type !== "add");
        return rows;
    };

    renderRow = (item, kit_child, kitRow) => {
        // let { margin, view, viewProposalTable } = this.props;
        switch (item.type) {
            case FLEET_GROUP:
                return (<div className="custom-table-row custom-table-row-level-1 custom-table-proposal row mx-0">
                    <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                        <div>{MANAGEMENT_TREE_TYPES.FLEET_GROUP.name}</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-2">
                        <div>{item.name}</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-3">
                        <span className="px-3">-</span>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-4">
                        <span className="px-3">-</span>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-4">
                        <span className="px-3">-</span>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-4">
                        <div className="editalble-form-data d-flex align-items-center justify-content-center">
                            <span className="px-3">{item.qty || 1}</span>
                        </div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-5 justify-content-start px-3">
                        <div>Hours</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-6">
                        <div/>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-7">
                        <div/>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-8">
                        <div/>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-9">
                        <div/>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-8">
                        <div>-</div>
                    </div>
                </div>);
            case SUPPLY_GROUP:
                return (<div className="custom-table-row custom-table-row-level-1 row mx-0">
                    <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                        <div>{MANAGEMENT_TREE_TYPES.SUPPLY_GROUP.name}</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-2">
                        <div>{item.name}</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-3">
                        <span className="px-3">-</span>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-4">
                        <span className="px-3">-</span>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-4">
                        <span className="px-3">-</span>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-4">
                        <div className="editalble-form-data d-flex align-items-center justify-content-center">
                            <span className="px-3">{item.qty || 1}</span>
                        </div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-5 justify-content-start px-3">
                        <div>Hours</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-6">
                        <div/>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-7">
                        <div/>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-8">
                        <div/>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-9">
                        <div/>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-8">
                        <div>-</div>
                    </div>
                </div>);
            case "INVENTORY_ITEM":
                // console.log(item, "inventory-item")
                return (<div className="custom-table-row custom-table-row-level-1 row mx-0">
                    <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                        <div>Inventory Item</div>
                    </div>
                    <div
                        className={`custom-table-cell-td custom-table-cell-td-2` + (!kitRow ? " last-child " : "")}
                    >
                        <div className="name-info-div p-0 position-relative">
                            {kit_child && (<span className="rectangle-icon-div position-absolute">
                    <img
                        src={Images.rectangle_gray_icon}
                        alt=""
                        className={"img-fluid"}
                    />
                  </span>)}
                            <span
                                style={kit_child && {paddingLeft: "30px"}}
                            >
                  {item?.kit_child ? item?.item?.name : (item.name || "-")}
                </span>
                        </div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-3">
                        <span className="px-3">-</span>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-4">
                        <span className="px-3">-</span>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-4">
                        <span className="px-3">-</span>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-4">
                        <div className="editalble-form-data d-flex align-items-center justify-content-center">
                <span className="px-3">
                  {// (item.kit_child
                      //   ? item.quantity
                      //     ? item.quantity
                      //     : item.initQuantity
                      //   : "")
                      item.qty || 1}
                </span>
                        </div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-5 px-0">
                        <div
                            className="editalble-form-data editalble-form-data-select d-flex align-items-center px-3">
                            {item?.kit_child ? (<span className="text-capitalize">{item?.kit_uom?.name || "-"}</span>) :
                                <span className="text-capitalize">{item?.uom?.name || "-"}</span>}
                        </div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-6">
                        <div/>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-7">
                        <div/>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-8">
                        <div/>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-9">
                        <div/>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-8">
                        <div>-</div>
                    </div>
                </div>);
            case "INVENTORY_KIT":
                return (<>
                    <div className="custom-table-row custom-table-row-level-1 row mx-0">
                        <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                            <div>{TYPES.inventory_kit.title}</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-2">
                            <div>{item.name}</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-3">
                            <span className="px-3">-</span>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-4">
                            <span className="px-3">-</span>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-4">
                            <span className="px-3">-</span>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-4">
                            <div className="editalble-form-data d-flex align-items-center justify-content-center">
                                <span className="px-3">{item.qty || 1}</span>
                            </div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-5">
                            <div>Unit</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-6">
                            <div/>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-7">
                            <div/>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-8">
                            <div/>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-9">
                            <div/>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-8">
                            <div>-</div>
                        </div>
                    </div>
                    {item.children.length > 0 && item.children.map((n, ind) => {
                        let kitRow = item.children.length > ind + 1;
                        return this.renderRow(n, true, kitRow)
                    })}
                    {item.data?.inventory_package_items?.map((p) => (<div
                        key={p.id}
                        className="custom-table-row custom-table-row-level-1 row mx-0"
                    >
                        <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                            <div>Inventory Group</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-2">
                            <div className="name-info-div position-relative">
                    <span className="rectangle-icon-div position-absolute">
                      <img
                          src={Images.rectangle_gray_icon}
                          alt=""
                          className={"img-fluid"}
                      />
                    </span>
                                <span>{p.item.name}</span>
                            </div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-3">
                            <div
                                className="editalble-form-data d-flex align-items-center justify-content-center">
                                <span className="px-3">-</span>
                            </div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-4">
                            <div>Amount</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-5">
                            <div
                                className="editalble-form-data d-flex align-items-center justify-content-center">
                                {/*<Form className="position-relative">*/}
                                {/*    <InputNumber placeholder={8}/>*/}
                                {/*    <Button*/}
                                {/*        className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">*/}
                                {/*        <EditOutlined/>*/}
                                {/*    </Button>*/}
                                {/*</Form>*/}
                                <span className="px-3">-</span>
                            </div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-6">
                            <div>${p.item.unit_cost * p.quantity}</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-7">
                            <div>{p.item.margin || 0}%</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-8">
                            {/* <div>
                    $
                    {calculatePercentage(
                      p.item.unit_cost * p.quantity,
                      p.item.margin
                    ) || 0}
                  </div> */}
                        </div>
                    </div>))}
                </>);
            case "FLEET_KIT":
                return (<>
                    <div className="custom-table-row custom-table-row-level-1 row mx-0">
                        <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                            <div>{TYPES.fleet_kit.title}</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-2">
                            <div>{item.name}</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-3">
                            <span className="px-3">-</span>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-4">
                            <span className="px-3">-</span>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-4">
                            <span className="px-3">-</span>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-4">
                            <div className="editalble-form-data d-flex align-items-center justify-content-center">
                                <span className="px-3">{item.qty || 1}</span>
                            </div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-5">
                            <div>Unit</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-6">
                            {item.price_unit ? `$${item.price_unit}` : "-"}
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-7">
                            <div>-</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-8">
                            <div>-</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-9">
                            <div>{item.total_price ? `$${item.total_price}` : "-"}</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-8">
                            <div>-</div>
                        </div>
                    </div>
                    {item.children?.length > 0 && item?.children.map((n, ind) => {
                        let kitRow = item.children?.length > ind + 1;
                        return this.handleFleetKit(n, true, kitRow);
                    })}

                </>);
            case "DISPOSAL":
                return (<>
                    <div className="custom-table-row custom-table-row-level-1 row mx-0">
                        <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                            <div>Disposal</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-2">
                            <div className="name-info-div p-0 position-relative">
                                {/*<span className="rectangle-icon-div position-absolute">*/}
                                {/*    <img src={Images.rectangle_gray_icon} alt="" className={"img-fluid"}/>*/}
                                {/*</span>*/}
                                <span>{item.name}</span>
                            </div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-3">
                                <span
                                    className="px-3">{item?.facility_type === "VENDOR" ? item?.facility_id?.vendor?.name : item?.facility_type === "WAREHOUSE" ? item?.facility_id?.internal_location.name : "-"}</span>
                        </div>
                        {!this.props.view ? 
                        <div className="custom-table-cell-td background-white-div custom-table-cell-td-4">
                            <InputNumber
                            //  placeholder={0} 
                            value={item.container_quantity}
                             onBlur={(e) => this.handleChangeContainer({cont_qty: e.target.value},item.id,this.props.newPricing?.id)}
                            //  onBlur={(e) => {this.handleChangeContainer({cont_qty: e})}}
                            />
                        </div> : <div className="custom-table-cell-td custom-table-cell-td-4">
                            {item.container_quantity ? item.container_quantity : "-"}
                        </div>
    }
                     {!this.props.view ? 
                        <div className="custom-table-cell-td custom-table-cell-td-4 p-0 bg-white">
                            <Select 
                                // placeholder={'TC'}
                                className="edit-select-box"
                                suffixIcon={<CaretDownOutlined/>}
                                value={item.container_type}
                                onChange={(e) => this.handleChangeContainer({container : e},item.id,this.props.newPricing?.id)}
                            >
                                <Option value="BA">BA</Option>
                                <Option value="CF">CF</Option>
                                <Option value="CM">CM</Option>
                                <Option value="CW">CW</Option>
                                <Option value="CY">CY</Option>
                                <Option value="DF">DF</Option>
                                <Option value="DM">DM</Option>
                                <Option value="DT">DT</Option>
                                <Option value="DW">DW</Option>
                                <Option value="HG">HG</Option>
                                <Option value="TC">TC</Option>
                                <Option value="TP">TP</Option>
                                <Option value="TT">TT</Option>
                            </Select>
                        </div> : <div className="custom-table-cell-td custom-table-cell-td-4">
                            {item.container_type ? item.container_type : "-"}
                        </div>
        }
                        <div className="custom-table-cell-td custom-table-cell-td-4">
                            <div className="editalble-form-data d-flex align-items-center justify-content-center">
                                <span className="px-3">{item.qty || 1}</span>
                            </div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-5 px-3 justify-content-start">
                            <span className="text-capitalize">{item?.uom?.name || "-"}</span>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-6">
                            <div/>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-7">
                            <div/>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-8">
                            <div/>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-9">
                            <div/>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-8 d-flex p-0 justify-content-start">
                                <span
                                    className="text-capitalize">{item?.doc_type ? item?.doc_type === "BILL_OF_LADING" ? "Bill of Lading" : item?.doc_type === "NEITHER" ? "Neither" : "Manifest" : "-"}</span>
                        </div>
                    </div>
                </>);
            case LABOR:
                return (<>
                    <div className="custom-table-row custom-table-row-level-1 row mx-0">
                        <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                            <div>Labor</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-2 gray-2-color">
                            <div>{item.name}</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-3">
                            <span className="px-3">-</span>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-4">
                            <span className="px-3">-</span>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-4">
                            <span className="px-3">-</span>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-4">
                            <div className="editalble-form-data d-flex align-items-center justify-content-center">
                                <span className="px-3">{item.qty}</span>
                            </div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-5 justify-content-start">
                            <div className="px-3">Hours</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-6">
                            <div className="editalble-form-data d-flex align-items-center justify-content-center">
                                {/*<span className="px-3">8</span>*/}
                            </div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-7">
                            <div/>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-8">
                            <div/>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-9">
                            <div/>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-8">
                            <div>-</div>
                        </div>
                        {/* <div className="custom-table-cell-td custom-table-cell-td-8">
                              <div/>
                          </div> */}
                    </div>
                </>);
            default:
                return <></>;
        }
    };
    stopEvtBubbling = (e) => {
        e.stopPropagation();
    };

    render() {
        const {newPricing, viewProposalTable, view, allOptions, foundRegion, removeThreeDots} = this.props;
        const foundUom = allOptions?.find((i) => i.id === newPricing?.variant_data?.pricing_uom?.id);
         
        return (<React.Fragment>
            <div className="col-12 custom-table-body p-0">
                <Collapse
                    // accordion
                    // defaultActiveKey={["1"]}
                    expandIcon={({isActive}) => (<CaretRightOutlined rotate={isActive ? 90 : 0}/>)}
                    className="custom-table-collapse-main"
                >
                    <Panel
                        header={<React.Fragment>
                            <div
                                className={newPricing?.resource_type === "DISPOSAL" ? "custom-table-row custom-collapse-line-item custom-table-row-level-1 line-item-grid row mx-0 disposal-added" : "custom-table-row custom-collapse-line-item custom-table-row-level-1 line-item-grid row mx-0"}>
                                <div
                                    className="custom-table-cell-td wage-info-collapse-td gray-2-color d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <img
                                            alt={""}
                                            src={newPricing?.resource_type === "INVENTORY_KIT" ? Images.inventory_kit_variant : newPricing?.resource_type === "INVENTORY_ITEM" ? Images.inventory_item_variant : newPricing?.resource_type === "DISPOSAL" ? Images.no_disposal_black : newPricing?.resource_type === "SUPPLY_GROUP" ? Images.supply_icon_black : Images.line_item_black}
                                            className="img-fluid mr-2"
                                        />
                                        {newPricing?.resource_type === "INVENTORY_KIT" || newPricing?.resource_type === "INVENTORY_ITEM" || newPricing?.resource_type == "DISPOSAL" || newPricing?.resource_type === "SUPPLY_GROUP"
                                        ? newPricing?.resource_id?.name 
                                        // : `${newPricing?.variant_data?.line_item?.name} ${foundRegion && '/'} ${foundRegion?.title || ""} - ${newPricing?.variant_data?.name}`
                                        : newPricing?.variant_data?.display_name ? newPricing?.variant_data?.display_name : "-"
                                    }
                                    </div>
                                    {!removeThreeDots && <Dropdown overlay={this.menu} trigger={['click']}>
                                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                            <img alt="remove-icon"
                                                 src={Images.black_dots_elipsis}
                                                 className="img-fluid"
                                            />
                                        </a>
                                    </Dropdown>}
                                </div>
                                {newPricing?.resource_type === "DISPOSAL" &&
                                <div
                                    className="custom-table-cell-td background-white-div p-0"
                                    onClick={this.stopEvtBubbling}
                                >
                                    {view ? (<span>{parseInt(newPricing?.container_quantity)}</span>) : (<InputNumber
                                        value={newPricing?.container_quantity}
                                        onBlur={(e) => {
                                            this.props.handleChangeContainer({container_quantity: e.target.value}, newPricing.id)

                                        }}
                                    />)}
                                </div>
                                }

                                {newPricing?.resource_type === "DISPOSAL" &&

                                <div
                                    className="custom-table-cell-td background-white-div p-0"
                                    onClick={this.stopEvtBubbling}
                                >
                                    {view ? (<span>{newPricing?.container_type}</span>) : (
                                     <Select 
                                     // placeholder={'TC'}
                                     className="edit-select-box w-100 bg-white"
                                     suffixIcon={<CaretDownOutlined/>}
                                     value={newPricing.container_type}
                                     onChange={(e) => this.props.handleChangeContainer({container_type: e},this.props.newPricing?.id)}
                                 >
                                     <Option value="BA">BA</Option>
                                     <Option value="CF">CF</Option>
                                     <Option value="CM">CM</Option>
                                     <Option value="CW">CW</Option>
                                     <Option value="CY">CY</Option>
                                     <Option value="DF">DF</Option>
                                     <Option value="DM">DM</Option>
                                     <Option value="DT">DT</Option>
                                     <Option value="DW">DW</Option>
                                     <Option value="HG">HG</Option>
                                     <Option value="TC">TC</Option>
                                     <Option value="TP">TP</Option>
                                     <Option value="TT">TT</Option>
                                 </Select>)}
                                </div>

                                }


                                <div
                                    className="custom-table-cell-td background-white-div p-0"
                                    onClick={this.stopEvtBubbling}
                                >
                                    {view ? (<span>{parseInt(newPricing?.workorder_qty) || "1"}</span>) : (<InputNumber
                                        value={newPricing?.workorder_qty || 1}
                                        onBlur={(e) => {
                                            this.props.handleQuantitySelectChange(e.target.value, newPricing.id)

                                        }}
                                    />)}
                                </div>
                                <div
                                    className="custom-table-cell-td p-0 gray-2-color d-flex justify-content-center"
                                    onClick={this.stopEvtBubbling}
                                >
                      <span className="d-inline-block w-100 px-3">
                       {/* {newPricing?.variant_data?.pricing_uom ? `${newPricing?.variant_data?.pricing_uom?.name} (${newPricing?.variant_data?.pricing_uom?.symbol})` : "-"}  */}
                       {/* {newPricing?.disposal_unit_id || "-"} */}
                       {newPricing?.resource_type === "DISPOSAL" ? newPricing?.disposal_unit_id :
                          newPricing.selected_unit == "UOM"
                            ? `${foundUom?.name} (${foundUom?.symbol})`
                            : newPricing.selected_unit == "HOURS"
                              ? "Hours (hrs)"
                              : "Day (d)"}

                      </span>
                                    <>
                                    </>
                                </div>
                                <div
                                    className={`custom-table-cell-td p-0 gray-2-color d-flex justify-content-center`}
                                >
                      <span className="d-inline-block w-100 px-3">
                        {`$ ${formatPrice(newPricing.price_per_unit)}`}
                      </span>
                                </div>

                                <div
                                    className="custom-table-cell-td gray-2-color pl-0 text-center"
                                    onClick={this.stopEvtBubbling}
                                >
                                    <Checkbox
                                        defaultChecked={false}
                                        checked={newPricing?.taxable}

                                    />
                                </div>
                                <div
                                    className="custom-table-cell-td gray-2-color pl-0 text-center"
                                    onClick={this.stopEvtBubbling}
                                >
                                    <Checkbox
                                        checked={newPricing?.include_subtotal}
                                        defaultChecked
                                    />
                                </div>
                                <div
                                    className="custom-table-cell-td gray-2-color px-3"
                                    onClick={this.stopEvtBubbling}
                                >
                                    <div className="d-inline-block w-100">
                                        {`$ ${formatPrice(newPricing?.total_price)}`}
                                    </div>
                                </div>
                                <div
                                    className="custom-table-cell-td gray-2-color px-3">{newPricing?.document_type ? newPricing?.document_type === "BILL_OF_LADING" ? "Bill of Lading" : newPricing?.document_type === "NEITHER" ? "Neither" : "Manifest" : "-"}</div>
                            </div>
                        </React.Fragment>}
                        key="1"
                    >
                        {this.state.rows.map((r, i) => {
                            let obj = {};
                            if (r.kit) {
                                let kitRow = this.state.rows.length > i + 1;
                                obj = {
                                    id: r.id,
                                    item: r.item,
                                    qty: r.quantity,
                                    kit_uom: r.kit?.unit,
                                    type: 'INVENTORY_ITEM',
                                    kit_child: true
                                }
                                return this.renderRow(obj, true, kitRow);
                            } else {
                                return this.renderRow(r);
                            }
                        })}
                    </Panel>
                </Collapse>
            </div>
        </React.Fragment>);

    }
}

export default WorkOrderServiceVarientTableCreateMain;
