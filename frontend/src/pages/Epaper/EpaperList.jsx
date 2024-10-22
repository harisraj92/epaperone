import React, { useState, useEffect } from "react";
import config from "../../config";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";
import EpaperCard from "./EpaperCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EpaperList = () => {
  const [newsid, setNewsid] = useState("");
  const [epaperList, setEpaperList] = useState([]); // Initialize as an empty array
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const cardsPerPage = 9; // Display 9 cards per page
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch epaper data
    const fetchEpapers = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/api/newslist`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setEpaperList(data); // Set data into state if it's an array
        } else {
          setEpaperList([]); // Set an empty array if data is not an array
        }

        console.log("Fetched epaper data:", data); // Log the API response
      } catch (error) {
        console.error("Error fetching epapers:", error);
        setEpaperList([]); // Set an empty array in case of an error
      }
    };

    fetchEpapers();
  }, []);

  const handleAddMainPage = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/AddMainPage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newstitle: "New ePaper Title", // Hardcoded title for now
          pagecontent: null, // Page content can be added later
          created_at: new Date().toISOString(), // Current timestamp
          updated_at: null, // Initially null
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save the new ePaper");
      }

      const result = await response.json();
      console.log("Toast trigger called"); // Debugging log
      toast.success("New page added successfully!");
      console.log("New ePaper saved with ID:", result.newsid);

      // Navigate to the NewspaperEditor with the newly created newsid and pageid as 1
      setTimeout(() => {
        navigate(`/newspapereditor?newsid=${result.newsid}&pageid=1`);
      }, 1000); // 1 second delay
    } catch (error) {
      console.error("Error saving new ePaper:", error);
    }
  };

  const handleDeleteMainPage = (deletedNewsid) => {
    try {
      // Remove the deleted ePaper from the state
      const updatedList = epaperList.filter(
        (epaper) => epaper.newsid !== deletedNewsid
      );
      setEpaperList(updatedList);

      // Show success toast
      toast.success("ePaper deleted successfully!");
    } catch (error) {
      // Show error toast
      toast.error("Failed to delete ePaper!");
    }
  };

  // Calculate indices for the current page's cards
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentEpapers = epaperList.slice(indexOfFirstCard, indexOfLastCard);

  const totalPages = Math.ceil(epaperList.length / cardsPerPage); // Calculate total pages

  // Handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container">
      {/* Toast Container for displaying toast messages */}
      <ToastContainer />
      <div className="text-center">
        <button
          className="btn bg-gray-100"
          title="Add New MainPage"
          onClick={handleAddMainPage}
        >
          <div className="text-danger">
            <FontAwesomeIcon icon={faFileCirclePlus} className="fa-4x" />
          </div>
        </button>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          {/* Previous Button */}
          <button
            className={`btn btn-outline-primary mx-1 ${
              currentPage === 1 ? "disabled" : ""
            }`}
            onClick={handlePreviousPage}
          >
            Previous
          </button>

          {/* Pagination Numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={index}
                className={`btn mx-1 ${
                  currentPage === pageNumber
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() => paginate(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            className={`btn btn-outline-primary mx-1 ${
              currentPage === totalPages ? "disabled" : ""
            }`}
            onClick={handleNextPage}
          >
            Next
          </button>
        </div>
      )}
      {/* Grid layout for epapers */}
      <div
        className="row g-3 overflow-y-auto"
        style={{ maxHeight: "50vh", overflow: scroll }}
      >
        {currentEpapers.length === 0 ? (
          <p>No epapers found.</p> // Fallback if no data
        ) : (
          currentEpapers.map((epaper, index) => (
            <div key={index} className="col-md-4">
              <EpaperCard
                newstitle={epaper.newstitle || "Untitled ePage"} // Pass the correct key for title
                updated_at={epaper.updated_at} // Pass the correct key for updated_at
                newsid={epaper.newsid}
                pageid={epaper.pageid}
                pages={epaper.pages}
                onDelete={handleDeleteMainPage} // Pass the delete callback
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EpaperList;
