import { useState } from "react";

const PingTest = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    try {
      const res = await fetch("https://api.yippieapp.com/api/v1/ping", {
        credentials: "include",
      });
      const data = await res.json();
      setResponse(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  return (
    <div>
      <button onClick={testConnection}>Test Connection</button>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
};

export default PingTest;
