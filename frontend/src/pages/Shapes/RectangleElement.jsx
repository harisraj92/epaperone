// RectangleElement.js
const RectangleElement = ({ dimension }) => {
  return (
    <div
      style={{
        width: dimension.width,
        height: dimension.height,
        backgroundColor: "lightgreen",
        border: "2px solid black",
      }}
    />
  );
};

export default RectangleElement;
