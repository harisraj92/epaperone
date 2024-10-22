// CircleElement.js
const CircleElement = ({ dimension }) => {
  return (
    <div
      style={{
        width: dimension.width,
        height: dimension.height,
        borderRadius: "50%",
        backgroundColor: "lightblue",
        border: "2px solid black",
      }}
    />
  );
};

export default CircleElement;
