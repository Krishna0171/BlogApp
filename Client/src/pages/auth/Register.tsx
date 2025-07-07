import { Box, Container, Typography } from "@mui/material";
import RegisterForm from "../../components/forms/RegisterForm";

const Register = () => {
  return (
    <Container maxWidth="xs">
      <Box mt={8}>
        <Typography variant="h5" mb={2}>
          Register
        </Typography>
        <RegisterForm />
      </Box>
    </Container>
  );
};

export default Register;
