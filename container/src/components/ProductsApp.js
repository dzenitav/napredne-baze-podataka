import { mount as productsMount } from 'ProductsApp/ProductsIndex';
import React, { useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { mount } from '../../../products-list/src';

export default () => {
    const ref = useRef(null);
    const history = useHistory();

    useEffect(() => {
        const { onParentNavigate } = mount(ref.current, {
            onNavigate: ({pathname: nextPathname}) => {
                const pathname = history.pathname;
                console.log('navigateeeeee in container',nextPathname);
                if (pathname !== nextPathname) {
                    history.push(nextPathname);
                }
            }
        })

        history.listen(onParentNavigate)
    }, []);

    return <div ref={ref} />
}