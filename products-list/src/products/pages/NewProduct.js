import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { useHistory } from 'react-router';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAX
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpclient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './PlaceForm.css';

const NewProduct = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpclient();
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
      } catch(err) {}
    };
    fetchCategories();
  }, [sendRequest]);

  const [formState, inputHandler] = useForm(
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

  const changeCategoryHandler = event => {
    formState.inputs.category.value = event.value;
    formState.inputs.category.isValid = true;
    formState.isValid = true;
  };

  const history = useHistory();

  const placeSubmitHandler = async event => {
    event.preventDefault();

    try {
      await sendRequest('http://localhost:4000/api/products', 'POST', 
      JSON.stringify({
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
        imageUrl: formState.inputs.imageUrl.value,
        category: formState.inputs.category.value,
        price: formState.inputs.price.value
      }),
      {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + auth.token,
      });

      history.push('/')
    } catch(err) {}
   
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
    <form className="place-form" onSubmit={placeSubmitHandler}>
      {isLoading && <LoadingSpinner asOverlay />}
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
      />
      <Input
        id="imageUrl"
        element="input"
        label="Image URL"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid image URL"
        onInput={inputHandler}
      />
      <Input
        id="price"
        element="input"
        type="number"
        label="Price"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAX(100)]}
        errorText="Please enter a valid price (max value is 100)."
        onInput={inputHandler}
      />
      <span>Select category</span>
      {!isLoading && loadedCategories && 
          <Select options={loadedCategories} id="category" onChange={changeCategoryHandler}/>} 

      <Button type="submit" disabled={!formState.isValid}>
        Add Product
      </Button>
    </form>
    </React.Fragment>
  );
};

export default NewProduct;
