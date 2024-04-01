import { createBrowserHistory } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

const mount = (el, { onNavigate, defaultHistory }) => {
    const history = defaultHistory || createMemoryHistory();

    if (onNavigate) {
        history.listen(onNavigate);
    }
   
    ReactDOM.render(<App history={history}/>, el);

    return {
        onParentNavigate( {pathname: nextPathname}) {
            const { pathname } = history.location;
            console.log('container just navigated')
            if (pathname !== nextPathname) {
                history.push(nextPathname);
            }
        }
    }
}

if (process.env.NODE_ENV === "development") {
    const el = document.querySelector("#products-development");
    if (el) {
        mount(el, { defaultHistory: createBrowserHistory()});
    }
}

export { mount };