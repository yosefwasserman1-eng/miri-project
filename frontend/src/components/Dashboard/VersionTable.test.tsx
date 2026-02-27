import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VersionTable } from './VersionTable';
import { RTLProvider } from '../../RTLProvider';

describe('VersionTable Component', () => {
    it('should render the immutable version history table', () => {
        render(
            <RTLProvider>
                <VersionTable />
            </RTLProvider>
        );

        // Assert that the title exists
        expect(screen.getByText('Immutable Version History')).toBeInTheDocument();

        // Check that we have the correct headers
        expect(screen.getByText('Version ID')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('Timestamp')).toBeInTheDocument();

        // Red Phase Requirement: Verify the "Compare Versions" button exists
        // The current UI does not have this button, so it will fail as intended.
        const compareButton = screen.getByRole('button', { name: /compare versions/i });
        expect(compareButton).toBeInTheDocument();
    });
});
