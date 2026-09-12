import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { io } from 'socket.io-client';
function Dashboard() {
  const [progressMessages, setProgressMessages] = useState([]);
const [socket, setSocket] = useState(null);

useEffect(() => {
  const newSocket = io('https://gitpolish-backend.onrender.com');
  setSocket(newSocket);

  newSocket.on('progress', (message) => {
    setProgressMessages((prev) => [...prev, message]);
  });

  return () => newSocket.disconnect();
}, []);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [recentUrls, setRecentUrls] = useState(JSON.parse(localStorage.getItem('recentUrls')) || []
);
  const formatExplanation = (text) => {
  // Numbered points se pehle line break daalo (jaise "1. **Title**")
  const withBreaks = text.replace(/(\d+\.\s\*\*)/g, '\n$1');
  
  // Har line ko process karo
  return withBreaks.split('\n').filter(line => line.trim()).map((line, index) => {
    // **bold** ko <b> me convert karo
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={index} className="explanation-line">
        {parts.map((part, i) => 
          part.startsWith('**') && part.endsWith('**') 
            ? <b key={i}>{part.slice(2, -2)}</b> 
            : part
        )}
      </p>
    );
  });
};
  const handleAnalyze = async (e) => {
  e.preventDefault();
  setError('');
  setResult(null);
  setProgressMessages([]);
  setLoading(true);

  try {
    const token = localStorage.getItem('token');

    const response = await axios.get(
      'https://gitpolish-backend.onrender.com/api/analyze-repo',
      {
        params: { downloadUrl, socketId: socket?.id },
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setResult(response.data);
    const updatedUrls = [downloadUrl, ...recentUrls];
    setRecentUrls(updatedUrls);
    localStorage.setItem('recentUrls', JSON.stringify(updatedUrls));
  } catch (err) {
    console.log(err);
    setError('Analysis fail ho gaya');
  } finally {
    setLoading(false);
  }
};

  return (
  <div>
    <Navbar />
    <div className="container">
      <h2>GitPolish Dashboard</h2>
<p className="subtitle">Paste a GitHub raw file URL to get AI-powered code analysis</p>

<form onSubmit={handleAnalyze} className="analyze-form">
  <input
    type="text"
    placeholder="GitHub raw file URL paste karo"
    value={downloadUrl}
    onChange={(e) => setDownloadUrl(e.target.value)}
  />
  <button type="submit" disabled={loading}>
  {loading ? 'Analyzing...' : 'Analyze'}
</button>
</form>


{recentUrls.length > 0 && (
  <div className="recent-urls">
    <h4>Recently Analyzed:</h4>
    {recentUrls.map((url, index) => (
      <div key={index} className="recent-url-item" onClick={() => setDownloadUrl(url)}>
        {url}
      </div>
    ))}
  </div>
)}

{loading && (
  <div className="progress-box">
    {progressMessages.map((msg, index) => (
      <p key={index} className="progress-message">{msg}</p>
    ))}
    {progressMessages.length === 0 && <p>Connecting...</p>}
  </div>
)}

      {result && (
        <div>
          <h3>Code Review</h3>
          <p>Overall Score: {result.codeReview.overallScore}/10</p>
          {result.codeReview.issues.map((issue, index) => (
            <div key={index} className={`issue-card ${issue.severity}`}>
  <div className="issue-header">
    <span className={`badge ${issue.severity}`}>{issue.severity}</span>
    <span className="issue-type">{issue.type}</span>
  </div>
  <p className="issue-description">{issue.description}</p>
  <div className="issue-fix">
    <b>💡 Suggested Fix:</b>
    <p>{issue.suggestion}</p>
  </div>
</div>
          ))}

          <h3>Documentation</h3>
<div className="doc-card">
  <p>{result.documentation.summary}</p>
</div>

{result.documentation.functions && result.documentation.functions.length > 0 && (
  <div className="functions-list">
    {result.documentation.functions.map((fn, index) => (
      <div key={index} className="function-card">
        <p className="function-name">🔧 {fn.name}</p>
        <p className="function-purpose">{fn.purpose}</p>
        {fn.parameters && <p className="function-params"><b>Parameters:</b> {fn.parameters}</p>}
      </div>
    ))}
  </div>
)}

<h3>Resume Bullets</h3>
<div className="resume-card">
  <ul className="bullet-list">
    {result.resumeBullets.bullets.map((bullet, index) => (
      <li key={index}>{bullet}</li>
    ))}
  </ul>

  {result.resumeBullets.suggestedSkills && (
    <div className="skills-section">
      <b>Suggested Skills:</b>
      <div className="skills-tags">
        {result.resumeBullets.suggestedSkills.map((skill, index) => (
          <span key={index} className="skill-tag">{skill}</span>
        ))}
      </div>
    </div>
  )}
</div>

          <h3>Auto-Fixed Code</h3>
<div className="autofix-card">
  <div className="autofix-explanation">
    <b>✨ What Changed:</b>
    <div>{formatExplanation(result.autoFix.changesExplanation)}</div>
  </div>
  
  <div className="code-block-header">
    <span>Fixed Code</span>
    <button 
      type="button"
      className="copy-btn"
      onClick={() => {
        navigator.clipboard.writeText(result.autoFix.fixedCode);
        alert('Code copied!');
      }}
    >
      📋 Copy
    </button>
  </div>
  <pre>{result.autoFix.fixedCode}</pre>
</div>
        </div>
      )}
    </div>
  </div>
);
}
export default Dashboard ;