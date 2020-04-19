import React from "react";
import plus from "../../assets/icons/plus.svg";
import { useSelector, useDispatch } from "react-redux";
import { deleteGroupStart } from "../../redux/group/group.actions";
import "./style.scss";

const Sidebar = ({ groupActive, setActive, toggleGroupModal }) => {
    const dispatch = useDispatch();

    const groups = useSelector(state => state.group.groups);
    const loading = useSelector(state => state.group.loading);

    const deleteGroup = id => {
        dispatch(deleteGroupStart(id));
    };

    return (
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
                    {groups.map(({ name, id }) => (
                        <li className={`group-item ${groupActive.id === id && "highlight"}`} key={id} onClick={() => setActive({ name, id })}>
                            <span>{name}</span>{" "}
                            {groupActive.id === id && (
                                <div onClick={() => deleteGroup(id)} className='tooltip'>
                                    &#10005; <div className='tooltiptext'>Delete</div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Sidebar;
