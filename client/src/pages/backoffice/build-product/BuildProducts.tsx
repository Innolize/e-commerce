import { Box, Breadcrumbs, Container, Link, Typography } from "@material-ui/core";
import { Redirect, useParams } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import CabinetContainer from "src/components/PcBuildContainers/CabinetContainer";
import DiskStorageContainer from "src/components/PcBuildContainers/DiskStorageContainer";
import MotherboardContainer from "src/components/PcBuildContainers/MotherboardContainer";
import PowerSupplyContainer from "src/components/PcBuildContainers/PowerSupplyContainer";
import ProcessorContainer from "src/components/PcBuildContainers/ProcessorContainer";
import RamContainer from "src/components/PcBuildContainers/RamContainer";
import VideoCardContainer from "src/components/PcBuildContainers/VideoCardContainer";

interface ParamProps {
  category: string;
}

const BuildProducts = () => {
  const { category } = useParams<ParamProps>();

  const formToRender = {
    ram: <RamContainer />,
    "video-card": <VideoCardContainer />,
    motherboard: <MotherboardContainer />,
    processor: <ProcessorContainer />,
    "power-supply": <PowerSupplyContainer />,
    cabinet: <CabinetContainer />,
    "disk-storage": <DiskStorageContainer />,
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
      <Box>{formToRender[category] || <Redirect to="ram"></Redirect>}</Box>
    </Container>
  );
};

export default BuildProducts;
