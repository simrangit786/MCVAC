import React, {Component} from "react";
import {Breadcrumb, Button, Drawer} from "antd";
import {Image} from "../../Images";
import {Link} from "react-router-dom";
import CreateDisposalTree from "../../management/disposal/disposal-family/create/CreateDisposalTree";

class FleetDrawer extends Component {
    render() {
        const {visible, item} = this.props;
        return (
            <Drawer
                className="main-drawer-div main-all-form-modal inline-item-drawer"
                title={
                    <div className="d-flex align-items-center">
                        {/*<img alt="" className="img-fluid" src={Image.line_item_icon_green}/>*/}
                        <span>Old Fridge Door Parts</span>
                    </div>
                }
                centered
                width={700}
                closable={false}
                onClose={this.props.onClose}
                placement={"right"}
                visible={visible}
                footer={
                    <div
                        style={{
                            textAlign: "right",
                        }}
                    >
                        <Button onClick={this.props.onClose} type="primary">
                            Done
                        </Button>
                    </div>
                }
            >
                <div className="breadcrumb-inner-details inline-item-breadcrumb">
                    <Breadcrumb
                        separator={
                            <img
                                src={Image.arrow_small_breadcrumb}
                                alt={""}
                                className="img-fluid"
                            />
                        }
                    >
                        {item.breadcrumb.map((name) => {
                            return (
                                <Breadcrumb.Item key={name}>
                                    <Link>Outdated Fridge Parts</Link>
                                </Breadcrumb.Item>
                            );
                        })}
                        <Breadcrumb.Item key={item.name}>
                            <Link>Old Fridge Door Parts</Link>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <CreateDisposalTree/>
            </Drawer>
        );
    }
}

export default FleetDrawer;
