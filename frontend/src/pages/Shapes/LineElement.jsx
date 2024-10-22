// LineElement.js
const LineElement = ({ dimension }) => {
  return (
    <div
      style={{
        width: dimension.width,
        height: "2px", // Thin height for a line
        backgroundColor: "black",
      }}
    />
  );
};

export default LineElement;
