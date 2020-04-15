import React from "react";
import spinner from "../../assets/icons/spinner.svg";

const LoadingSpinner = () => {
    return <img className='main-loading' alt='Loading...' src={spinner} />;
};

export default LoadingSpinner;
