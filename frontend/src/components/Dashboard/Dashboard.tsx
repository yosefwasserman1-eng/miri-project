import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { ChatUI } from './ChatUI';
import { VersionTable } from './VersionTable';

export function Dashboard() {
    return (
        <Box className="h-full w-full">
            <Grid container spacing={3} className="h-full">
                {/* Left side: Version Table (Time-Travel) */}
                <Grid item xs={12} md={7} className="h-full flex flex-col">
                    <Box className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <VersionTable />
                    </Box>
                </Grid>

                {/* Right side: Chat UI (Conversational QA) */}
                <Grid item xs={12} md={5} className="h-full">
                    <ChatUI />
                </Grid>
            </Grid>
        </Box>
    );
}
