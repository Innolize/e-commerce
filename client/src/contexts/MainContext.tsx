import { ReactNode } from "react";
import CustomThemeProvider from "./CustomThemeContext";
import { UserProvider } from "./UserContext";

interface Props {
  children: ReactNode;
}

const MainContextProvider = ({ children }: Props) => {
  return (
    <UserProvider>
      <CustomThemeProvider>{children}</CustomThemeProvider>
    </UserProvider>
  );
};

export default MainContextProvider;
