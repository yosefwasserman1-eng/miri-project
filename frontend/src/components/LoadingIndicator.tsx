import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

interface LoadingIndicatorProps {
    label?: string;
}

export function LoadingIndicator({ label }: LoadingIndicatorProps) {
    return (
        <Box className="flex flex-col items-center justify-center p-4 gap-2">
            <CircularProgress role="progressbar" size={40} />
            {label && (
                <Typography variant="body2" className="text-gray-600 animate-pulse">
                    {label}
                </Typography>
            )}
        </Box>
    );
}
