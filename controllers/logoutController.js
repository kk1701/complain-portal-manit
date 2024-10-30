import appError from "../utils/appError";

const logoutController = (req, res) => {
    try {
        res.clearCookie('jwt'); // Clear the session cookie
        // Add any other cookies you need to clear here

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred during logout', error: error.message });
    }
};

export default logoutController;