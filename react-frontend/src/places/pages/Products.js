import React, { useEffect, useState} from 'react';
import ProductList from '../components/ProductList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const Products = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [loadedProducts, setLoadedProducts] = useState();

  useEffect(() => {
    const sendRequest = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:4000/api/products');
        const responseData = await response.json();

        if(!response.ok) {
          throw new Error(responseData.products);
        }
        setLoadedProducts(responseData.products);
        setIsLoading(false);
      } catch(err) {
        setError(err.message);
      }
      
    };
    sendRequest();
  }, []);

  const errorHandler = () => {
    setError(null);
  }
 
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      { isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedProducts && <ProductList key="007" items={loadedProducts} />}
    </React.Fragment>
  )
};

export default Products;
