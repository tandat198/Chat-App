import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getGroupsStart, deleteGroupStart, getUsersInGroupStart } from "../../redux/group/group.actions";
<<<<<<< HEAD
<<<<<<< HEAD
import FormModal from "../../components/formmodal";
import ListModal from "../../components/listmodal";
=======
import FormModal from "../../components/FormModal/index";
import ListModal from "../../components/ListModal/index";
>>>>>>> parent of 905b24e... change file name
=======
import FormModal from "../../components/FormModal/index";
import ListModal from "../../components/ListModal/index";
>>>>>>> parent of 905b24e... change file name
import plus from "../../assets/icons/plus.svg";
import spinner from "../../assets/icons/spinner.svg";
import more from "../../assets/icons/more.svg";
import user from "../../assets/icons/user.svg";
import group from "../../assets/icons/group.svg";
import gear from "../../assets/icons/gear.svg";
import logout from "../../assets/icons/logout.svg";
import { signOutStart } from "../../redux/user/user.actions";
import "./style.scss";

class HomePage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            openCreateGroupModal: false,
            openAddUserModal: false,
            openUserListModal: false,
            openOption: false,
            isChanged: true,
            groupActive: {}
        };
    }

    componentDidMount() {
        this.props.getGroups();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.msg !== prevState.msg) return { msg: nextProps.msg };
        if (!nextProps.isAuthenticated) return { isAuthenticated: false };
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(this.state);
        console.log(prevState);
        console.log(prevProps);
        if (this.state.msg !== prevState.msg) {
            switch (this.state.msg) {
                case "Delete group successfully":
                    this.setState({
                        groupActive: {},
                        msg: ""
                    });
                    break;
                case "add new successfully":
                    console.log(this.state);
                    this.setState({
                        openAddUserModal: false,
                        msg: ""
                    });
                    break;
                case "create new successfully":
                    this.setState({
                        openCreateGroupModal: false,
                        msg: ""
                    });
                    break;
                default:
                    return;
            }
        }
    }

    render() {
        const { openCreateGroupModal, openAddUserModal, openUserListModal, groupActive, openOption, isChanged } = this.state;
        const { loading, groups, users, deleteGroupReq, getUsersReq, signOutReq } = this.props;

        const toggleGroupModal = () => {
            this.setState(state => ({ openCreateGroupModal: !state.openCreateGroupModal }));
        };

        const toggleUserModal = () => {
            this.setState(state => ({ openAddUserModal: !state.openAddUserModal }));
        };

        const toggleUserListModal = () => {
            this.setState(state => ({ openUserListModal: !state.openUserListModal }));
        };

        const toggleOption = () => {
            this.setState(state => ({ openOption: !state.openOption }));
        };

        const setActive = group => {
            this.setState({ groupActive: group, isChanged: true });
        };

        const deleteGroup = id => {
            deleteGroupReq(id);
        };

        const signOut = () => {
            this.props.history.push("/signin");
            signOutReq();
        };

        const getUsers = () => {
            console.log(users);
            if (users.length === 0 || isChanged) {
                getUsersReq(groupActive._id);
                this.setState({
                    isChanged: false
                });
            }
            this.setState({
                openUserListModal: true
            });
        };

        if (loading === "main") return <img className='main-loading' alt='Loading...' src={spinner} />;
        return (
            <React.Fragment>
                <div className='main'>
                    {loading === "delete" && (
                        <>
                            <img className='delete-spinner' src={spinner} alt='Loading...' />
                            <div className='overlay'></div>
                        </>
                    )}
                    <div className='side-bar' style={{ opacity: loading === "delete" && 0.8 }}>
                        <div className='top-side-bar'>
                            <span className='title'>Group List</span>
                            <button onClick={toggleGroupModal} className='create-new-group tooltip'>
                                <img className='plus-icon tooltip' src={plus} alt='Add' />
                                <span className='tooltiptext'>Create Group</span>
                            </button>
                        </div>
                        {groups.length > 0 && (
                            <ul className='group-list'>
                                {groups.map(({ name, _id }) => (
                                    <li className={`group-item ${groupActive._id === _id && "highlight"}`} key={_id} onClick={() => setActive({ name, _id })}>
                                        <span>{name}</span>{" "}
                                        {groupActive._id === _id && (
                                            <div onClick={() => deleteGroup(_id)} className='tooltip'>
                                                &#10005; <div className='tooltiptext'>Delete</div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className='chat-container'>
                        <div className='top-chat'>
                            <div className='group-name'>{groupActive.name}</div>
                            <div className='option-wrapper'>
                                <img onClick={toggleOption} className='three-dot' src={more} alt='More' />
                                {openOption && (
                                    <div className='option'>
                                        {groupActive._id && (
                                            <>
                                                <button onClick={toggleUserModal} type='button'>
                                                    <span>Add New User</span>
                                                    <span>
                                                        <img src={user} alt='user' />
                                                    </span>
                                                </button>
                                                <button onClick={getUsers} type='button'>
                                                    <span>Users In Group</span>
                                                    <span>
                                                        <img src={group} alt='people' />
                                                    </span>
                                                </button>
                                            </>
                                        )}
                                        <button type='button'>
                                            <span>Setting</span>
                                            <span>
                                                <img src={gear} alt='setting' />
                                            </span>
                                        </button>
                                        <button onClick={signOut} type='button'>
                                            <span>Log Out</span>
                                            <span>
                                                <img src={logout} alt='logout' />
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {openCreateGroupModal && <FormModal field='group' toggleModal={toggleGroupModal} />}
                {openAddUserModal && <FormModal groupActiveId={groupActive._id} field='user' toggleModal={toggleUserModal} />}
                {openUserListModal && <ListModal toggleModal={toggleUserListModal} />}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    groups: state.group.groups,
    users: state.group.users,
    loading: state.group.loading,
    msg: state.group.msg,
    isAuthenticated: state.user.isAuthenticated
});

const mapDispatchToProps = dispatch => ({
    getGroups: () => dispatch(getGroupsStart()),
    deleteGroupReq: id => dispatch(deleteGroupStart(id)),
    getUsersReq: id => dispatch(getUsersInGroupStart(id)),
    signOutReq: () => dispatch(signOutStart())
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HomePage));
