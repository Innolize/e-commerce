import { createContext, ReactNode } from "react";
import { useState } from "react";
import { IUser } from "src/types";

type ContextType = {
  user?: IUser;
  setUser: (user?: IUser) => void;
};

export const UserContext = createContext<ContextType>({
  user: undefined,
  setUser: () => {},
});

interface Props {
  children: ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<IUser>();
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
