import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';
import { useHttpclient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';


const UpdateProduct = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpclient();
  const [loadedProduct, setLoadedProduct] = useState();
  const productId = useParams().productId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      imageUrl: {
        value: '',
        isValid: false
      }
    },
    false
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:4000/api/products/${productId}`);
        setLoadedProduct(responseData.product);

        setFormData(
          {
            title: {
              value: loadedProduct.title,
              isValid: true
            },
            description: {
              value: loadedProduct.description,
              isValid: true
            },
            imageUrl: {
              value: loadedProduct.imageUrl,
              isValid: true
            }
          },
          true
        );
      } catch(err) {}
    }
  
    fetchProduct();
  }, [sendRequest, productId, setFormData]);

  const history = useHistory();

  const placeUpdateSubmitHandler = async event => {
    event.preventDefault();
    console.log(formState.inputs);

    try {
      await sendRequest(`http://localhost:4000/api/products/${productId}`, 'PATCH', 
      JSON.stringify({
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
        imageUrl: formState.inputs.imageUrl.value,
      }),
      {
        'Content-Type': 'application/json'
      });

      history.push('/')
    } catch(err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedProduct && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
    {!isLoading && loadedProduct && <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={loadedProduct.title}
        initialValid={true}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(6)]}
        errorText="Please enter a valid description (min. 6 characters)."
        onInput={inputHandler}
        initialValue={loadedProduct.description}
        initialValid={true}
      />
       <Input
        id="imageUrl"
        element="textarea"
        label="Image"
        validators={[VALIDATOR_REQUIRE(6)]}
        errorText="Please enter image URL."
        onInput={inputHandler}
        initialValue={loadedProduct.imageUrl}
        initialValid={true}
      />
      <Button type="submit" disabled={!formState.isValid}>
        Update Product
      </Button>
    </form>}
    </React.Fragment>
  );
};

export default UpdateProduct;
