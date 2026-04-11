"use client"
import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { checkAuthUser } from "./slices/authSlice";

function AuthCheck({ children }) {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(checkAuthUser());
  }, [dispatch]);

  return <>{children}</>;
}

export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <AuthCheck>{children}</AuthCheck>
    </Provider>
  );
}
