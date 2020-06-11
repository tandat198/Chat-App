import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMessagesOfGroupStart } from "../../redux/group/group.actions";
import LoadingSpinner from "../LoadingSpinner";
import "./style.scss";

const ChatBox = ({ groupId }) => {
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.group.messages);
    const msg = useSelector((state) => state.group.msg);
    const loading = useSelector((state) => state.group.loading);
    const skip = useSelector((state) => state.group.skip);
    const chatBoxRef = useRef(null);
    const [lastScrollHeight, setLastScrollHeight] = useState(0);
    const currentUser = useSelector((state) => state.user.currentUser);

    const scrollToBottom = () => {
        const chatBox = chatBoxRef.current;
        if (msg === "added messages" || msg === "first time load messages") {
            chatBox.scrollTop = chatBox.scrollHeight;
        } else if (msg === "next load messages") {
            chatBox.scrollTop = (chatBox.scrollHeight * 9) / 10 - lastScrollHeight;
        }
    };

    useEffect(scrollToBottom, [messages]);

    const onScroll = () => {
        if (chatBoxRef.current.scrollTop === 0 && skip) {
            dispatch(getMessagesOfGroupStart(groupId, skip));
            setLastScrollHeight(chatBoxRef.current.scrollHeight);
        }
    };
    return (
        <React.Fragment>
            {loading === "loading messages" && <LoadingSpinner width='200px' height='200px' />}

            <ul ref={chatBoxRef} onScroll={onScroll} id='chat-box' className={`messages-container ${messages.length < 8 && "flex-end"}`}>
                {messages.map((message) => (
                    <li className={`${currentUser.id === message.senderId ? "owner" : undefined}`} key={message._id}>
                        <span className='sender'>{message.senderName}</span>
                        <span className={`${currentUser.id === message.senderId ? "blue" : "gray"} text`}>{message.text}</span>
                    </li>
                ))}
            </ul>
        </React.Fragment>
    );
};

export default ChatBox;
