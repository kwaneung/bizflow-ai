/**
 * Shared UI Components Library
 *
 * This library provides reusable UI components based on shadcn/ui.
 * All components follow accessibility standards and can be used across
 * all domain modules (ecommerce, realestate, pt).
 *
 * @module @bizflow/shared/ui
 */

// Utils
export { cn } from './lib/utils';

// UI Components
export {
  Button,
  buttonVariants,
  type ButtonProps,
} from './components/ui/button';
export { Input, type InputProps } from './components/ui/input';
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './components/ui/card';
export { Label } from './components/ui/label';
export { Textarea, type TextareaProps } from './components/ui/textarea';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
export { Alert, AlertTitle, AlertDescription } from './components/ui/alert';
export {
  Spinner,
  spinnerVariants,
  type SpinnerProps,
} from './components/ui/spinner';
export { Badge, badgeVariants } from './components/ui/badge';
export { Skeleton } from './components/ui/skeleton';
