import React, { createContext, useContext, useReducer } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

const Home = () => <div>Home Page</div>;
const Login = () => <div>Login Page</div>;
const Register = () => <div>Register Page</div>;
const ItemListing = () => <div>Item Listing Page</div>;
const Dashboard = () => <div>User Dashboard</div>;

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
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/items" component={ItemListing} />
          <PrivateRoute path="/dashboard">
            <Dashboard />
          </PrivateRoute>
        </Switch>
      </Router>
    </AppProvider>
  );
};

const PrivateRoute = ({ children, ...rest }) => {
  const { state } = useContext(AppContext);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        state.isAuthenticated ? (
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

export default App;