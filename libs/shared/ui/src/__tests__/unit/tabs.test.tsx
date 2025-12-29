import { render, screen, userEvent } from '../utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';

describe('Tabs Components', () => {
  describe('Tabs (Root)', () => {
    it('should render children', () => {
      render(
        <Tabs defaultValue="tab1" data-testid="tabs">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      );

      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });

    it('should render with defaultValue', () => {
      render(
        <Tabs defaultValue="tab2">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      // Tab 2 should be active by default
      expect(screen.getByText('Content 2')).toBeVisible();
    });

    it('should support controlled value', () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('tab1');
        return (
          <Tabs value={value} onValueChange={setValue}>
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content 1</TabsContent>
            <TabsContent value="tab2">Content 2</TabsContent>
          </Tabs>
        );
      };

      render(<TestComponent />);
      expect(screen.getByText('Content 1')).toBeVisible();
    });
  });

  describe('TabsList', () => {
    it('should render trigger buttons', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList data-testid="tabs-list">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const list = screen.getByTestId('tabs-list');
      expect(list).toBeInTheDocument();
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
    });

    it('should apply default styles', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList data-testid="tabs-list">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const list = screen.getByTestId('tabs-list');
      expect(list).toHaveClass(
        'inline-flex',
        'h-10',
        'items-center',
        'justify-center',
        'rounded-md',
        'bg-muted',
        'p-1'
      );
    });

    it('should accept custom className', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList className="custom-list" data-testid="tabs-list">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      expect(screen.getByTestId('tabs-list')).toHaveClass('custom-list');
    });

    it('should forward ref', () => {
      const ref = jest.fn();
      render(
        <Tabs defaultValue="tab1">
          <TabsList ref={ref}>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('TabsTrigger', () => {
    it('should render as button', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
    });

    it('should apply default styles', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1" data-testid="trigger">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
        'whitespace-nowrap',
        'rounded-sm',
        'px-3',
        'py-1.5',
        'text-sm',
        'font-medium'
      );
    });

    it('should accept custom className', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1" className="custom-trigger" data-testid="trigger">
              Tab 1
            </TabsTrigger>
          </TabsList>
        </Tabs>
      );

      expect(screen.getByTestId('trigger')).toHaveClass('custom-trigger');
    });

    it('should handle click to change tabs', async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      // Initially Tab 1 content should be visible
      expect(screen.getByText('Content 1')).toBeVisible();

      // Click Tab 2
      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

      // Tab 2 content should now be visible
      expect(screen.getByText('Content 2')).toBeVisible();
    });

    it('should be disabled when disabled prop is true', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1" disabled>Disabled Tab</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      expect(screen.getByRole('tab', { name: 'Disabled Tab' })).toBeDisabled();
    });

    it('should forward ref', () => {
      const ref = jest.fn();
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1" ref={ref}>Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('TabsContent', () => {
    it('should render content for active tab', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      );

      expect(screen.getByText('Content 1')).toBeVisible();
    });

    it('should show only active tab content', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      // Only active tab content should be visible
      expect(screen.getByText('Content 1')).toBeVisible();
      // Inactive content may not be in DOM or may be hidden
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    });

    it('should apply default styles', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" data-testid="content">Content 1</TabsContent>
        </Tabs>
      );

      const content = screen.getByTestId('content');
      expect(content).toHaveClass('mt-2', 'ring-offset-background');
    });

    it('should accept custom className', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="custom-content" data-testid="content">
            Content 1
          </TabsContent>
        </Tabs>
      );

      expect(screen.getByTestId('content')).toHaveClass('custom-content');
    });

    it('should forward ref', () => {
      const ref = jest.fn();
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" ref={ref}>Content 1</TabsContent>
        </Tabs>
      );

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA roles', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getAllByRole('tab')).toHaveLength(2);
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });

      // Focus and press arrow key
      await user.click(tab1);
      await user.keyboard('{ArrowRight}');

      // Tab 2 should now be focused and active
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      expect(tab2).toHaveFocus();
      expect(screen.getByText('Content 2')).toBeVisible();
    });
  });

  describe('complete tabs example', () => {
    it('should render complete tabs component', async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Account information</TabsContent>
          <TabsContent value="password">Password settings</TabsContent>
          <TabsContent value="settings">Application settings</TabsContent>
        </Tabs>
      );

      // Initial state
      expect(screen.getByText('Account information')).toBeVisible();

      // Click Password tab
      await user.click(screen.getByRole('tab', { name: 'Password' }));
      expect(screen.getByText('Password settings')).toBeVisible();

      // Click Settings tab
      await user.click(screen.getByRole('tab', { name: 'Settings' }));
      expect(screen.getByText('Application settings')).toBeVisible();
    });
  });
});

// Import React for controlled component test
import * as React from 'react';
