// components/QueryForm.js
import { useState } from 'react';

export default function QueryForm({ filename, onQuery }) {
  const [query, setQuery] = useState('');

  const handleQuery = async () => {
    const response = await fetch('http://localhost:8000/query', { // backend url
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename, query }),
    });

    if (response.ok) {
      const data = await response.json();
      onQuery(data.response);
    } else {
      console.error('Query failed');
    }
  };

  return (
    <div>
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={handleQuery}>Query</button>
    </div>
  );
}