import { Box, CircularProgress } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { JSXElementConstructor } from "react";
import {
  IBrand,
  ICabinet,
  ICategory,
  IDiskStorage,
  IMotherboard,
  IPowerSupply,
  IProcessor,
  IProduct,
  IRam,
  IVideoCard,
} from "src/types";

interface Props {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  rows?:
    | IMotherboard[]
    | ICabinet[]
    | IRam[]
    | IPowerSupply[]
    | IProcessor[]
    | IVideoCard[]
    | IProduct[]
    | IBrand[]
    | ICategory[]
    | IDiskStorage[];
  Table: JSXElementConstructor<any>;
  handleDelete: (id: string) => void;
}

const TableLayout = ({
  isLoading,
  isSuccess,
  isError,
  rows,
  Table,
  handleDelete,
}: Props) => {
  return (
    <Box>
      {isSuccess ? (
        <Table rows={rows} handleDelete={handleDelete} />
      ) : isLoading ? (
        <Box mt={5} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        isError && <DataGrid error rows={[]} columns={[]} />
      )}
    </Box>
  );
};

export default TableLayout;
