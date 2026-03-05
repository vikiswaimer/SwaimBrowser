/**
 * usePlatform Hook
 * Хук для определения текущей платформы и её возможностей.
 */

import { useMemo } from 'react';
import {
  detectPlatform,
  PLATFORM_CAPABILITIES,
  type Platform,
  type PlatformCapabilities,
} from '../shared/platform';

interface UsePlatformReturn {
  platform: Platform;
  capabilities: PlatformCapabilities;
  isDesktop: boolean;
  isMobile: boolean;
  isWeb: boolean;
}

export function usePlatform(): UsePlatformReturn {
  return useMemo(() => {
    const platform = detectPlatform();
    const capabilities = PLATFORM_CAPABILITIES[platform];

    return {
      platform,
      capabilities,
      isDesktop: platform === 'desktop',
      isMobile: platform === 'mobile',
      isWeb: platform === 'web',
    };
  }, []);
}
