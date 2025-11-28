module.exports = function handler(req, res) {
    console.log('Test endpoint called');
    res.status(200).json({ message: 'Hello from Vercel!', time: new Date().toISOString() });
};
