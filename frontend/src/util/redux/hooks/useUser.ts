// useUser.ts

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setUser } from "../slices/userSlice";

export function useUser() {
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.user.name);
  const userID = useSelector((state: RootState) => state.user.user_uuid);

  const newUserLogin = (user_uuid: string, name: string) => {
    // Perform login logic and dispatch setAuth with true
    dispatch(
      setUser({
        name: name,
        user_uuid: user_uuid,
      }),
    );
  };

  const userLogout = () => {
    // Perform login logic and dispatch setAuth with true
    dispatch(
      setUser({
        name: null,
        user_uuid: null,
      }),
    );
  };

  return {
    username,
    userID,
    newUserLogin,
    userLogout,
  };
}
