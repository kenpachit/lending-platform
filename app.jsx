import React, { createContext, useContext, useReducer, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import _ from 'lodash'; // Import lodash

const Home = lazy(() => import('./Home'));
const Login = lazy(() => import('./Login'));
const Register = lazy(() => import('./Register'));
const ItemListing = lazy(() => import('./ItemListing'));
const Dashboard = lazy(() => import('./Dashboard'));

const initialState = {
  isAuthenticated: false,
  items: [],
  user: null,
};

const AppContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case 'ADD_ITEMS':
      return {
        ...state,
        items: [...state.items, ...action.payload],
      };
    default:
      return state;
  }
};

const fetchItems = _.memoize(async (params) => {
  const response = await fetch(`your-api-endpoint/${params}`);
  return await response.json();
});

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/items" component={ItemListing} />
            <Route path="/dashboard" render={() => (
              isAuthenticated ? <Dashboard /> : <Redirect to="/login" />
            )} />
          </Switch>
        </Suspense>
      </Router>
    </AppProvider>
  );
};

export default App;