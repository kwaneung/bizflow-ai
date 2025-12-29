import { render, screen, userEvent } from '../utils';
import { Textarea } from '../../components/ui/textarea';
import * as React from 'react';

describe('Textarea', () => {
  describe('rendering', () => {
    it('should render textarea element', () => {
      render(<Textarea />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render as textarea tag', () => {
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('should render with placeholder', () => {
      render(<Textarea placeholder="Enter your message..." />);
      expect(screen.getByPlaceholderText('Enter your message...')).toBeInTheDocument();
    });

    it('should apply default styles', () => {
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass(
        'flex',
        'min-h-[80px]',
        'w-full',
        'rounded-md',
        'border',
        'border-input',
        'bg-background',
        'px-3',
        'py-2',
        'text-sm'
      );
    });

    it('should accept custom className', () => {
      render(<Textarea className="custom-textarea" data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveClass('custom-textarea');
    });
  });

  describe('interaction', () => {
    it('should handle onChange events', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(<Textarea onChange={handleChange} />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Hello World');

      expect(handleChange).toHaveBeenCalled();
      expect(textarea).toHaveValue('Hello World');
    });

    it('should handle onFocus events', async () => {
      const handleFocus = jest.fn();
      const user = userEvent.setup();

      render(<Textarea onFocus={handleFocus} />);

      await user.click(screen.getByRole('textbox'));
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('should handle onBlur events', async () => {
      const handleBlur = jest.fn();
      const user = userEvent.setup();

      render(<Textarea onBlur={handleBlur} />);

      const textarea = screen.getByRole('textbox');
      await user.click(textarea);
      await user.tab();

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should not accept input when disabled', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(<Textarea disabled onChange={handleChange} />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Hello');

      expect(handleChange).not.toHaveBeenCalled();
      expect(textarea).toHaveValue('');
    });

    it('should support multiline input', async () => {
      const user = userEvent.setup();

      render(<Textarea />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Line 1{Enter}Line 2{Enter}Line 3');

      expect(textarea).toHaveValue('Line 1\nLine 2\nLine 3');
    });
  });

  describe('state', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Textarea disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should apply disabled styles', () => {
      render(<Textarea disabled data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
    });

    it('should be readonly when readOnly prop is true', () => {
      render(<Textarea readOnly />);
      expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
    });

    it('should be required when required prop is true', () => {
      render(<Textarea required />);
      expect(screen.getByRole('textbox')).toBeRequired();
    });
  });

  describe('value handling', () => {
    it('should render with default value', () => {
      render(<Textarea defaultValue="Default text content" />);
      expect(screen.getByRole('textbox')).toHaveValue('Default text content');
    });

    it('should render with controlled value', () => {
      render(<Textarea value="Controlled value" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveValue('Controlled value');
    });

    it('should update controlled value', async () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        return <Textarea value={value} onChange={(e) => setValue(e.target.value)} />;
      };

      const user = userEvent.setup();
      render(<TestComponent />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'New value');

      expect(textarea).toHaveValue('New value');
    });
  });

  describe('sizing', () => {
    it('should have minimum height', () => {
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('min-h-[80px]');
    });

    it('should support custom height via className', () => {
      render(<Textarea className="min-h-[200px]" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('min-h-[200px]');
    });

    it('should support rows attribute', () => {
      render(<Textarea rows={5} data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveAttribute('rows', '5');
    });

    it('should support cols attribute', () => {
      render(<Textarea cols={50} data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveAttribute('cols', '50');
    });
  });

  describe('character limits', () => {
    it('should support maxLength attribute', () => {
      render(<Textarea maxLength={100} data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveAttribute('maxLength', '100');
    });

    it('should enforce maxLength', async () => {
      const user = userEvent.setup();

      render(<Textarea maxLength={10} />);

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      await user.type(textarea, 'This is a very long text that exceeds the limit');

      expect(textarea.value.length).toBeLessThanOrEqual(10);
    });
  });

  describe('accessibility', () => {
    it('should support aria-label', () => {
      render(<Textarea aria-label="Message input" />);
      expect(screen.getByLabelText('Message input')).toBeInTheDocument();
    });

    it('should support aria-describedby', () => {
      render(<Textarea aria-describedby="textarea-description" />);
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-describedby',
        'textarea-description'
      );
    });

    it('should support aria-invalid', () => {
      render(<Textarea aria-invalid="true" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('ref forwarding', () => {
    it('should forward ref to textarea element', () => {
      const ref = jest.fn();
      render(<Textarea ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('should allow focus via ref', () => {
      const ref = React.createRef<HTMLTextAreaElement>();
      render(<Textarea ref={ref} />);
      ref.current?.focus();
      expect(ref.current).toHaveFocus();
    });
  });

  describe('placeholder styles', () => {
    it('should apply placeholder styles', () => {
      render(<Textarea placeholder="Placeholder" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('placeholder:text-muted-foreground');
    });
  });

  describe('use cases', () => {
    it('should work as comment input', () => {
      render(
        <div>
          <label htmlFor="comment">Comment</label>
          <Textarea id="comment" placeholder="Write your comment..." />
        </div>
      );

      expect(screen.getByLabelText('Comment')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Write your comment...')).toBeInTheDocument();
    });

    it('should work in a form', async () => {
      const handleSubmit = jest.fn((e) => e.preventDefault());
      const user = userEvent.setup();

      render(
        <form onSubmit={handleSubmit}>
          <Textarea name="message" />
          <button type="submit">Submit</button>
        </form>
      );

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Test message');
      await user.click(screen.getByRole('button'));

      expect(handleSubmit).toHaveBeenCalled();
      expect(textarea).toHaveValue('Test message');
    });

    it('should work with error state', () => {
      render(
        <Textarea
          aria-invalid="true"
          className="border-red-500"
          data-testid="textarea"
        />
      );

      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
      expect(textarea).toHaveClass('border-red-500');
    });
  });

  describe('name attribute', () => {
    it('should support name attribute for forms', () => {
      render(<Textarea name="description" data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveAttribute('name', 'description');
    });
  });
});
