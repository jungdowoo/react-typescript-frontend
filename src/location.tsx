import React, { useEffect, useState } from 'react';

const Location: React.FC = () => {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:8080/api/location')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); 
      })
      .then(data => setMessage(data.location))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="Location">
      <header className="Location-header">
        <p>{message}</p>
      </header>
    </div>
  );
}

export default Location;
