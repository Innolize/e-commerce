import { Container } from "@material-ui/core";
import { useParams } from "react-router";
import CabinetForm from "src/components/Forms/createForms/CreateCabinetForm";
import DiskStorageForm from "src/components/Forms/createForms/CreateDiskStorageForm";
import MotherboardForm from "src/components/Forms/createForms/CreateMotherboardForm";
import PowerSupplyForm from "src/components/Forms/createForms/CreatePowerSupplyForm";
import ProcessorForm from "src/components/Forms/createForms/CreateProcessorForm";
import RamForm from "src/components/Forms/createForms/CreateRamForm";
import VideoCardForm from "src/components/Forms/createForms/CreateVideoCardForm";

interface ParamProps {
  category: string;
}

const CreateBuildProduct = () => {
  const { category } = useParams<ParamProps>();

  const formToRender = {
    ram: <RamForm />,
    "video-card": <VideoCardForm />,
    motherboard: <MotherboardForm />,
    processor: <ProcessorForm />,
    "power-supply": <PowerSupplyForm />,
    cabinet: <CabinetForm />,
    "disk-storage": <DiskStorageForm />,
  };

  return <Container>{formToRender[category]}</Container>;
};

export default CreateBuildProduct;
