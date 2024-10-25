import ldap from 'ldapjs';
import dotenv from 'dotenv';
dotenv.config();

class Ldap_authenticator {
    constructor(baseDN) {
        this.baseDN = baseDN;
    }

    authenticate(username, password) {
        const client = ldap.createClient({
            url: process.env.LDAP_URL || "ldaps://localhost:389",
        });

        const userdn = `uid=${username},${this.baseDN}`;

        return new Promise((resolve, reject) => {
            client.bind(userdn, password, (err) => {
                if (err) {
                    console.error("Bind error:", err);
                    client.unbind();
                    return resolve(false); // Resolve false for failure
                }

                console.log("Authentication successful");
                client.unbind();
                return resolve(true); // Resolve true for success
            });
        });
    }
}

export default Ldap_authenticator;