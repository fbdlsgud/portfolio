import { render, screen } from '@testing-library/react';
import { act } from 'react';

jest.mock('axios', () => {
  const instance = {
    get: (url) =>
      Promise.resolve({
        data: String(url).includes('visit') ? { today: 0, total: 0 } : [],
      }),
    post: () => Promise.resolve({ data: {} }),
  };

  return {
    __esModule: true,
    default: {
      create: () => instance,
    },
    create: () => instance,
  };
});

import App from './App';

test('renders app navigation', async () => {
  await act(async () => {
    render(<App />);
    await Promise.resolve();
    await Promise.resolve();
  });

  expect(screen.getByText(/Games/i)).toBeInTheDocument();
});
