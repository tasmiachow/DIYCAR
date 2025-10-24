import React, { useState, useEffect } from 'react'
import '../App.css'
import Card from '../components/Card'; 


const ViewCars = () => {
    const [cars, setCars] = useState([])

    useEffect(()=> {
        const fetchAllCars = async()=>{
            const response = await fetch(`http://localhost:3000/cars`);
            const data = await response.json();
            setCars(data)
        }

        fetchAllCars();
    }, []); 
    return (
        <div className ="Cars">
            <main> 
                {
                    cars && cars.length > 0 ?
                cars.map((car,index) => 
                    
                   <Card key={car.car_id} id={car.car_id}
                         car_name = {car.car_name} 
                         base_price = {car.base_price}
                         total_price = {car.total_price}
                    />

                ) : <h3 className="noResults">{'No Cars Yet 😞'}</h3>
            }
        </main>
            
        </div>
    )
}

export default ViewCars