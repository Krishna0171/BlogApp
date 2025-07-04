import { Box, Container, Typography } from "@mui/material";
import LoginForm from "../../components/forms/LoginForm";

const Login = () => {
  return (
    <Container maxWidth="xs">
      <Box mt={8}>
        <Typography variant="h5" mb={2}>
          Login
        </Typography>
        <LoginForm />
      </Box>
    </Container>
  );
};

export default Login;
