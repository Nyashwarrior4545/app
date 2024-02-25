//ProductDetail.js


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useRedirectLoggedOutUser from "../../../customHook/useRedirectLoggedOutUser";
import { selectIsLoggedIn } from "../../../redux/features/auth/authSlice";
import { getProduct } from "../../../redux/features/product/productSlice";
import Card from "../../card/Card";
import { SpinnerImg } from "../../loader/Loader";
import "./ProductDetail.scss";
import DOMPurify from "dompurify";
import axios from "axios";

const ProductDetail = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const { id } = useParams();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { product, isLoading, isError, message } = useSelector(
    (state) => state.product
  );

  // State to store the selected products for sending
  const [selectedProducts, setSelectedProducts] = useState([]);

  const stockStatus = (quantity) => {
    if (quantity > 0) {
      return <span className="--color-success">In Stock</span>;
    }
    return <span className="--color-danger">Out Of Stock</span>;
  };

  useEffect(() => {
    if (isLoggedIn === true) {
      dispatch(getProduct(id));
    }

    if (isError) {
      console.log(message);
    }
  }, [isLoggedIn, isError, message, dispatch]);

  // Function to handle sending the product list
  const sendProductList = async () => {
    try {
      // Assuming you have the backend URL in your environment variables
      const backendURL = process.env.REACT_APP_BACKEND_URL;

      // Replace 'recipientUserId' with the actual recipient's user ID
      const recipientUserId = 'recipientUserId';

      // Make a POST request to your backend endpoint
      const response = await axios.post(
        `${backendURL}/api/products/${id}/share`,
        {
          recipientUserId,
          products: selectedProducts,
        }
      );

      // Handle success or show a notification to the user
      console.log('Product list sent successfully!', response.data);
    } catch (error) {
      // Handle error
      console.error('Error sending product list:', error.message);
    }
  };


  return (
    <div className="product-detail">
      <h3 className="--mt">Request Detail</h3>
      <Card cardClass="card">
        {isLoading && <SpinnerImg />}
        {product && (
          <div className="detail">
            <Card cardClass="group">
              {product?.image ? (
                <img
                  src={product.image.filePath}
                  alt={product.image.fileName}
                />
              ) : (
                <p>No image set for this request</p>
              )}
            </Card>
            <h4>Request Availability: {stockStatus(product.quantity)}</h4>
            <hr />
            <h4>
              <span className="badge">Name: </span> &nbsp; {product.name}
            </h4>
            <p>
              <b>&rarr; SKU : </b> {product.sku}
            </p>
            <p>
              <b>&rarr; Category : </b> {product.category}
            </p>
            <p>
              <b>&rarr; Status : </b> {product.status}
            </p>
            <p>
              <b>&rarr; Price : </b> {"$"}
              {product.price}
            </p>
            <p>
              <b>&rarr; Quantity in stock : </b> {product.quantity}
            </p>
            <p>
              <b>&rarr; Total Value in stock : </b> {"$"}
              {product.price * product.quantity}
            </p>
            <hr />
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description),
              }}
            ></div>
            <hr />
            <code className="--color-dark">
              Created on: {product.createdAt.toLocaleString("en-US")}
            </code>
            <br />
            <code className="--color-dark">
              Last Updated: {product.updatedAt.toLocaleString("en-US")}
            </code>
            {/* Button to trigger sending the product list */}
            <button onClick={sendProductList}>Send Product List</button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductDetail;


