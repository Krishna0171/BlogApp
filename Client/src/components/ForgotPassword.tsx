import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import * as authService from "../services/authService";
import LoadingButton from "@mui/lab/LoadingButton";

type ForgotPasswordDialogProps = {
  open: boolean;
  onClose: () => void;
};

const ForgotPassword = ({ open, onClose }: ForgotPasswordDialogProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendResetLink = async () => {
    setLoading(true);
    const result = await authService.forgotPassword(email);
    setLoading(false);

    if (result.isSuccess) {
      toast.success("Reset link sent to your email.");
      setEmail("");
      onClose();
    } else {
      toast.error(result.Message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        setEmail("");
      }}
      fullWidth
    >
      <DialogTitle>Forgot Password</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Email"
          fullWidth
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Stack direction={["column","row"]} gap={2}>
          <Button
            variant="outlined"
            onClick={() => {
              onClose();
              setEmail("");
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handleSendResetLink}
            loading={loading}
            disabled={!email}
          >
            Send Reset Link
          </LoadingButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPassword;
