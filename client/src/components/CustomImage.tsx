import { makeStyles, Paper, Typography } from "@material-ui/core";
import MaterialUiImage from "material-ui-image";

interface Props {
  hasImage: boolean;
  imageSrc: string;
}

const CustomImage = ({ hasImage, imageSrc }: Props) => {
  const classes = useStyles();

  return (
    <Paper className={classes.image}>
      {hasImage ? (
        <MaterialUiImage
          disableTransition
          imageStyle={{ borderRadius: "4px", height: "150px" }}
          style={{
            borderRadius: "4px",
            paddingTop: "0",
            height: "150px",
          }}
          src={imageSrc}
        />
      ) : (
        <Paper className={classes.noImage}>
          <Typography>Image not found.</Typography>
        </Paper>
      )}
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  image: {
    width: "100%",
    height: "150px",
  },
  noImage: {
    width: "100%",
    height: "150px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    color: "black",
  },
}));

export default CustomImage;
