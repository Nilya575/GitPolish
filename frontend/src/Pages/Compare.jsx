import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
function Compare() {
    const [url1, setUrl1] = useState('');
    const [url2, setUrl2] = useState('');
    const [result1, setResult1] = useState(null);
    const [result2, setResult2] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const handleCompare = async (e) => {
    e.preventDefault();
    setError('');
    setResult1(null);
    setResult2(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const [response1, response2] = await Promise.all([
        axios.get('https://gitpolish-backend.onrender.com/api/analyze-repo', {
          params: { downloadUrl: url1 },
          headers: { Authorization: `Bearer ${token}` }
        }),
     axios.get('https://gitpolish-backend.onrender.com/api/analyze-repo', {
          params: { downloadUrl: url2 },
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setResult1(response1.data);
      setResult2(response2.data);
    } catch (err) {
      console.log(err);
      setError('Comparison fail ho gaya');
    } finally {
      setLoading(false);
    }
  };
    return (
    <div>
      <Navbar />
      <div className="container" style={{ maxWidth: '1000px' }}>
        <h2>Compare Two Files</h2>
        <p className="subtitle">Paste two GitHub raw file URLs to compare their code quality</p>

        <form onSubmit={handleCompare}>
          <label>File 1 URL</label>
          <input 
             type="text"
            placeholder="First GitHub raw file URL"
            value={url1}
            onChange={(e) => setUrl1(e.target.value)}
          />
          <label>File 2 URL</label>
          <input
            type="text"
            placeholder="Second GitHub raw file URL"
            value={url2}
            onChange={(e) => setUrl2(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Comparing...' : 'Compare'}
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}

        {result1 && result2 && (
            <div className="comparison-grid">
            <div className="comparison-column">
              <h3>File 1</h3>
              <div className="score-display">
                <span className="big-score">{result1.codeReview.overallScore}</span>
                <span>/10</span>
              </div>
              <p className="issue-count">{result1.codeReview.issues.length} issues found</p>
              {result1.codeReview.issues.map((issue, i) => (
                <div key={i} className={`issue-card ${issue.severity}`}>
                  <span className={`badge ${issue.severity}`}>{issue.severity}</span>
                  <p className="issue-description">{issue.description}</p>
                </div>
              ))}
            </div>
            <div className="comparison-column">
              <h3>File 2</h3>
              <div className="score-display">
                <span className="big-score">{result2.codeReview.overallScore}</span>
                <span>/10</span>
              </div>
              <p className="issue-count">{result2.codeReview.issues.length} issues found</p>
              {result2.codeReview.issues.map((issue, i) => (
                <div key={i} className={`issue-card ${issue.severity}`}>
                  <span className={`badge ${issue.severity}`}>{issue.severity}</span>
                  <p className="issue-description">{issue.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Compare;
   