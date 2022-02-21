import React, { useEffect, useState} from 'react';
import ProductList from '../components/ProductList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpclient } from '../../shared/hooks/http-hook';

const Products = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpclient();
  const [loadedProducts, setLoadedProducts] = useState();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const responseData = await sendRequest('http://localhost:4000/api/products');
       
        setLoadedProducts(responseData.products);
        console.log(loadedProducts)
      } catch(err) {}
    };
    fetchProducts();
  }, [sendRequest]);

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
      {!isLoading && loadedProducts && <ProductList key="007" items={loadedProducts} onDeleteProduct={productDeletedHandler}/>}
    </React.Fragment>
  )
};

export default Products;
