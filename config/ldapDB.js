import ldap from 'ldapjs';
import appError from "../utils/appError.js";
import dotenv from 'dotenv';
dotenv.config();
// ldap db has the initialize client function which will be called in the index.js file to initialize the ldap client and later on we can use the client to search the ldap database for the user details

let client;

const initializeLdapClient = () => {
  client = ldap.createClient({
    url: process.env.LDAP_URL || "ldaps://localhost:389", // Corrected protocol to ldap:
  });

  client.bind(process.env.LDAP_BIND_DN || "cn=admin,dc=dev,dc=com", process.env.LDAP_BIND_PASSWORD || "yoga", (err) => {
    if (err) {
      console.error("LDAP bind failed!", err);
      throw new appError("LDAP bind failed!", 500);
    }
    console.log('LDAP bind successful');
  });

  client.on("error", (err) => {
    console.error("LDAP client error", err);
    initializeLdapClient();
  });
};

export { initializeLdapClient, client };