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
  const [ category, setCategory ] = useState();
  const [ price, setPrice ] = useState(100);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const responseData = await sendRequest('http://localhost:4000/api/products');
        setLoadedProducts(responseData.products);
      } catch(err) {}
    };
    fetchProducts();

    const fetchCategories = async () => {
      try {
        const responseData = await sendRequest('http://localhost:4000/api/categories');
        setLoadedCategories(responseData.categories);
      } catch(err) {}
    };
    fetchCategories();
  }, [sendRequest]);

  useEffect(() => {
    const fetchData = async () => {
      let productsUrl = `http://localhost:4000/api/products?price=${price}`;
      try {
        if(category) {
          productsUrl = productsUrl + `&category=${category}`; 
        } 
        const responseData = await sendRequest(productsUrl);      
        setLoadedProducts(responseData.products);
      } catch(err) {
        setLoadedProducts(null);
      }
    }
    fetchData();
  }, [category, price]);

  const productDeletedHandler = (deletedProductId) => {
    setLoadedProducts(prevProducts =>
      prevProducts.filter(product => product.id !== deletedProductId)
    );
  }

  const priceFilterHandler = async (price) => {
    setPrice(price);
  }

  const categoryFilterHandler = async (categoryId) => {  
    setCategory(categoryId);
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
        {!isLoading && loadedProducts && <ProductList key="007" category={category} items={loadedProducts} onDeleteProduct={productDeletedHandler}/>}
        {!isLoading && loadedCategories && <ProductFilters key="001" price={price} category={category} items={loadedCategories} onSelectCategory={categoryFilterHandler} onSelectPrice={priceFilterHandler}/>}
      </div>
     
    </React.Fragment>
  )
};

export default Products;
