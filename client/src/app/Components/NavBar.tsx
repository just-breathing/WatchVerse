
import NavBarWrapper from "./NavBarWrapper";
import { getCookie } from "../utils/session";




const NavBar = async() => {
    const cookie = await getCookie();
    return ( 
         <NavBarWrapper cookie={cookie} /> 
     );
}
 
export default NavBar;