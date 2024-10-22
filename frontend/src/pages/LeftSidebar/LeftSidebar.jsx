import React, { useEffect, useState } from "react";
import axios from "axios";

const LeftSidebar = ({ onLoadTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [selectedTemplates, setSelectedTemplates] = useState([]); // Track selected templates

  // Fetch templates on component mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/template");
        setTemplates(response.data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };
    fetchTemplates();
  }, []);

  // Handle when a template is clicked
  const handleTemplateClick = async (template) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/template/${template.template_id}`
      );
      const templateData = response.data;

      // Append the selected template to the selectedTemplates array
      setSelectedTemplates((prevTemplates) => [...prevTemplates, templateData]);

      // Call the parent's function to load the template (sending accumulated templates)
      onLoadTemplate([...selectedTemplates, templateData]); // Send updated list to CanvasContainer
    } catch (error) {
      console.error("Error fetching template content:", error);
    }
  };

  const handleDoubleClick = (template) => {
    setEditingTemplateId(template.template_id);
    setNewTemplateName(template.name || ""); // Populate the input field with the current template name
  };

  const handleRename = async (template) => {
    if (!newTemplateName) {
      return alert("Template name cannot be empty.");
    }

    try {
      // Call API to update the template name
      await axios.put(
        `http://localhost:5000/api/template/${template.template_id}`,
        {
          name: newTemplateName,
        }
      );

      // Update the local template list
      setTemplates((prevTemplates) =>
        prevTemplates.map((t) =>
          t.template_id === template.template_id
            ? { ...t, name: newTemplateName }
            : t
        )
      );
      setEditingTemplateId(null); // Exit editing mode
    } catch (error) {
      console.error("Error renaming template:", error);
      alert("Failed to rename template.");
    }
  };

  return (
    <div className="left-sidebar">
      <h5>Templates</h5>
      <ul>
        {templates.map((template) => (
          <li key={template.template_id}>
            {editingTemplateId === template.template_id ? (
              // Show input field when editing
              <input
                type="text"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                onBlur={() => handleRename(template)} // Save on blur
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename(template); // Save on Enter key
                }}
                autoFocus
                className="form-control form-control-sm"
              />
            ) : (
              // Show the template name and allow double-click to edit
              <button
                onDoubleClick={() => handleDoubleClick(template)}
                onClick={() => handleTemplateClick(template)} // Append template on click
                className="btn btn-link"
              >
                {template.name || `Template ${template.template_id}`}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeftSidebar;
