import pool from '../models/db.js';

export async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email and password are required' });
        }
        
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Email is already in use' });
        }
        
        // Ensure your database has a 'password' column in the users table
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, profile_picture, created_at',
            [name, email.toLowerCase(), password]
        );
        
        res.status(201).json({ user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
        const user = result.rows[0];
        
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Return user object without the password
        res.json({
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                profile_picture: user.profile_picture, 
                created_at: user.created_at 
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login Failed' });
    }
}

export async function me(req, res) {
    try {
        // Checks for the user ID in either the headers (if no middleware) or the request object (if using middleware)
        const userId = req.headers['user-id'] || req.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: No User ID provided' });
        }

        const result = await pool.query(
            'SELECT id, name, email, profile_picture, created_at FROM users WHERE id = $1', 
            [userId]
        );
        
        if (!result.rows[0]) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
}