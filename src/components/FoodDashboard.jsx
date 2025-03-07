import { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import '../styles/FoodDashboard.css';
import Spinner from "../components/Spinner"
import axios from "axios"; 
import HamburgerMenu from "./HamburgerMenu"; 

const baseURL = import.meta.env.REACT_APP_BASEURL; 

const FoodDashboard = () => { 
  const [foodItems, setFoodItems] = useState([]); 
  const [foodImages, setFoodImages] = useState({}); 
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate(); 

  useEffect(() => { 
    const fetchData = async () => { 
      setLoading(true); 
      try { 
        const token = localStorage.getItem("token"); 
        if (!token) { 
          navigate("/login"); 
          return; 
        } 

        const userResponse = await axios.get(`${baseURL}/auth/user`, { 
          headers: { Authorization: `Bearer ${token}` }, 
        }); 

        if (userResponse.data.role !== "admin") { 
          navigate("/login"); 
          return; 
        } 

        setUser(userResponse.data); 

        const foodResponse = await axios.get(`${baseURL}/food/all`, { 
          headers: { Authorization: `Bearer ${token}` }, 
        }); 
        
        const foods = foodResponse.data;
        setFoodItems(foods);

        // Fetch images for each food item
        const imagePromises = foods.map(async (food) => {
          try {
            const imageResponse = await axios.get(`${baseURL}/food/photo/${food._id}`, {
              headers: { Authorization: `Bearer ${token}` },
              responseType: 'blob'
            });
            
            // Create a blob URL for the image
            const imageUrl = URL.createObjectURL(imageResponse.data);
            return { [food._id]: imageUrl };
          } catch (error) {
            console.error(`Error fetching image for food ${food._id}`, error);
            return { [food._id]: null };
          }
        });

        // Wait for all image fetches to complete
        const imageResults = await Promise.all(imagePromises);
        
        // Combine image results into a single object
        const imagesMap = imageResults.reduce((acc, curr) => ({...acc, ...curr}), {});
        setFoodImages(imagesMap);

      } catch (error) { 
        console.error("Error fetching data", error); 
        navigate("/login"); 
      } finally { 
        setLoading(false); 
      } 
    }; 

    fetchData(); 

    // Cleanup function to revoke blob URLs
    return () => {
      Object.values(foodImages).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [navigate]); 
   
  if (loading) { 
    return <Spinner/>; 
  } 

  return ( 
    <div className="food-dashboard-container"> 
      <header className="dashboard-header">
        <HamburgerMenu />
      </header>
       
      <div className="food-grid"> 
        {foodItems.map((food) => ( 
          <div 
            key={food._id} 
            className="food-card"
            onClick={() => navigate(`/food/${food._id}`)}
            style={{ cursor: "pointer" }}
          > 
            {foodImages[food._id] ? (
              <img  
                src={foodImages[food._id]}  
                alt={food.name}  
                className="food-image"  
              />
            ) : (
              <div className="no-image-placeholder">No Image</div>
            )}
            <h3 className="food-name">{food.name}</h3> 
            <p className="food-description">{food.description.slice(0, 50)}...</p> 
            <div className="food-class-last">
                <p className="food-price">₹{food.price}</p> 
            </div> 
          </div> 
        ))} 
      </div> 
    </div> 
  ); 
}; 

export default FoodDashboard;