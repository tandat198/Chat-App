import React, { PureComponent } from "react";
import { connect } from "react-redux";

import './style.scss'
class HomePage extends PureComponent {

    render() {
        const { currentUser } = this.props
        return <div className='homepage'>
            <div className='sidebar'>
                <div className="info-wrapper">
                    <img src="" alt="" />
                    <span className='name'>{currentUser.name}</span>
                </div>
            </div>
        </div>;
    }
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(HomePage);
