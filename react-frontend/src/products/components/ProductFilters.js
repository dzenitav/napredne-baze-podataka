import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import './ProductItem.css';
import { useHttpclient } from '../../shared/hooks/http-hook';

const ProductFilters = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpclient();
  
  const selectPriceHandler = (e)=>{
    props.onSelectPrice(e.target.value)
  }

  const selectCategoryHandler = (e, cat) => {
    e.preventDefault();
    props.onSelectCategory(cat);
  };

  const clearFilters = () => {
    props.onSelectCategory(undefined);
    props.onSelectPrice(100)
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      <div className="filters-wrapper">
        <div className="filters-inner-wrapper">
          <h4 className="filters-title">Category:</h4>
          
          {props.items.map(cat => {
            return <Link 
                      className={`filter-category ${props.category === cat.id ? 'button--inverse': ''}`} 
                      id={cat.id}
                      to=""
                      key={cat.id} 
                      onClick={(e)=>selectCategoryHandler(e, cat.id)}>
                      {cat.name}</Link>
          })}
        
          <h4>Price (up to): { props.price }$</h4>
          <input type="range" className="filter-range" defaultValue={props.price} onInput={selectPriceHandler} />

          <Button inverse onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
        
      </div>
     
    </React.Fragment>
  );
};

export default ProductFilters;
