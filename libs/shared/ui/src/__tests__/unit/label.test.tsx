import { render, screen, userEvent } from '../utils';
import { Label } from '../../components/ui/label';

describe('Label', () => {
  describe('rendering', () => {
    it('should render children', () => {
      render(<Label>Label Text</Label>);
      expect(screen.getByText('Label Text')).toBeInTheDocument();
    });

    it('should render as label element', () => {
      render(<Label data-testid="label">Label</Label>);
      const label = screen.getByTestId('label');
      expect(label.tagName).toBe('LABEL');
    });

    it('should apply default styles', () => {
      render(<Label data-testid="label">Label</Label>);
      const label = screen.getByTestId('label');
      expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none');
    });

    it('should accept custom className', () => {
      render(<Label className="custom-label" data-testid="label">Label</Label>);
      expect(screen.getByTestId('label')).toHaveClass('custom-label');
    });
  });

  describe('htmlFor attribute', () => {
    it('should associate with input via htmlFor', () => {
      render(
        <div>
          <Label htmlFor="username">Username</Label>
          <input id="username" type="text" />
        </div>
      );

      const label = screen.getByText('Username');
      expect(label).toHaveAttribute('for', 'username');
    });

    it('should work with clicking label to focus input', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <Label htmlFor="email">Email</Label>
          <input id="email" type="email" />
        </div>
      );

      const label = screen.getByText('Email');
      const input = screen.getByRole('textbox');

      await user.click(label);
      expect(input).toHaveFocus();
    });
  });

  describe('peer-disabled styles', () => {
    it('should apply peer-disabled styles', () => {
      render(<Label data-testid="label">Label</Label>);
      const label = screen.getByTestId('label');
      expect(label).toHaveClass('peer-disabled:cursor-not-allowed', 'peer-disabled:opacity-70');
    });

    it('should work with disabled peer input', () => {
      render(
        <div>
          <input className="peer" disabled />
          <Label data-testid="label">Disabled Input Label</Label>
        </div>
      );

      // Just verify the classes are applied
      const label = screen.getByTestId('label');
      expect(label).toHaveClass('peer-disabled:cursor-not-allowed');
    });
  });

  describe('accessibility', () => {
    it('should support aria-label', () => {
      render(<Label aria-label="Custom label">Label</Label>);
      expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
    });

    it('should work as form label', () => {
      render(
        <form>
          <Label htmlFor="name">Name</Label>
          <input id="name" type="text" />
        </form>
      );

      expect(screen.getByLabelText('Name')).toBeInTheDocument();
    });
  });

  describe('ref forwarding', () => {
    it('should forward ref to label element', () => {
      const ref = jest.fn();
      render(<Label ref={ref}>Label</Label>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('use cases', () => {
    it('should work with input field', () => {
      render(
        <div>
          <Label htmlFor="username">Username</Label>
          <input id="username" type="text" placeholder="Enter username" />
        </div>
      );

      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    });

    it('should work with textarea', () => {
      render(
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea id="description" placeholder="Enter description" />
        </div>
      );

      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
    });

    it('should work with checkbox', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <input type="checkbox" id="terms" />
          <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>
      );

      const checkbox = screen.getByRole('checkbox');
      const label = screen.getByText('Accept terms and conditions');

      await user.click(label);
      expect(checkbox).toBeChecked();
    });

    it('should work with required field indicator', () => {
      render(
        <div>
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <input id="email" type="email" required />
        </div>
      );

      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('*')).toHaveClass('text-red-500');
    });
  });

  describe('multiple labels', () => {
    it('should render multiple labels', () => {
      render(
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <input id="firstName" type="text" />
          <Label htmlFor="lastName">Last Name</Label>
          <input id="lastName" type="text" />
        </div>
      );

      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Last Name')).toBeInTheDocument();
    });
  });

  describe('custom content', () => {
    it('should support complex children', () => {
      render(
        <Label>
          <span>Username</span>
          <span className="text-muted-foreground">(required)</span>
        </Label>
      );

      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByText('(required)')).toBeInTheDocument();
    });
  });
});
