/**
 * Fit & Fight Club → Pulse CRM Visitor Tracker
 *
 * This script automatically captures visitor information and sends it to Supabase
 * Add this script to your website's HTML head section
 *
 * IMPORTANT: Replace SUPABASE_URL and SUPABASE_ANON_KEY with your actual values
 */

(function() {
  'use strict';

  // ⚠️ CONFIGURATION - REPLACE WITH YOUR VALUES
  const CONFIG = {
    SUPABASE_URL: 'https://YOUR_PROJECT_ID.supabase.co',
    SUPABASE_ANON_KEY: 'YOUR_ANON_PUBLIC_KEY',
    TABLE_NAME: 'visitors'
  };

  /**
   * Core tracking function - logs anonymous visitor
   */
  function captureAnonymousVisitor() {
    const visitorData = {
      page_visited: document.title || window.location.pathname,
      referrer: document.referrer || 'direct',
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };

    sendToSupabase(visitorData);
  }

  /**
   * Send data to Supabase REST API
   */
  function sendToSupabase(data) {
    const url = `${CONFIG.SUPABASE_URL}/rest/v1/${CONFIG.TABLE_NAME}`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': CONFIG.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        console.log('✓ Visitor logged successfully');
      }
    })
    .catch(error => {
      // Silently fail - don't disrupt user experience
      console.debug('Visitor tracking:', error);
    });
  }

  /**
   * Track page view on document load
   */
  function initializeTracking() {
    captureAnonymousVisitor();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTracking);
  } else {
    initializeTracking();
  }

  // Expose function globally for lead form submissions
  window.FFC_CRM = {
    captureVisitor: function(emailAddress, phoneNumber) {
      const leadData = {
        page_visited: document.title,
        visitor_email: emailAddress,
        visitor_phone: phoneNumber,
        referrer: document.referrer,
        user_agent: navigator.userAgent
      };
      sendToSupabase(leadData);
    }
  };
})();
