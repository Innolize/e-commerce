import { Box, Button, Container, Grid, Paper, Step, StepLabel, Stepper, Typography } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import BrandSelection from "src/components/PcBuild/BrandSelection";
import CabinetSelection from "src/components/PcBuild/CabinetSelection";
import DiskStorageSelection from "src/components/PcBuild/DiskStorageSelection";
import MotherboardSelection from "src/components/PcBuild/MotherboardSelection";
import PowerSupplySelection from "src/components/PcBuild/PowerSupplySelection";
import ProcessorSelection from "src/components/PcBuild/ProcessorsSelection";
import RamSelection from "src/components/PcBuild/RamSelection";
import VideoCardSelection from "src/components/PcBuild/VideoCardSelection";
import { UserContext } from "src/contexts/UserContext";
import { ICabinet, IDiskStorage, IMotherboard, IPowerSupply, IProcessor, IRam, IVideoCard } from "src/types";

type CpuBrand = "AMD" | "INTEL" | "";

const steps = [
  "Choose a CPU brand",
  "Choose a Motherboard",
  "Choose a Processor",
  "Choose RAM",
  "Choose a Video Card",
  "Choose a Storage device",
  "Choose a Cabinet",
  "Choose a Power Supply",
];

const Build = () => {
  const { user } = useContext(UserContext);
  const [activeStep, setActiveStep] = useState(0);
  const [cpuBrand, setCpuBrand] = useState<CpuBrand>("");
  const [motherboard, setMotherboard] = useState<IMotherboard | undefined>();
  const [processor, setProcessor] = useState<IProcessor | undefined>();
  const [ram, setRam] = useState<IRam | undefined>();
  const [videoCard, setVideoCard] = useState<IVideoCard | undefined>();
  const [diskStorage, setDiskStorage] = useState<IDiskStorage | undefined>();
  const [cabinet, setCabinet] = useState<ICabinet | undefined>();
  const [powerSupply, setPowerSupply] = useState<IPowerSupply | undefined>();

  const addProductsToCart = () => {
    //TODO
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleBack = () => {
    switch (activeStep) {
      case 1:
        setMotherboard(undefined);
        break;
      case 2:
        setProcessor(undefined);
        break;
      case 3:
        setRam(undefined);
        break;
      case 4:
        setVideoCard(undefined);
        break;
      case 5:
        setDiskStorage(undefined);
        break;
      case 6:
        setCabinet(undefined);
        break;
      case 7:
        setPowerSupply(undefined);
        break;
      default:
        console.error("Step not found.");
    }

    setActiveStep(activeStep - 1);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  return (
    <Container>
      <Box my={3}>
        <Typography component="h1" variant="h3" align="center">
          Build your pc
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={2}>
          <Box>
            {activeStep !== 0 && (
              <Button variant="contained" color="secondary" onClick={handleBack}>
                Go back
              </Button>
            )}
          </Box>
          <Box my={4}>
            <Stepper activeStep={activeStep} orientation="vertical" component={Paper}>
              <Step>
                <StepLabel>Brand: {cpuBrand}</StepLabel>
              </Step>
              <Step>
                <StepLabel>Motherboard: {motherboard?.product.name}</StepLabel>
              </Step>
              <Step>
                <StepLabel>Processor: {processor?.product.name}</StepLabel>
              </Step>
              <Step>
                <StepLabel>Ram: {ram?.product.name}</StepLabel>
              </Step>
              <Step>
                <StepLabel>Video Card: {videoCard?.product.name}</StepLabel>
              </Step>
              <Step>
                <StepLabel>Disk Storage: {diskStorage?.product.name}</StepLabel>
              </Step>
              <Step>
                <StepLabel>Cabinet: {cabinet?.product.name}</StepLabel>
              </Step>
              <Step>
                <StepLabel>Power Supply: {powerSupply?.product.name}</StepLabel>
              </Step>
            </Stepper>
          </Box>
        </Grid>
        <Grid item xs={10}>
          <Box my={3}>
            <Box my={2}>
              <Typography align="center" variant="h6">
                {steps[activeStep]}
              </Typography>
            </Box>
            {activeStep === steps.length ? (
              <Box>
                <Typography align="center" variant="h5" gutterBottom>
                  Your pc was built.
                </Typography>
                <Box my={3} textAlign="center">
                  <Button onClick={addProductsToCart} variant="contained">
                    Add pc parts to cart
                  </Button>
                </Box>
              </Box>
            ) : (
              <React.Fragment>
                {activeStep === 0 && <BrandSelection setCpuBrand={setCpuBrand} handleNext={handleNext} />}
                {activeStep === 1 && cpuBrand && (
                  <MotherboardSelection setMotherboard={setMotherboard} cpuBrand={cpuBrand} handleNext={handleNext} />
                )}
                {activeStep === 2 && motherboard && (
                  <ProcessorSelection
                    handleNext={handleNext}
                    setProcessor={setProcessor}
                    socket={motherboard.cpuSocket}
                  />
                )}
                {activeStep === 3 && motherboard && (
                  <RamSelection handleNext={handleNext} setRam={setRam} ramVersion={motherboard.ramVersion} />
                )}
                {activeStep === 4 && motherboard && (
                  <VideoCardSelection
                    handleNext={handleNext}
                    setVideoCard={setVideoCard}
                    videoVersion={motherboard.videoSocket}
                  />
                )}
                {activeStep === 5 && motherboard && (
                  <DiskStorageSelection handleNext={handleNext} setDiskStorage={setDiskStorage} />
                )}
                {activeStep === 6 && motherboard && (
                  <CabinetSelection handleNext={handleNext} setCabinet={setCabinet} />
                )}
                {activeStep === 7 && motherboard && (
                  <PowerSupplySelection handleNext={handleNext} setPowerSupply={setPowerSupply} />
                )}
              </React.Fragment>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Build;
