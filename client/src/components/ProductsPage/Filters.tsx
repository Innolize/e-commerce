import {
  AppBar,
  Button,
  createStyles,
  Dialog,
  IconButton,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import CloseIcon from "@material-ui/icons/Close";
import { forwardRef, ReactElement, Ref, useState } from "react";
import { ICategory } from "src/types";
import useScreenSize from "use-screen-size";
import CategoryFilter from "./CategoryFilter";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: "relative",
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  })
);

interface Props {
  categories: ICategory[];
  handleCategoryChange: () => void;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: ReactElement },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Filters = ({ categories, handleCategoryChange }: Props) => {
  const screenSize = useScreenSize();
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const mobileCategoryChange = () => {
    handleCategoryChange();
    handleClose();
  };

  return (
    <>
      {screenSize.width > 768 ? (
        <CategoryFilter categories={categories} handleCategoryChange={handleCategoryChange} />
      ) : (
        screenSize.width <= 768 && (
          <>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
              Filters
            </Button>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
              <AppBar className={classes.appBar}>
                <Toolbar>
                  <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h6" className={classes.title}>
                    Filters
                  </Typography>
                </Toolbar>
              </AppBar>
              <CategoryFilter categories={categories} handleCategoryChange={mobileCategoryChange} />
            </Dialog>
          </>
        )
      )}
    </>
  );
};

export default Filters;
