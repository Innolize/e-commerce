import { Box, Button, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid, GridCellParams, GridColDef } from '@material-ui/data-grid';
import CustomToolbar from '../../components/customToolbar';
import useCategories from '../../hooks/useCategories';

const useStyles = makeStyles(() => ({
  gridContainer: {
    height: '500px',
    marginBottom: '50px',
  },
}));

const Categories = () => {
  const classes = useStyles();
  const query = useCategories();

  return (
    <Container>
      <Box my={4} textAlign="center">
        <Typography variant="h3">Categories</Typography>
      </Box>
      <Button>Add new</Button>
      <Box className={classes.gridContainer}>
        {query.isError ? (
          <DataGrid error rows={[]} columns={[]} />
        ) : (
          <DataGrid
            columns={
              [
                { field: 'id', type: 'number', width: 80 },
                { field: 'name', flex: 1 },
                {
                  field: 'actions',
                  sortable: false,
                  filterable: false,
                  flex: 1,
                  renderCell: (params: GridCellParams) => (
                    <div>
                      <Button>Edit</Button>
                      <Button>Delete</Button>
                    </div>
                  ),
                },
              ] as GridColDef[]
            }
            rows={
              query.isLoading
                ? []
                : query.data!.map((category: any) => ({ id: category.id, name: category.name }))
            }
            loading={query.isLoading}
            components={{
              Toolbar: CustomToolbar,
            }}
          />
        )}
      </Box>
    </Container>
  );
};

export default Categories;
