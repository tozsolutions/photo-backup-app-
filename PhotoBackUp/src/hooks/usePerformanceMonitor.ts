import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  fps: number;
  loadTime: number;
}

export const usePerformanceMonitor = (enabled: boolean = false) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    fps: 0,
    loadTime: 0,
  });

  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const renderStartTime = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    let animationId: number;
    
    const measureFPS = () => {
      const currentTime = performance.now();
      frameCount.current++;
      
      if (currentTime - lastTime.current >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
        frameCount.current = 0;
        lastTime.current = currentTime;
        
        setMetrics(prev => ({ ...prev, fps }));
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        setMetrics(prev => ({ ...prev, memoryUsage }));
      }
    };

    const measureLoadTime = () => {
      if (performance.navigation && performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        setMetrics(prev => ({ ...prev, loadTime }));
      }
    };

    // Start FPS monitoring
    measureFPS();
    
    // Measure memory every 5 seconds
    const memoryInterval = setInterval(measureMemory, 5000);
    
    // Measure load time once
    measureLoadTime();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      clearInterval(memoryInterval);
    };
  }, [enabled]);

  const startRenderMeasure = () => {
    if (enabled) {
      renderStartTime.current = performance.now();
    }
  };

  const endRenderMeasure = () => {
    if (enabled && renderStartTime.current > 0) {
      const renderTime = performance.now() - renderStartTime.current;
      setMetrics(prev => ({ ...prev, renderTime }));
      renderStartTime.current = 0;
    }
  };

  return {
    metrics,
    startRenderMeasure,
    endRenderMeasure,
  };
};

// Performance optimization utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Lazy loading utility
export const useLazyLoad = (
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {}
) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options]);

  return isVisible;
};