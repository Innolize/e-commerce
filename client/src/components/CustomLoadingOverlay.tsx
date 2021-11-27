import { LinearProgress } from "@material-ui/core";
import { GridOverlay } from "@material-ui/data-grid";

const CustomLoadingOverlay = () => {
  return (
    <GridOverlay>
      <div style={{ position: "absolute", top: 0, width: "100%" }}>
        <LinearProgress color="secondary" />
      </div>
    </GridOverlay>
  );
};

export default CustomLoadingOverlay;
