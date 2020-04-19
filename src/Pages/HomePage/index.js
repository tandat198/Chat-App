import React from "react";
import { withRouter } from "react-router-dom";
import io from "socket.io-client";
import { connect } from "react-redux";
import { deleteGroupStart, getUsersInGroupStart, getMessagesOfGroupStart, addMsgToStore, getGroupsStart } from "../../redux/group/group.actions";
import ChatBox from "../../Components/ChatBox";
import FormModal from "../../Components/FormModal";
import ListModal from "../../Components/ListModal";
import LoadingSpinner from "../../Components/LoadingSpinner";
import spinner from "../../assets/icons/spinner.svg";
import more from "../../assets/icons/more.svg";
import user from "../../assets/icons/user.svg";
import group from "../../assets/icons/group.svg";
import gear from "../../assets/icons/gear.svg";
import logout from "../../assets/icons/logout.svg";
import paperPlane from "../../assets/icons/paper-plane.svg";
import { signOutStart } from "../../redux/user/user.actions";
import "./style.scss";
import Sidebar from "../../Components/Sidebar";

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
        socket.on("connect", () => {
            socket.on("sendMsgFromServer", msg => {
                if (msg !== "msg from server" && msg !== "connected to server" && msg) {
                    this.props.addNewMsgToStore(msg);
                }
            });
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.msg !== prevState.msg) return { msg: nextProps.msg };
        if (!nextProps.isAuthenticated) return { isAuthenticated: false };
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        socket.on("connect", () => {
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
        const { loading, users, messages, getUsersReq, getMessagesReq, signOutReq } = this.props;

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
            if (group.id !== groupActive.id) {
                this.setState({ groupActive: group, isChanged: true });
                getMessagesReq(group.id, -15);
                const sendData = { room: group };
                socket.emit("room", sendData);
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
            const user = JSON.parse(localStorage.getItem("user"));
            const sentData = {
                user,
                room: groupActive,
                msg: e.target.firstChild.value
            };
            socket.emit("room", sentData);
            // addNewMsg(e.target.firstChild.value, groupActive);
            e.target.firstChild.value = null;
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
                    <Sidebar groupActive={groupActive} setActive={setActive} toggleGroupModal={toggleGroupModal} />
                    <div className='chat-container'>
                        <div id='text'></div>
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
                        {messages.length > 0 && <ChatBox groupId={groupActive.id} />}
                        {groupActive.id && (
                            <form onSubmit={sendMsg} className='chat-bar'>
                                <input type='text' name='chatText' id='' placeholder='Enter your message' />
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
    messages: state.group.messages,
    loading: state.group.loading,
    msg: state.group.msg,
    index: state.group.index,
    isAuthenticated: state.user.isAuthenticated
});

const mapDispatchToProps = dispatch => ({
    getMessagesReq: (groupId, index) => dispatch(getMessagesOfGroupStart(groupId, index)),
    getGroups: () => dispatch(getGroupsStart()),
    deleteGroupReq: id => dispatch(deleteGroupStart(id)),
    getUsersReq: id => dispatch(getUsersInGroupStart(id)),
    signOutReq: () => dispatch(signOutStart()),
    addNewMsgToStore: msg => dispatch(addMsgToStore(msg))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HomePage));
