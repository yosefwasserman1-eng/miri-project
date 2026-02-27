import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import { LoadingIndicator } from '../LoadingIndicator';

export function ChatUI() {
    return (
        <Box className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
            <Box className="p-4 border-b border-gray-100 bg-gray-50">
                <Typography variant="h6" className="text-gray-800">QA Conversational Engine</Typography>
            </Box>
            <Box className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Visual state for pending generation */}
                <Box className="flex justify-start">
                    <Box className="bg-gray-100 p-3 rounded-2xl rounded-tr-none max-w-[80%]">
                        <LoadingIndicator label="System is waiting for your instruction..." />
                    </Box>
                </Box>
            </Box>
            <Box className="p-4 border-t border-gray-100 flex gap-2">
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter prompt or describe fixes..."
                    size="small"
                />
                <IconButton color="primary" aria-label="Send">
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
}
