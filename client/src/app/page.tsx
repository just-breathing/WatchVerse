import { redirect } from 'next/navigation'
import RedirectDiv from './Components/redirectDiv';

async function getData() {
  const data=await fetch("http://localhost:5001/all", {
    method: "GET",
    cache: "no-cache",
    next: { revalidate: 0 },
  })
  const res = await data.json();
  return res;
}

type Props={
    title:string,
    description:string,
    author:string,
    fileName:string
}

export default function Home(): JSX.Element {
  return (
   <div className='grid grid-flow-col w-[100vw] h-[100vh] mt-4 ml-3 gap-1' >
      {getData().then((res)=>res.map((data:Props)=>{
        return (
        <RedirectDiv  key={data.title} url={`http://localhost:4000/watch?key=${data.fileName}`} >
        <div className='mt-6' >
          <p>{data.title}</p>
          <p>{data.author}</p>
          <p>{data.description}</p>
        </div>
        </RedirectDiv>
      )
      }))}
     </div>
  );
}
