import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingIndicator } from './LoadingIndicator';

describe('LoadingIndicator', () => {
    it('renders without crashing', () => {
        render(<LoadingIndicator />);
        // We expect the progress indicator to be present
        const progress = screen.getByRole('progressbar');
        expect(progress).toBeInTheDocument();
    });

    it('displays optional label', () => {
        const label = 'Generating video...';
        render(<LoadingIndicator label={label} />);
        expect(screen.getByText(label)).toBeInTheDocument();
    });
});
