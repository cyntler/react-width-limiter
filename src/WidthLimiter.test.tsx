import { render, screen } from '@testing-library/react';
import { WidthLimiter } from './WidthLimiter';

test('render WidthLimiter with no children nodes', () => {
  render(<WidthLimiter />);

  expect(screen.getByTestId('width-limiter-container')).toBeDefined();
});
