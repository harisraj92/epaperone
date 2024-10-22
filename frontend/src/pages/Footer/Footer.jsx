// FooterComponent.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareFull, faCircle } from "@fortawesome/free-solid-svg-icons"; // Import icons for shapes
const Footer = () => {
  return (
    <div className="footerPDF">
      <div>
        <div className="col text-lg-start">
          <FontAwesomeIcon icon={faSquareFull} className="text-warning me-1" />
          <FontAwesomeIcon icon={faSquareFull} className="text-danger me-1" />
          <FontAwesomeIcon icon={faSquareFull} className="text-primary me-1" />
          <FontAwesomeIcon icon={faSquareFull} className="text-success me-1" />
          <FontAwesomeIcon
            icon={faSquareFull}
            className="text-secondary me-1"
          />
        </div>
        <div className="col text-lg-start">
          <FontAwesomeIcon icon={faCircle} className="text-warning me-1" />
          <FontAwesomeIcon icon={faCircle} className="text-danger me-1" />
          <FontAwesomeIcon icon={faCircle} className="text-primary me-1" />
          <FontAwesomeIcon icon={faCircle} className="text-success me-1" />
          <FontAwesomeIcon icon={faCircle} className="text-secondary me-1" />
        </div>
        <div className="col text-lg-start">
          <FontAwesomeIcon icon={faSquareFull} className="text-warning me-1" />
          <FontAwesomeIcon icon={faSquareFull} className="text-danger me-1" />
          <FontAwesomeIcon icon={faSquareFull} className="text-primary me-1" />
          <FontAwesomeIcon icon={faSquareFull} className="text-success me-1" />
          <FontAwesomeIcon
            icon={faSquareFull}
            className="text-secondary me-1"
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
