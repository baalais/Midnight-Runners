/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Image from "next/image";

const Reviews = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewRes = await fetch(
          `https://api.fera.ai/v3/public/reviews?product.id=${productId}&public_key=${process.env.NEXT_PUBLIC_FERA_ID}`
        );
        if (!reviewRes.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await reviewRes.json();
        setReviews(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!reviews.length) return <p>No reviews found.</p>;

  return (
    <div>
      {reviews.map((review) => (
        <div className="flex flex-col gap-4" key={review.id}>
          {/* USER */}
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
          {/* STARS */}
          <div className="flex gap-2">
            {Array.from({ length: review.rating }).map((_, index) => (
              <Image src="/star.png" alt="" key={index} width={16} height={16} />
            ))}
          </div>
          {/* DESC */}
          {review.heading && <p>{review.heading}</p>}
          {review.body && <p>{review.body}</p>}
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
