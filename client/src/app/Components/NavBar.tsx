const NavBar = () => {
    const routes = {
        Home: '/',
        Upload:"/upload",
        SignIn:"/signin",
        SignOut:"/signout"
    }
    return ( 
        <div>
            <nav className="bg-slate-400 w-full h-[70px] flex justify-center items-center">
                <div className="flex-grow ml-[20px] ">
                    <p className="text-white font-bold text-3xl">Watch Verse</p>
                </div>
                <div className="flex-grow" >
                    <ul className="flex justify-end items-center gap-5  mr-[40px]"  >
                       {Object.entries(routes).map(([key, value]) => (
                            <li key={key} className="text-white font-bold text-2xl">
                                <a href={value}>{key}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </div>
     );
}
 
export default NavBar;