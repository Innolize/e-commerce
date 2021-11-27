import { Box, Container, Typography } from "@material-ui/core";

const NoMatch = () => {
  return (
    <Container>
      <Box textAlign="center" mt={6}>
        <Typography variant="h1">404</Typography>
      </Box>
      <Box textAlign="center" mt={2}>
        <Typography>Sorry, we couldn't find that page.</Typography>
      </Box>
    </Container>
  );
};

export default NoMatch;
