import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@material-ui/core";
import { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import OrderRow from "src/components/OrderRow";
import { UserContext } from "src/contexts/UserContext";
import { IGetAllOrders } from "src/hooks/types";
import useGetAll from "src/hooks/useGetAll";

const Orders = () => {
  const LIMIT = 12;
  const [page, setPage] = useState(0);
  const [offset, setOffset] = useState(0);
  const { user } = useContext(UserContext);
  const queryOrders = useGetAll<IGetAllOrders>("order", offset, LIMIT);

  if (!user) {
    return <Redirect to="/login" />;
  }

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
    setPage(page);
    setOffset(page * LIMIT);
  };

  return (
    <Container>
      <Box my={4}>
        <Box my={3}>
          <Typography align="center" variant="h3">
            Orders
          </Typography>
        </Box>
        <Box my={6}>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Order Id</TableCell>
                  <TableCell align="right">Payment Type</TableCell>
                  <TableCell align="right">Payment Status</TableCell>
                  <TableCell align="right">Total Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {queryOrders.isSuccess && !!queryOrders.data.results.length ? (
                  queryOrders.data.results.map((order) => <OrderRow key={order.id} order={order} />)
                ) : (
                  <TableRow>
                    <TableCell variant="head" align="center" colSpan={12}>
                      <Box my={2}>
                        <Typography variant="h5">No orders found</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[]}
                    page={page}
                    rowsPerPage={LIMIT}
                    count={queryOrders.data?.count || 0}
                    onPageChange={handlePageChange}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Container>
  );
};

export default Orders;
