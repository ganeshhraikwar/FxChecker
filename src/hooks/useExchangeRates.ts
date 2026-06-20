import { useState, useEffect } from "react";

export function useExchangeRates(base: string) {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const cacheKey = `fx-rates-${base}`;
    const cachedData = localStorage.getItem(cacheKey);
    let usedCache = false;

    if (cachedData) {
      try {
        const { rates: cachedRates, timestamp } = JSON.parse(cachedData);
        // Cache for 60 seconds
        if (Date.now() - timestamp < 60000) {
          setRates(cachedRates);
          setLastUpdated(timestamp);
          setLoading(false);
          usedCache = true;
          return; // Skip fetch
        }
      } catch (e) {
        // bad cache
      }
    }
    
    const fallbackRates: Record<string, number> = {
      USD: 1, EUR: 0.95, GBP: 0.79, JPY: 150.0, CAD: 1.35, AUD: 1.5, INR: 83.0, CHF: 0.88, CNY: 7.2
    };

    fetch(`https://api.frankfurter.dev/v1/latest?base=${base}`)
      .then(res => {
        if (!res.ok) throw new Error('API request failed');
        return res.json();
      })
      .then(data => {
        if (active) {
          const newRates = { ...data.rates, [base]: 1 };
          setRates(newRates);
          setLastUpdated(Date.now());
          setError(null);
          setLoading(false);
          localStorage.setItem(cacheKey, JSON.stringify({ rates: newRates, timestamp: Date.now() }));
        }
      })
      .catch(err => {
        if (active) {
          console.error(err);
          // if we have stale cache, use it
          if (cachedData) {
             const { rates: cachedRates, timestamp } = JSON.parse(cachedData);
             setRates(cachedRates);
             setLastUpdated(timestamp);
             setError(`Offline mode. Using cached rates from ${new Date(timestamp).toLocaleTimeString()}`);
             setLoading(false);
             return;
          }

          const factor = fallbackRates[base] || 1;
          const adjustedRates: Record<string, number> = {};
          for (const key in fallbackRates) {
            adjustedRates[key] = fallbackRates[key] / factor;
          }
          setRates(adjustedRates);
          setError('Frankfurter API unreachable. Using fallback simulated rates.');
          setLoading(false);
        }
      });

    return () => { active = false; };
  }, [base]);

  return { rates, loading, error, lastUpdated };
}
