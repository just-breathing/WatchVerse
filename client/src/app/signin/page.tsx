
import Link from "next/link";
import {handleSignIn} from "../actions/forms";

const SignUp = () => {
    return ( 
        <div className="text-center w-[100vw] h-[100vh] bg-white text-black m-auto " >
            <form  action={handleSignIn} className="flex flex-col place-items-center gap-2 w-[100vw] h-[100vh] my-auto  -translate-y-[-15vh] " >
                <h1 className="text-2xl" >Sign In</h1>
                <input type="text" name="email" placeholder="Enter email" className={` outline-none w-[350px] bg-none border border-black`}/>
                <input type="password" name="password" placeholder="Enter password" className={` outline-none w-[350px] bg-none border border-black`} />
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-max">Sign In</button>
                <Link href="/signup">Sign Up</Link>
            </form>
        </div>
     );
}
 
export default SignUp;