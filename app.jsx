import React, { createContext, useContext, useReducer, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

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

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true, user: action.payload };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null };
    case 'ADD_ITEMS':
      return { ...state, items: [...state.items, ...action.payload] };
    default:
      return state;
  }
};

async function fetchItems(params) {
  const response = await fetch(`your-api-endpoint/${params}`);
  const data = await response.json();
  return data;
}

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch, fetchItems }}>
      {children}
    </AppContext.Provider>
  );
};

const PrivateRoute = ({ children, ...rest }) => {
  const { state: { isAuthenticated } } = useContext(AppContext);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
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
            <PrivateRoute path="/dashboard">
              <Dashboard />
            </PrivateRoute>
          </Switch>
        </Suspense>
      </Router>
    </AppProvider>
  );
};

export default App;