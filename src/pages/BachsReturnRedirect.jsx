// src/pages/BachsReturnRedirect.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './CheckoutPage.module.css';

/**
 * Bachs success/cancel URLs point here with an opaque, signed token instead of
 * a tracking ID. Resolve the token through the API, then hand the customer to
 * the normal checkout return experience.
 */
function BachsReturnRedirect() {
  const { returnToken } = useParams();
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let active = true;

    const resolveReturn = async () => {
      try {
        const response = await fetch(
          `${apiBaseUrl}/api/bachs/return/${encodeURIComponent(returnToken)}/`
        );
        if (!response.ok) throw new Error('Return link could not be verified');
        const data = await response.json();
        if (!active) return;
        if (!data.tracking_id) throw new Error('Return link could not be verified');
        navigate(
          `/checkout/${encodeURIComponent(data.tracking_id)}${window.location.search}`,
          { replace: true }
        );
      } catch {
        if (active) setFailed(true);
      }
    };

    resolveReturn();
    return () => {
      active = false;
    };
  }, [apiBaseUrl, navigate, returnToken]);

  return (
    <div className={styles.bachsReturnPage}>
      <div className={styles.bachsReturnCard}>
        <div className={styles.bachsReturnBrand}>
          <img src="/ontrac_favicon.png" alt="OnTrac" />
        </div>
        {failed ? (
          <>
            <h1 className={styles.bachsReturnTitle}>We couldn’t verify this payment link</h1>
            <p className={styles.bachsReturnText}>
              Your payment may still have gone through. Open your tracking page to see the latest status.
            </p>
            <div className={styles.bachsReturnActions}>
              <button
                type="button"
                className={styles.bachsReturnPrimary}
                onClick={() => navigate('/tracking')}
              >
                Go to tracking
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={`${styles.bachsReturnIcon} ${styles.returnIconConfirming}`}>
              <div className={styles.returnSpinner}></div>
            </div>
            <h1 className={styles.bachsReturnTitle}>Returning to your payment…</h1>
            <p className={styles.bachsReturnText}>
              Please wait while we retrieve your payment details.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default BachsReturnRedirect;
