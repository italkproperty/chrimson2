import { db } from './mockDb';
import { AnalyticsEventType } from '../types';

/**
 * Centrally tracks conversion events and user interactions.
 * Persists to MockDB (localStorage) for admin visibility.
 */
export const trackEvent = (type: AnalyticsEventType, details?: Record<string, any>) => {
  try {
    db.trackEvent(type, details);
  } catch (e) {
    console.error('Analytics tracking failed:', e);
  }
};