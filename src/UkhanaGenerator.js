import React, { useState } from 'react';

const UkhanaGenerator = () => {
  const [yourName, setYourName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [selectedType, setSelectedType] = useState('चतुर');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedUkhana, setGeneratedUkhana] = useState('');
  
  const generateUkhana = async () => {
    if (!yourName || !partnerName) {
      setError('कृपया दोन्ही नावे टाका');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3000/api/generate-ukhana', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          yourName,
          partnerName,
          selectedType
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Log the response to see what we're getting
      console.log('Response data:', data);
      
      // Update this line to match the response structure
      setGeneratedUkhana(data.content || '');
      
    } catch (error) {
      console.error('Error generating ukhana:', error);
      setError('उखाणा बनवताना काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="ukhana-container">
        <h1 className="ukhana-title">उखाणा बनवा</h1>
        
        <div className="input-group">
          <label>तुमचं नाव</label>
          <input
            type="text"
            value={yourName}
            onChange={(e) => setYourName(e.target.value)}
            placeholder="तुमचं नाव टाका"
          />
        </div>
        
        <div className="input-group">
          <label>साथीचं नाव</label>
          <input
            type="text"
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            placeholder="साथीचं नाव टाका"
          />
        </div>
        
        <div className="input-group">
          <label>उखाण्याचा प्रकार</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="चतुर">चतुर</option>
            <option value="विनोदी">विनोदी</option>
            <option value="प्रौढ">प्रौढ</option>
            <option value="व्यंगात्मक">व्यंगात्मक</option>
          </select>
        </div>
        
        <button
          onClick={generateUkhana}
          disabled={loading}
          className="generate-button"
        >
          {loading ? 'उखाणा बनवत आहे...' : 'GENERATE'}
        </button>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="result-container">
          <p style={{ whiteSpace: 'pre-line' }}>{generatedUkhana}</p>
        </div>
      </div>
    </div>
  );
};

export default UkhanaGenerator;