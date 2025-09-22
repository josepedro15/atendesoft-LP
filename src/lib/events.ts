// Analytics events tracking for AtendeSoft

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
}

// Event tracking functions
export const trackEvent = (event: string, properties?: Record<string, any>) => {
  // In production, replace with your analytics service (Google Analytics, Mixpanel, etc.)
  
  
  // Example: Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, properties);
  }
};

// Specific event functions
export const events = {
  ctaWhatsappClick: (label: string) => {
    trackEvent('cta_whatsapp_click', { label });
  },
  
  pricingClick: (plan: string) => {
    trackEvent('pricing_click', { plan });
  },
  
  scroll75: () => {
    trackEvent('scroll_75');
  },
  
  faqOpen: (question: string) => {
    trackEvent('faq_open', { question });
  },
  
  videoPlay: (source: string) => {
    trackEvent('video_play', { source });
  },
  
  productCtaClick: (productId: string) => {
    trackEvent('product_cta_click', { product_id: productId });
  },
  
  toolTipOpen: (slug: string) => {
    trackEvent('tool_tip_open', { slug });
  },
  
  navClick: (section: string) => {
    trackEvent('nav_click', { section });
  },
  
  heroCtaClick: (type: 'primary' | 'secondary') => {
    trackEvent('hero_cta_click', { type });
  },
  
  linktreeView: () => {
    trackEvent('linktree_view');
  },
  
  linktreeClick: (linkId: string, category: string) => {
    trackEvent('linktree_click', { link_id: linkId, category });
  }
};

// Scroll tracking hook
export const useScrollTracking = () => {
  let scroll75Tracked = false;
  
  const handleScroll = () => {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    
    if (scrollPercent >= 75 && !scroll75Tracked) {
      events.scroll75();
      scroll75Tracked = true;
    }
  };
  
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }
  
  return () => {}; // Return empty cleanup function if window is not available
};