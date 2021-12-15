import { Box, Breadcrumbs, Container, Link, Typography } from "@material-ui/core";
import { Navigate, useParams } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import CabinetTable from "src/components/PcBuildTables/CabinetTable";
import DiskStorageTable from "src/components/PcBuildTables/DiskStorageTable";
import MotherboardTable from "src/components/PcBuildTables/MotherboardTable";
import PowerSupplyTable from "src/components/PcBuildTables/PowerSupplyTable";
import ProcessorTable from "src/components/PcBuildTables/ProcessorTable";
import RamTable from "src/components/PcBuildTables/RamTable";
import VideoCardTable from "src/components/PcBuildTables/VideoCardTable";

const PcBuildProducts = () => {
  const { category } = useParams();

  const tableToRender = {
    ram: <RamTable />,
    "video-card": <VideoCardTable />,
    motherboard: <MotherboardTable />,
    processor: <ProcessorTable />,
    "power-supply": <PowerSupplyTable />,
    cabinet: <CabinetTable />,
    "disk-storage": <DiskStorageTable />,
  };

  return (
    <Container>
      <Box>
        <Box textAlign="center" my={4}>
          <Typography variant="h3">Pc-build Products</Typography>
        </Box>
        <Box my={2} display="flex" justifyContent="center">
          <Breadcrumbs>
            <Link color="secondary" to="/admin/build/ram" component={RouterLink}>
              Ram
            </Link>
            <Link color="secondary" to="/admin/build/video-card" component={RouterLink}>
              Video Card
            </Link>
            <Link color="secondary" to="/admin/build/motherboard" component={RouterLink}>
              Motherboard
            </Link>
            <Link color="secondary" to="/admin/build/processor" component={RouterLink}>
              Processor
            </Link>
            <Link color="secondary" to="/admin/build/power-supply" component={RouterLink}>
              Power Supply
            </Link>
            <Link color="secondary" to="/admin/build/cabinet" component={RouterLink}>
              Cabinet
            </Link>
            <Link color="secondary" to="/admin/build/disk-storage" component={RouterLink}>
              Disk Storage
            </Link>
          </Breadcrumbs>
        </Box>
      </Box>
      {!!category && <Box>{tableToRender[category] || <Navigate to="ram"></Navigate>}</Box>}
    </Container>
  );
};

export default PcBuildProducts;
