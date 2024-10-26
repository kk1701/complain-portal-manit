// Ensures the client receives the CSRF token, which is necessary for the client to include the token in subsequent requests (e.g., in headers or form fields)
const csrfMiddleware = (req, res, next) => {
    // Send the CSRF token cookie with every request
    res.cookie('XSRF-TOKEN', req.csrfToken(), { httpOnly: true, sameSite: 'Strict' });
    next();
}
export default csrfMiddleware;