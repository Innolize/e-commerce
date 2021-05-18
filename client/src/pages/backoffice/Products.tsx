import { Box, Breadcrumbs, Button, Link, Typography } from "@material-ui/core";
import DeleteDialog from "../../components/DeleteDialogs/DeleteDialog";
import { Container } from "@material-ui/core";
import useDeleteProduct from "src/hooks/productHooks/generalProducts/useDeleteProduct";
import { useState } from "react";
import Alert from "@material-ui/lab/Alert";
import { Link as RouterLink } from "react-router-dom";
import { ICategory } from "src/types";
import useCategories from "src/hooks/categoryHooks/useCategories";
import useMotherboards from "src/hooks/productHooks/motherboard/useMotherboards";
import MotherboardTable from "src/components/Tables/MotherboardTable";
import useCabinets from "src/hooks/productHooks/cabinet/useCabinets";
import CabinetTable from "src/components/Tables/CabinetTable";
import {
  MOTHERBOARD_ID,
  CABINET_ID,
  RAM_ID,
  POWER_SUPPLY_ID,
  PROCESSOR_ID,
  VIDEO_CARD_ID,
  DISK_STORAGE_ID,
} from "../../utils/categoriesIds";
import TableLayout from "src/components/Tables/TableLayout";
import RamTable from "src/components/Tables/RamTable";
import useRams from "src/hooks/productHooks/ram/useRams";
import PowerSupplyTable from "src/components/Tables/PowerSupplyTable";
import usePowerSupplies from "src/hooks/productHooks/powerSupply/usePowerSupplies";
import useDiskStorage from "src/hooks/productHooks/diskStorage/useDiskStorage";
import useProcessors from "src/hooks/productHooks/processor/useProcessors";
import useVideoCards from "src/hooks/productHooks/videoCard/useVideoCards";
import ProcessorTable from "src/components/Tables/ProcessorTable";
import VideoCardTable from "src/components/Tables/VideoCardTable";
import DiskStorageTable from "src/components/Tables/DiskStorageTable";

const Products = () => {
  const queryCategories = useCategories();
  const [deleteId, setDeleteId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const deleteProduct = useDeleteProduct();
  const [category, setCategory] = useState(1);
  const queryMotherboard = useMotherboards(true);
  const queryCabinet = useCabinets(false);
  const queryRam = useRams(false);
  const queryPowerSupplies = usePowerSupplies(false);
  const queryVideoCard = useVideoCards(false);
  const queryProcessor = useProcessors(false);
  const queryDiskStorage = useDiskStorage(false);

  const handleClickDeleteBtn = (id: string) => {
    setOpen(true);
    setDeleteId(id);
  };

  const handleCategoryChange = (id: number | string) => {
    setCategory(Number(id));
    switch (id) {
      case MOTHERBOARD_ID:
        queryMotherboard.refetch();
        break;
      case CABINET_ID:
        queryCabinet.refetch();
        break;
      case RAM_ID:
        queryRam.refetch();
        break;
      case POWER_SUPPLY_ID:
        queryPowerSupplies.refetch();
        break;
      case PROCESSOR_ID:
        queryProcessor.refetch();
        break;
      case VIDEO_CARD_ID:
        queryVideoCard.refetch();
        break;
      case DISK_STORAGE_ID:
        queryDiskStorage.refetch();
        break;
      default:
        return;
    }
  };

  const handleDelete = () => {
    deleteProduct.mutate(deleteId);
    closeDialog();
  };

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Box my={4} textAlign="center">
        <Typography variant="h3">Products</Typography>
      </Box>

      <Box display="flex" justifyContent="center">
        <Breadcrumbs aria-label="breadcrumb">
          {queryCategories.isSuccess &&
            queryCategories.data.map((category: ICategory) => (
              <Link
                key={category.id}
                color="inherit"
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </Link>
            ))}
        </Breadcrumbs>
      </Box>

      {deleteProduct.isSuccess && (
        <Box my={2}>
          <Alert severity="success">Product deleted successfully</Alert>
        </Box>
      )}

      {deleteProduct.isError && (
        <Box my={2}>
          <Alert severity="error">{deleteProduct.error?.message}</Alert>
        </Box>
      )}

      <DeleteDialog
        toDelete="product"
        open={open}
        closeDialog={closeDialog}
        handleDelete={handleDelete}
      />

      <Button to="products/create" component={RouterLink}>
        Add new
      </Button>

      {category === MOTHERBOARD_ID && (
        <TableLayout
          Table={MotherboardTable}
          handleDelete={handleClickDeleteBtn}
          isLoading={queryMotherboard.isLoading}
          isSuccess={queryMotherboard.isSuccess}
          isError={queryMotherboard.isError}
          rows={queryMotherboard.data}
        />
      )}

      {category === CABINET_ID && (
        <TableLayout
          Table={CabinetTable}
          handleDelete={handleClickDeleteBtn}
          isLoading={queryCabinet.isLoading}
          isSuccess={queryCabinet.isSuccess}
          isError={queryCabinet.isError}
          rows={queryCabinet.data}
        />
      )}

      {category === RAM_ID && (
        <TableLayout
          Table={RamTable}
          handleDelete={handleClickDeleteBtn}
          isLoading={queryRam.isLoading}
          isSuccess={queryRam.isSuccess}
          isError={queryRam.isError}
          rows={queryRam.data}
        />
      )}

      {category === POWER_SUPPLY_ID && (
        <TableLayout
          Table={PowerSupplyTable}
          handleDelete={handleClickDeleteBtn}
          isLoading={queryPowerSupplies.isLoading}
          isSuccess={queryPowerSupplies.isSuccess}
          isError={queryPowerSupplies.isError}
          rows={queryPowerSupplies.data}
        />
      )}

      {category === PROCESSOR_ID && (
        <TableLayout
          Table={ProcessorTable}
          handleDelete={handleClickDeleteBtn}
          isLoading={queryProcessor.isLoading}
          isSuccess={queryProcessor.isSuccess}
          isError={queryProcessor.isError}
          rows={queryProcessor.data}
        />
      )}

      {category === VIDEO_CARD_ID && (
        <TableLayout
          Table={VideoCardTable}
          handleDelete={handleClickDeleteBtn}
          isLoading={queryVideoCard.isLoading}
          isSuccess={queryVideoCard.isSuccess}
          isError={queryVideoCard.isError}
          rows={queryVideoCard.data}
        />
      )}

      {category === DISK_STORAGE_ID && (
        <TableLayout
          Table={DiskStorageTable}
          handleDelete={handleClickDeleteBtn}
          isLoading={queryDiskStorage.isLoading}
          isSuccess={queryDiskStorage.isSuccess}
          isError={queryDiskStorage.isError}
          rows={queryDiskStorage.data}
        />
      )}
    </Container>
  );
};

export default Products;
