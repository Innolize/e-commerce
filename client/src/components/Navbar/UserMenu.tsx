import { Link } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { IUser } from "src/types";

interface Props {
  handleLogout: () => void;
  user: IUser;
}

const UserMenu = ({ handleLogout, user }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button size="large" onClick={handleClick} startIcon={<AccountCircleIcon />}>
        My user
      </Button>
      <Menu id="user-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem disabled>{user.userInfo.mail}</MenuItem>
        <Link color="textPrimary" underline="none" component={RouterLink} to="/orders" onClick={handleClose}>
          <MenuItem>My orders</MenuItem>
        </Link>
        <MenuItem
          onClick={() => {
            handleClose();
            handleLogout();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export default UserMenu;
