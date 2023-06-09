import React, {Component} from "react";
import {Breadcrumb} from "antd";
import {connect} from "react-redux";
import {setBreadcrumb} from "../Store/actions/breadcrumbAction";
import {Image as Images} from "./Images";

class CustomSelectOption extends Component {
    render() {
        const customer_contact = this.props.data?.customer_contact
        const owner_contact = this.props.data?.owner_contact
        return (<React.Fragment>
                <div className="row mx-0 custom-tree-row justify-content-between py-2">
                    <div className="common-select-option-row" style={{width:"87%"}}>
                        <div className="select-option-details d-flex align-items-center">
                            {this.props.img && (<div
                                    className={this.props.img ? "select-option-icon d-inline-block" : ""}
                                    style={{...this.props?.style,float:"left"}}
                                >
                                    <img src={this.props.img} alt={""} className="img-fluid"/>
                                </div>)}
                            <div className="d-inline-block" style={{width:"calc(100% - 45px)"}}>
                                <h6 style={{
                                    display:'inline-block',
                                    maxWidth:'98%',
                                    textOverflow:'ellipsis',
                                    overflow:'hidden',
                                    whiteSpace:'nowrap'
                                }} className="mb-0 custom-select-option-title">{this.props.data.name}</h6>
                                <ul className="list-inline mb-0 person-list-details">
                                    <li>
                                        <img src={Images.person_gray_small} alt={''} className="img-fluid"/>
                                        <span>{customer_contact?.length ? customer_contact[0]?.account?.name : '-'}</span>
                                    </li>
                                    <li>
                                        <img src={Images.person_round_gray_small} alt={''} className="img-fluid"/>
                                        <span>{owner_contact?.length ? owner_contact[0]?.account?.name : '-'}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="text-green-tag select-text-tier">
                        {this.props.type}
                    </div>
                </div>
            </React.Fragment>);
    }
}

export default connect(null, {setBreadcrumb})(CustomSelectOption);
