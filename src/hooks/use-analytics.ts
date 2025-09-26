import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: string;
}

export const useAnalytics = () => {
  const router = useRouter();

  const trackEvent = useCallback(async (event: string, properties?: Record<string, any>) => {
    try {
      const analyticsEvent: AnalyticsEvent = {
        event,
        properties: {
          ...properties,
          page: router.asPath,
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          referrer: document.referrer || 'direct'
        }
      };

      // Enviar para API de analytics
      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analyticsEvent),
      });

      // Log para desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log('Analytics Event:', analyticsEvent);
      }
    } catch (error) {
      console.error('Erro ao enviar evento de analytics:', error);
    }
  }, [router.asPath]);

  const trackPageView = useCallback((page: string) => {
    trackEvent('page_view', { page });
  }, [trackEvent]);

  const trackConversion = (type: string, value?: number) => {
    trackEvent('conversion', { 
      type, 
      value,
      conversion_page: router.asPath 
    });
  };

  const trackFormStart = (formName: string) => {
    trackEvent('form_start', { form_name: formName });
  };

  const trackFormComplete = (formName: string, fields: Record<string, any>) => {
    trackEvent('form_complete', { 
      form_name: formName,
      fields: Object.keys(fields).length,
      has_empresa: !!fields.empresa,
      has_cargo: !!fields.cargo
    });
  };

  const trackDownload = (fileName: string, fileType: string) => {
    trackEvent('download', { 
      file_name: fileName,
      file_type: fileType,
      download_page: router.asPath
    });
  };

  const trackWhatsAppClick = (context: string) => {
    trackEvent('whatsapp_click', { 
      context,
      page: router.asPath
    });
  };

  // Track page views on route change
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      trackPageView(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    // Track initial page view
    trackPageView(router.asPath);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router, trackPageView]);

  return {
    trackEvent,
    trackPageView,
    trackConversion,
    trackFormStart,
    trackFormComplete,
    trackDownload,
    trackWhatsAppClick
  };
};
