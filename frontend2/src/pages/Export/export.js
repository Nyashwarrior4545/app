


//export.js
import "./export.scss";
import React, { Fragment, useEffect, useState } from "react";
import {
  Col,
  Row,
  Button,
  FormGroup,
  Input,
  Table,
  FormText,
} from "reactstrap";
import { read, utils } from "xlsx";
import axios from "axios";


const requiredFields = ["ID", "Name", "Category", "Status", "Quantity", "Price", "Description"];

function App() {
  const [loading, setLoading] = useState(false);
  const [excelRows, setExcelRows] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = (await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/jokes`)).data;
      setRows(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const [fileName, setFileName] = useState('');


  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = utils.sheet_to_json(worksheet);
        setExcelRows(json);
      };
      reader.readAsArrayBuffer(file);
    }
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const uploadData = async () => {
    try {
      setLoading(true);

      const firstItemKeys = excelRows[0] && Object.keys(excelRows[0]);

      let requiredValidation = false;

      if (firstItemKeys.length) {
        requiredFields.forEach((element) => {
          if (!firstItemKeys.find((x) => x === element)) {
            requiredValidation = true;
          }
        });
      }

      if (requiredValidation) {
        alert("Required fields " + JSON.stringify(requiredFields));
        setLoading(false);
        return;
      }

      const jokesResponse = (
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/jokes`)
      ).data;
      const jokeList = jokesResponse || [];

      const jokes = excelRows.map((obj) => ({
        _id: jokeList.find((x) => x.jokeId == obj["ID"])?._id,
        jokeId: obj["ID"] || "",
        name: obj["Name"] || "",
        category: obj["Category"] || "",
        status: obj["Status"] || "",
        quantity: obj["Quantity"] || "",
        price: obj["Price"] || "",
        description: obj["Description"] || "",
        
      }));

      const updatedJokes = jokes.filter((x) => x._id);
      const newJokes = jokes.filter((x) => !x._id);

      if (updatedJokes.length) {
        const result = (
          await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/bulk/jokes-bulk-update`,
            updatedJokes
          )
        ).data;

        if (result) {
          alert("Successfully updated " + updatedJokes.length + " documents");
        }
      }

      console.log("newJokes:", newJokes); // Add this line

      if (newJokes.length) {
        const result = (
          await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/bulk/jokes-bulk-insert`,
            newJokes
          )
        ).data;
  
        if (result) {
          alert("Successfully added " + newJokes.length + " documents");
        }
      }

      fetchData();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("uploadData error: ", error.response);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setExcelRows([]);
    window.location.reload();
  };
  

  function renderDataTable() {
    return (
      <div className="right_result">
        <Table className="custom-table">
          <thead>
            <tr className="header">
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Description</th>
              <th>CreatedAt</th>
              <th>UpdatedAt</th>
            </tr>
          </thead>
          <tbody className="rows">
            {rows.map((item, idx) => (
              <tr className="text" key={idx}>
                <td className="cute">{item.jokeId}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.status}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.description}</td>
                <td>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : ""}
                </td>
                <td>
                  {item.updatedAt
                    ? new Date(item.updatedAt).toLocaleString()
                    : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
  
  return (
    <Fragment>
      
      <div className="container">
        <Row>
          <Col md="6 text-left">
          <FormGroup>
          <label htmlFor="inputEmpGroupFile" className="custom-file-upload">
              {fileName || 'Choose File'}
            </label>
            <Input
              id="inputEmpGroupFile"
              name="file"
              type="file"
              className="form-control"
              onChange={readUploadFile}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              style={{ display: 'none' }} // hide the default file input
            />
            <FormText className="text">
                {
                  "NOTE: The headers in the Excel file should be as follows!. => "
                }
                {requiredFields.join(", ")}
              </FormText>
            </FormGroup>
          </Col>
          <Col md="6 text-left">
            {selectedFile?.name && (
              <Button className="upload" disabled={loading} color="success" onClick={uploadData}>
                {"Upload data"}
              </Button>
            )}{" "}
            {selectedFile?.name && (
              <Button className="remove-button" disabled={loading} color="danger" onClick={removeFile}>
                {"Remove file"}
              </Button>
            )}
          </Col>
        </Row>
        {loading && <progress style={{ width: "100%" }}></progress>}
        <h4 className="mt-4" style={{ color: "black" }}>
          Request Table
        </h4>
        <button className="refresh" onClick={fetchData}>Refresh</button>
        {renderDataTable()}
      </div>
    </Fragment>
  );
}

export default App;