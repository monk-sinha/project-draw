import CreateRoomForm from "./CreateRoomForm"
import JoinRoomForm from "./JoinRoomForm"
import { useRouter } from 'next/navigation'
import { nanoid } from "nanoid"

export default function Card(){

        return(
            <div className="rounded-lg border bg-slate-900 text-white shadow-sm flex justify-center items-center m-10 p-10">
                <div className="flex flex-col ">
                    <h5 className="flex justify-center m-3 font-bold text-2xl">Project Draw</h5>
                    <div className="flex justify-center items-center m-5">
                        <CreateRoomForm />
                    </div>
                </div>
            </div>
        )
    }