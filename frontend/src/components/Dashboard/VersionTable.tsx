import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

// Mock schema from PRD
const mockVersions = [
    { id: 'v1', status: 'COMPLETED', date: '2026-02-26T20:00:00Z' },
    { id: 'v2', status: 'COMPLETED', date: '2026-02-26T20:05:00Z' }
];

export function VersionTable() {
    return (
        <Box className="flex flex-col h-full gap-4">
            <Box className="flex justify-between items-center">
                <Typography variant="h6" className="text-gray-800 font-semibold">Immutable Version History</Typography>
                <Button variant="outlined" size="small">Compare Versions</Button>
            </Box>
            <TableContainer component={Paper} className="shadow-none border border-gray-200">
                <Table size="small">
                    <TableHead className="bg-gray-50">
                        <TableRow>
                            <TableCell>Version ID</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Timestamp</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mockVersions.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell>{new Date(row.date).toLocaleTimeString('he-IL')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
