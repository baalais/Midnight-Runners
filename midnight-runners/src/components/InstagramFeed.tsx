/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from 'react';

interface InstagramFeedProps {
  userName: string;
}

const InstagramFeedComponent: React.FC<InstagramFeedProps> = ({ userName }) => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const accessToken = 'your-access-token'; // Replace with your actual access token
    const appId = '1643027746596356';

    fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_url&access_token=${accessToken}`)
      .then(response => response.json())
      .then(data => {
        setPhotos(data.data);
      })
      .catch(error => console.error('Error fetching Instagram data:', error));
  }, [userName]);

  return (
    <div className="instagram-feed">
      {photos.map((photo: any) => (
        <img key={photo.id} src={photo.media_url} alt={photo.caption ? photo.caption : 'Instagram Photo'} />
      ))}
    </div>
  );
};

export default InstagramFeedComponent;
