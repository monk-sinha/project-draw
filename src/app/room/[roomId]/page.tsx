'use client'

import Canvas from "@/components/Canvas";

interface PageProps {
    params : {
        roomId: string
    }
}

const page = async ({params}: PageProps) => {
    const roomId = params;
    
    return (
        <div className="w-screen h-screen bg-slate-900 flex justify-center items-center"> 
        <Canvas />
        </div>
    );
};

export default page