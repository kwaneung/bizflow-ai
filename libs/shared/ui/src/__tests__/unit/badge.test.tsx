import { render, screen } from '../utils';
import { Badge, badgeVariants } from '../../components/ui/badge';

describe('Badge', () => {
  describe('rendering', () => {
    it('should render children', () => {
      render(<Badge>Badge Text</Badge>);
      expect(screen.getByText('Badge Text')).toBeInTheDocument();
    });

    it('should render as span element', () => {
      render(<Badge data-testid="badge">Badge</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.tagName).toBe('SPAN');
    });

    it('should apply default styles', () => {
      render(<Badge data-testid="badge">Badge</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
        'rounded-md',
        'border',
        'px-2',
        'text-xs',
        'font-medium'
      );
    });

    it('should accept custom className', () => {
      render(<Badge className="custom-badge" data-testid="badge">Badge</Badge>);
      expect(screen.getByTestId('badge')).toHaveClass('custom-badge');
    });

    it('should have data-slot attribute', () => {
      render(<Badge data-testid="badge">Badge</Badge>);
      expect(screen.getByTestId('badge')).toHaveAttribute('data-slot', 'badge');
    });
  });

  describe('variants', () => {
    it('should render with default variant', () => {
      render(<Badge variant="default" data-testid="badge">Default</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-primary', 'text-primary-foreground', 'border-transparent');
    });

    it('should render with secondary variant', () => {
      render(<Badge variant="secondary" data-testid="badge">Secondary</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground', 'border-transparent');
    });

    it('should render with destructive variant', () => {
      render(<Badge variant="destructive" data-testid="badge">Destructive</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-destructive', 'text-white', 'border-transparent');
    });

    it('should render with outline variant', () => {
      render(<Badge variant="outline" data-testid="badge">Outline</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('text-foreground', 'border-border');
    });

    it('should render with success variant', () => {
      render(<Badge variant="success" data-testid="badge">Success</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-emerald-500', 'text-white', 'border-transparent');
    });

    it('should render with warning variant', () => {
      render(<Badge variant="warning" data-testid="badge">Warning</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-amber-500', 'text-white', 'border-transparent');
    });

    it('should render with info variant', () => {
      render(<Badge variant="info" data-testid="badge">Info</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-blue-500', 'text-white', 'border-transparent');
    });
  });

  describe('content', () => {
    it('should render text content', () => {
      render(<Badge>New</Badge>);
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('should render with number', () => {
      render(<Badge>42</Badge>);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should support complex children', () => {
      render(
        <Badge>
          <span data-testid="icon">✓</span>
          <span>Verified</span>
        </Badge>
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('Verified')).toBeInTheDocument();
    });
  });

  describe('HTML attributes', () => {
    it('should support onClick handler', async () => {
      const handleClick = jest.fn();
      render(<Badge onClick={handleClick}>Clickable</Badge>);

      const badge = screen.getByText('Clickable');
      badge.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should support title attribute', () => {
      render(<Badge title="Badge tooltip">Badge</Badge>);
      expect(screen.getByTitle('Badge tooltip')).toBeInTheDocument();
    });

    it('should support data attributes', () => {
      render(<Badge data-value="test" data-testid="badge">Badge</Badge>);
      expect(screen.getByTestId('badge')).toHaveAttribute('data-value', 'test');
    });
  });

  describe('accessibility', () => {
    it('should support aria-label', () => {
      render(<Badge aria-label="Status badge">Active</Badge>);
      expect(screen.getByLabelText('Status badge')).toBeInTheDocument();
    });

    it('should support role attribute', () => {
      render(<Badge role="status" data-testid="badge">Status</Badge>);
      expect(screen.getByTestId('badge')).toHaveAttribute('role', 'status');
    });
  });

  describe('badgeVariants', () => {
    it('should generate correct classes for default variant', () => {
      const classes = badgeVariants();
      expect(classes).toContain('bg-primary');
      expect(classes).toContain('text-primary-foreground');
    });

    it('should generate correct classes for custom variant', () => {
      const classes = badgeVariants({ variant: 'success' });
      expect(classes).toContain('bg-emerald-500');
      expect(classes).toContain('text-white');
    });
  });

  describe('use cases', () => {
    it('should work as status indicator', () => {
      render(
        <div>
          <Badge variant="success">Active</Badge>
          <Badge variant="destructive">Inactive</Badge>
          <Badge variant="warning">Pending</Badge>
        </div>
      );

      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Inactive')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('should work as count badge', () => {
      render(<Badge variant="info">5 new messages</Badge>);
      expect(screen.getByText('5 new messages')).toBeInTheDocument();
    });
  });
});
