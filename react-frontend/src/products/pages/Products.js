import React, { useEffect, useState} from 'react';
import ProductList from '../components/ProductList';
import ProductFilters from '../components/ProductFilters'
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpclient } from '../../shared/hooks/http-hook';

const Products = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpclient();
  const [loadedProducts, setLoadedProducts] = useState();
  const [loadedCategories, setLoadedCategories] = useState();

  useEffect(() => {
    const fetchProducts = async () => {
      const queryParams = new URLSearchParams(window.location.search)
      const term = queryParams.get("category")
      try {
        let responseData
        if(term) {
          responseData = await sendRequest(`http://localhost:4000/api/products/category/${term}`);
        } else {
          responseData = await sendRequest('http://localhost:4000/api/products');
        } 
       
        setLoadedProducts(responseData.products);
      } catch(err) {}
    };
    fetchProducts();
  }, [sendRequest]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responseData = await sendRequest('http://localhost:4000/api/categories');
        setLoadedCategories(responseData.categories);
      } catch(err) {}
    };
    fetchCategories();
  }, [sendRequest]);

  const productDeletedHandler = (deletedProductId) => {
    setLoadedProducts(prevProducts =>
      prevProducts.filter(product => product.id !== deletedProductId)
    );
  }

  const productFilterHandler = async (categoryId) => {  
    try {
      let responseData
      if(categoryId) {
        responseData = await sendRequest(`http://localhost:4000/api/products/category/${categoryId}`); 
      } else {
        responseData = await sendRequest('http://localhost:4000/api/products');
      } 
     
      setLoadedProducts(responseData.products);
    } catch(err) {}
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      { isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <div className="main-wrapper">
        {!isLoading && loadedProducts && <ProductList key="007" items={loadedProducts} onDeleteProduct={productDeletedHandler}/>}
        {!isLoading && loadedCategories && <ProductFilters key="001" items={loadedCategories} onSelectCategory={productFilterHandler}/>}
      </div>
     
    </React.Fragment>
  )
};

export default Products;
