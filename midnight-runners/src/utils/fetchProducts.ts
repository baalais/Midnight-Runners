export const fetchProducts = async () => {
  try {
    const response = await fetch("https://www.midnightrunners.club/_functions/products");
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${response.status} ${errorText}`);
    }
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Error fetching products: ", error);
    throw error;
  }
};
