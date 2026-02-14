import React from 'react';
import { Typography, Card, CardContent, Box, Chip } from "@mui/material";

import { mockData } from '../../utils/mockData';
import { mockUsers } from '../../../mockData';

const DashboardMain: React.FC = () => {
  return (
    <div className="dashboard-main">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>
      
      <main className="dashboard-content">
        <Box >
            <Typography variant="h3" gutterBottom>
                Dashboard Psiholog
            </Typography>

            {mockUsers.map((user) => (
                <Card key={user.id} sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h5">{user.username}</Typography>
                    <Typography variant="subtitle2">{user.email}</Typography>

                    <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Jurnale:</Typography>
                    {user.journals.map((j) => (
                        <Card key={j.id} sx={{ mb: 2, p: 2 }}>
                        <Typography>{j.content}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Emoție dominantă: {j.analysis.dominantEmotion} | Tipare: {j.analysis.cognitiveDistortion} | Scor risc: {j.analysis.riskScore}
                        </Typography>
                        </Card>
                    ))}
                    </Box>

                    {user.alerts.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Alerte:</Typography>
                        {user.alerts.map((a) => (
                        <Chip key={a.id} label={a.message} color={a.level === "critical" ? "error" : "warning"} sx={{ mr: 1 }} />
                        ))}
                    </Box>
                    )}
                </CardContent>
                </Card>
            ))}
        </Box>
      </main>
    </div>
  );
};

export default DashboardMain;
