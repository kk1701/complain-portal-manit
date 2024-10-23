import ldap from 'ldapjs';
import appError from "../utils/appError.js";

//ldap db  has the initialize client function which will be called in the index.js file to initialize the ldap client and later on we can use the client to search the ldap database for the user details

let client;



const initializeLdapClient = () => {
  client = ldap.createClient({
    url: process.env.LDAP_URL
  });

  client.bind(process.env.LDAP_BIND_DN, process.env.LDAP_BIND_PASSWORD, (err) => {
    if (err) {
      console.error("LDAP bind failed ! ", err);
      throw new appError("LDAP bind failed !", 500);
    }
    console.log('LDAP bind successful');
  });
  client.on("error", (err) => {
    console.error("LDAP client error", err);
    initializeLdapClient();
  })

}



export default { initializeLdapClient, client };