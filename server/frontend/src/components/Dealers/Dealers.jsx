import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const Dealers = () => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchDealers = async () => {
      try {
        const response = await fetch(`${window.location.origin}/djangoapp/get_dealers`);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const result = await response.json();
        if (result.status !== 200 || !Array.isArray(result.dealers)) {
          throw new Error("The dealerships response had an unexpected format.");
        }

        if (!cancelled) {
          setDealers(result.dealers);
        }
      } catch (fetchError) {
        console.error("Error fetching dealerships:", fetchError);
        if (!cancelled) {
          setError("Unable to load dealerships. Please try again later.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDealers();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      <h1 style={{ color: "grey", marginTop: "20px" }}>Dealers</h1>
      {loading ? (
        <p>Loading dealerships...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : dealers.length === 0 ? (
        <p>No dealerships found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Dealer</th>
              <th>City</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            {dealers.map((dealer) => (
              <tr key={dealer.id}>
                <td>
                  {dealer.id !== undefined && dealer.id !== null ? (
                    <Link to={`/dealer/${dealer.id}`}>
                      {dealer.full_name || dealer.short_name || dealer.name || `Dealer #${dealer.id}`}
                    </Link>
                  ) : (
                    dealer.full_name || dealer.short_name || dealer.name || "Dealer"
                  )}
                </td>
                <td>{dealer.city || ""}</td>
                <td>{dealer.state || dealer.st || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dealers;
