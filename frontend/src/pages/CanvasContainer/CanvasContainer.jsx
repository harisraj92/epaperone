import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useContext,
} from "react";
import config from "../../config";
import CanvasComponent from "./CanvasComponent";
import { CanvasContext } from "./CanvasContext"; // Import CanvasContext
import Toolbar from "./Toolbar/Toolbar"; // Toolbar remains here
import { toast } from "react-toastify";
import Footer from "../Footer/Footer";

// Helper to get initial data for new canvas elements
const getInitialData = (data, type = "TEXT") => {
  return {
    type: type,
    id: `${type}__${Date.now()}__${data.length}`,
    position: {
      top: 100,
      left: 100,
    },
    dimension: {
      width: "150",
      height: type === "TEXT" ? "auto" : "150",
    },
    content: type === "TEXT" ? "<div>Enter text Here...</div>" : "",
  };
};

// Helper to get initial heading data
const getInitialHeading = (data, type = "HEADING") => {
  return {
    type: type,
    id: `${type}__${Date.now()}__${data.length}`,
    position: {
      top: 100,
      left: 100,
    },
    dimension: {
      width: "150",
      height: type === "HEADING" ? "50" : "500",
    },
    content:
      type === "HEADING"
        ? "<h1>Text Heading Here</h1> <h2>Sub Heading Here </h2> <p>Sample text</p>"
        : "",
  };
};

const getInitialCol = (data, type = "COLUMNTEXT") => {
  return {
    type: type,
    id: `${type}__${Date.now()}__${data.length}`,
    position: {
      top: 100,
      left: 100,
    },
    dimension: {
      width: "200",
      height: type === "COLUMNTEXT" ? "200" : "auto",
    },
    content: type === "COLUMNTEXT" ? "" : "",
  };
};
const getInitialColtwo = (data, type = "COLUMNTEXTTWO") => {
  return {
    type: type,
    id: `${type}__${Date.now()}__${data.length}`,
    position: {
      top: 100,
      left: 100,
    },
    dimension: {
      width: "400",
      height: type === "COLUMNTEXTTWO" ? "400" : "auto",
    },
    content: type === "COLUMNTEXTTWO" ? "" : "",
  };
};

const CanvasContainer = ({
  newsid,
  pageid,
  onEdit,
  zoomLevel,
  canvasSize,
  onLoadTemplate,
}) => {
  const [canvasData, setCanvasData] = useState([]);
  const [activeSelection, setActiveSelection] = useState(new Set());
  const [enableQuillToolbar, setEnableQuillToolbar] = useState(false);
  const containerRef = useRef(null);
  const isSelectAll = useRef(false);

  useEffect(() => {
    if (Array.isArray(onLoadTemplate) && onLoadTemplate.length > 0) {
      let combinedContent = [];

      // Combine all the templates' content
      onLoadTemplate.forEach((template, templateIndex) => {
        try {
          const templateContent = JSON.parse(template.content);
          if (Array.isArray(templateContent.content)) {
            // Ensure each key is unique by combining the template index and the item's id
            const uniqueContent = templateContent.content.map(
              (item, index) => ({
                ...item,
                uniqueId: `${item.id}_${templateIndex}_${index}`, // Generate unique key
              })
            );
            combinedContent = [...combinedContent, ...uniqueContent];
          }
        } catch (error) {
          console.error("Error parsing template content:", error);
        }
      });

      // Set the combined content to canvasData
      setCanvasData(combinedContent);
    }
  }, [onLoadTemplate]);

  useEffect(() => {
    console.log("News ID:", newsid);
    console.log("Page ID:", pageid);
  }, [newsid, pageid]);

  useEffect(() => {
    console.log("Canvas size:", canvasSize);
    console.log("Zoom level:", zoomLevel);
  }, [canvasSize, zoomLevel]);

  const fetchCanvasData = async (newsid, pageid) => {
    if (!newsid || !pageid) {
      console.error("Missing newsid or pageid. Cannot fetch data.");
      return;
    }

    setCanvasData([]); // Clear existing data

    try {
      console.log(`Fetching data for newsid: ${newsid}, pageid: ${pageid}`);

      const response = await fetch(
        `${config.apiBaseUrl}/api/pagecontent?newsid=${newsid}&pageid=${pageid}`
      );

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error response text:", errorData);
        throw new Error("Failed to fetch canvas data");
      }

      const data = await response.json();
      console.log("Fetched data:", data);

      if (!data || !data.pagecontent) {
        console.error("No page content found.");
        return;
      }

      let parsedCanvasData = JSON.parse(data.pagecontent); // First parsing
      console.log("Parsed pagecontent after first parsing:", parsedCanvasData);

      if (typeof parsedCanvasData === "string") {
        parsedCanvasData = JSON.parse(parsedCanvasData); // Second parsing
      }

      console.log("Final parsedCanvasData:", parsedCanvasData);

      setCanvasData(
        Array.isArray(parsedCanvasData.content) ? parsedCanvasData.content : []
      );
    } catch (error) {
      console.error("Error fetching canvas data:", error.message || error);
    }
  };

  useEffect(() => {
    if (newsid && pageid) {
      fetchCanvasData(newsid, pageid);
    }
  }, [newsid, pageid]);

  const saveCanvasData = async (newsid, pageid) => {
    if (!newsid || !pageid) {
      toast.error("Missing newsid or pageid. Cannot save.");
      return;
    }

    try {
      const content = JSON.stringify({
        content: canvasData,
        width: canvasSize.width, // Add canvas width
        height: canvasSize.height, // Add canvas height
      });

      console.log(content);
      const response = await fetch(`${config.apiBaseUrl}/api/pagecontent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsid, pageid, pagecontent: content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error saving canvas data: ${errorData.error}`);
      }

      toast.success("Canvas saved successfully!");
    } catch (error) {
      toast.error("Error saving canvas data: " + error.message);
    }
  };

  //saveAsTemplateData

  // Function to save canvas content as template
  const saveAsTemplateData = async () => {
    try {
      const content = JSON.stringify({
        content: canvasData, // The current canvas content from CanvasContext
      });

      const response = await fetch(`${config.apiBaseUrl}/api/template`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content, // The content (canvas data in JSON format)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error saving template: ${errorData.error}`);
      }

      toast.success("Template saved successfully!");
    } catch (error) {
      toast.error("Error saving template: " + error.message);
    }
  };

  const updateCanvasData = (data) => {
    const currentDataIndex = canvasData.findIndex(
      (canvas) => canvas.id === data.id
    );
    if (currentDataIndex === -1) {
      return;
    }
    const updatedData = { ...canvasData[currentDataIndex], ...data };
    const newCanvasData = [...canvasData];
    newCanvasData.splice(currentDataIndex, 1, updatedData);
    setCanvasData(newCanvasData);
  };

  const addElement = (type) => {
    const defaultData = getInitialData(canvasData, type);
    setCanvasData([...canvasData, { ...defaultData, type: type ?? "TEXT" }]);
    activeSelection.clear();
    activeSelection.add(defaultData.id);
    setActiveSelection(new Set(activeSelection));
  };

  const addHeading = (type) => {
    const defaultHeadingData = getInitialHeading(canvasData, type);
    setCanvasData([
      ...canvasData,
      { ...defaultHeadingData, type: type ?? "HEADING" },
    ]);
    activeSelection.clear();
    activeSelection.add(defaultHeadingData.id);
    setActiveSelection(new Set(activeSelection));
  };

  const addColumnText = (type) => {
    const defaultColumnData = getInitialCol(canvasData, type);
    setCanvasData([
      ...canvasData,
      { ...defaultColumnData, type: type ?? "COLUMNTEXT" },
    ]);
    activeSelection.clear();
    activeSelection.add(defaultColumnData.id);
    setActiveSelection(new Set(activeSelection));
  };

  const addColumnTexttwo = (type) => {
    const defaultColumnData = getInitialColtwo(canvasData, type);
    setCanvasData([
      ...canvasData,
      { ...defaultColumnData, type: type ?? "COLUMNTEXTTWO" },
    ]);
    activeSelection.clear();
    activeSelection.add(defaultColumnData.id);
    setActiveSelection(new Set(activeSelection));
  };

  const deleteElement = useCallback(() => {
    setCanvasData(canvasData.filter((data) => !activeSelection.has(data.id)));
    setActiveSelection(new Set());
  }, [activeSelection, canvasData]);

  const selectAllElement = useCallback(() => {
    canvasData.forEach((data) => activeSelection.add(data.id));
    setActiveSelection(new Set(activeSelection));
  }, [activeSelection, canvasData]);

  const context = {
    actions: {
      setCanvasData,
      setActiveSelection,
      updateCanvasData,
      addElement,
      addHeading,
      addColumnText,
      addColumnTexttwo,
      saveCanvasData,
      saveAsTemplateData,
      setEnableQuillToolbar,
    },
    state: {
      canvasData,
      activeSelection,
    },
  };

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Delete") {
        deleteElement();
      } else if (["a", "A"].includes(event.key) && event.ctrlKey) {
        event.preventDefault();
        selectAllElement();
      }
    },
    [deleteElement, selectAllElement]
  );

  const handleMouseDown = useCallback(() => {
    isSelectAll.current = false;
    setActiveSelection(new Set());
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [handleKeyDown, handleMouseDown]);

  return (
    <CanvasContext.Provider value={context}>
      <div className="container overflow-auto">
        <div className="row">
          {/* Toolbar */}
          <Toolbar
            isEditEnable={enableQuillToolbar}
            saveCanvasData={() => saveCanvasData(newsid, pageid)}
            saveAsTemplateData={() => saveAsTemplateData()}
          />
          <div
            className="mt-2"
            id="canvas-container"
            ref={containerRef}
            style={{
              width: canvasSize.width,
              height: canvasSize.height,
              border: "1px solid #ccc",
              overflow: "hidden",
              transformOrigin: "top left",
              transform: `scale(${zoomLevel})`,
              // Add margin, padding, and box-shadow
              margin: "10px",
              padding: "2px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              className="bg-light"
              style={{
                position: "relative",
                width: canvasSize.width / zoomLevel,
                height: canvasSize.height / zoomLevel,
                overflow: "hidden",
              }}
            >
              {canvasData.map((canvas) => (
                <CanvasComponent key={canvas.id} {...canvas} />
              ))}
              {/* <Footer /> */}
            </div>
          </div>
        </div>
      </div>
    </CanvasContext.Provider>
  );
};

export default CanvasContainer;
