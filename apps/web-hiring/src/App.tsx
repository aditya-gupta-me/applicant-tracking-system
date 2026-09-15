import { useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";
import { Link } from "react-router-dom";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const fn = async () => {
    const res = await authClient.getSession();

    console.log(res);

    if(res.data !== null || res.data !== undefined){
      console.log("Came here");
      setIsLoggedIn(true);
    }
  }

  useEffect(() => {
    fn();
  }, [])

  return (
    <>
    {!isLoggedIn && 
    <p>
      You are not logged-in
      <Link to={'/login'}>Login here</Link>
    </p>}

    {isLoggedIn && <p>Welcome user!</p>}
    App.jsx
    </>
  )
}

export default App;