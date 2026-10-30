import React, { useEffect, useState } from "react";
import "./Coupons.css";

import { COUPONS_API_URL as API_URL } from "../../config/api";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setCoupons(json.data);
        } else {
          setCoupons([]);
        }
      } catch (e) {
        console.error("Error fetching coupons from database:", e);
        setError("Could not load coupons from server.");
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const getCouponStatus = (coupon) => {
    const today = new Date().toISOString().slice(0, 10);
    if (coupon.disabled) return "Disabled";
    if (coupon.end && coupon.end < today) return "Expired";
    if (coupon.start && coupon.start > today) return "Scheduled";
    if (Number(coupon.limit) > 0 && Number(coupon.used) >= Number(coupon.limit)) {
      return "Limit Reached";
    }
    return "Active";
  };

  if (loading) return <div className="Coupons-loading">Loading coupons from database…</div>;
  if (error) return <div className="Coupons-error">{error}</div>;

  return (
    <section className="Coupons" id="coupons">
      <header className="Coupons-header">
        <h1 className="Coupons-title">Available Coupons</h1>
        <p className="Coupons-subtitle">
          Apply these verified promotional codes at checkout for instant discounts.
        </p>
      </header>

      {coupons.length === 0 ? (
        <p className="Coupons-empty">No active coupons available right now.</p>
      ) : (
        <table className="Coupons-table">
          <thead>
            <tr>
              <th>Coupon Code</th>
              <th>Description</th>
              <th>Discount</th>
              <th>Min. Purchase</th>
              <th>Valid Until</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => {
              const status = getCouponStatus(c);
              const discountText =
                c.type === "Fixed Amount (₹)"
                  ? `₹${c.value}`
                  : `${c.value}% OFF`;

              return (
                <tr key={c._id || c.id}>
                  <td>
                    <strong>{c.code}</strong>
                  </td>
                  <td>{c.description || "—"}</td>
                  <td>{discountText}</td>
                  <td>{c.minimum ? `₹${c.minimum}` : "No minimum"}</td>
                  <td>{c.end || "Ongoing"}</td>
                  <td>
                    <span className={`Coupons-status-tag Coupons-status-${status.toLowerCase().replace(/\s+/g, "-")}`}>
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default Coupons;
