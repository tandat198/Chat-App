import React, { PureComponent } from "react";
import { connect } from "react-redux";
import "./style.scss";
import { withRouter } from "react-router-dom";
import { uploadProfileStart, uploadCoverStart } from "../../redux/user/user.actions";

class Profile extends PureComponent {
    uploadProfilePhoto = (e) => {
        const { uploadProfile } = this.props;
        uploadProfile(e.target.files[0]);
    };

    uploadCoverPhoto = (e) => {
        const { uploadCover } = this.props;
        uploadCover(e.target.files[0]);
    };
    render() {
        const {
            currentUser: { coverPhoto, profilePhoto, name },
        } = this.props;

        const AddIcon = () => (
            <svg width='64' height='64' version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 512 512'>
                <g>
                    <path
                        d='M492,236H276V20c0-11.046-8.954-20-20-20c-11.046,0-20,8.954-20,20v216H20c-11.046,0-20,8.954-20,20s8.954,20,20,20h216
			v216c0,11.046,8.954,20,20,20s20-8.954,20-20V276h216c11.046,0,20-8.954,20-20C512,244.954,503.046,236,492,236z'
                    />
                </g>
            </svg>
        );

        return (
            <div className='profile'>
                <div className='container profile-container'>
                    <div className='info'>
                        <div className='cover-photo'>
                            <img src={coverPhoto ? coverPhoto : require("../../assets/images/cover-photo.jpg")} alt='Cover' />
                        </div>
                        <div className='profile-photo'>{profilePhoto ? <img src={profilePhoto} alt='Profile' /> : <AddIcon />}</div>
                        <div className='update-btn'>
                            <button className='update-profile'>
                                <label htmlFor='profile-photo'>Set Profile Photo</label>
                            </button>
                            <input onChange={this.uploadProfilePhoto} style={{ display: "none" }} type='file' name='profilePhoto' id='profile-photo' />
                            <button className='update-cover'>
                                <label htmlFor='cover-photo'>Set Cover Photo</label>
                            </button>
                            <input onChange={this.uploadCoverPhoto} style={{ display: "none" }} type='file' name='coverPhoto' id='cover-photo' />
                        </div>

                        <div className='name'>{name}</div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
    uploadProfile: (file) => dispatch(uploadProfileStart(file)),
    uploadCover: (file) => dispatch(uploadCoverStart(file)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile));
