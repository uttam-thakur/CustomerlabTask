import { useState } from "react";
import { Button, TextField, Select, MenuItem, Link } from "@mui/material";
import "./App.css";
import axios from "axios";

// Schema labels object containing schema keys and their corresponding labels
const schemaLabels = {
  first_name: "First Name",
  last_name: "Last Name",
  gender: "Gender",
  age: "Age",
  account_name: "Account Name",
  city: "City",
  state: "State",
};

function App() {
  const [popupVisible, setPopupVisible] = useState(false); // For controlling visibility of popup
  const [selectedSchemas, setSelectedSchemas] = useState([]); // For storing selected schemas
  const [selectedSchemaNames, setSelectedSchemaNames] = useState({}); // For storing selected schema names
  const [showSelected, setShowSelected] = useState(false); // For controlling visibility of selected schema names

  // Function to toggle the visibility of the popup
  const togglePopup = () => {
    setPopupVisible(!popupVisible);
  };

  const submitHandler = () => {
    // Get the segment name from the text field
    const segmentNameInput = document.getElementById("segmentName");
    const segmentName = segmentNameInput.value;

    // Create an array to store the schema objects
    const schemaArray = [];

    // Iterate over selectedSchemas to create schema objects
    selectedSchemas.forEach((schemaKey) => {
      const schemaObject = {};
      schemaObject[schemaKey] = schemaLabels[schemaKey];
      schemaArray.push(schemaObject);
    });

    // Prepare the data object to be sent
    const data = {
      segment_name: segmentName,
      schema: schemaArray,
    };

    // Log or send the data to the backend
    console.log("Data to be sent:", data);

    // Clear input data and selected schema
    segmentNameInput.value = "";
    setSelectedSchemas([]);
    setSelectedSchemaNames({});

    // Send data to the webhook URL using Axios
    axios
      .post("https://webhook.site/dd82cb2b-b24e-4d26-99c9-1b4a2b3ca1c8", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Response from webhook:", response.data);
      })
      .catch((error) => {
        console.error("Error sending data to webhook:", error);
      });
  };
  // Function to handle schema change when a schema is selected
  const handleSchemaChange = (event) => {
    const value = event.target.value;
    // Adding the selected schema to the array of selected schemas
    const newSelectedSchemas = [...selectedSchemas, value];
    setSelectedSchemas(newSelectedSchemas);

    // Updating the selected schema names object with the new schema name
    const updatedSchemaNames = {
      ...selectedSchemaNames,
      [value]: schemaLabels[value],
    };
    setSelectedSchemaNames(updatedSchemaNames);
  };

  // Function to handle schema name change when a name is selected for a schema
  const handleSchemaNameChange = (event, key) => {
    setSelectedSchemaNames({
      ...selectedSchemaNames,
      [key]: event.target.value,
    });
  };

  // Function to display the selected schema names when the link is clicked
  const handleLinkClick = () => {
    setShowSelected(!showSelected);
  };

  // Function to delete the selected schema name when click on the --- button
  const handleDeleteSchema = (key) => {
    // Filter out the selected schema and update the state
    const updatedSelectedSchemas = selectedSchemas.filter(
      (schemaKey) => schemaKey !== key
    );
    setSelectedSchemas(updatedSelectedSchemas);

    // Filter out the selected schema name and update the state
    const updatedSelectedSchemaNames = { ...selectedSchemaNames };
    delete updatedSelectedSchemaNames[key];
    setSelectedSchemaNames(updatedSelectedSchemaNames);
  };

  // JSX structure for rendering the component
  return (
    <div className="App">
      <div className="navbar">
        <p className="para">View Audience</p>
      </div>
      <Button variant="outlined" className="saveButton" onClick={togglePopup}>
        Save segment
      </Button>
      {/* Popup component */}
      {popupVisible && (
        <div
          className="popup"
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "600px",
            height: "100vh",
            backgroundColor: "#ffffff",
            boxShadow: "-1px 0px 7px 1px rgba(0,0,0,0.24)",
            transition: "transform 0.3s ease-out",
            transform: "translateX(0%)",
          }}
        >
          {/* Header of the popup */}
          <div
            style={{
              padding: "20px",
              width: "100%",
              height: "22px",
              backgroundColor: "#38AEBD",
              color: "white",
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <p>Saving Segment</p>
          </div>
          {/* Text field for entering segment name */}
          <p>Enter the Name of the Segment</p>
          <TextField
            id="segmentName"
            placeholder="Name of the segment"
            variant="outlined"
            fullWidth
            style={{ marginBottom: "20px" }}
          />

          {/* Dropdowns for selecting schema names */}
          {showSelected && (
            <div style={{ border: "2px solid blue", width: "95%" }}>
              {Object.entries(selectedSchemaNames).map(([key, name]) => (
                <div
                  key={key}
                  style={{ marginBottom: "20px", padding: "20px" }}
                >
                  <Select
                    fullWidth
                    variant="outlined"
                    value={name}
                    style={{ width: "80%", marginTop: "20px" }}
                    onChange={(event) => handleSchemaNameChange(event, key)}
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value={name}>{name}</MenuItem>
                  </Select>
                  <Button
                    style={{
                      backgroundColor: "#F2FBF9",
                      padding: "16px",
                      marginLeft: "20px",
                    }}
                    onClick={() => handleDeleteSchema(key)}
                  >
                    ---
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Dropdown for adding new schemas */}
          <div style={{ marginBottom: "20px" }}>
            <p>Add Schema to Segment </p>
            <Select
              fullWidth
              variant="outlined"
              defaultValue=""
              value={selectedSchemas[selectedSchemas.length - 1] || ""}
              onChange={handleSchemaChange}
              style={{ width: "80%" }}
            >
              <MenuItem value="">Select</MenuItem>
              {Object.entries(schemaLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </div>
          <Link
            style={{
              color: "#41B494",
              display: "flex",
              marginLeft: "50px",
              cursor: "pointer",
            }}
            onClick={handleLinkClick}
          >
            + Add new Schema
          </Link>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              backgroundColor: "whiteSmoke",
              height: "60px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 10px",
            }}
          >
            <Button
              variant="contained"
              style={{
                backgroundColor: "#41B494",
                color: "white",
                borderRadius: "5px",
              }}
              disabled={!selectedSchemas.length}
              onClick={submitHandler}
            >
              Save the Segment
            </Button>
            <Button
              variant="outlined"
              onClick={togglePopup}
              style={{
                backgroundColor: "white",
                color: "red",
                borderRadius: "5px",
                marginRight: "270px",
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
