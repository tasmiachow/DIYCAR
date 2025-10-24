import pool from "../config/database.js";

const getCars = async (req, res) => {
    try{
        const getAllCars = await pool.query(
            `SELECT * FROM cars order BY car_id ASC;`
        );
        res.status(200).json(getAllCars.rows);
    }
    catch(error){
        res.status(409).json( {error: error.message });
    }
};

const getCarById = async (req, res) => {
    try{
        const carQuery = 
        `SELECT 
            c.car_id,
            c.car_name AS car_name,
            c.total_price,
            f.name AS feature_name,
            o.name AS option_name,
            o.price AS option_price,
            o.image_url
        FROM customCars cc
        JOIN cars c
            ON cc.custom_car_id = c.car_id
        JOIN features f
            ON cc.custom_feature_id = f.feature_id
        JOIN options o
            ON cc.custom_option_id = o.option_id
        WHERE c.car_id = $1;`;
        const car_id = req.params.car_id;
        const getSpecificCar = await pool.query( carQuery, [car_id]); 
        const baseCarDetails = {
                car_id: getSpecificCar.rows[0].car_id,
                car_name: getSpecificCar.rows[0].car_name,
                total_price: getSpecificCar.rows[0].total_price
                };

        const feature_list = [];
        for(let i=0; i<getSpecificCar.rows.length; i++){
            feature_list.push( {
                feature_name: getSpecificCar.rows[i].feature_name, 
                option_name: getSpecificCar.rows[i].option_name, 
                option_price: getSpecificCar.rows[i].option_price, 
                image_url: getSpecificCar.rows[i].image_url
            });
        };
        const final_car = {
            ...baseCarDetails, 
            "features": [...feature_list]
        }
        res.status(200).json(final_car)
        
    }
    catch(error){
        console.log('error fetching car details');
        res.status(409).json( {error: error.message} );
    }
}


//add car 

const addCar = async(req, res) => {
    try{
        const  {
            car_name, 
            base_price,
            total_price,
            customizations
        } = req.body;
        
        
        const carResults = await pool.query(
            `INSERT INTO cars (car_name, base_price, total_price)
            VALUES($1, $2, $3)
            RETURNING car_id
             `, [
                car_name, 
                base_price, 
                total_price
             ]
        );
        const car_id = carResults.rows[0].car_id;
        for(const item of customizations){
            const {feature_id, option_id} = item;
            await pool.query(
                `INSERT INTO customCars (custom_car_id, custom_feature_id, custom_option_id)
                VALUES ($1, $2, $3)`,
                [car_id, feature_id, option_id]);
        };
        
        res.status(201).json(
            {   
                message: "Car created successfully", car_id 

            }
        );
    }
    catch(error){
        res.status(409).json({error: error.message});
    }
}

//update
const editCar = async(req, res) => {
    try{
        const car_id = parseInt(req.params.id);
        const{
            car_name, 
            base_price, 
            total_price, 
            customizations
        } = req.body;

        const update = await pool.query(
            `UPDATE cars SET car_name =$1, base_price = $2, total_price = $3 
            WHERE car_id =$4
            RETURNING car_id`, 
            [
                car_name, 
                base_price, 
                total_price, 
                car_id
            ]
        );
       
        
        for(const item of customizations){
            const {feature_id, option_id} = item;
            await pool.query(
                `UPDATE customCars SET custom_option_id = $1 
                WHERE custom_car_id = $2 AND custom_feature_id = $3;`,
                [ option_id, 
                    car_id, 
                    feature_id
                ]);
        };

        res.status(200).json({ message: "Car updated successfully" });
    }
    catch(error){
        res.status(409).json({error: error.message}); 
    }
};



//delete
const deleteCar = async(req, res) =>{
    try{
        const car_id = parseInt(req.params.id);
        const deleteFromcc = await pool.query(`DELETE FROM customCars WHERE custom_car_id = $1`, [
            car_id,
        ]);
        const results = await pool.query(`DELETE FROM cars WHERE car_id = $1`, [
            car_id,
        ]);
        res.status(200).json({ message: "Car deleted successfully" });
    }
    catch(error){
        res.status(409).json( {error: error.message});
    }
};

export default { getCars, getCarById, addCar, editCar, deleteCar };