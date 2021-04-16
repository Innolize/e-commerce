import IconButton from "@material-ui/core/IconButton";
import { useTheme } from "@material-ui/core/styles";
import NightsStayIcon from "@material-ui/icons/NightsStay";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import { useContext } from "react";
import { CustomThemeContext } from "../contexts/customThemeContext";

interface Props {
  className?: string;
}

const ChangeThemeButton = (props: Props) => {
  const theme = useTheme();
  const { currentTheme, setTheme } = useContext(CustomThemeContext);

  const handleThemeChange = () => {
    currentTheme === "light" ? setTheme!("dark") : setTheme!("light");
  };

  return (
    <IconButton className={props.className} onClick={handleThemeChange}>
      {theme.palette.type === "light" ? <WbSunnyIcon /> : <NightsStayIcon />}
    </IconButton>
  );
};

export default ChangeThemeButton;
