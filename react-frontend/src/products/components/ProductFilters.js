import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './ProductItem.css';
import { useHttpclient } from '../../shared/hooks/http-hook';

const ProductFilters = props => {
  console.log(props.items)
  const { isLoading, error, sendRequest, clearError } = useHttpclient();
  const [ price, setPrice ] = useState(100);

  const handleInput = (e)=>{
    setPrice( e.target.value );
  }
  const hotels = [
    { name: "A", price: 40  },
    { name: "B", price: 50  },
    { name: "C", price: 60  }
  ];

  const selectCategoryHandler = (e) => {
   e.preventDefault()
   console.log(e);
   //props.onSelectCategory();
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      <div className="filters-wrapper">
        <div className="filters-inner-wrapper">
          <h4 className="filters-title">Category</h4>
          
          {props.items.map(cat => {
            return <Link className="filter-category" id={cat.id} key={cat.id} to={`?category=${cat.id}`} onClick={()=>props.onSelectCategory(cat.id)}>{cat.name}</Link>
          })}
        
          <h4>Price (less than): { price }$</h4>
          <input type="range" value={price} onInput={ handleInput } />
          <div>
          { hotels.filter( hotel => { return hotel.price < parseInt(price, 10) }).map( hotel => {
            return <p key={hotel.name}>{ hotel.name } | { hotel.price } &euro; </p>
          })}        
          </div>

          <Button inverse onClick={()=>props.onSelectCategory(null)}>
            Clear filters
          </Button>
        </div>
        
      </div>
     
    </React.Fragment>
  );
};

export default ProductFilters;
