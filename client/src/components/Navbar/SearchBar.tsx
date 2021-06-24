import InputBase from "@material-ui/core/InputBase";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.background.default,
      boxShadow: "0 2px 5px 2px rgb(64 60 67 / 30%)",
      "&:hover": {
        border: `1px solid #0079D3`,
      },
      "&:focus-within": {
        border: `1px solid #0079D3`,
      },
      marginRight: theme.spacing(2),
      marginLeft: theme.spacing(2),
      width: "100%",
      maxWidth: "575px",
    },
    searchIcon: {
      padding: theme.spacing(0, 1),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "inherit",
      width: "100%",
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(3)}px)`,
      width: "100%",
    },
  })
);

const SearchBar = () => {
  const classes = useStyles();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [searchQuery, setSearchQuery] = useState("");
  const history = useHistory();

  const handleSumbit = (e: React.FormEvent) => {
    e.preventDefault();
    searchParams.set("name", searchQuery);
    history.replace("/products/?" + searchParams.toString());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <form className={classes.search} onSubmit={handleSumbit}>
      <button hidden type="submit"></button>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search for products..."
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ "aria-label": "search" }}
        value={searchQuery}
        onChange={handleChange}
      />
    </form>
  );
};

export default SearchBar;
