// Asinkrona funkcija, lai iegūtu emuāra ierakstus no API
export const fetchBlogs = async () => {
  try {
    // Datu iegūšana no norādītā URL
    const response = await fetch("https://www.midnightrunners.club/_functions/blogPosts");
    
    // Pārbaudām, vai atbilde nav OK (statuss ārpus diapazona 200-299)
    if (!response.ok) {
      throw new Error("Network response was not ok"); // Izmetam kļūdu sliktām atbildēm
    }
    
    // Atbildes datu parsēšana kā JSON
    const data = await response.json();
    return data.items; // Atgriežam elementus no iegūtajiem datiem
  } catch (error) {
    console.error("Error fetching blog posts:", error); // Kļūdas pierakstīšana konsolē
    throw error; // Atkal izmetam kļūdu turpmākai apstrādei
  }
};
