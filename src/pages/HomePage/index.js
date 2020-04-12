import React, { useRef, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { createGroupStart, getGroupsStart } from "../../redux/group/group.actions";
import "./style.scss";
import more from "../../assets/images/more.svg";
import spinner from "../../assets/images/spinner.svg";

const HomePage = props => {
    const { loading, groups = [] } = props;
    useEffect(() => {
        console.log(groups);
        props.getGroups();
    }, []);
    const groupName = useRef(null);
    const [addGroupModal, setAddGroupModal] = useState(false);
    const [groupActive, setGroupActive] = useState("");

    const createNewGroup = e => {
        e.preventDefault();
        props.createGroup(groupName.current.value);
    };

    const toggleModal = () => {
        setAddGroupModal(!addGroupModal);
    };

    const setActive = id => {
        setGroupActive(id);
    };

    return (
        <React.Fragment>
            <div className='main'>
                <div className='side-bar'>
                    <div className='top-side-bar'>
                        <span className='title'>Group List</span>
                        <button onClick={toggleModal} className='create-new-group'>
                            <img className='plus-icon' src={more} alt='Add' />
                        </button>
                    </div>
                    {groups.length && (
                        <ul className='group-list'>
                            {groups.map(({ name = "", _id = "" }) => (
                                <li className={`group-item ${groupActive === _id && "highlight"}`} key={_id} onClick={() => setActive(_id)}>
                                    {name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className='chat-container'></div>
            </div>
            {addGroupModal && (
                <div className='add-modal'>
                    <div className='modal-content'>
                        <form onSubmit={createNewGroup}>
                            <label htmlFor='group-name'>Group Name</label>
                            <div className='input-control'>
                                <input ref={groupName} type='text' placeholder='Enter your group name' id='group-name' />
                            </div>
                            <div className='btn-wrapper'>
                                <button onClick={toggleModal} type='button' value='cancel'>
                                    Cancel
                                </button>
                                <button type='submit' value='submit'>
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                    {loading && <img className='spinner' src={spinner} />}
                </div>
            )}
        </React.Fragment>
    );
};

const mapStateToProps = state => ({
    groups: state.group.groups,
    loading: state.group.loading
});

const mapDispatchToProps = dispatch => ({
    getGroups: () => dispatch(getGroupsStart()),
    createGroup: name => dispatch(createGroupStart({ name }))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HomePage));
