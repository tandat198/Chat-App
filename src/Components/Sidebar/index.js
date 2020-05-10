import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteGroupStart } from "../../redux/group/group.actions";
import { Link } from "react-router-dom";
import plus from "../../assets/icons/plus.svg";
import "./style.scss";
import LoadingSpinner from "../LoadingSpinner";

const Sidebar = ({ groupActive, setActive, toggleGroupModal }) => {
    const dispatch = useDispatch();

    const groups = useSelector(state => state.group.groups);
    const loading = useSelector(state => state.group.loading);

    const deleteGroup = id => {
        setActive({});
        dispatch(deleteGroupStart(id));
    };

    const BackIcon = () => (
        <svg fill='#fff' width='24' height='24' version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 492 492' enableBackground='0 0 492 492'>
            <g>
                <g>
                    <path
                        d='M198.608,246.104L382.664,62.04c5.068-5.056,7.856-11.816,7.856-19.024c0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12
                    C361.476,2.792,354.712,0,347.504,0s-13.964,2.792-19.028,7.864L109.328,227.008c-5.084,5.08-7.868,11.868-7.848,19.084
                    c-0.02,7.248,2.76,14.028,7.848,19.112l218.944,218.932c5.064,5.072,11.82,7.864,19.032,7.864c7.208,0,13.964-2.792,19.032-7.864
                    l16.124-16.12c10.492-10.492,10.492-27.572,0-38.06L198.608,246.104z'
                    />
                </g>
            </g>
        </svg>
    );

    return (
        <div className='side-bar'>
            <div className={loading === "deleting" ? "overlay" : undefined}></div>
            {loading === "deleting" && <LoadingSpinner />}
            <div className='side-bar-content'>
                <div className='top-side-bar'>
                    <Link to='/' className='back-to-home tooltip'>
                        <BackIcon />
                        <span className='tooltiptext'>Back To Home</span>
                    </Link>
                    <span className='title'>Group List</span>
                    <button onClick={toggleGroupModal} className='create-new-group tooltip'>
                        <img className='plus-icon' src={plus} alt='Add' />
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
        </div>
    );
};

export default Sidebar;
