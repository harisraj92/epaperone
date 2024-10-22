import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Function to export canvas container to PDF
const exportToPDF = () => {
  const canvasContainer = document.getElementById("canvas-container-wrapper"); // Select the wrapper that includes both canvas and footer

  html2canvas(canvasContainer, { useCORS: true }).then((canvas) => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      0,
      canvas.width,
      canvas.height
    );
    pdf.save("canvas-export.pdf");
  });
};
