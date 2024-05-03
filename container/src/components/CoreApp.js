import { mount as coreMount } from 'CoreApp/CoreIndex';
import React, { useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default ({isSignedIn}) => {
    const ref = useRef(null);
    const history = useHistory();

    useEffect(() => {
        console.log("CoreApp.js - i am being called")
        const { onParentNavigate } = coreMount(ref.current, {
            initialPath: history.location.pathname,
            onNavigate: ({pathname: nextPathname}) => {
                console.log('1 navigateeeeee in container - CoreApp.js', pathname, nextPathname);

                const pathname  = history.location.pathname;
                if (pathname !== nextPathname) {
                    console.log('navigateeeeee in container - CoreApp.js', pathname, nextPathname);
                    history.push(nextPathname);
                }
            },
        })

        history.listen(onParentNavigate)
    }, [isSignedIn]);

    return <div ref={ref} />
}