
"use client"
import Link from "next/link";
import { useState } from "react";
import { handlelogout } from "../actions/forms";

interface cookie{
    cookie:string|null
}

const NavBarWrapper:React.FC<cookie> = ({cookie}) => {


    const routes = {
        Watch: '/home',
        Upload:"/upload",
        SignIn:"/signin",
        SignOut:"/signout"
    }
    const loggedIN = ['/upload', '/home','/signout'];
    const loggedOUT = ['/signin'];

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(()=>!open);
    }



    return ( 
        <div>
            <nav className="bg-slate-400 w-full h-[70px] flex justify-center items-center">
                <div className="flex-grow ml-[20px] ">
                    <p className="text-white font-bold text-3xl">
                       <Link href="/"> Watch Verse</Link>
                    </p>
                </div>
                <div className="flex-grow" >
                    <ul className="md:flex   justify-end  items-center sm:hidden  gap-5  mr-[40px]"  >
                       {Object.entries(routes).map(([key, value]) => {
                                const isLoggedIN = loggedIN.some(route => route===value);
                                const isLoggedOUT = loggedOUT.some(route => route===value);

                            if((isLoggedIN && cookie) ||(isLoggedOUT && !cookie)){
                                return(<li key={key} className="text-white font-bold text-2xl">
                                    {value==='/signout' ? <form action={handlelogout} ><button>{key}</button></form> : <Link href={value}>{key}</Link>}
                                </li>)
                            }
                    })}
                    </ul>
                    <div className="sm:flex md:hidden" >
                        {!open ? (
                            <p className="text-white font-bold text-3xl" onClick={handleOpen} >Menu</p>
                        ) : (
                            <p className="text-white font-bold text-3xl" onClick={handleOpen} >X</p>
                        )}
                    <ul className={`sm:hidden justify-center md:flex items-center gap-5  mr-[40px]`}  >
                       {Object.entries(routes).map(([key, value]) => (
                            <li key={key} className="text-white font-bold text-2xl">
                                <Link href={value}  >{key}</Link>
                            </li>
                        ))}
                    </ul>
                    </div>
                </div>
            </nav>
        </div>
     );
}

export default NavBarWrapper;