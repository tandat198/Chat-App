import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { createGroupStart, addUserStart } from "../../redux/group/group.actions";
import spinner from "../../assets/icons/spinner.svg";
import "./style.scss";

class Modal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            setValue: "",
            inputValue: ""
        };
    }
    render() {
        const { inputValue } = this.state;
        const { createGroup, addUser, loading, toggleModal, field, groupActiveId } = this.props;

        const onSubmit = e => {
            e.preventDefault();
            switch (field) {
                case "group":
                    createGroup(inputValue);
                    break;
                case "user":
                    addUser(groupActiveId, inputValue);
                    break;
                default:
                    return;
            }
        };

        const setValue = e => {
            this.setState({
                [e.target.name]: e.target.value
            });
        };

        return (
            <div className='modal'>
                <div className='modal-content'>
                    <form onSubmit={onSubmit}>
                        <label htmlFor='group-name'>{field === "group" ? "Group Name" : "Email"}</label>
                        <div className='input-control'>
                            <input
                                onChange={setValue}
                                name='inputValue'
                                type='text'
                                placeholder={`Enter ${field === "group" ? "group name" : "user's email"}`}
                                id='group-name'
                            />
                        </div>
                        <div className='btn-wrapper'>
                            <button onClick={toggleModal} type='button' value='cancel'>
                                Cancel
                            </button>
                            <button disabled={loading && true} type='submit' value='submit'>
                                {field === "group" ? "Create" : "Add"}
                            </button>
                        </div>
                    </form>
                </div>
                {loading === "modal" && <img alt='Loading...' className='spinner' src={spinner} />}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    loading: state.group.loading
});

const mapDispatchToProps = dispatch => ({
    createGroup: name => dispatch(createGroupStart({ name })),
    addUser: (groupId, email) => dispatch(addUserStart({ groupId, email }))
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
