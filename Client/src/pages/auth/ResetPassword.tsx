import { Box, Container, Typography } from "@mui/material";
import ResetPasswordForm from "../../components/forms/ResetPasswordForm";

const ResetPassword = () => {
  return (
    <Container maxWidth="xs">
      <Box mt={8}>
        <Typography variant="h5" mb={2}>
          Reset Password
        </Typography>
        <ResetPasswordForm />
      </Box>
    </Container>
  );
};

export default ResetPassword;
