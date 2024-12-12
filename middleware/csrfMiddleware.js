import csrf from '@dr.pogodin/csurf';
const csrfProtection = csrf({ cookie: true ,httpOnly: true, secure: false, sameSite: 'Strict' });

export default csrfProtection;