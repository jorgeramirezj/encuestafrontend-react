import Navigation from "./Components/Navigation";
import AppRoute from "./Router/AppRoute";
import routes from "./Router/routes";
import { AuthProvider } from "./context/authContext";
import { BrowserRouter as Router, Switch } from 'react-router-dom'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation></Navigation>
        <Switch>
          {
            routes.map(route => <AppRoute
              component={route.component}
              path={route.path}
              routeType={route.routeType}
              key={route.path}
              exact
            ></AppRoute>)
          }
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
