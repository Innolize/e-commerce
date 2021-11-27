import { Box, Breadcrumbs, Container, Link, Typography } from "@material-ui/core";
import { Redirect, useParams } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import CabinetTable from "src/components/PcBuildTables/CabinetTable";
import DiskStorageTable from "src/components/PcBuildTables/DiskStorageTable";
import MotherboardTable from "src/components/PcBuildTables/MotherboardTable";
import PowerSupplyTable from "src/components/PcBuildTables/PowerSupplyTable";
import ProcessorTable from "src/components/PcBuildTables/ProcessorTable";
import RamTable from "src/components/PcBuildTables/RamTable";
import VideoCardTable from "src/components/PcBuildTables/VideoCardTable";

interface ParamProps {
  category: string;
}

const PcBuildProducts = () => {
  const { category } = useParams<ParamProps>();

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
            <Link color="secondary" to="ram" component={RouterLink}>
              Ram
            </Link>
            <Link color="secondary" to="video-card" component={RouterLink}>
              Video Card
            </Link>
            <Link color="secondary" to="motherboard" component={RouterLink}>
              Motherboard
            </Link>
            <Link color="secondary" to="processor" component={RouterLink}>
              Processor
            </Link>
            <Link color="secondary" to="power-supply" component={RouterLink}>
              Power Supply
            </Link>
            <Link color="secondary" to="cabinet" component={RouterLink}>
              Cabinet
            </Link>
            <Link color="secondary" to="disk-storage" component={RouterLink}>
              Disk Storage
            </Link>
          </Breadcrumbs>
        </Box>
      </Box>
      <Box>{tableToRender[category] || <Redirect to="ram"></Redirect>}</Box>
    </Container>
  );
};

export default PcBuildProducts;
