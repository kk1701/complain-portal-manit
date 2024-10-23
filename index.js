import dotenv from 'dotenv'
import app from './app.js'
import connectToDB from './config/connectDB.js'
import { initializeLdapClient } from './config/ldapDB.js';

const PORT = process.env.PORT || 3000

dotenv.config()
connectToDB()

// Initialize LDAP client
initializeLdapClient();

app.listen(PORT, () => {
    console.log("Server is live at port:", PORT);
});