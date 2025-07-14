// pages/SessionManager.tsx
import { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import * as sessionService from "../services/sessionService";
import SessionCard from "../components/SessionCard";
import { type Session } from "../types/Session";
import { useAuth } from "../hooks/useAuth";
import { confirmDialog } from "../utils/sweetAlert";

const SessionManager = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const { user } = useAuth();

  const loadSessions = async () => {
    const result = await sessionService.getAllSessions();
    if (result.isSuccess) {
      setSessions(result.Data);
    }
  };

  const handleLogout = async (sessionId: string) => {
    const confirmation = await confirmDialog({
      title: "Logout Confirmation!",
      text: "Are you sure you want to logout this device?",
    });
    await sessionService.logoutSession(sessionId);
    loadSessions();
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const currentSessionId = user?.sessionId;

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" mb={3}>
        Active Sessions
      </Typography>
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          isCurrent={session.id === currentSessionId}
          onLogout={() => handleLogout(session.id)}
        />
      ))}
    </Container>
  );
};

export default SessionManager;
