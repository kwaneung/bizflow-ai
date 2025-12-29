import { render, screen } from '../utils';
import { Spinner, spinnerVariants } from '../../components/ui/spinner';

describe('Spinner', () => {
  describe('rendering', () => {
    it('should render SVG element', () => {
      const { container } = render(<Spinner data-testid="spinner" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should have proper SVG attributes', () => {
      const { container } = render(<Spinner />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
      expect(svg).toHaveAttribute('fill', 'none');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('should apply animation class', () => {
      render(<Spinner data-testid="spinner" />);
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveClass('animate-spin');
    });

    it('should accept custom className', () => {
      render(<Spinner className="custom-spinner" data-testid="spinner" />);
      expect(screen.getByTestId('spinner')).toHaveClass('custom-spinner');
    });
  });

  describe('sizes', () => {
    it('should render with default size', () => {
      render(<Spinner size="default" data-testid="spinner" />);
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveClass('size-5');
    });

    it('should render with small size', () => {
      render(<Spinner size="sm" data-testid="spinner" />);
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveClass('size-4');
    });

    it('should render with large size', () => {
      render(<Spinner size="lg" data-testid="spinner" />);
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveClass('size-6');
    });

    it('should render with extra large size', () => {
      render(<Spinner size="xl" data-testid="spinner" />);
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveClass('size-8');
    });
  });

  describe('SVG structure', () => {
    it('should contain circle element', () => {
      const { container } = render(<Spinner />);
      const circle = container.querySelector('circle');
      expect(circle).toBeInTheDocument();
      expect(circle).toHaveAttribute('cx', '12');
      expect(circle).toHaveAttribute('cy', '12');
      expect(circle).toHaveAttribute('r', '10');
    });

    it('should contain path element', () => {
      const { container } = render(<Spinner />);
      const path = container.querySelector('path');
      expect(path).toBeInTheDocument();
      expect(path).toHaveAttribute('fill', 'currentColor');
    });

    it('should apply opacity to circle', () => {
      const { container } = render(<Spinner />);
      const circle = container.querySelector('circle');
      expect(circle).toHaveClass('opacity-25');
    });

    it('should apply opacity to path', () => {
      const { container } = render(<Spinner />);
      const path = container.querySelector('path');
      expect(path).toHaveClass('opacity-75');
    });
  });

  describe('color', () => {
    it('should use currentColor for stroke', () => {
      const { container } = render(<Spinner />);
      const circle = container.querySelector('circle');
      expect(circle).toHaveAttribute('stroke', 'currentColor');
    });

    it('should inherit text color', () => {
      render(<Spinner data-testid="spinner" />);
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveClass('text-current');
    });

    it('should support custom color via className', () => {
      render(<Spinner className="text-blue-500" data-testid="spinner" />);
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveClass('text-blue-500');
    });
  });

  describe('accessibility', () => {
    it('should support aria-label', () => {
      render(<Spinner aria-label="Loading..." data-testid="spinner" />);
      expect(screen.getByTestId('spinner')).toHaveAttribute('aria-label', 'Loading...');
    });

    it('should support role attribute', () => {
      render(<Spinner role="status" data-testid="spinner" />);
      expect(screen.getByTestId('spinner')).toHaveAttribute('role', 'status');
    });

    it('should support aria-hidden', () => {
      render(<Spinner aria-hidden="true" data-testid="spinner" />);
      expect(screen.getByTestId('spinner')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('spinnerVariants', () => {
    it('should generate correct classes for default size', () => {
      const classes = spinnerVariants();
      expect(classes).toContain('size-5');
      expect(classes).toContain('animate-spin');
    });

    it('should generate correct classes for custom size', () => {
      const classes = spinnerVariants({ size: 'xl' });
      expect(classes).toContain('size-8');
      expect(classes).toContain('animate-spin');
    });
  });

  describe('use cases', () => {
    it('should work as loading indicator', () => {
      render(
        <div data-testid="loading-container">
          <Spinner aria-label="Loading content..." />
          <span>Loading...</span>
        </div>
      );

      const container = screen.getByTestId('loading-container');
      expect(container).toHaveTextContent('Loading...');
    });

    it('should work in button', () => {
      render(
        <button disabled>
          <Spinner size="sm" aria-hidden="true" />
          <span>Loading</span>
        </button>
      );

      expect(screen.getByRole('button')).toBeDisabled();
      expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should work as centered loader', () => {
      render(
        <div className="flex items-center justify-center">
          <Spinner size="lg" aria-label="Loading page..." />
        </div>
      );

      // Just verify it renders without errors
      expect(document.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('SVG props', () => {
    it('should support additional SVG attributes', () => {
      render(<Spinner width="40" height="40" data-testid="spinner" />);
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('width', '40');
      expect(spinner).toHaveAttribute('height', '40');
    });

    it('should support title for accessibility', () => {
      const { container } = render(
        <Spinner aria-label="Loading spinner" data-testid="spinner" />
      );
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('aria-label', 'Loading spinner');
    });
  });
});
