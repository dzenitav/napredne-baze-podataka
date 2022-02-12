import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import ProductItem from './ProductItem';
import Button from '../../shared/components/FormElements/Button';
import './ProductList.css';

const ProductList = props => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No products found. Maybe create one?</h2>
          <Button to="/products/new">Add product</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map(place => (
        <ProductItem
          key={place.id}
          id={place.id}
          image={place.imageUrl}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
        />
      ))}
    </ul>
  );
};

export default ProductList;
