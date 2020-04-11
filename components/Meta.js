import ReactGA from 'react-ga';
import Router from 'next/router'

export default function Meta (props) {
    Router.onRouteChangeComplete = url => {
        console.log("라우트 체인지 컴플릿", url)
        const pathName = window.location.pathname;
        ReactGA.initialize('UA-161685840-1');
        ReactGA.set({page: pathName});
        ReactGA.pageview(pathName);
    }

    return (
        <>
        </>
    );
}

