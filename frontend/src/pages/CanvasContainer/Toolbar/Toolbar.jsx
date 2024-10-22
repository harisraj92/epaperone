import React, { useContext } from "react";
import config from "../../../config";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { CanvasContext } from "../CanvasContext";
import "@flaticon/flaticon-uicons/css/all/all.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faColumns, faGripLines } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const sizeList = [
  "5px",
  "6px",
  "7px",
  "8px",
  "9px",
  "10px",
  "11px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "72px",
  "100px",
];

export const fontList = [
  "Aaradhana",
  "Abhilasha",
  "Gidugu",
  "Gurajada",
  "LakkiReddy",
  "mallanna",
  "Mandali-Regular",
  "NATS",
  "NTR",
  "Peddana-Regular",
  "Ponnala",
  "PottiSreeramulu",
  "RaviPrakash",
  "Sree Krushnadevaraya",
  "suranna",
  "Suravaram",
  "SyamalaRamana",
  "TimmanaRegular",
  "Arial",
  "Arial Black",
  "Arial Unicode MS",
  "Calibri",
  "Cambria",
  "Cambria Math",
  "Candara",
  `Segoe UI, wf_segoe-ui_normal, helvetica, arial, sans-serif`,
  "Comic Sans MS",
  "Consolas",
  "Constantia",
  "Corbel",
  "Courier New",
  "Georgia",
  "Lucida Sans Unicode",
  "Tahoma",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana",
  "Roboto",
  "Kalaham Regular",
  "Noto Serif Tamil",
];

export const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
  "script",
  "blockquote",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "color",
  "image",
  "code-block",
];

export default function Toolbar({
  isEditEnable,
  saveCanvasData,
  saveAsTemplateData,
  newsid,
  pageid,
}) {
  const { actions } = useContext(CanvasContext);
  const navigate = useNavigate();

  const addElement = (type) => {
    actions?.addElement(type);
    toast.success(`${type} added!`);
  };
  const addHeading = (type) => {
    actions?.addHeading(type);
    toast.success(`Heading added!`);
  };
  const addColumnText = (type) => {
    actions?.addColumnText(type);
    toast.success(`Column added!`);
  };
  const addColumnTexttwo = (type) => {
    actions?.addColumnTexttwo(type);
    toast.success(`Column added!`);
  };
  const addHeaderTemplate = (type) => {
    actions?.addHeaderTemplate(type);
    toast.success(`Header Template added!`);
  };

  const handleAddPage = async () => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/api/eNewsPage/addsubpage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newsid }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        throw new Error(errorData.error || "Failed to add new page");
      }

      const data = await response.json();
      toast.success("New page added successfully!");
      console.log("New page added with pageid:", data.pageid);

      // Redirect to the new page
      navigate(`/newspapereditor?newsid=${newsid}&pageid=${data.pageid}`);
    } catch (error) {
      console.error("Error adding new page:", error.message);
      alert(`Error adding new page: ${error.message}`);
    }
  };

  const handleDeletePage = async () => {
    if (!newsid || !pageid) {
      toast.error("Missing newsid or pageid");
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/api/eNewsPage`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsid, pageid }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        throw new Error(errorData.error || "Failed to delete page");
      }

      const data = await response.json();
      toast.warning("Page deleted successfully!");

      // Redirect the user to another page, e.g., the home page or the previous page
      navigate(`/newspapereditor/${newsid}/1`);
    } catch (error) {
      console.error("Error deleting page:", error.message);
      toast.error(`Error deleting page: ${error.message}`);
    }
  };

  // New function for exporting to PDF
  // Function for exporting to PDF
  const exportToPDF = async () => {
    const input = document.getElementById("canvas-container"); // Get the canvas-container element
    if (!input) {
      toast.error("Canvas container not found!");
      return;
    }

    try {
      // Wait for images to load properly
      const images = input.getElementsByTagName("img");
      const promises = [];

      for (let i = 0; i < images.length; i++) {
        if (!images[i].complete) {
          promises.push(
            new Promise((resolve, reject) => {
              images[i].onload = resolve;
              images[i].onerror = reject;
            })
          );
        }
      }

      // Ensure all images are loaded before taking a snapshot
      await Promise.all(promises);

      // Capture the content of the div
      const canvas = await html2canvas(input, {
        useCORS: true, // Enable cross-origin resource sharing
        allowTaint: true, // Allow tainted (cross-origin) images
      });

      const imgData = canvas.toDataURL("image/png");

      // Initialize jsPDF and add the captured canvas image
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 size width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add the image to the PDF
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Save the generated PDF
      pdf.save("exported-canvas.pdf");
      toast.success("Canvas exported to PDF!");
    } catch (error) {
      console.error("Error exporting canvas:", error);
      toast.error("Failed to export canvas.");
    }
  };

  return (
    <div>
      <div>
        <ToastContainer />
        <div className="row">
          <div
            className="btn-group"
            role="group"
            aria-label="Basic mixed styles example"
          >
            {/* <button type="button" className="btn btn-danger">
              <i
                className="fi fi-sr-home"
                title="Home"
                style={{ fontSize: "24px", color: "wheat" }}
              ></i>{" "}
              Home
            </button> */}
            {/* <button
              type="button"
              className="btn btn-danger"
              onClick={() => handleAddPage(newsid)}
            >
              <i
                className="fi fi-sr-add-document"
                title="Add Page"
                style={{ fontSize: "24px", color: "wheat" }}
              ></i>
              Add
            </button> */}
            <button
              type="button"
              className="btn btn-danger"
              onClick={saveCanvasData}
            >
              <i
                className="fi fi-sr-disk"
                title="Save Page"
                style={{ fontSize: "24px", color: "wheat" }}
              ></i>{" "}
              Save
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={saveAsTemplateData}
            >
              <i
                className="fi fi-sr-disk"
                title="Save Page"
                style={{ fontSize: "24px", color: "wheat" }}
              ></i>{" "}
              Save Template
            </button>
            {/* <button
              type="button"
              className="btn btn-danger"
              onClick={handleDeletePage}
            >
              <i
                className="fi fi-bs-trash"
                title="Delete Page"
                style={{ fontSize: "24px", color: "wheat" }}
              ></i>{" "}
              Delete
            </button> */}
            <button
              type="button"
              className="btn btn-danger"
              onClick={exportToPDF}
            >
              <i
                className="fi fi-sr-file-export"
                title="Export Page"
                style={{ fontSize: "24px", color: "wheat" }}
              ></i>{" "}
              Export
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => addElement("TEXT")}
            >
              <i
                className="fi fi-sr-message-text"
                title="Add Text"
                style={{ fontSize: "24px", color: "wheat" }}
              ></i>{" "}
              Text
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => addHeading("HEADING")}
            >
              <i
                className="fi fi-bs-heading"
                title="Add Heading"
                style={{ fontSize: "24px", color: "wheat" }}
              ></i>{" "}
              NewsBox
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => addElement("IMAGE")}
            >
              <i
                className="fi fi-br-add-image"
                title="Add Image"
                style={{ fontSize: "24px", color: "wheat" }}
              ></i>{" "}
              Image
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => addColumnText("COLUMNTEXT")}
            >
              <i
                className="fi fi-sr-columns-3"
                title="Add Column"
                style={{ fontSize: "24px", color: "wheat" }}
              ></i>{" "}
              ColumnText
            </button>
            {/* <button
              type="button"
              className="btn btn-danger"
              onClick={() => addColumnTexttwo("COLUMNTEXTTWO")}
            >
              <i
                className="fi fi-sr-columns-3"
                title="Add Column"
                style={{ fontSize: "24px", color: "wheat" }}
              ></i>{" "}
              Columntwo
            </button> */}
            {/* <button
              type="button"
              className="btn btn-danger"
              onClick={() => addHeaderTemplate("HEADERTEMPLATE")}
            >
              <i
                className="fi fi-sr-columns-3"
                title="Add Column"
                style={{ fontSize: "24px", color: "wheat" }}
              ></i>{" "}
              HeaderTemplate
            </button> */}
          </div>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        {isEditEnable && (
          <div id="toolbar">
            <select className="ql-font">
              {fontList.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
            <select className="ql-size">
              {sizeList.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <select className="ql-header">
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
              <option value="">Normal</option>
            </select>

            <button className="btn btn-outline-secondary ql-bold" />
            <button className="btn btn-outline-secondary ql-italic" />
            <button className="btn btn-outline-secondary ql-underline" />
            <button className="btn btn-outline-secondary ql-strike" />
            <select className="ql-align" />
            <select className="ql-color" />
            <select className="ql-background" />
            <button
              className="btn btn-outline-secondary ql-list"
              value="ordered"
            />
            <button
              className="btn btn-outline-secondary ql-list"
              value="bullet"
            />
            <button
              className="btn btn-outline-secondary ql-indent"
              value="-1"
            />
            <button
              className="btn btn-outline-secondary ql-indent"
              value="+1"
            />
            <button className="btn btn-outline-secondary ql-blockquote" />
            <button className="btn btn-outline-secondary ql-link" />
            <button className="btn btn-outline-secondary ql-image" />
            <button className="btn btn-outline-secondary ql-code-block" />
          </div>
        )}
      </div>
    </div>
  );
}
