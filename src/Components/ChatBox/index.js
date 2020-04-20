import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMessagesOfGroupStart } from "../../redux/group/group.actions";
import "./style.scss";

const ChatBox = props => {
    const messages = useSelector(state => state.group.messages);
    const msg = useSelector(state => state.group.msg);
    const index = useSelector(state => state.group.index);
    const chatBoxRef = useRef(null);
    const [lastScrollHeight, setLastScrollHeight] = useState(0);
    const dispatch = useDispatch();
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const scrollToBottom = () => {
        const chatBox = chatBoxRef.current;
        if (chatBox.scrollHeight && (msg === "added to store" || msg === "first load")) {
            chatBox.scrollTop = chatBox.scrollHeight;
        } else if (msg === "next load") {
            chatBox.scrollTop = chatBox.scrollHeight - lastScrollHeight;
        }
    };

    useEffect(scrollToBottom, [messages]);

    const onScroll = () => {
        if (chatBoxRef.current.scrollTop === 0) {
            dispatch(getMessagesOfGroupStart(props.groupId, index));
            setLastScrollHeight(chatBoxRef.current.scrollHeight);
        }
    };

    return (
        <ul ref={chatBoxRef} onScroll={onScroll} id='chat-box' className={`messages-container ${messages.length < 8 && "flex-end"}`}>
            {messages.map(message => (
                <li className={`${currentUser.id === message.senderId ? "blue" : "gray"}`} key={message.id}>
                    {message.text}
                </li>
            ))}
        </ul>
    );
};

export default ChatBox;
