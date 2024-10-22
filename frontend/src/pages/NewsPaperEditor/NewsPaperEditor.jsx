import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import CanvasContainer from "../CanvasContainer/CanvasContainer"; // Adjust the path
import RightSidebar from "../RightSidebar/RightSidebar"; // Adjust the path
import config from "../../config";
import LeftSidebar from "../LeftSidebar/LeftSidebar";

// Custom hook to extract query parameters from the URL
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const NewsPaperEditor = () => {
  const [zoomLevel, setZoomLevel] = useState(1); // Initial zoom level is 1 (100%)
  const [canvasSize, setCanvasSize] = useState({ width: 1247, height: 1965 }); // Initial canvas size
  const { newsid: paramNewsid, pageid: paramPageid } = useParams();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const query = useQuery();
  const navigate = useNavigate();

  // Initialize state for title, error, and total pages
  const [newstitle, setNewstitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [Pages, setTotalPages] = useState();

  // Get the current pageid and newsid from the URL or fallback to params
  const [pageid, setPageid] = useState(paramPageid || query.get("pageid"));
  const newsid = paramNewsid || query.get("newsid");

  const isEditMode = !!newsid && !!pageid; // Check if editing or adding new

  const handleLoadTemplate = (template) => {
    setSelectedTemplate(template);
  };

  // Fetch title and total pages based on the current newsid
  useEffect(() => {
    const fetchNewstitle = async () => {
      try {
        if (newsid) {
          const response = await fetch(
            `${config.apiBaseUrl}/api/newstitle/${newsid}`
          );
          const data = await response.json();
          setNewstitle(data.newstitle || "Untitled Page");
          setTotalPages(data.Pages);
        }
      } catch (error) {
        setError("Error fetching title");
      }
    };
    if (newsid) {
      fetchNewstitle();
    }
  }, [newsid]);

  // Update pageid whenever it changes in the URL
  useEffect(() => {
    const newPageid = query.get("pageid");
    setPageid(newPageid);
  }, [query]);

  // Save title
  const handleSaveTitle = async () => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/api/newstitle/${newsid}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newstitle }),
        }
      );
      if (!response.ok) throw new Error("Failed to update title");
      setIsEditing(false);
    } catch (error) {
      setError("Error updating title");
    }
  };

  return (
    <div className="newspaper-editor">
      <div className="container-fluid">
        <div className="row">
          {/* Left Sidebar */}
          <div className="col-lg-2 col-md-3 bg-light p-3">
            <LeftSidebar onLoadTemplate={handleLoadTemplate} />
          </div>

          {/* Main content (Canvas and Title) */}
          <div className="col-lg-8 col-md-6 mb-5">
            <div className="text-left">
              {/* Editable Title */}
              {isEditing ? (
                <input
                  type="text"
                  value={newstitle}
                  onChange={(e) => setNewstitle(e.target.value)}
                  onBlur={handleSaveTitle}
                  autoFocus
                  className="form-control form-control-lg mb-3"
                  placeholder="Edit Title"
                />
              ) : (
                <h2
                  onClick={() => setIsEditing(true)}
                  className="text-primary font-weight-bold cursor-pointer"
                >
                  {newstitle}
                </h2>
              )}

              {/* Error display */}
              {error && <div className="alert alert-danger">{error}</div>}
            </div>

            {/* Canvas Container */}
            <div className="mt-3">
              <CanvasContainer
                className="content-container"
                newsid={newsid}
                pageid={pageid}
                isEditMode={isEditMode}
                zoomLevel={zoomLevel}
                canvasSize={canvasSize}
                onLoadTemplate={selectedTemplate}
              />
            </div>
            <hr />
          </div>

          {/* Right Sidebar for Layout Properties */}
          <div className="col-lg-2 col-md-3 bg-light p-3">
            <RightSidebar
              setCanvasSize={setCanvasSize}
              setZoomLevel={setZoomLevel}
              canvasSize={canvasSize}
              zoomLevel={zoomLevel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPaperEditor;
