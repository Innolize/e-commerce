import { Box, Button, Typography } from '@material-ui/core';
import { Container } from '@material-ui/core';
import { DataGrid, GridColDef, GridCellParams } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import useProducts from '../../hooks/useProducts';
import CustomToolbar from '../../components/customToolbar';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    height: '500px',
    marginBottom: '50px',
  },
}));

const Products = () => {
  const classes = useStyles();
  const query = useProducts();

  return (
    <Container>
      <Box my={4} textAlign="center">
        <Typography variant="h3">Products</Typography>
      </Box>
      <Button>Add new</Button>
      <Box className={classes.gridContainer}>
        {query.isError ? (
          <DataGrid error rows={[]} columns={[]} />
        ) : (
          <DataGrid
            columns={
              [
                { field: 'id', type: 'number', width: 70 },
                { field: 'name', flex: 1 },
                { field: 'description', flex: 1 },
                { field: 'image' },
                { field: 'price' },
                { field: 'stock' },
                { field: 'category' },
                { field: 'brand' },
                {
                  field: 'actions',
                  sortable: false,
                  filterable: false,
                  width: 150,
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
                : query.data!.map((product: any) => ({
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    image: product.image,
                    price: product.price,
                    stock: product.stock ? 'Yes' : 'No',
                    category: product.category?.name || 'Not found',
                    brand: product.brand?.name || 'Not found',
                  }))
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

export default Products;
