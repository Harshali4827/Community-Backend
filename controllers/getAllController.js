import pool from "../config/db.js";

export const getAllCountry = async (req,res) => {
    try{
        const [roles] = await pool.query('select * from country');
        res.status(200).json(roles);
    }catch(error){
        console.error('Error fetching country');
        res.status(500).json({Message:'Internal Server error'})
    }
}
export const getStatesByCountry = async (req, res) => {
    const { countryId } = req.params;
    try {
        const [states] = await pool.query('SELECT * FROM states WHERE country_id = ?', [countryId]);
        res.status(200).json(states);
    } catch (error) {
        console.error('Error fetching states:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const createCity = async (req, res) => {
    try {
        const { city_name, country_id, state_id } = req.body;

        const [existing] = await pool.query(
            'SELECT id FROM city WHERE city_name = ? AND country_id = ? AND state_id = ? AND is_delete = 0',
            [city_name, country_id, state_id]
        );
        
        if (existing.length > 0) {
            return res.status(200).json({ 
                message: 'City already exists', 
                cityId: existing[0].id 
            });
        }

        const [result] = await pool.query(
            'INSERT INTO city (city_name, country_id, state_id, status, is_delete) VALUES (?, ?, ?, "active", 0)',
            [city_name, country_id, state_id]
        );

        res.status(201).json({ 
            message: 'City added successfully', 
            cityId: result.insertId 
        });
    } catch (error) {
        console.error('Error creating city:', error);
        res.status(500).json({ error: error.message });
    }
};