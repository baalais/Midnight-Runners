import React from 'react';
import InstagramFeedComponent from '../../components/InstagramFeed';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Welcome to My Website</h1>
      <InstagramFeedComponent userName="midnightrunnerslatvija" /> {/* Replace with your actual username */}
    </div>
  );
};

export default HomePage;
