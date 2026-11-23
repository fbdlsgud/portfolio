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
import axios from './axios/axiosInstance';

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders app navigation', async () => {
  await act(async () => {
    render(<App />);
    await Promise.resolve();
    await Promise.resolve();
  });

  expect(screen.getByText(/Games/i)).toBeInTheDocument();
});

test('keeps the main page usable when the API returns the SPA fallback', async () => {
  jest.spyOn(axios, 'get').mockResolvedValue({ data: '<!doctype html><title>Fallback</title>' });

  await act(async () => {
    render(<App />);
  });

  expect(screen.getByRole('link', { name: 'Games' })).toBeInTheDocument();
  expect(screen.getByText('최신 프로젝트', { exact: false })).toBeInTheDocument();
  expect(screen.getByText('최신 댓글', { exact: false })).toBeInTheDocument();
});
