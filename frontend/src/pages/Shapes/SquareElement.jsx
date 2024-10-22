// SquareElement.js
const SquareElement = ({ dimension }) => {
  const size = Math.min(dimension.width, dimension.height); // Ensuring it's square
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: "lightcoral",
        border: "2px solid black",
      }}
    />
  );
};

export default SquareElement;
