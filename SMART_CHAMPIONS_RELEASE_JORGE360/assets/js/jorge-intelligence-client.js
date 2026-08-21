(function (global) {
  'use strict';

  let context = null;

  function isServerAvailable() {
    return typeof location !== 'undefined' && /^https?:$/.test(location.protocol);
  }

  async function ask(query, localContext) {
    if (!isServerAvailable() || typeof fetch !== 'function') return null;
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timeout = setTimeout(function () { if (controller) controller.abort(); }, 4500);
    try {
      const response = await fetch('/api/jorge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query, context: context || localContext || null }),
        signal: controller ? controller.signal : undefined,
      });
      if (!response.ok) return null;
      const result = await response.json();
      if (!result || !result.display) return null;
      context = result.meta && result.meta.context ? result.meta.context : context;
      return result.display;
    } catch (error) {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

  function reset(caseId) {
    context = { caseId: Number(caseId) || 1 };
  }

  global.JORGE_INTELLIGENCE_CLIENT = Object.freeze({ ask: ask, reset: reset, mode: 'SERVER_WITH_LOCAL_FALLBACK' });
})(window);
