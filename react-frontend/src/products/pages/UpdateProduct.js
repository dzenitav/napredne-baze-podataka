import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import Select from 'react-select';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAX
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpclient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';


const UpdateProduct = () => {
  const auth = useContext(AuthContext);
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
      },
      category: {
        value: '',
        isValid: false
      },
      price: {
        value: '',
        isValid: false,
      }
    },
    false
  );

  const [ loadedCategories, setLoadedCategories ] = useState();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responseData = await sendRequest('http://localhost:4000/api/categories');
       
        const options = [];
        responseData.categories.forEach(cat => {
          const category = {};
          category.value = cat.id;
          category.label = cat.name;
          options.push(category);
        })
     
        setLoadedCategories(options);
        formState.inputs.category.isValid = true;
      } catch(err) {}
    };
    fetchCategories();
  }, [sendRequest]);

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
            },
            category: {
              value: loadedProduct.category ? loadedProduct.category.id : '',
              isValid: true
            },
            price: {
              value: loadedProduct.price ? loadedProduct.price : 0,
              isValid: true,
            }
          },
          true
        );
      } catch(err) {}
    }
  
    fetchProduct();
  }, [sendRequest, productId, setFormData]);

  const changeCategoryHandler = event => {
    formState.inputs.category.value = event.value;
    formState.inputs.category.isValid = true;
    formState.isValid = true;
  };
  
  const history = useHistory();

  const placeUpdateSubmitHandler = async event => {
    event.preventDefault();
    if(formState.inputs.category.value === '') {
      formState.inputs.category.value = loadedProduct.category.id
    }

    try {
      await sendRequest(`http://localhost:4000/api/products/${productId}`, 'PATCH', 
      JSON.stringify({
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
        imageUrl: formState.inputs.imageUrl.value,
        category: formState.inputs.category.value,
        price: formState.inputs.price.value,
      }),
      {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + auth.token,
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
        element="input"
        label="Image"
        validators={[VALIDATOR_REQUIRE(6)]}
        errorText="Please enter image URL."
        onInput={inputHandler}
        initialValue={loadedProduct.imageUrl}
        initialValid={true}
      />
       <Input
        id="price"
        element="input"
        type="number"
        label="Price"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAX(100)]}
        errorText="Please enter a valid price."
        onInput={inputHandler}
        initialValue={loadedProduct.price}
        initialValid={true}
      />

      <span>Select category</span>
        {!isLoading && loadedCategories && loadedProduct &&
          <Select 
            defaultValue={{value: loadedProduct.category ? loadedProduct.category.id : '', label: loadedProduct.category ? loadedProduct.category.name : '' }}
            onChange={changeCategoryHandler}
            options={loadedCategories}
            id="category"
          />} 

      <Button type="submit" disabled={!formState.isValid}>
        Update Product
      </Button>
    </form>}
    </React.Fragment>
  );
};

export default UpdateProduct;
