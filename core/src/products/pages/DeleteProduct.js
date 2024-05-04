import React, { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpclient } from '../../shared/hooks/http-hook';


const DeleteProduct = ({ history }) => {
  const auth = {};
  const userData = localStorage.getItem("userData");
  if(userData) {
    const userDataParsed = JSON.parse(userData);
    auth.isLoggedIn = true;
    auth.token = userDataParsed.token;
  }

  const ref = useRef(null);
  const { isLoading, error, sendRequest, clearError } = useHttpclient();
  const productId = useParams().productId;

  useEffect(() => {
      const deleteProduct = async() => {
        try {
           await sendRequest(`http://localhost:4000/api/products/${productId}`,
           'DELETE',
           null,
            {
              Authorization: 'Bearer ' + auth.token
            });
        } catch(err) {}
        history.push("/");
      }

      deleteProduct();
  }, [sendRequest]);


  return <div ref={ref} />
};

export default DeleteProduct;
