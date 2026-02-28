import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import { io } from 'socket.io-client';
import { LoadingIndicator } from '../LoadingIndicator';
import { requestImageGeneration, API_BASE } from '../../services/aiService';

interface ShotUpdatedPayload {
  event: string;
  shotId: string;
  versionId: string;
  status?: string;
  imageUrl?: string;
}

export function ChatUI() {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [lastShot, setLastShot] = useState<ShotUpdatedPayload | null>(null);

    useEffect(() => {
        const socket = io(API_BASE);
        socket.on('SHOT_UPDATED', (payload: ShotUpdatedPayload) => {
            setLastShot(payload);
            setLoading(false);
        });
        return () => {
            socket.off('SHOT_UPDATED');
            socket.disconnect();
        };
    }, []);

    async function handleSend() {
        const prompt = input.trim();
        if (!prompt || loading) return;

        setLoading(true);
        setLastShot(null);
        try {
            const res = await requestImageGeneration(prompt);
            if (!res.ok) {
                setLoading(false);
                return;
            }
            setInput('');
        } catch {
            setLoading(false);
        }
    }

    return (
        <Box className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
            <Box className="p-4 border-b border-gray-100 bg-gray-50">
                <Typography variant="h6" className="text-gray-800">QA Conversational Engine</Typography>
            </Box>
            <Box className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading && (
                    <Box className="flex justify-start">
                        <Box className="bg-gray-100 p-3 rounded-2xl rounded-tr-none max-w-[80%]">
                            <LoadingIndicator label="Generating image..." />
                        </Box>
                    </Box>
                )}
                {lastShot && (
                    <Box className="flex flex-col gap-2">
                        {lastShot.status && (
                            <Typography variant="body2" color="text.secondary">
                                Status: {lastShot.status}
                            </Typography>
                        )}
                        {lastShot.imageUrl && (
                            <Box component="img" src={lastShot.imageUrl} alt="Generated" sx={{ maxWidth: '100%', maxHeight: 320, borderRadius: 1 }} />
                        )}
                    </Box>
                )}
                {!loading && !lastShot && (
                    <Box className="flex justify-start">
                        <Box className="bg-gray-100 p-3 rounded-2xl rounded-tr-none max-w-[80%]">
                            <LoadingIndicator label="System is waiting for your instruction..." />
                        </Box>
                    </Box>
                )}
            </Box>
            <Box className="p-4 border-t border-gray-100 flex gap-2">
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter prompt or describe fixes..."
                    size="small"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                />
                <IconButton color="primary" aria-label="Send" onClick={handleSend} disabled={loading}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
}
