export const requireAuth = (req, res, next) => {
    // Extract the user ID from the custom header we send from the React frontend
    const userId = req.headers['user-id'];

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: No User ID provided' });
    }

    // Attach the userId to the request object so the next function can use it
    req.userId = userId;
    
    // Move on to the next function (the controller)
    next();
};