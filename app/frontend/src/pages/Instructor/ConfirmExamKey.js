import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import '../../css/App.css';
import "../../css/ManualExamKey.css";

const ConfirmExamKey = (props) => {
  const location = useLocation();
  const { examTitle, classID } = location.state || {};

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/parse-csv');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching CSV data:', error);
      }
    };

    fetchData();
  }, []);

  const handleConfirm = async () => {
    try {
      await axios.post('/api/confirm-answers', { data });
      alert('Answers confirmed and stored successfully.');
    } catch (error) {
      console.error('Error confirming answers:', error);
      alert('Failed to confirm answers.');
    }
  };

  const handleReject = () => {
    alert('Answers rejected. Please re-upload the PDF.');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="App">
        <div className="main-content">
          <header>
            <h2>Review Answer Key</h2>
            <h2>{examTitle}</h2>
          </header>
          <section className="review-csv">
            <button className="back-button" onClick={() => window.history.back()}>Back</button>
            <div className="nested-window">
              <div className="bubble-grid" data-testid="bubble-grid">
                <table>
                  <thead>
                    <tr>
                      {Object.keys(data[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, i) => (
                          <td key={i}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <button className="btn" onClick={handleConfirm}>Confirm</button>
            <button className="btn" onClick={handleReject}>Reject</button>
          </section>
        </div>
      </div>
    </>
  );
};

export default ConfirmExamKey;
