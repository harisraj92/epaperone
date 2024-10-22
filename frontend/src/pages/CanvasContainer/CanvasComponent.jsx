import React, { useContext, useRef } from "react";
import { Rnd } from "react-rnd";
import { CanvasContext } from "./CanvasContext";
import { resizeHandleClasses } from "./canvasUtils";
import TextElement from "./Text/TextElement";
import AddHeading from "./Text/AddHeading";
import ImageElement from "./Images/ImageElement";
import Coltext from "./Text/Coltext";
import Coltexttwo from "./Text/Coltexttwo";
import HeaderTemplate from "./Text/HeaderTemplate";
import Footer from "../Footer/Footer";

// New Shape Components
const Shape = ({ type, dimension }) => {
  const shapeStyles = {
    RECTANGLE: {
      backgroundColor: "#ddd",
      width: dimension.width,
      height: dimension.height,
    },
    CIRCLE: {
      backgroundColor: "#ddd",
      borderRadius: "50%",
      width: dimension.width,
      height: dimension.height,
    },
    LINE: { backgroundColor: "#333", width: dimension.width, height: "2px" },
    SQUARE: {
      backgroundColor: "#ddd",
      width: dimension.width,
      height: dimension.width,
    }, // Square has equal width and height
  };

  return <div style={shapeStyles[type]} />;
};

const componentMap = {
  TEXT: TextElement,
  IMAGE: ImageElement,
  HEADING: AddHeading,
  COLUMNTEXT: Coltext,
  COLUMNTEXTTWO: Coltexttwo,
  RECTANGLE: Shape,
  CIRCLE: Shape,
  LINE: Shape,
};

const getEnableResize = (type) => {
  return {
    bottom: type !== "LINE",
    bottomLeft: true,
    bottomRight: true,
    top: type !== "LINE",
    topLeft: true,
    topRight: true,
    left: type !== "LINE",
    right: type !== "LINE",
  };
};

const CanvasComponent = (props) => {
  const { state, actions } = useContext(CanvasContext);
  const { dimension, position, content, id, type } = props;
  const [showGrids, setShowGrids] = React.useState(false);
  const [isReadOnly, setIsReadOnly] = React.useState(true);
  const elementRef = React.useRef(null);
  const isDragged = useRef(false);

  const activeSelection = state?.activeSelection;

  const onBlur = (event) => {
    const toolbarElement = document.querySelector("#toolbar");
    if (
      event.currentTarget.contains(event?.relatedTarget) ||
      toolbarElement?.contains(event?.relatedTarget)
    ) {
      return;
    }
    setIsReadOnly(true);
    actions?.setEnableQuillToolbar(false);
    if (id && activeSelection) {
      activeSelection.delete(id);
      actions?.setActiveSelection(new Set(activeSelection));
    }
  };

  const getComponent = () => {
    const Component = type && componentMap[type];
    if (!Component || !id) return null;
    return (
      <Component
        key={id}
        id={id}
        type={type}
        position={position}
        dimension={dimension}
        content={content}
        isReadOnly={isReadOnly}
      />
    );
  };

  const style = {
    outline: "none",
    border: `2px solid ${
      (id && state?.activeSelection.has(id)) || showGrids || isDragged.current
        ? "#21DEE5"
        : "transparent"
    }`,
  };

  const onMouseEnter = () => {
    setShowGrids(true);
  };

  const onMouseLeave = () => {
    setShowGrids(false);
  };

  const onfocus = (event) => {
    if (id) {
      actions?.setActiveSelection(new Set(state?.activeSelection.add(id)));
    }
  };

  const onKeyDown = (event) => {
    if (!isReadOnly) event.stopPropagation();
  };

  const handleClass =
    id && state?.activeSelection.has(id) && state?.activeSelection.size === 1
      ? "showHandles"
      : "";

  const onDoubleClick = () => {
    if (!isReadOnly) return;
    setIsReadOnly(false);
    actions?.setEnableQuillToolbar(true);
  };

  return (
    <div ref={elementRef}>
      <Rnd
        style={style}
        size={{ width: dimension?.width || 0, height: dimension?.height || 0 }}
        position={{ x: position?.left || 0, y: position?.top || 0 }}
        onDragStart={() => {
          isDragged.current = true;
        }}
        onDragStop={(e, d) => {
          isDragged.current = false;
          actions?.updateCanvasData({ id, position: { left: d.x, top: d.y } });
        }}
        resizeHandleWrapperClass={handleClass}
        resizeHandleClasses={resizeHandleClasses}
        onResize={(e, direction, ref, delta, position) => {
          actions?.updateCanvasData({
            id,
            dimension: { width: ref.style.width, height: ref.style.height },
            position: { top: position.y, left: position.x },
          });
        }}
        enableResizing={getEnableResize(type)}
        minWidth={type === "LINE" ? 200 : 100} // Restrict resizing for lines
        minHeight={type === "LINE" ? 2 : 50} // Restrict resizing for lines
        disableDragging={!isReadOnly}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onDoubleClick={onDoubleClick}
        onKeyDown={onKeyDown}
        onFocus={onfocus}
        onBlur={onBlur}
        tabIndex={0}
        lockAspectRatio={type === "CIRCLE"} // Lock aspect ratio for circles
      >
        <div className="item-container">{getComponent()}</div>
      </Rnd>
      <Footer />
    </div>
  );
};

export default CanvasComponent;
