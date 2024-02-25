//ProductForm.js

import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Card from "../../card/Card";

import "./ProductForm.scss";

const ProductForm = ({
  product,
  productImage,
  imagePreview,
  description,
  setDescription,
  handleInputChange,
  handleImageChange,
  saveProduct,
}) => {
  return (
    <div className="add-product">
      <Card cardClass={"card"}>
        <form onSubmit={saveProduct}>
          <Card cardClass={"group"}>
            <label>Request Image</label>
            <code className="--color-dark">
              Supported Formats: jpg, jpeg, png
            </code>
            <input
              type="file"
              name="image"
              onChange={(e) => handleImageChange(e)}
            />

            {imagePreview != null ? (
              <div className="image-preview">
                <img src={imagePreview} alt="product" />
              </div>
            ) : (
              <p>No image set for this request.</p>
            )}
          </Card>
          <label>Request Name:</label>
          <input
            type="text"
            placeholder="Request name"
            name="name"
            value={product?.name}
            onChange={handleInputChange}
          />

          <label>Request Category:</label>
          <select

            type="text"
            placeholder="Product Category"
            name="category"
            value={product?.category}
            onChange={handleInputChange}
          >
            <option value="">Select a Category</option>
            <option value="Process Safety">Process Safety</option>
            <option value="Environment">Environment</option>
            <option value="Safety">Safety</option>
            <option value="Accident">Accident</option>
            <option value="Complaint">Complaint</option>
            <option value="Loss">Loss</option>
            <option value="Over £100,000">Over £100,000</option>
            <option value="Health">Health</option>
            <option value="HR">HR</option>
            <option value="Expenses">Expenses</option>
            <option value="Overtime">Overtime</option>
            <option value="Holiday">Holiday</option>
          </select>

          <label>Request Status:</label>
          <select

            type="text"
            placeholder="status"
            name="status"
            value={product?.status}
            onChange={handleInputChange}
          >
            <option value="">Select status</option>
            <option value="Open">Open</option>
            <option value="Awaiting Approval">Awaiting Approval</option>
            <option value="Approval">Approval</option>
            <option value="Completed">Completed</option>
            <option value="Closed">Closed</option>
          </select>

          <label>Request Price:</label>
          <input
            type="text"
            placeholder="Request Price"
            name="price"
            value={product?.price}
            onChange={handleInputChange}
          />

          <label>Request Quantity:</label>
          <input
            type="text"
            placeholder="Request Quantity"
            name="quantity"
            value={product?.quantity}
            onChange={handleInputChange}
          />

          <label>Request Description:</label>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            modules={ProductForm.modules}
            formats={ProductForm.formats}
          />

          <div className="--my">
            <button type="submit" className="--btn --btn-primary">
              Save Request
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

ProductForm.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
  ],
};
ProductForm.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "video",
  "image",
  "code-block",
  "align",
];

export default ProductForm;
