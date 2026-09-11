import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Sach me delete karna hai?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(history.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Analysis History</h2>

        {loading && <p>Loading...</p>}
        {!loading && history.length === 0 && <p>Koi history nahi hai abhi</p>}

        {history.map((item) => (
          <div key={item._id} className="history-card-full">
            <div className="history-summary" onClick={() => toggleExpand(item._id)}>
              <div>
                <p className="history-filename">📄 {item.fileName}</p>
                <p className="history-date">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
              <div className="history-actions">
                <span className="score-badge">{item.codeReview.overallScore}/10</span>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}>
                  🗑️
                </button>
                <span className="expand-icon">{expandedId === item._id ? '▲' : '▼'}</span>
              </div>
            </div>

            {expandedId === item._id && (
              <div className="history-details">
                <h4>Code Review</h4>
                {item.codeReview.issues.map((issue, i) => (
                  <div key={i} className={`issue-card ${issue.severity}`}>
                    <div className="issue-header">
                      <span className={`badge ${issue.severity}`}>{issue.severity}</span>
                      <span className="issue-type">{issue.type}</span>
                    </div>
                    <p className="issue-description">{issue.description}</p>
                    <div className="issue-fix">
                      <b>💡 Fix:</b>
                      <p>{issue.suggestion}</p>
                    </div>
                  </div>
                ))}

                <h4>Documentation</h4>
                <div className="doc-card">
                  <p>{item.documentation.summary}</p>
                </div>

                <h4>Resume Bullets</h4>
                <div className="resume-card">
                  <ul className="bullet-list">
                    {item.resumeBullets.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                </div>

                {item.autoFix && (
                  <>
                    <h4>Auto-Fixed Code</h4>
                    <div className="autofix-card">
                      <p style={{ marginBottom: '10px', fontSize: '14px' }}>
                        {item.autoFix.changesExplanation}
                      </p>
                      <pre>{item.autoFix.fixedCode}</pre>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;