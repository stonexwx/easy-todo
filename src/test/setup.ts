import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { cleanup } from '@testing-library/react';

// 清理测试环境
afterEach(() => {
  cleanup();
});

// MSW服务器设置（如果需要mock API）
const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

// 模拟ResizeObserver，因为jsdom环境中没有提供
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// 全局注册ResizeObserver
window.ResizeObserver = MockResizeObserver; 