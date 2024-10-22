import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import config from "../../config";
import {
  faEdit,
  faTrashAlt,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const EpaperCard = ({
  newstitle,
  updated_at,
  newsid,
  pageid,
  pages,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    console.log("Navigating to editor with:", { newsid, pageid });
    navigate(`/newspapereditor?newsid=${newsid}&pageid=${pageid}`);
  };

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (!isNaN(date)) {
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return "Unknown Date";
  };

  const handleDeleteMainPage = async () => {
    console.log(`Attempting to delete newsid: ${newsid}`); // Log the newsid to verify

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/api/deletemainpage/${newsid}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        const result = await response.json();
        console.log("Delete successful:", result); // Log success
        onDelete(newsid);
      } else {
        const errorData = await response.json();
        console.log("Delete failed:", errorData); // Log the error response
        alert(errorData.message || "Failed to delete the eNewspage.");
      }
    } catch (error) {
      console.error("Error deleting eNewspage:", error);
      alert("Error deleting eNewspage. Please try again.");
    }
  };

  return (
    <div className="container">
      <div>
        <div className="mt-2 pt-2">
          <div className="col-xs-12">
            <div className="card text-center">
              <div>
                <div className="d-flex justify-content-evenly align-items-center">
                  <div>
                    <p>{newstitle || "Untitled Page"}</p>
                    <p className="card-title">
                      updated on {formatDate(updated_at)}
                    </p>

                    <button
                      onClick={handleEdit}
                      className="btn btn-sm btn-outline-primary mr-2" // Changed to button
                      aria-label="Delete"
                    >
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button
                      onClick={handleDeleteMainPage}
                      className="btn btn-sm btn-outline-danger" // Changed to button
                      aria-label="Delete"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} /> Delete{" "}
                    </button>
                  </div>
                  <span className="card-icon me-3">
                    <FontAwesomeIcon
                      icon={faNewspaper}
                      className="display-1 text-muted opacity-50"
                    />
                    <p>Pages {pages}</p>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpaperCard;
