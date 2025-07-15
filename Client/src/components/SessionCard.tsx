// components/SessionCard.tsx
import { Card, Typography, Button, Stack } from "@mui/material";
import type { Session } from "../types/session.ts";

type Props = {
  session: Session;
  isCurrent: boolean;
  onLogout: () => void;
};

const SessionCard = ({ session, isCurrent, onLogout }: Props) => {
  return (
    <Card sx={{ p: 2, mb: 2 }}>
      <Stack direction="row" justifyContent="space-between">
        <div>
          <Typography variant="body1">
            {session.userAgent || "Unknown Device"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            IP: {session.ipAddress || "Unknown"} <br />
            Expires: {new Date(session.expiresAt).toLocaleString()}
          </Typography>
        </div>
        <div>
          {!isCurrent && (
            <Button variant="outlined" color="error" onClick={onLogout}>
              Logout
            </Button>
          )}
          {isCurrent && (
            <Typography variant="caption" color="primary">
              Current Device
            </Typography>
          )}
        </div>
      </Stack>
    </Card>
  );
};

export default SessionCard;
