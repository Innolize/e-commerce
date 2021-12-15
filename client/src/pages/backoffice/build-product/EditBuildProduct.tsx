import { Container } from "@material-ui/core";
import { useParams } from "react-router";
import EditCabinetForm from "src/components/Forms/editForms/EditCabinetForm";
import EditDiskStorageForm from "src/components/Forms/editForms/EditDiskStorageForm";
import EditMotherboardForm from "src/components/Forms/editForms/EditMotherboardForm";
import EditPowerSupplyForm from "src/components/Forms/editForms/EditPowerSupplyForm";
import EditProcessorForm from "src/components/Forms/editForms/EditProcessorForm";
import EditRamForm from "src/components/Forms/editForms/EditRamForm";
import EditVideoCardForm from "src/components/Forms/editForms/EditVideoCardForm";

const EditBuildProduct = () => {
  const { category, id } = useParams();

  if (!category || !id) {
    return <></>;
  }

  const formToRender = {
    ram: <EditRamForm id={id} />,
    "video-card": <EditVideoCardForm id={id} />,
    motherboard: <EditMotherboardForm id={id} />,
    processor: <EditProcessorForm id={id} />,
    "power-supply": <EditPowerSupplyForm id={id} />,
    cabinet: <EditCabinetForm id={id} />,
    "disk-storage": <EditDiskStorageForm id={id} />,
  };

  return <Container>{formToRender[category]}</Container>;
};

export default EditBuildProduct;
