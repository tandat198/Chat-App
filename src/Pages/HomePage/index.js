import React from "react";
import { withRouter } from "react-router-dom";
import io from "socket.io-client";
import { connect } from "react-redux";
import { getGroupsStart, deleteGroupStart, getUsersInGroupStart, getMessagesOfGroupStart, addNewMessageStart } from "../../redux/group/group.actions";
import FormModal from "../../Components/FormModal";
import ListModal from "../../Components/ListModal";
import LoadingSpinner from "../../Components/LoadingSpinner";
import plus from "../../assets/icons/plus.svg";
import spinner from "../../assets/icons/spinner.svg";
import more from "../../assets/icons/more.svg";
import user from "../../assets/icons/user.svg";
import group from "../../assets/icons/group.svg";
import gear from "../../assets/icons/gear.svg";
import logout from "../../assets/icons/logout.svg";
import paperPlane from "../../assets/icons/paper-plane.svg";
import { signOutStart } from "../../redux/user/user.actions";
import "./style.scss";

const socket = io.connect("https://young-falls-17697.herokuapp.com", { autoConnect: true });
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
        socket.on("connect", function () {
            socket.on("sendMsgFromServer", function (data) {});
        });
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
        const { loading, groups, users, messages, deleteGroupReq, getUsersReq, getMessagesReq, signOutReq, addNewMsg } = this.props;
        const currentUser = JSON.parse(localStorage.getItem("user"));

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
            getMessagesReq(group._id);
            const sendData = { room: group };
            socket.emit("room", sendData);
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

        const sendMsg = async e => {
            e.preventDefault();
            addNewMsg(e.target.firstChild.value, groupActive);
            e.target.firstChild.value = null;
        };

        const scroll = () => {
            console.log("scroll");
            var chatBox = document.getElementById("chat-box");
            chatBox.scrollTop = chatBox.scrollHeight;
        };

        if (loading === "main") return <LoadingSpinner />;
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
                        <ul onChange={scroll} id='chat-box' className={`messages-container ${messages.length < 8 && "flex-end"}`}>
                            {messages.map(message => (
                                <li className={`${currentUser._id === message.senderId ? "blue" : "gray"}`} key={message._id}>
                                    {message.text}
                                </li>
                            ))}
                        </ul>
                        <form onSubmit={sendMsg} className='chat-bar'>
                            <input type='text' name='chatText' id='' placeholder='Enter your message' />
                            <button type='submit'>
                                <span>Send</span> <img src={paperPlane} alt='send' />
                            </button>
                        </form>
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
    currentUser: state.user.currentUser,
    groups: state.group.groups,
    users: state.group.users,
    messages: state.group.messages,
    loading: state.group.loading,
    msg: state.group.msg,
    isAuthenticated: state.user.isAuthenticated
});

const mapDispatchToProps = dispatch => ({
    getGroups: () => dispatch(getGroupsStart()),
    getMessagesReq: groupId => dispatch(getMessagesOfGroupStart(groupId)),
    deleteGroupReq: id => dispatch(deleteGroupStart(id)),
    getUsersReq: id => dispatch(getUsersInGroupStart(id)),
    signOutReq: () => dispatch(signOutStart()),
    addNewMsg: (msg, room) => dispatch(addNewMessageStart(msg, room))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HomePage));
