import {
  GridColumnsToolbarButton,
  GridDensitySelector,
  GridFilterToolbarButton,
  GridToolbarContainer,
} from '@material-ui/data-grid';

export default function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridColumnsToolbarButton />
      <GridFilterToolbarButton />
      <GridDensitySelector />
    </GridToolbarContainer>
  );
}
