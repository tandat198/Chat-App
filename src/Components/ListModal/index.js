import React, { PureComponent } from "react";
import { connect } from "react-redux";
import spinner from "../../assets/icons/spinner.svg";
import "./style.scss";

class ListModal extends PureComponent {
    render() {
        const { loading, users, toggleModal } = this.props;
        return (
            <div className='modal'>
                <div className='modal-content'>
                    <ul className='user-list'>
                        {users.map(user => (
                            <li className='user-item' key={user._id}>
                                {user.name}
                            </li>
                        ))}
                    </ul>
                    <button onClick={toggleModal} type='button'>
                        Close
                    </button>
                </div>
                {loading === "modal" && <img alt='Loading...' className='spinner center' src={spinner} />}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    loading: state.group.loading,
    users: state.group.users
});

export default connect(mapStateToProps)(ListModal);
