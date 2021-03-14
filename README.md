## Introduction

This project show the weather of city selected along with Currency data.

## Getting started
1. Run `npm install` to install dependencies.<br />
2. Run `npm start` to see the example app at `http://localhost:8080`.

## Commands

- `npm start` - start the dev server
- `npm run build` - create a production ready build in `dist` folder


## You need to develop a web application which will be accessed by 10000 concurrent users. Could you share the optimization tricks/technique you will use to optimize the application that it can allow 10,000 concurrent users to access the application and page load should not exceed 10s?

1. React fiber : Interpretive Rendering 
    Not to block the main thread.
    To work on multiple tasks at a time and switch between them according to priority.
    To partially render a tree without committing the result.
    react-virtualized, react-window other ways to render large list data

2. Server-side Rendering:
    To improve user experience and receive viewable content faster.

3. Pure components :
    It also does shallow comparisons on prop and state data then only shouldComponentUpdate lifecycle hook is called. The shouldcomponentupdate life cycle event is triggered before the re-rendering of the component.
    Use of react.memo for higher-order components.

4. Standard Code practice  :
    The usage of arrow functions helps in preserving the context of the execution.
    Avoid use of inline styles and functions definition as its javascript object has to be converted into a CSS style property.
    Use react fragments to avoid extra tags.
    Use Immutable data structures(use functional programming).
    Only use those import which are needed so there will be less dependencies.
    throttling and debouncing techniques.
    Avoid using Index as Key for map.
    Avoiding Props in Initial States.
    Spreading props on DOM elements use specific attributes.
    CSS Animations Instead of JS Animations and use of CDN.
    Web Workers which will perform script operation in a web application’s background thread.
    Optimizing bundle size.
    Lazy loading and caching.

## You need to design the authentication protocol of your web application to ensure every request sent to backend application is validated to ensure full security. Can you share your approach how you design your frontend application to ensure security of the API call against unauthorized access?

1. Form and api level Changes : 
     Validate all form input when user. should have reCaptcha distinguish humans from bots.
     Authentication Without Proper Authorization.
     Encode output data and appropriate response headers.
     Check Cross-Site Request and randomized token for every session.
     Important data should be encryted using encryted algo. 
     Content Security Policy which checks data coming from whlisted domains.
     avoid use third-party scripts.
     Audit your dependencies to check vulnerable packages and upgrade.
     use Subresource for third-party CDN hosting.

2. Disabling Caching Of Confidential Resources:
    res.setHeader('Cache-Control','no-cache,no-store,max-age=0,must-revalidate');
    res.setHeader('Pragma','no-cache');
    res.setHeader('Expires','-1');

3. Enforcing HTTPS:
    res.setHeader('Strict-Transport-Security','max-age=31536000; includeSubDomains; preload');
    Enabling XSS Filtering: res.setHeader('X-XSS-Protection','1;mode=block');
    Controlling Framing: res.setHeader('X-Frame-Options','SAMEORIGIN');
    Explicitly Whitelisting Sources: res.setHeader('Content-Security-Policy',"script-src 'self'");
    Preventing Content-Type Sniffing: res.setHeader('X-Content-Type-Options','nosniff');

    Disable caching for confidential information using the Cache-Control header.
    Enforce HTTPS using the Strict-Transport-Security header, and add your domain to Chrome’s preload list.
    Make your web app more robust against XSS by leveraging the X-XSS-Protection header.
    Block clickjacking using the X-Frame-Options header.
    Leverage Content-Security-Policy to whitelist specific sources and endpoints.
    Prevent MIME-sniffing attacks using the X-Content-Type-Options header.

   please refer this link https://www.simform.com/react-security-vulnerabilities-solutions/

To design authorization we need (Auth0 / JWT) :

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch(`${config.apiUrl}/users/authenticate`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);

            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}

Create login page when user enter username and password if its authenticated you will get token with that you call subsequent api's to render any component. after authentication completed you based on routes redirected to component. Routes are based on user authentication. 


## Explaining the concept of Session, Local and Cookie Storage, give two real world examples when each of these techniques should be used and the rationale behind it?

LocalStorage :
    Stores data with no expiration date, and gets cleared only through JavaScript, or clearing the Browser cache / Locally Stored Data.
    Storage limit is the maximum amongst the three.
    cache some application data in the browser for later usage.

SessionStorage :
    The sessionStorage object stores data only for a session, meaning that the data is stored until the browser (or tab) is closed.
    Storage limit is larger than a cookie (at least 5MB).
    If the user tries to buy two tickets in two different tabs, you wouldn't want the two sessions interfering with each other.

Cookie :
    Stores data that has to be sent back to the server with subsequent requests. Its expiration varies based on the type and the expiration duration can be set from either server-side or client-side (normally from server-side).
    Cookies are primarily for server-side reading (can also be read on client-side), localStorage and sessionStorage can only be read on client-side.
    Size must be less than 4KB.
    Cookies can be made secure by setting the httpOnly flag as true for that cookie. This prevents client-side access to that cookie.
    Whereas cookies at automatically attached to headers if the same domain and path defined in the cookie match the request. (and all of the other restrictions -- secure, httponly, not expired, etc)
    Cookies help us to identify which pages users are visiting and analyse data about webpage.
