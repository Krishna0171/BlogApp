import { Container, TextField, Button, Typography, Box } from '@mui/material';

const Login = () => (
  <Container maxWidth="sm">
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <form>
        <TextField fullWidth label="Email" margin="normal" required/>
        <TextField fullWidth label="Password" type="password" margin="normal" required/>
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
    </Box>
  </Container>
);

export default Login;
