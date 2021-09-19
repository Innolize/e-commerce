import {
  Box,
  Button,
  Chip,
  CircularProgress,
  createStyles,
  Divider,
  Grid,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Pagination } from "@material-ui/lab";
import { AxiosResponse } from "axios";
import camelcaseKeys from "camelcase-keys";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { apiRoutes } from "src/hooks/apiRoutes";
import { IGetAllRams } from "src/hooks/types";
import api from "src/services/api";
import { IRam } from "src/types";
import currencyFormatter from "src/utils/formatCurrency";
import CustomImage from "src/components/CustomImage";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    card: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    chip: {
      margin: theme.spacing(0.5),
      textAlign: "left",
    },
    section1: {
      margin: theme.spacing(3, 2),
    },
    section2: {
      margin: theme.spacing(2),
    },
    section3: {
      display: "flex",
      justifyContent: "flex-end",
      margin: theme.spacing(3, 1, 1),
    },
  })
);

interface Props {
  ramVersion: string;
  setRam: React.Dispatch<React.SetStateAction<IRam | undefined>>;
  handleNext: () => void;
}

const LIMIT = 12;

const RamSelection = ({ ramVersion, setRam, handleNext }: Props) => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const queryRam = useQuery(
    [apiRoutes.ram.cacheString, { LIMIT, offset, ramVersion }],
    () =>
      api
        .get(apiRoutes.ram.route, { params: { limit: LIMIT, offset, ram_version: ramVersion } })
        .then((res: AxiosResponse) => {
          // converts the response to camelCase and this creates our entity
          const camelCaseResponse: IGetAllRams = camelcaseKeys(res.data, { deep: true });
          return camelCaseResponse;
        }),
    {
      staleTime: 60 * 5 * 1000, // 5 minutes
    }
  );

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setOffset((value - 1) * LIMIT);
  };

  if (queryRam.isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (queryRam.isSuccess && queryRam.data.results.length) {
    return (
      <Box>
        <div className={classes.root}>
          <Grid container spacing={3}>
            {queryRam.data.results.map((ram) => (
              <Grid item xs={3}>
                <Paper className={classes.card}>
                  <div className={classes.section1}>
                    <Grid container alignItems="center">
                      <Grid item xs>
                        <Box mt={2}>
                          <Typography variant="h5">{ram.product.name}</Typography>
                        </Box>
                      </Grid>
                      <Grid item>
                        <Box mt={2}>
                          <Typography gutterBottom variant="h6">
                            {currencyFormatter.format(ram.product.price)}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Typography color="textSecondary" variant="body2">
                      {ram.product.description}
                    </Typography>
                  </div>
                  <Box textAlign="center">
                    <CustomImage hasImage={!!ram.product.image} imageSrc={ram.product.image} />
                  </Box>
                  <Divider variant="middle" />
                  <div className={classes.section2}>
                    <Typography gutterBottom variant="body1">
                      Specifications
                    </Typography>
                    <Box display="flex" flexDirection="column" textAlign="left">
                      <Chip className={classes.chip} label={"Watts: " + ram.watts + "W"} />
                      <Chip className={classes.chip} label={"Memory: " + ram.memory} />
                      <Chip className={classes.chip} label={"Ram Version: " + ram.ramVersion} />
                    </Box>
                  </div>
                  <div className={classes.section3}>
                    <Box mb={2} mr={2}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setRam(ram);
                          handleNext();
                        }}
                        color="primary"
                      >
                        Add to build
                      </Button>
                    </Box>
                  </div>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </div>
        <Box display="flex" justifyContent="center" my={3}>
          <Pagination count={Math.ceil(queryRam.data.count / LIMIT)} page={page} onChange={handleChange} />
        </Box>
      </Box>
    );
  } else if (queryRam.isSuccess && queryRam.data.results.length === 0) {
    return (
      <Box my={6}>
        <Typography align="center">No products found</Typography>
      </Box>
    );
  }

  if (queryRam.isError) {
    return (
      <Box my={3} display="flex" justifyContent="center">
        <Typography variant="h5">Some error occurred loading the product.</Typography>
      </Box>
    );
  } else {
    return <></>;
  }
};

export default RamSelection;
