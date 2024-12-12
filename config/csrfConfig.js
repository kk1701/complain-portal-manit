export const csrf = {
    secret: 'your-very-secure-and-long-secret-key', // Replace with a strong secret, preferably from environment variables
    cookieName: 'csrfToken',
    headerName: 'x-csrf-token', // Header where the token is expected
    cookieOptions: {
        httpOnly: true, // Prevents JavaScript access to the cookie
        secure: false, // Set to true if using HTTPS
        sameSite: 'Strict', // Helps mitigate CSRF attacks
        // maxAge: 3600000 // Token expiration (optional)
    }
};