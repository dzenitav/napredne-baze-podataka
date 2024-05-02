import { mount as productsMount } from 'ProductsApp/ProductsIndex';
import React, { useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default ({isSignedIn}) => {
    const ref = useRef(null);
    const history = useHistory();

    useEffect(() => {
        console.log("ProductsApp.js - i am being called, user state", isSignedIn)
        const { onParentNavigate } = productsMount(ref.current, {
            initialPath: history.location.pathname,
            onNavigate: ({pathname: nextPathname}) => {
                const pathname  = history.location.pathname;
                if (pathname !== nextPathname) {
                    console.log('navigateeeeee in container - ProductsApp.js', pathname, nextPathname);
                    history.push(nextPathname);
                }
            },
        })

        history.listen(onParentNavigate)
    }, [isSignedIn]);

    return <div ref={ref} />
}