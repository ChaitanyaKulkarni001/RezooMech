import ReactMarkdown from 'react-markdown';

function AIResponse({ response }) {
  // Parse the response string to JSON
  let parsedResponse = {};
  try {
    parsedResponse = JSON.parse(response);
  } catch (error) {
    console.error("Failed to parse response:", error);
  }

  return (
    <div className="response mt-6 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">AI Analysis</h3>

      {/* Render all fields dynamically */}
      {Object.keys(parsedResponse).map((key) => {
        const value = parsedResponse[key];

        return (
          <div key={key} className="mb-6">
            <h4 className="text-lg font-medium text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}:</h4>
            {/* Check if the value is an array (e.g., for improvements or examples) */}
            {Array.isArray(value) ? (
              <ul className="list-disc pl-6 text-gray-600">
                {value.map((item, index) => (
                  <li key={index} className="mb-4">
                    <ReactMarkdown>{item.suggestion}</ReactMarkdown>
                  </li>
                ))}
              </ul>
            ) : (
              <ReactMarkdown className="text-gray-600">{value}</ReactMarkdown>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default AIResponse;
