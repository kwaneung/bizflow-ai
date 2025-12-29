import { render, screen } from '../utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../../components/ui/card';

describe('Card Components', () => {
  describe('Card', () => {
    it('should render children', () => {
      render(
        <Card data-testid="card">
          <div>Card content</div>
        </Card>
      );
      expect(screen.getByTestId('card')).toHaveTextContent('Card content');
    });

    it('should apply default styles', () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('rounded-lg', 'border', 'bg-card', 'shadow-sm');
    });

    it('should accept custom className', () => {
      render(<Card className="custom-card" data-testid="card">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('custom-card');
    });

    it('should forward ref', () => {
      const ref = jest.fn();
      render(<Card ref={ref}>Content</Card>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('CardHeader', () => {
    it('should render children', () => {
      render(
        <CardHeader data-testid="header">
          <div>Header content</div>
        </CardHeader>
      );
      expect(screen.getByTestId('header')).toHaveTextContent('Header content');
    });

    it('should apply default styles', () => {
      render(<CardHeader data-testid="header">Content</CardHeader>);
      const header = screen.getByTestId('header');
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6');
    });

    it('should accept custom className', () => {
      render(<CardHeader className="custom-header" data-testid="header">Content</CardHeader>);
      expect(screen.getByTestId('header')).toHaveClass('custom-header');
    });

    it('should forward ref', () => {
      const ref = jest.fn();
      render(<CardHeader ref={ref}>Content</CardHeader>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('CardTitle', () => {
    it('should render as h3 element', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByText('Title');
      expect(title.tagName).toBe('H3');
    });

    it('should render children', () => {
      render(<CardTitle>Card Title</CardTitle>);
      expect(screen.getByText('Card Title')).toBeInTheDocument();
    });

    it('should apply default styles', () => {
      render(<CardTitle data-testid="title">Title</CardTitle>);
      const title = screen.getByTestId('title');
      expect(title).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight');
    });

    it('should accept custom className', () => {
      render(<CardTitle className="custom-title" data-testid="title">Title</CardTitle>);
      expect(screen.getByTestId('title')).toHaveClass('custom-title');
    });

    it('should forward ref', () => {
      const ref = jest.fn();
      render(<CardTitle ref={ref}>Title</CardTitle>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('CardDescription', () => {
    it('should render as p element', () => {
      render(<CardDescription>Description</CardDescription>);
      const description = screen.getByText('Description');
      expect(description.tagName).toBe('P');
    });

    it('should render children', () => {
      render(<CardDescription>Card description text</CardDescription>);
      expect(screen.getByText('Card description text')).toBeInTheDocument();
    });

    it('should apply default styles', () => {
      render(<CardDescription data-testid="description">Description</CardDescription>);
      const description = screen.getByTestId('description');
      expect(description).toHaveClass('text-sm', 'text-muted-foreground');
    });

    it('should accept custom className', () => {
      render(
        <CardDescription className="custom-description" data-testid="description">
          Description
        </CardDescription>
      );
      expect(screen.getByTestId('description')).toHaveClass('custom-description');
    });

    it('should forward ref', () => {
      const ref = jest.fn();
      render(<CardDescription ref={ref}>Description</CardDescription>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('CardContent', () => {
    it('should render children', () => {
      render(<CardContent data-testid="content">Content text</CardContent>);
      expect(screen.getByTestId('content')).toHaveTextContent('Content text');
    });

    it('should apply default styles', () => {
      render(<CardContent data-testid="content">Content</CardContent>);
      const content = screen.getByTestId('content');
      expect(content).toHaveClass('p-6', 'pt-0');
    });

    it('should accept custom className', () => {
      render(<CardContent className="custom-content" data-testid="content">Content</CardContent>);
      expect(screen.getByTestId('content')).toHaveClass('custom-content');
    });

    it('should forward ref', () => {
      const ref = jest.fn();
      render(<CardContent ref={ref}>Content</CardContent>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('CardFooter', () => {
    it('should render children', () => {
      render(<CardFooter data-testid="footer">Footer content</CardFooter>);
      expect(screen.getByTestId('footer')).toHaveTextContent('Footer content');
    });

    it('should apply default styles', () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>);
      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
    });

    it('should accept custom className', () => {
      render(<CardFooter className="custom-footer" data-testid="footer">Footer</CardFooter>);
      expect(screen.getByTestId('footer')).toHaveClass('custom-footer');
    });

    it('should forward ref', () => {
      const ref = jest.fn();
      render(<CardFooter ref={ref}>Footer</CardFooter>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Card composition', () => {
    it('should render complete card structure', () => {
      render(
        <Card data-testid="card">
          <CardHeader data-testid="header">
            <CardTitle data-testid="title">Test Card</CardTitle>
            <CardDescription data-testid="description">
              This is a test card description
            </CardDescription>
          </CardHeader>
          <CardContent data-testid="content">
            <p>Card main content goes here</p>
          </CardContent>
          <CardFooter data-testid="footer">
            <button>Action</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toHaveTextContent('Test Card');
      expect(screen.getByTestId('description')).toHaveTextContent(
        'This is a test card description'
      );
      expect(screen.getByTestId('content')).toHaveTextContent('Card main content goes here');
      expect(screen.getByTestId('footer')).toContainElement(screen.getByRole('button'));
    });

    it('should work with partial composition', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Simple Card</CardTitle>
          </CardHeader>
          <CardContent>Content only</CardContent>
        </Card>
      );

      expect(screen.getByText('Simple Card')).toBeInTheDocument();
      expect(screen.getByText('Content only')).toBeInTheDocument();
    });
  });
});
