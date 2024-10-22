import React, { useState } from "react";
import LayoutProperties from "./LayoutProperties";

const RightSidebar = ({
  setCanvasSize,
  setZoomLevel,
  canvasSize,
  zoomLevel,
}) => {
  const [customWidth, setCustomWidth] = useState(canvasSize.width);
  const [customHeight, setCustomHeight] = useState(canvasSize.height);
  const [selectedSize, setSelectedSize] = useState("Broadsheet"); // Default to Broadsheet

  const onZoomIn = () =>
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 2));
  const onZoomOut = () =>
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 0.5));

  const onSizeChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedSize(selectedValue);

    let newSize = { width: 944, height: 1247 };

    switch (selectedValue) {
      case "Mainpage":
        newSize = { width: 1247, height: 1965 };
        break;
      case "Tabloid":
        newSize = { width: 944, height: 1247 };
        break;
      case "custom":
        // Leave the size unchanged for custom, since the user will set custom dimensions
        return;
      default:
        newSize = { width: 944, height: 768 };
    }

    setCanvasSize(newSize); // Apply the size immediately if it's not custom
  };

  const applyCustomSize = () => {
    setCanvasSize({
      width: parseInt(customWidth, 10),
      height: parseInt(customHeight, 10),
    });
  };

  return (
    <div className="right-sidebar">
      <LayoutProperties
        zoomLevel={zoomLevel}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onSizeChange={onSizeChange}
        selectedSize={selectedSize}
        customWidth={customWidth}
        customHeight={customHeight}
        setCustomWidth={setCustomWidth}
        setCustomHeight={setCustomHeight}
        applyCustomSize={applyCustomSize}
      />
    </div>
  );
};

export default RightSidebar;
