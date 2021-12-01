import { Box, Button, createStyles, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    image: {
      objectFit: "fill",
      width: "300px",
      minHeight: "150px",
    },
  })
);

type CpuBrand = "AMD" | "INTEL" | "";

interface Props {
  setCpuBrand: React.Dispatch<React.SetStateAction<CpuBrand>>;
  handleNext: () => void;
}

const BrandSelection = ({ setCpuBrand, handleNext }: Props) => {
  const classes = useStyles();

  return (
    <Box display="flex" justifyContent="center">
      <Box
        onClick={() => {
          setCpuBrand("AMD");
          handleNext();
        }}
        component={Button}
      >
        <img className={classes.image} src="images/amd_logo.png" alt="amd logo"></img>
      </Box>
      <Box
        onClick={() => {
          setCpuBrand("INTEL");
          handleNext();
        }}
        component={Button}
      >
        <img className={classes.image} src="images/intel_logo.png" alt="intel logo"></img>
      </Box>
    </Box>
  );
};

export default BrandSelection;
