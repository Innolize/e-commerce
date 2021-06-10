import { Container } from "@material-ui/core";
import { useParams } from "react-router";
import EditCabinetForm from "src/components/Forms/editForms/EditCabinetForm";
import DiskStorageForm from "src/components/Forms/createForms/CreateDiskStorageForm";
import MotherboardForm from "src/components/Forms/createForms/CreateMotherboardForm";
import PowerSupplyForm from "src/components/Forms/createForms/CreatePowerSupplyForm";
import ProcessorForm from "src/components/Forms/createForms/CreateProcessorForm";
import RamForm from "src/components/Forms/createForms/CreateRamForm";
import VideoCardForm from "src/components/Forms/createForms/CreateVideoCardForm";

interface ParamProps {
  category: string;
  id: string;
}

const EditBuildProduct = () => {
  const { category, id } = useParams<ParamProps>();

  const formToRender = {
    ram: <RamForm />,
    "video-card": <VideoCardForm />,
    motherboard: <MotherboardForm />,
    processor: <ProcessorForm />,
    "power-supply": <PowerSupplyForm />,
    cabinet: <EditCabinetForm id={id} />,
    "disk-storage": <DiskStorageForm />,
  };

  return <Container>{formToRender[category]}</Container>;
};

export default EditBuildProduct;
