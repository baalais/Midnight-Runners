/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Image from "next/image";

const Reviews = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<any[]>([]); // Saglabā atsauksmes
  const [loading, setLoading] = useState(true); // Ielādes statusa kontrolēšana
  const [error, setError] = useState<string | null>(null); // Kļūdas ziņojums

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Atsauksmju iegūšana no API
        const reviewRes = await fetch(
          `https://api.fera.ai/v3/public/reviews?product.id=${productId}&public_key=${process.env.NEXT_PUBLIC_FERA_ID}`
        );
        if (!reviewRes.ok) {
          throw new Error("Failed to fetch reviews"); // Kļūda, ja pieprasījums neizdevās
        }
        const data = await reviewRes.json();
        setReviews(data.data); // Saglabā iegūtās atsauksmes
      } catch (err) {
        setError(err.message); // Kļūdas apstrāde
      } finally {
        setLoading(false); // Beidz ielādi
      }
    };

    if (productId) {
      fetchReviews(); // Atsauksmju ielāde tikai, ja ir produkta ID
    }
  }, [productId]);

  // Atsauksmju ielādes statuss
  if (loading) return <p>Loading reviews...</p>;
  // Atsauksmju kļūda
  if (error) return <p>Error: {error}</p>;
  // Ja nav atsauksmju
  if (!reviews.length) return <p>No reviews found.</p>;

  return (
    <div>
      {reviews.map((review) => (
        <div className="flex flex-col gap-4" key={review.id}>
          {/* LIETOTĀJS */}
          <div className="flex items-center gap-4 font-medium">
            <Image
              src={review.customer.avatar_url}
              alt=""
              width={32}
              height={32}
              className="rounded-full"
            />
            <span>{review.customer.display_name}</span>
          </div>
          {/* ZVAIGZNES */}
          <div className="flex gap-2">
            {Array.from({ length: review.rating }).map((_, index) => (
              <Image src="/star.png" alt="" key={index} width={16} height={16} />
            ))}
          </div>
          {/* APRAKSTS */}
          {review.heading && <p>{review.heading}</p>}
          {review.body && <p>{review.body}</p>}
          {/* MEDIJA ATSAUKSMES */}
          <div>
            {review.media.map((media: any) => (
              <Image
                src={media.url}
                key={media.id}
                alt=""
                width={100}
                height={50}
                className="object-cover"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reviews;
