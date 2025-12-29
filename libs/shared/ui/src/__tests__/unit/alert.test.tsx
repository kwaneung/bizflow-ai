import { render, screen } from '../utils';
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert';

describe('Alert Components', () => {
  describe('Alert', () => {
    it('should render children', () => {
      render(<Alert data-testid="alert">Alert content</Alert>);
      expect(screen.getByTestId('alert')).toHaveTextContent('Alert content');
    });

    it('should have alert role', () => {
      render(<Alert>Alert</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should apply default variant styles', () => {
      render(<Alert data-testid="alert">Alert</Alert>);
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('bg-card', 'text-foreground');
    });

    it('should apply base styles', () => {
      render(<Alert data-testid="alert">Alert</Alert>);
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('relative', 'w-full', 'rounded-lg', 'border', 'px-4', 'py-3');
    });

    it('should accept custom className', () => {
      render(<Alert className="custom-alert" data-testid="alert">Alert</Alert>);
      expect(screen.getByTestId('alert')).toHaveClass('custom-alert');
    });

    it('should have data-slot attribute', () => {
      render(<Alert data-testid="alert">Alert</Alert>);
      expect(screen.getByTestId('alert')).toHaveAttribute('data-slot', 'alert');
    });
  });

  describe('Alert variants', () => {
    it('should render with default variant', () => {
      render(<Alert variant="default" data-testid="alert">Default Alert</Alert>);
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('bg-card', 'text-foreground');
    });

    it('should render with destructive variant', () => {
      render(<Alert variant="destructive" data-testid="alert">Error Alert</Alert>);
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('text-destructive', 'bg-destructive/5', 'border-destructive/20');
    });

    it('should render with success variant', () => {
      render(<Alert variant="success" data-testid="alert">Success Alert</Alert>);
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('text-emerald-600', 'bg-emerald-50', 'border-emerald-200');
    });

    it('should render with warning variant', () => {
      render(<Alert variant="warning" data-testid="alert">Warning Alert</Alert>);
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('text-amber-600', 'bg-amber-50', 'border-amber-200');
    });

    it('should render with info variant', () => {
      render(<Alert variant="info" data-testid="alert">Info Alert</Alert>);
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('text-blue-600', 'bg-blue-50', 'border-blue-200');
    });
  });

  describe('AlertTitle', () => {
    it('should render children', () => {
      render(<AlertTitle>Alert Title</AlertTitle>);
      expect(screen.getByText('Alert Title')).toBeInTheDocument();
    });

    it('should apply default styles', () => {
      render(<AlertTitle data-testid="title">Title</AlertTitle>);
      const title = screen.getByTestId('title');
      expect(title).toHaveClass('col-start-2', 'line-clamp-1', 'min-h-4', 'font-medium', 'tracking-tight');
    });

    it('should accept custom className', () => {
      render(<AlertTitle className="custom-title" data-testid="title">Title</AlertTitle>);
      expect(screen.getByTestId('title')).toHaveClass('custom-title');
    });

    it('should have data-slot attribute', () => {
      render(<AlertTitle data-testid="title">Title</AlertTitle>);
      expect(screen.getByTestId('title')).toHaveAttribute('data-slot', 'alert-title');
    });
  });

  describe('AlertDescription', () => {
    it('should render children', () => {
      render(<AlertDescription>Alert description text</AlertDescription>);
      expect(screen.getByText('Alert description text')).toBeInTheDocument();
    });

    it('should apply default styles', () => {
      render(<AlertDescription data-testid="description">Description</AlertDescription>);
      const description = screen.getByTestId('description');
      expect(description).toHaveClass('col-start-2', 'grid', 'justify-items-start', 'gap-1', 'text-sm');
    });

    it('should accept custom className', () => {
      render(
        <AlertDescription className="custom-description" data-testid="description">
          Description
        </AlertDescription>
      );
      expect(screen.getByTestId('description')).toHaveClass('custom-description');
    });

    it('should have data-slot attribute', () => {
      render(<AlertDescription data-testid="description">Description</AlertDescription>);
      expect(screen.getByTestId('description')).toHaveAttribute('data-slot', 'alert-description');
    });
  });

  describe('Alert composition', () => {
    it('should render complete alert with title and description', () => {
      render(
        <Alert data-testid="alert">
          <AlertTitle data-testid="title">Error Occurred</AlertTitle>
          <AlertDescription data-testid="description">
            An error has occurred. Please try again later.
          </AlertDescription>
        </Alert>
      );

      expect(screen.getByTestId('alert')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toHaveTextContent('Error Occurred');
      expect(screen.getByTestId('description')).toHaveTextContent(
        'An error has occurred. Please try again later.'
      );
    });

    it('should render alert with only title', () => {
      render(
        <Alert>
          <AlertTitle>Simple Alert</AlertTitle>
        </Alert>
      );

      expect(screen.getByText('Simple Alert')).toBeInTheDocument();
    });

    it('should render alert with only description', () => {
      render(
        <Alert>
          <AlertDescription>Just a description</AlertDescription>
        </Alert>
      );

      expect(screen.getByText('Just a description')).toBeInTheDocument();
    });

    it('should render destructive alert with complete structure', () => {
      render(
        <Alert variant="destructive" data-testid="alert">
          <AlertTitle>Delete Account</AlertTitle>
          <AlertDescription>
            This action cannot be undone. This will permanently delete your account.
          </AlertDescription>
        </Alert>
      );

      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('text-destructive');
      expect(screen.getByText('Delete Account')).toBeInTheDocument();
      expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument();
    });

    it('should render success alert', () => {
      render(
        <Alert variant="success">
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>Your changes have been saved successfully.</AlertDescription>
        </Alert>
      );

      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(screen.getByText(/Your changes have been saved/)).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should maintain alert role with composition', () => {
      render(
        <Alert>
          <AlertTitle>Alert Title</AlertTitle>
          <AlertDescription>Alert Description</AlertDescription>
        </Alert>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should support additional aria attributes', () => {
      render(
        <Alert aria-live="polite" data-testid="alert">
          <AlertDescription>Message</AlertDescription>
        </Alert>
      );

      expect(screen.getByTestId('alert')).toHaveAttribute('aria-live', 'polite');
    });
  });
});
