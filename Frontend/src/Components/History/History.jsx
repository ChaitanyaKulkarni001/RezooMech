import React, { useState, useContext } from 'react';
import api from '../../api';
import { ThemeContext } from "../ThemeContext";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from "recharts";
import GitHubStyleCalendar from './GitHubStyleCalendar';

const History = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useContext(ThemeContext);

  // Record types to display in the table and bar chart
  const recordTypes = [
    "PRACTISE_INTERVIEW",
    "FOLLOWUP_INTERVIEW",
    "SPECIFIC_ROLE_INTERVIEW",
    "RAPID_FIRE",
    "CODE_QUIZ",
    "RESUME",
    "GROUP_DISCUSSION"
  ];

  const handleHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('api/user-history/');
      setData(response.data);
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Compute counts for each record type
  const counts = recordTypes.reduce((acc, type) => {
    acc[type] = 0;
    return acc;
  }, {});

  data.forEach(record => {
    if (recordTypes.includes(record.type)) {
      counts[record.type] = (counts[record.type] || 0) + 1;
    }
  });

  // Prepare bar chart data from the counts
  const barChartData = recordTypes.map((type) => ({
    type,
    count: counts[type]
  }));

  // Conditional styling objects based on the theme
  const containerStyle = {
    padding: '2rem',
    backgroundColor: theme === "dim" ? '#f5f5f7' : '#1f2937',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: theme === "dim" ? '#000' : '#fff',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '2rem',
  };

  const thStyle = {
    border: '1px solid #e0e0e0',
    padding: '0.75rem',
    backgroundColor: theme === "dim" ? '#fff' : '#374151',
    color: theme === "dim" ? '#000' : '#fff',
    textAlign: 'center',
  };

  const tdStyle = {
    border: '1px solid #e0e0e0',
    padding: '0.75rem',
    textAlign: 'center',
  };

  const cardStyle = {
    backgroundColor: theme === "dim" ? '#fff' : '#374151',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
    fontWeight: '600',
    color: theme === "dim" ? '#333' : '#ddd',
  };

  const sectionStyle = {
    marginBottom: '0.75rem',
    textAlign: 'justify',
    lineHeight: '1.5',
  };

  // Scrollable container styles
  const scrollBoxStyle = {
    maxHeight: '150px',
    overflowY: 'auto',
    padding: '0.5rem',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    backgroundColor: theme === "dim" ? '#fafafa' : '#4b5563',
    textAlign: 'justify',
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ color: theme === "dim" ? '#000' : '#fff', marginBottom: '1rem' }}>
        My History
      </h1>
      
      {/* Button to fetch history */}
      <div 
        onClick={handleHistory}  
        className="relative inline-flex items-center justify-center gap-4 group" 
        style={{ cursor: 'pointer', marginBottom: '1rem' }}
      >
        <div
          className="absolute inset-0 duration-1000 opacity-60 transition-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"
        ></div>
        <a
          role="button"
          className="group relative inline-flex items-center justify-center text-base rounded-xl bg-gray-900 px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30"
          title="Watch my History"
          href="#"
        >
          Review My Activity
          <svg
            aria-hidden="true"
            viewBox="0 0 10 10"
            height="10"
            width="10"
            fill="none"
            className="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
          >
            <path d="M0 5h7" className="transition opacity-0 group-hover:opacity-100"></path>
            <path d="M1 1l4 4-4 4" className="transition group-hover:translate-x-[3px]"></path>
          </svg>
        </a>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Table for record type counts */}
      {data && data.length > 0 && (
        <table className='mt-3' style={tableStyle}>
          <thead>
            <tr>
              {recordTypes.map((type, index) => (
                <th key={index} style={thStyle}>{type}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {recordTypes.map((type, index) => (
                <td key={index} style={tdStyle}>{counts[type]}</td>
              ))}
            </tr>
          </tbody>
        </table>
      )}


<GitHubStyleCalendar
  theme={theme}
  style={{ transform: "scale(0.8)", transformOrigin: "center" }}
/>



      {/* Bar Graph Section */}
      {data && data.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', textAlign: 'center', color: theme === "dim" ? '#000' : '#fff' }}>
            Record Type Counts
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={barChartData} 
              margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={theme === "dim" ? "#ccc" : "#444"} 
              />
              <XAxis 
                dataKey="type" 
                tick={{ fill: theme === "dim" ? "#000" : "#fff", fontSize: 12 }} 
              />
              <YAxis 
                tick={{ fill: theme === "dim" ? "#000" : "#fff", fontSize: 12 }} 
                domain={[0, 'dataMax']}
                allowDecimals={false}
              />
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: theme === "dim" ? '#fff' : '#333', 
                  border: 'none', 
                  color: theme === "dim" ? '#000' : '#fff' 
                }} 
              />
              <Bar dataKey="count" fill="#007aff" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Detailed Records */}
      {data && data.length > 0 ? (
        data.map((record, index) => (
          <div key={index} style={cardStyle}>
            <div style={headerStyle}>
              <span>{record.type}</span>
              <span>{new Date(record.timestamp).toLocaleString()}</span>
            </div>
            <div style={sectionStyle}>
              <strong>Question:</strong> {record.question}
            </div>
            <div style={sectionStyle}>
              <strong>Transcription:</strong>
              <div style={scrollBoxStyle}>
                {record.transcription}
              </div>
            </div>
            <div style={sectionStyle}>
              <strong>AI Response:</strong>
              <div style={scrollBoxStyle}>
                {record.ai_response}
              </div>
            </div>
            {record.metadata && (
              <div style={sectionStyle}>
                <strong>Metadata:</strong>
                <div style={scrollBoxStyle}>
                  {Object.entries(record.metadata).map(([key, value], idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        padding: '0.25rem 0', 
                        borderBottom: '1px solid #e0e0e0' 
                      }}
                    >
                      <span style={{ fontWeight: 'bold', color: '#007aff' }}>{key}</span>
                      <span>{value.toString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        !loading && <p>No history available.</p>
      )}
    </div>
  );
};

export default History;
