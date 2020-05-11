import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { deleteGroupStart, getUsersInGroupStart, getMessagesOfGroupStart, joinRoomStart } from "../../redux/group/group.actions";
import ChatBox from "../../Components/ChatBox";
import FormModal from "../../Components/FormModal";
import Sidebar from "../../Components/Sidebar";
import LoadingHOC from "../../Components/LoadingHOC";
import LoadingSpinner from "../../Components/LoadingSpinner";
import ListModal from "../../Components/ListModal";
import { signOutStart } from "../../redux/user/user.actions";
import { addNewMessageStart } from "../../redux/group/group.actions";
import more from "../../assets/icons/more.svg";
import user from "../../assets/icons/user.svg";
import group from "../../assets/icons/group.svg";
import gear from "../../assets/icons/gear.svg";
import logout from "../../assets/icons/logout.svg";
import paperPlane from "../../assets/icons/paper-plane.svg";
import "./style.scss";

class ChatPage extends React.PureComponent {
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

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.msg !== prevState.msg) return { msg: nextProps.msg };
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.msg !== prevState.msg) {
            switch (this.state.msg) {
                case "Delete group successfully":
                    this.setState({
                        groupActive: {},
                        msg: ""
                    });
                    break;
                case "Add user successfully":
                    this.setState({
                        openAddUserModal: false,
                        msg: ""
                    });
                    break;
                case "Create group successfully":
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
        const { loading, users, getUsersReq, getMessagesReq, signOutReq, currentUser } = this.props;

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
            if (group.id && group.id !== groupActive.id) {
                getMessagesReq(group.id, 0);
                this.props.joinRoom(group);
            }
        };

        const signOut = () => {
            this.props.history.push("/signin");
            signOutReq();
        };

        const getUsers = () => {
            if (users.length === 0 || isChanged) {
                getUsersReq(groupActive.id);
                this.setState({
                    isChanged: false
                });
            }
            this.setState({
                openUserListModal: true
            });
        };

        const sendMsg = async e => {
            e.preventDefault();
            this.props.addMsg(currentUser, groupActive, e.target.firstChild.value);
            e.target.firstChild.value = null;
        };

        return (
            <React.Fragment>
                <div className='main'>
                    {loading === "delete" && (
                        <div className='overlay'>
                            <LoadingSpinner />
                        </div>
                    )}

                    <Sidebar groupActive={groupActive} setActive={setActive} toggleGroupModal={toggleGroupModal} />
                    <div className='chat-container'>
                        <div className='top-chat'>
                            <div className='group-name'>{groupActive.name}</div>
                            <div className='option-wrapper'>
                                <img onClick={toggleOption} className={`three-dot ${openOption && "active"}`} src={more} alt='More' />
                                {openOption && (
                                    <div className='option'>
                                        {groupActive.id && (
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
                        {groupActive.id && <ChatBox groupId={groupActive.id} />}
                        {groupActive.id && (
                            <form onSubmit={sendMsg} className='chat-bar'>
                                <input autoCorrect='off' autoComplete='off' type='text' name='chatText' id='' placeholder='Enter your message' />
                                <button type='submit'>
                                    <span>Send</span> <img src={paperPlane} alt='send' />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
                {openCreateGroupModal && <FormModal field='group' toggleModal={toggleGroupModal} />}
                {openAddUserModal && <FormModal groupActiveId={groupActive.id} field='user' select toggleModal={toggleUserModal} />}
                {openUserListModal && <ListModal toggleModal={toggleUserListModal} />}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
    groups: state.group.groups,
    users: state.group.users,
    loading: state.group.loading,
    msg: state.group.msg,
    isAuthenticated: state.user.isAuthenticated
});

const mapDispatchToProps = dispatch => ({
    getMessagesReq: (groupId, skip) => dispatch(getMessagesOfGroupStart(groupId, skip)),
    deleteGroupReq: id => dispatch(deleteGroupStart(id)),
    getUsersReq: id => dispatch(getUsersInGroupStart(id)),
    signOutReq: () => dispatch(signOutStart()),
    joinRoom: room => dispatch(joinRoomStart(room)),
    addMsg: (user, room, msg) => dispatch(addNewMessageStart(user, room, msg))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoadingHOC(ChatPage, "groups")));
