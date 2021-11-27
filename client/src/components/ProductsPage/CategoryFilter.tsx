import { Box, Collapse, createStyles, Link, List, ListItem, ListItemText, makeStyles, Theme } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ICategory } from "src/types";
import { convertText } from "src/utils/convertText";

interface Props {
  categories: ICategory[];
  handleCategoryChange?: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    nested: {
      paddingLeft: theme.spacing(3),
    },
  })
);

const CategoryFilter = ({ categories, handleCategoryChange }: Props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box minWidth="20%" display="flex" flexDirection="column" my={4} mr={1}>
      <List component="nav" aria-labelledby="nested-list-subheader">
        <ListItem button onClick={handleClick}>
          <ListItemText primaryTypographyProps={{ variant: "h5" }} primary="Category" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link color="textPrimary" to="/products" component={RouterLink}>
              <ListItem button className={classes.nested} onClick={handleCategoryChange}>
                <ListItemText primary="Show all" />
              </ListItem>
            </Link>
            {categories.map((category: ICategory) => (
              <Link key={category.id} color="textPrimary" to={`?category=${category.id}`} component={RouterLink}>
                <ListItem button className={classes.nested} onClick={handleCategoryChange}>
                  <ListItemText primary={convertText(category.name)} />
                </ListItem>
              </Link>
            ))}
          </List>
        </Collapse>
      </List>
    </Box>
  );
};

export default CategoryFilter;
