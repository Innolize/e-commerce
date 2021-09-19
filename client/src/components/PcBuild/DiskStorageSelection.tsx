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
import CustomImage from "src/components/CustomImage";
import { apiRoutes } from "src/hooks/apiRoutes";
import { IGetAllDiskStorages } from "src/hooks/types";
import api from "src/services/api";
import { IDiskStorage } from "src/types";
import currencyFormatter from "src/utils/formatCurrency";

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
  setDiskStorage: React.Dispatch<React.SetStateAction<IDiskStorage | undefined>>;
  handleNext: () => void;
}

const LIMIT = 12;

const DiskStorageSelection = ({ setDiskStorage, handleNext }: Props) => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const queryDiskStorage = useQuery(
    [apiRoutes["disk-storage"].cacheString, { LIMIT, offset }],
    () =>
      api.get(apiRoutes["disk-storage"].route, { params: { limit: LIMIT, offset } }).then((res: AxiosResponse) => {
        // converts the response to camelCase and this creates our entity
        const camelCaseResponse: IGetAllDiskStorages = camelcaseKeys(res.data, { deep: true });
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

  if (queryDiskStorage.isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (queryDiskStorage.isSuccess && queryDiskStorage.data.results.length) {
    return (
      <Box>
        <div className={classes.root}>
          <Grid container spacing={3}>
            {queryDiskStorage.data.results.map((diskStorage) => (
              <Grid item xs={3}>
                <Paper className={classes.card}>
                  <div className={classes.section1}>
                    <Grid container alignItems="center">
                      <Grid item xs>
                        <Box mt={2}>
                          <Typography variant="h5">{diskStorage.product.name}</Typography>
                        </Box>
                      </Grid>
                      <Grid item>
                        <Box mt={2}>
                          <Typography gutterBottom variant="h6">
                            {currencyFormatter.format(diskStorage.product.price)}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Typography color="textSecondary" variant="body2">
                      {diskStorage.product.description}
                    </Typography>
                  </div>
                  <Box textAlign="center">
                    <CustomImage hasImage={!!diskStorage.product.image} imageSrc={diskStorage.product.image} />
                  </Box>
                  <Divider variant="middle" />
                  <div className={classes.section2}>
                    <Typography gutterBottom variant="body1">
                      Specifications
                    </Typography>
                    <Box display="flex" flexDirection="column" textAlign="left">
                      <Chip className={classes.chip} label={"Watts: " + diskStorage.watts + "W"} />
                      <Chip className={classes.chip} label={"Total Storage: " + diskStorage.totalStorage + "GB"} />
                      <Chip className={classes.chip} label={"Type: " + diskStorage.type} />
                      <Chip className={classes.chip} label={"Mb/s: " + diskStorage.mbs} />
                    </Box>
                  </div>
                  <div className={classes.section3}>
                    <Box mb={2} mr={2}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setDiskStorage(diskStorage);
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
          <Pagination count={Math.ceil(queryDiskStorage.data.count / LIMIT)} page={page} onChange={handleChange} />
        </Box>
      </Box>
    );
  } else if (queryDiskStorage.isSuccess && queryDiskStorage.data.results.length === 0) {
    return (
      <Box my={6}>
        <Typography align="center">No products found</Typography>
      </Box>
    );
  }

  if (queryDiskStorage.isError) {
    return (
      <Box my={3} display="flex" justifyContent="center">
        <Typography variant="h5">Some error occurred loading the product.</Typography>
      </Box>
    );
  } else {
    return <></>;
  }
};

export default DiskStorageSelection;
