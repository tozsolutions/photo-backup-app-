import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true,
});

// Mock navigator.connection
const mockConnection = {
  type: 'wifi',
  effectiveType: '4g',
  downlink: 10,
  rtt: 50,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

Object.defineProperty(navigator, 'connection', {
  writable: true,
  value: mockConnection,
});

describe('useNetworkStatus', () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    vi.clearAllMocks();
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('should return initial network status', () => {
    const { result } = renderHook(() => useNetworkStatus());

    expect(result.current.isOnline).toBe(true);
    expect(result.current.connectionType).toBe('wifi');
    expect(result.current.effectiveType).toBe('4g');
    expect(result.current.downlink).toBe(10);
    expect(result.current.rtt).toBe(50);
  });

  it('should set up event listeners', () => {
    renderHook(() => useNetworkStatus());

    expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
    expect(mockConnection.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should clean up event listeners on unmount', () => {
    const { unmount } = renderHook(() => useNetworkStatus());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
    expect(mockConnection.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should handle online/offline events', () => {
    const { result } = renderHook(() => useNetworkStatus());

    // Simulate going offline
    act(() => {
      Object.defineProperty(navigator, 'onLine', { value: false });
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.isOnline).toBe(false);

    // Simulate going online
    act(() => {
      Object.defineProperty(navigator, 'onLine', { value: true });
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current.isOnline).toBe(true);
  });

  it('should handle connection changes', () => {
    const { result } = renderHook(() => useNetworkStatus());

    // Simulate connection change
    act(() => {
      mockConnection.effectiveType = '3g';
      mockConnection.downlink = 5;
      mockConnection.rtt = 100;
      
      const changeHandler = mockConnection.addEventListener.mock.calls.find(
        call => call[0] === 'change'
      )?.[1];
      
      if (changeHandler) {
        changeHandler();
      }
    });

    expect(result.current.effectiveType).toBe('3g');
    expect(result.current.downlink).toBe(5);
    expect(result.current.rtt).toBe(100);
  });

  it('should handle missing connection API gracefully', () => {
    // Temporarily remove connection API
    const originalConnection = (navigator as any).connection;
    delete (navigator as any).connection;

    const { result } = renderHook(() => useNetworkStatus());

    expect(result.current.connectionType).toBe('unknown');
    expect(result.current.effectiveType).toBe('unknown');
    expect(result.current.downlink).toBe(0);
    expect(result.current.rtt).toBe(0);

    // Restore connection API
    (navigator as any).connection = originalConnection;
  });
});