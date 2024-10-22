import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearchPlus,
  faSearchMinus,
  faSearch,
  faSquareFull,
  faVectorSquare,
  faCircle,
  faArrowsAltH,
} from "@fortawesome/free-solid-svg-icons"; // Import icons for shapes
const LayoutProperties = ({
  onAddShape,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onSizeChange,
  selectedSize,
  customWidth,
  customHeight,
  setCustomWidth,
  setCustomHeight,
  applyCustomSize,
  addShape,
}) => {
  return (
    <div className="layout-properties p-3">
      <h5>Canvas Layout & Zoom</h5>

      {/* Zoom Controls */}
      <div className="zoom-controls mb-3 d-flex align-items-center">
        <button className="btn btn-primary me-2" onClick={onZoomIn}>
          <FontAwesomeIcon icon={faSearchPlus} /> {/* Zoom In Icon */}
        </button>
        <button className="btn btn-secondary" onClick={onZoomOut}>
          <FontAwesomeIcon icon={faSearchMinus} /> {/* Zoom Out Icon */}
        </button>
        <div className="zoom-level ms-3 d-flex align-items-center">
          <FontAwesomeIcon icon={faSearch} /> {/* Zoom Level Icon */}
          <span className="ms-2">{Math.round(zoomLevel * 100)}%</span>
        </div>
      </div>

      {/* Predefined Sizes */}
      <div className="form-group">
        <label>Select Size:</label>
        <select
          className="form-control form-control-sm"
          value={selectedSize}
          onChange={onSizeChange}
        >
          <option value="Broadsheet">MainPage (1247 x 1965)</option>
          <option value="Tabloid">Tabloid (944 x 1247)</option>
          <option value="custom">Custom Size</option>
        </select>
      </div>

      {/* Only show custom width and height if 'Custom Size' is selected */}
      {selectedSize === "custom" && (
        <div className="custom-size mt-3">
          <h5>Custom Size</h5>
          <div className="row">
            {/* Width Input */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Width (px):</label>
                <input
                  type="number"
                  className="form-control  form-control-sm"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(e.target.value)}
                />
              </div>
            </div>

            {/* Height Input */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Height (px):</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <button className="btn btn-success mt-2" onClick={applyCustomSize}>
            Apply Custom Size
          </button>
        </div>
      )}
      {/* <h5>Shapes</h5>
      <div className="shape-controls mb-3">
        <button
          className="btn btn-outline-primary me-2"
          onClick={() => onAddShape("CIRCLE")}
        >
          <FontAwesomeIcon icon={faCircle} /> Circle
        </button>
        <button
          className="btn btn-outline-primary me-2"
          onClick={() => onAddShape("SQUARE")}
        >
          <FontAwesomeIcon icon={faSquareFull} /> Square
        </button>
        <button
          className="btn btn-outline-primary me-2"
          onClick={() => onAddShape("RECTANGLE")}
        >
          <FontAwesomeIcon icon={faVectorSquare} /> Rectangle
        </button>
        <button
          className="btn btn-outline-primary me-2"
          onClick={() => onAddShape("LINE")}
        >
          <FontAwesomeIcon icon={faArrowsAltH} /> Line
        </button>
      </div> */}
    </div>
  );
};

export default LayoutProperties;
