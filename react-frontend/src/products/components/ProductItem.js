import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './ProductItem.css';
import { useHttpclient } from '../../shared/hooks/http-hook';

const ProductItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpclient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(`http://localhost:4000/api/products/${props.id}`,
       'DELETE',
       null,
       {
         Authorization: 'Bearer ' + auth.token
       });
      props.onDelete(props.id);
    } catch(err) {}
  };

  let addedIntoCart = false;
  const cartData = localStorage.getItem("cartData");
  if(cartData) {
    const cartDataParsed = JSON.parse(cartData);
    const inCart = cartDataParsed.indexOf(props.id);
    if (inCart !== -1) {
      addedIntoCart = true;
    }
  } 
  const [isActive, setIsActive] = useState(addedIntoCart);

  const handleCartClick = (e) => {
    e.target.classList.toggle('active');
    if(isActive) {
      setIsActive(false);
      removeFromCart();
    } else {
      setIsActive(true);
      addToCart();
    }
  }

  const addToCart = () => {
    const cartData = localStorage.getItem("cartData");
    if(cartData && cartData.length !== 0) {
      const cartDataParsed = JSON.parse(cartData);
      cartDataParsed.push(props.id);
      localStorage.setItem("cartData",  JSON.stringify(
        cartDataParsed
      ))
    } else {
      localStorage.setItem("cartData",  JSON.stringify(
        [props.id]
      ))
    }
  }

  const removeFromCart = () => {
    const cartData = localStorage.getItem("cartData");
    if(cartData && cartData.length !== 0) {
      const cartDataParsed = JSON.parse(cartData);
      const filteredArr = cartDataParsed.filter(number => number !== props.id);
      localStorage.setItem("cartData",  JSON.stringify(
        filteredArr
      ))
    }    
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      <Modal
        show={showMap}ß
        onCancel={closeMapHandler}
        header={props.description}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <img src={props.imageUrl} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this product? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="place-item">
        {isLoading && <LoadingSpinner asOverlay/>}
        <Card className="place-item__content">
          <div className="place-item__image">
            <span className="place-item__price">{props.price}$</span>
            <img src={props.imageUrl} alt={props.title} />
            {!auth.isLoggedIn && (
               <span className={isActive ? 'place-item__cart active': "place-item__cart"} title={isActive ? 'Remove from cart': 'Add to cart'} data-id={props.id} onClick={(e) => handleCartClick(e)}>+</span>
            )}
            {auth.isLoggedIn && auth.userId !== props.creatorId && (
               <span className={isActive ? 'place-item__cart active': "place-item__cart"} title={isActive ? 'Remove from cart': 'Add to cart'} data-id={props.id} onClick={(e) => handleCartClick(e)}>+</span>
            )}
          </div>
          <div className="place-item__info">
            <h3>{props.title}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            
            {!auth.isLoggedIn && (
              <Button inverse onClick={openMapHandler}>
                VIEW
              </Button>
            )}
            {auth.isLoggedIn && auth.userId === props.creatorId && (
              <Button to={`/products/${props.id}`}>EDIT</Button>
            )}

            {auth.isLoggedIn && auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}

            {auth.isLoggedIn && auth.userId !== props.creatorId && (
              <Button inverse onClick={openMapHandler}>
                VIEW
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default ProductItem;
