import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { createGroupStart, addUserStart } from "../../redux/group/group.actions";
import LoadingSpinner from "../LoadingSpinner";
import "./style.scss";

class FormModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            setValue: "",
            inputValue: "",
            optionValue: "email",
            error: ""
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.error !== prevState.error) return { error: nextProps.error };
        return null;
    }

    render() {
        const { inputValue, optionValue, error } = this.state;
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

        const setOption = e => {
            this.setState({
                optionValue: e.target.value
            });
        };

        return (
            <div className='modal'>
                <div className='modal-content'>
                    <form onSubmit={e => e.preventDefault()}>
                        {field === "group" ? (
                            <label htmlFor='group-name'>Group Name</label>
                        ) : (
                            <div className='select-wrapper'>
                                <span>Search for</span>
                                <select onChange={setOption}>
                                    <option value='email'>Email</option>
                                    <option value='name'>Name</option>
                                </select>
                            </div>
                        )}
                        <div className='input-control'>
                            <input onChange={setValue} name='inputValue' type='text' placeholder={`Enter ${field === "group" ? "group name" : `user's ${optionValue}`}`} id='group-name' />
                            {error && <span className='error'>{error}</span>}
                        </div>
                        <div className='btn-wrapper'>
                            <button className='cancel-btn' onClick={toggleModal} type='button'>
                                Cancel
                            </button>
                            <button className='submit-btn' onClick={onSubmit} disabled={loading} type='button'>
                                {field === "group" ? "Create" : "Add"}
                            </button>
                        </div>
                    </form>
                </div>
                {loading === "modal" && <LoadingSpinner />}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    loading: state.group.loading,
    error: state.group.error
});

const mapDispatchToProps = dispatch => ({
    createGroup: name => dispatch(createGroupStart({ name })),
    addUser: (groupId, email) => dispatch(addUserStart({ groupId, email }))
});

export default connect(mapStateToProps, mapDispatchToProps)(FormModal);
