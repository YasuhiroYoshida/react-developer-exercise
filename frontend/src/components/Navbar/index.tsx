import React from "react";
import * as UI from "@material-ui/core";
import { useAuth } from "auth";
import logo from "logo.svg";
import "./index.scss";

const Navbar = () => {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <React.Fragment>
      <UI.AppBar className="Navbar" color="secondary" position="fixed">
        <UI.Container>
          <UI.Toolbar variant="dense" disableGutters>
            <UI.Link href="/">
              <img className="Navbar-logo" src={logo} alt="GoodGym logo" />
            </UI.Link>

            <div className="Navbar-grow" />
            <UI.Avatar
              className="Navbar-avatar"
              src={user.avatar}
              alt={user.name}
            />
          </UI.Toolbar>
        </UI.Container>
      </UI.AppBar>
      <UI.Toolbar variant="dense" />
    </React.Fragment>
  );
};

export default Navbar;
