import React, { useEffect } from "react"
import Dashboard from "./components/dashboard/Index"
import { userSearchHandler } from "./components/commentBox/auth";

/*
  url params should be in the below format
  http://localhost:3000?q={token}+{userId} // backoffice
*/


const App = () => {

  useEffect(() => {
    handleLocationParams();
  }, []);

  const handleLocationParams = () => {
    let search: string;
    let pathname: string;

    // eslint-disable-next-line
    ({ search, pathname } = window.location, { search, pathname })
    if (search) {
      window.history.pushState('', '', pathname);
      userSearchHandler(search);
    }
  };



  return (
    <Dashboard />
  )
}

export default App
