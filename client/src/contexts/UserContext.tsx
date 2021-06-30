import { createContext, ReactNode } from "react";
import { useState } from "react";
import { IUserResponse } from "src/types";

type ContextType = {
  user?: IUserResponse;
  setUser: (user?: IUserResponse) => void;
};

export const UserContext = createContext<ContextType>({
  setUser: () => {},
});

interface Props {
  children: ReactNode;
}

const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<IUserResponse>();
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export default UserProvider;
