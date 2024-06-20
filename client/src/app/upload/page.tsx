"use client"
import { useState } from "react";
import { Input } from "../Components/input";

    const UploadPage: React.FC = () => {
        const [formData, setFormData] = useState<{ title: string; description: string; author: string; file: File | null }>({
            title: "",
            description: "",
            author: "",
            file: null,
        });
    
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };
    
        const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
                setFormData({ ...formData, [e.target.name]: e.target.files[0] });
            }
        };


        const sendReq=(path:string,formdata: FormData) =>{
            return fetch(`http://localhost:5002/${path}`, {
                method: "POST",
                body: formdata
            })
        }
        const sendChunks = async(uploadID: string) => {
            const promises=[]
            const chunks = 1024 * 10 * 1024;
            if (formData.file) {
                const totalChunks = Math.ceil(formData.file.size / chunks);
                for (let i = 0; i < totalChunks; i++) {
                    const formdata = new FormData();
                    const start = i * chunks;
                    const end = Math.min(start + chunks, formData.file.size);
                    const chunk = formData.file.slice(start, end);
                    formdata.append('chunk',chunk);
                    formdata.append("chunkID",i.toString());
                    formdata.append("uploadID",uploadID);
                    formdata.append("fileName",formData.file?.name);
                    const promise =  sendReq(("upload"),formdata)
                    promises.push(promise)
              }

            }

            await Promise.all(promises);

        };

        const completeUpload = async(uploadID: string) => {
            const formdata = new FormData();
            formdata.append("uploadID",uploadID);
            formdata.append("title",formData.title);

            if (formData.file) {
                formdata.append("fileName",formData.file?.name);
            }
            sendReq("complete",formdata)
        }

    const handleSubmit = async() => {
        const formdata = new FormData();
        if (formData.file) {
            formdata.append("fileName",formData.file?.name);
          }        
        formdata.append("title",formData.title);
        formdata.append("description",formData.description);
        formdata.append("author",formData.author);
        const res = await sendReq("init", formdata)
          try
          {
            const data = await res.json();
            if (data && data.uploadID) {
                await sendChunks(data.uploadID);
                await completeUpload(data.uploadID)
            } else {
                console.log("Server response does not have an uploadID property");
                console.log(data)
            }
        }
          catch(err)
          {
            console.log(err);
          }
        
        console.log(formData);
    }

    return (    
        <div className="text-center w-[100vw] h-[100vh] bg-white text-black  " >
            <div className="flex flex-col place-items-center gap-2 w-[100vw] h-[100vh] m-auto  " >
                <h1>Upload Video</h1>
                <Input type="text" placeholder="Video Title" value={formData.title} name="title" onChange={handleChange} />
                <Input type="text" placeholder="Video Description" value={formData.description} name="description" onChange={handleChange} />
                <Input type="text" placeholder=" Author" value={formData.author} name="author" onChange={handleChange} />
                <input type="file"  name="file" onChange={handleFile} /> 
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-max" onClick={handleSubmit} >Upload</button>
            </div>
        </div>
      );
}
 
export default UploadPage;