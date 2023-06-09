import React, { Component } from "react";
import { connect } from "react-redux";
import { userLogOutAction } from "../Store/actions/authAction";

class LogOut extends Component {
  componentDidMount() {
    this.props.userLogOutAction();
  }

  render() {
    return <React.Fragment />;
  }
}

const mapActionToProps = {
  userLogOutAction,
};

export default connect(null, mapActionToProps)(LogOut);
