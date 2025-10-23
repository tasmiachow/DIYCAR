import pool from "./database.js";
import "./dotenv.js";
//Tables 
// cars 
// features 
// options
// customCars


const createCar = async () => {
    const createCarTable = ` 
        CREATE TABLE IF NOT EXISTS cars(
            car_id SERIAL PRIMARY KEY,
            car_name VARCHAR(255) NOT NULL,
            base_price NUMERIC NOT NULL,
            total_price NUMERIC NOT NULL
            ); 
        `;
    
    try{
        const res = await pool.query(createCarTable);
        console.log("success creating base car table");
    }

    catch (err){
        console.log( 'Failed at creating basic car table', err);
    }
}; 

const features = async () =>{
    const createFeatureTable = ` 
        
        CREATE TABLE IF NOT EXISTS features(
            feature_id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            is_required BOOLEAN 
            ); 
        `;
    try{
        const featuteRes = await pool.query(createFeatureTable);
        console.log("success creating base feature table");
    }

    catch (err){
        console.log( 'Failed at creating feature table', err);
    }
};

const options = async () =>{
     const createOptionsTable = ` 
        
        CREATE TABLE IF NOT EXISTS options(
            option_id SERIAL PRIMARY KEY,
            option_for_feature INTEGER NOT NULL, 
            FOREIGN KEY (option_for_feature) REFERENCES features(feature_id),
            name VARCHAR(255) NOT NULL,
            price NUMERIC NOT NULL, 
            image_url TEXT NOT NULL, 
            is_available BOOLEAN 
        ); 
        `;
    try{
        const optionRes = await pool.query(createOptionsTable);
        console.log("success creating options of features table");
    }

    catch (err){
        console.log( 'Failed at creating options table', err);
    }
};

const customized_car = async () =>{
     const customCar = ` 
        
        CREATE TABLE IF NOT EXISTS customCars(
            custom_id SERIAL PRIMARY KEY,
            custom_car_id INTEGER NOT NULL, 
            custom_feature_id INTEGER NOT NULL, 
            custom_option_id INTEGER NOT NULL,
            FOREIGN KEY (custom_car_id) REFERENCES cars(car_id),
            FOREIGN KEY (custom_feature_id) REFERENCES features(feature_id),
            FOREIGN KEY (custom_option_id) REFERENCES options(option_id)
        ); 
        `;
    try{
        const customRes = await pool.query(customCar);
        console.log("success creating custom cars table");
    }

    catch (err){
        console.log( 'Failed at custom car table', err);
    }
};

// Have to seperate this logic because foreign keys depend on each other
const dropAllTables = async() =>{
     const dropQuery =  `
        DROP TABLE IF EXISTS customCars;
        DROP TABLE IF EXISTS options;
        DROP TABLE IF EXISTS features;
        DROP TABLE IF EXISTS cars;
        `;
    try{
        const dropTableRes = await pool.query(dropQuery);
        console.log('SUCCESS dropped all tables!')
    }
    catch (err){
        console.log( 'Error dropping all tables', err );
    }
}; 


await dropAllTables();
await createCar();
await features();
await options();
await customized_car();