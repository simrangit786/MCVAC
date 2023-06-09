import React, {Component} from "react";
import {connect} from "react-redux";
import {setBreadcrumb} from "../../../../Store/actions/breadcrumbAction";
import {Image as Images} from "../../../Images";

class WoCustomSelectOptions extends Component {
    render() {
        const project_customer_contact = this.props.data?.project_customer_contact
        const project_owner_contact = this.props.data?.project_owner_contact

        return (<React.Fragment>
                <div className="row mx-0 custom-tree-row justify-content-between py-2">
                    <div className="common-select-option-row" style={{width:"87%"}}>
                        <div className="select-option-details align-items-center">
                            {this.props.img && (<div
                                    className={this.props.img ? "select-option-icon d-inline-block" : ""}
                                    style={{...this.props?.style,float:"left"}}
                                >
                                    <img src={this.props.img} alt={""} className="img-fluid"/>
                                </div>)}
                            <div className="d-inline-block" style={{width:"calc(100% - 45px)"}}>
                                <h6 style={{
                                    display:'inline-block',
                                    maxWidth:'95%',
                                    textOverflow:'ellipsis',
                                    overflow:'hidden',
                                    whiteSpace:'nowrap'
                                }} className="mb-0 custom-select-option-title">{this.props.data.name}</h6>
                                <ul className="list-inline mb-0 person-list-details">
                                    <li>
                                        <img src={Images.person_gray_small} alt={''} className="img-fluid"/>
                                        <span>{project_customer_contact?.length ? project_customer_contact[0]?.account?.name : '-'}</span>
                                    </li>
                                    <li>
                                        <img src={Images.person_round_gray_small} alt={''} className="img-fluid"/>
                                        <span>{project_owner_contact?.length ? project_owner_contact[0]?.account?.name : '-'}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* {this.props.data.breadcrumb.length > 1 && */}
                        {/*{this.props.data.parent != null && (<Breadcrumb
                                separator={<img
                                    src={Images.arrow_small_breadcrumb}
                                    alt={""}
                                    className="img-fluid"
                                />}
                            >
                                {this.props.data.breadcrumb.map((name) => {
                                    return (<>
                                            <Breadcrumb.Item key={name}>{name}</Breadcrumb.Item>
                                        </>);
                                })}
                                <Breadcrumb.Item>{this.props.data.name}</Breadcrumb.Item>
                            </Breadcrumb>)}*/}
                    </div>
                    <div className="text-green-tag select-text-tier">
                        {this.props.type}
                    </div>
                </div>
            </React.Fragment>);
    }
}

export default connect(null, {setBreadcrumb})(WoCustomSelectOptions);
