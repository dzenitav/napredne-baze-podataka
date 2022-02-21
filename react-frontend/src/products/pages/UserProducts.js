import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ProductList from '../components/ProductList';
import { useHttpclient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const UserProducts = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpclient();
  const [loadedProducts, setLoadedProducts] = useState();
  const userId = useParams().userId;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:4000/api/products/user/${userId}`);
        setLoadedProducts(responseData.products);
      } catch(err) {}
    }
    fetchProducts();
  }, [sendRequest, userId])

  const productDeletedHandler = (deletedProductId) => {
    setLoadedProducts(prevProducts =>
      prevProducts.filter(product => product.id !== deletedProductId)
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      { isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      { !isLoading && loadedProducts && <ProductList items={loadedProducts} onDeleteProduct={productDeletedHandler}/>}
    </React.Fragment>
  );
};

export default UserProducts;
