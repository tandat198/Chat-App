import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { getGroupsStart } from "../../redux/group/group.actions";
import spinner from "../../assets/icons/spinner.svg";

export const LoadingHOC = (WrappedComponent, data) => {
    class LoadIndicator extends PureComponent {
        componentDidMount() {
            switch (data) {
                case "groups":
                    this.props.getGroups();
                    break;
                default:
                    break;
            }
        }
        render() {
            return this.props.loading === "main" ? <img className='main-loading' alt='Loading...' src={spinner} /> : <WrappedComponent {...this.props} />;
        }
    }

    const mapStateToProp = state => ({
        loading: state.group.loading
    });

    const mapDispatchToProps = dispatch => ({
        getGroups: () => dispatch(getGroupsStart())
    });

    return connect(mapStateToProp, mapDispatchToProps)(LoadIndicator);
};

export default LoadingHOC;
