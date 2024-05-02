import { mount } from 'AuthApp/AuthIndex';
import React, { useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default ({ onSignIn }) => {
    const ref = useRef(null);
    const history = useHistory();
    useEffect(() => {
        const { onParentNavigate } = mount(ref.current, {
            initialPath: history.location.pathname,
            onNavigate: (obj) => {
                const nextPathname = obj.location.pathname;
                const pathname = history.location.pathname;
                if (pathname !== nextPathname) {
                    console.log('navigateeeeee in container - AuthApp.js', pathname, nextPathname);
                    const userData = localStorage.getItem("userData");
                    if (userData) {
                        onSignIn();
                    }
                    history.push(nextPathname);
                }
            },
        })

        history.listen(onParentNavigate)
    }, []);

    return <div ref={ref} />
}