import { mount as productsMount } from 'ProductsApp/ProductsIndex';
import { mount as authMount } from 'AuthApp/AuthIndex';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App auth={authMount}/>, document.getElementById('root'));




//productsMount(document.querySelector('#root'));

  
