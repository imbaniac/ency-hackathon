import { useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import ApiKeyForm from "./pages/ApiKeyForm";
import Webinars from "./pages/Webinars";
import Header from "./pages/Header";
import UserContext from "./utils/UserContext";
import CreateWebinar from "./pages/Webinars/CreateWebinar";
import WebinarSettings from "./pages/Webinars/WebinarSettings";
import WebinarPublic from "./pages/Webinars/WebinarPublic";

const PrivateRoute = ({ children, shouldRedirect, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        shouldRedirect ? (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        ) : (
          children
        )
      }
    />
  );
};

const App = () => {
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("livepeer-api-key") || ""
  );

  return (
    <UserContext.Provider value={{ apiKey, setApiKey }}>
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <ApiKeyForm />
          </Route>
          <Route path="/view/:playbackId">
            <WebinarPublic />
          </Route>
          <PrivateRoute shouldRedirect={!apiKey} path="/webinars">
            <Switch>
              <Route exact path="/webinars">
                <Webinars />
              </Route>
              <Route path="/webinars/:id/new">
                <CreateWebinar />
              </Route>
              <Route path="/webinars/:id/settings">
                <WebinarSettings />
              </Route>
            </Switch>
          </PrivateRoute>
        </Switch>
      </Router>
    </UserContext.Provider>
  );
};

export default App;
