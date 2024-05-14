import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAX
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpclient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './PlaceForm.css';

const ProductsCart = ({history}) => {

    const { isLoading, error, sendRequest, clearError } = useHttpclient();
    const [loadedProducts, setLoadedProducts] = useState();
    const [ price, setPrice ] = useState(100);
  
    useEffect(() => {
      const fetchProducts = async () => {
        try {

          const userData = localStorage.getItem("userData");
          let userId;
          if(userData) {
            const userDataParsed = JSON.parse(userData);
            userId = userDataParsed.userId;
          }
          const responseData = await sendRequest('http://localhost:4000/api/products');

          let myProducts = [];
          const cartData = localStorage.getItem("cartData");
          if(cartData) {
            const cartDataParsed = JSON.parse(cartData);
            myProducts = responseData.products.filter(e => {
                return cartDataParsed.indexOf(e.id) !== -1 && e.creator !== userId
            })
        
          } 
          setLoadedProducts(myProducts);
        } catch(err) {}
      };
      fetchProducts();
    }, [sendRequest]);

    const removeItem = (id) => {
        console.log("I am here now", id);
        const cartData = localStorage.getItem("cartData");
        if(cartData && cartData.length !== 0) {
          const cartDataParsed = JSON.parse(cartData);
          const filteredArr = cartDataParsed.filter(number => number !== id);
          localStorage.setItem("cartData",  JSON.stringify(
            filteredArr
          ));
          const products = loadedProducts.filter(product => product.id !== id);
          setLoadedProducts(products);
        }    
    }

  return (
    
    <ul className="products-list">
    {loadedProducts && loadedProducts.map((item, index) => (
        <li key={item.id}><h3>{item.title}<span className="products-cart-remove" onClick={(id)=> removeItem(item.id)}>x</span></h3></li>
    ))}
    <a class="button button--default" href="/#">ORDER</a>
   </ul>
  )
}

export default ProductsCart;