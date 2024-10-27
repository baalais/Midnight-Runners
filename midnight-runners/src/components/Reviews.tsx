/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Image from "next/image";

const Reviews = ({ productId }: { productId: string }) => {
  // Stāvokļa mainīgie pārskatu glabāšanai, ielādēšanas statusam un kļūdu ziņojumam
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Funkcija, lai iegūtu pārskatus
    const fetchReviews = async () => {
      try {
        const reviewRes = await fetch(
          `https://api.fera.ai/v3/public/reviews?product.id=${productId}&public_key=${process.env.NEXT_PUBLIC_FERA_ID}`
        );
        if (!reviewRes.ok) {
          throw new Error("Failed to fetch reviews"); // Ja pieprasījums nav veiksmīgs, izmet kļūdu
        }
        const data = await reviewRes.json(); // Pārveido atbildi JSON formātā
        setReviews(data.data); // Iestata iegūtos pārskatus
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message); // Iestata kļūdas ziņu
        } else {
          setError("An unexpected error occurred"); // Neparedzēta kļūda
        }
      } finally {
        setLoading(false); // Iestata ielādēšanas statusu uz false neatkarīgi no rezultāta
      }
    };

    if (productId) {
      fetchReviews(); // Izsauc funkciju, ja ir produktam ID
    }
  }, [productId]); // Atkārto efektu, ja mainās productId

  // Šie ir nosacījumi, kas nosaka, kādi komponenti tiks attēloti
  if (loading) return <p>Loading reviews...</p>; // Ja ielādē, attēlo ziņu
  if (error) return <p>Error: {error}</p>; // Ja ir kļūda, attēlo kļūdas ziņu
  if (!reviews.length) return <p>No reviews found.</p>; // Ja nav pārskatu, attēlo ziņu

  return (
    <div>
      {/* Iterē caur visiem pārskatiem un attēlo katru */}
      {reviews.map((review) => (
        <div className="flex flex-col gap-4" key={review.id}>
          <div className="flex items-center gap-4 font-medium">
            {/* Klienta avataru attēlošana */}
            <Image
              src={review.customer.avatar_url}
              alt=""
              width={32}
              height={32}
              className="rounded-full"
            />
            <span>{review.customer.display_name}</span>
          </div>
          <div className="flex gap-2">
            {/* Attēlo zvaigznes atbilstoši vērtējumam */}
            {Array.from({ length: review.rating }).map((_, index) => (
              <Image src="/star.png" alt="" key={index} width={16} height={16} />
            ))}
          </div>
          {/* Attēlo pārskata virsrakstu un ķermeni, ja tie ir pieejami */}
          {review.heading && <p>{review.heading}</p>}
          {review.body && <p>{review.body}</p>}
          <div>
            {/* Attēlo pārskata pievienotos medijus */}
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

export default Reviews; // Eksportē Reviews komponenti
