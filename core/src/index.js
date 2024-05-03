import { createBrowserHistory, createMemoryHistory } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

const mount = (el, { onNavigate, defaultHistory, initialPath }) => {
    const history = defaultHistory || createMemoryHistory({
        initialEntries: [initialPath]
    });

    if (onNavigate) {
        history.listen(onNavigate);
    }
   
    ReactDOM.render(<App history={history} />, el);

    return {
        onParentNavigate( {pathname: nextPathname}) {
            const { pathname } = history.location;
            if (pathname !== nextPathname) {
                console.log('onParentNavigate - I am in core now', pathname, nextPathname);
                history.push(nextPathname);
            }
        }
    }
}

if (process.env.NODE_ENV === "development") {
    const el = document.querySelector("#core-development");
    if (el) {
        mount(el, { defaultHistory: createBrowserHistory()});
    }
}

export { mount };