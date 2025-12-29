import { render, screen } from '../utils';
import { Skeleton } from '../../components/ui/skeleton';

describe('Skeleton', () => {
  describe('rendering', () => {
    it('should render as div element', () => {
      render(<Skeleton data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton.tagName).toBe('DIV');
    });

    it('should apply default styles', () => {
      render(<Skeleton data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('bg-accent', 'animate-pulse', 'rounded-md');
    });

    it('should accept custom className', () => {
      render(<Skeleton className="custom-skeleton" data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveClass('custom-skeleton');
    });

    it('should have data-slot attribute', () => {
      render(<Skeleton data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveAttribute('data-slot', 'skeleton');
    });
  });

  describe('custom sizing', () => {
    it('should support custom width via className', () => {
      render(<Skeleton className="w-full" data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveClass('w-full');
    });

    it('should support custom height via className', () => {
      render(<Skeleton className="h-10" data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveClass('h-10');
    });

    it('should support combined width and height', () => {
      render(<Skeleton className="w-40 h-10" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('w-40', 'h-10');
    });

    it('should support circle shape', () => {
      render(<Skeleton className="rounded-full w-12 h-12" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('rounded-full', 'w-12', 'h-12');
    });
  });

  describe('content', () => {
    it('should render without children', () => {
      const { container } = render(<Skeleton data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.textContent).toBe('');
    });

    it('should support children if needed', () => {
      render(
        <Skeleton data-testid="skeleton">
          <span>Hidden content</span>
        </Skeleton>
      );
      expect(screen.getByTestId('skeleton')).toContainElement(screen.getByText('Hidden content'));
    });
  });

  describe('HTML attributes', () => {
    it('should support data attributes', () => {
      render(<Skeleton data-value="test" data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveAttribute('data-value', 'test');
    });

    it('should support style attribute', () => {
      render(<Skeleton style={{ width: '100px' }} data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveStyle({ width: '100px' });
    });
  });

  describe('accessibility', () => {
    it('should support aria-label', () => {
      render(<Skeleton aria-label="Loading content" data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-label', 'Loading content');
    });

    it('should support aria-busy', () => {
      render(<Skeleton aria-busy="true" data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-busy', 'true');
    });

    it('should support role attribute', () => {
      render(<Skeleton role="status" data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveAttribute('role', 'status');
    });
  });

  describe('use cases', () => {
    it('should work as text skeleton', () => {
      render(
        <div>
          <Skeleton className="h-4 w-[250px]" data-testid="skeleton" />
          <Skeleton className="h-4 w-[200px] mt-2" />
        </div>
      );

      expect(screen.getByTestId('skeleton')).toHaveClass('h-4', 'w-[250px]');
    });

    it('should work as avatar skeleton', () => {
      render(
        <Skeleton className="h-12 w-12 rounded-full" data-testid="skeleton" />
      );

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('h-12', 'w-12', 'rounded-full');
    });

    it('should work as card skeleton', () => {
      render(
        <div className="space-y-2">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      );

      const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons).toHaveLength(3);
    });

    it('should work as button skeleton', () => {
      render(<Skeleton className="h-10 w-24 rounded-md" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('h-10', 'w-24', 'rounded-md');
    });

    it('should work in list loading state', () => {
      render(
        <div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      );

      const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons).toHaveLength(9); // 3 items × 3 skeletons each
    });

    it('should work as table row skeleton', () => {
      render(
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      );

      const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons).toHaveLength(3);
    });
  });

  describe('animation', () => {
    it('should have pulse animation', () => {
      render(<Skeleton data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveClass('animate-pulse');
    });

    it('should allow custom animation via className', () => {
      render(
        <Skeleton className="animate-none" data-testid="skeleton" />
      );
      expect(screen.getByTestId('skeleton')).toHaveClass('animate-none');
    });
  });

  describe('variants', () => {
    it('should support rectangular skeleton (default)', () => {
      render(<Skeleton className="w-full h-10" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('rounded-md');
    });

    it('should support circular skeleton', () => {
      render(<Skeleton className="rounded-full w-10 h-10" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('rounded-full');
    });

    it('should support text line skeleton', () => {
      render(<Skeleton className="h-4 w-3/4" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('h-4', 'w-3/4');
    });
  });

  describe('composition', () => {
    it('should work in complex layouts', () => {
      render(
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" data-testid="image-skeleton" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" data-testid="title-skeleton" />
            <Skeleton className="h-4 w-[200px]" data-testid="description-skeleton" />
          </div>
        </div>
      );

      expect(screen.getByTestId('image-skeleton')).toBeInTheDocument();
      expect(screen.getByTestId('title-skeleton')).toBeInTheDocument();
      expect(screen.getByTestId('description-skeleton')).toBeInTheDocument();
    });
  });
});
