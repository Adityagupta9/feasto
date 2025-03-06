import React from "react";
import { MutatingDots } from "react-loader-spinner";
import "../styles/Spinner.css";

const Spinner = () => {
  return (
    <div className="spinner-container">
      <MutatingDots
        visible={true}
        height="100"
        width="100"
        color="#FFA500"
        secondaryColor="#FFD580"
        radius="12.5"
        ariaLabel="mutating-dots-loading"
      />
    </div>
  );
};

export default Spinner;
