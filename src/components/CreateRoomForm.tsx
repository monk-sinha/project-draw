import { nanoid } from "nanoid"
import { useEffect, useState } from "react"

import { io } from 'socket.io-client'

import { useRouter } from 'next/navigation'

const socket = io('http://localhost:3001')

export default function CreateRoomForm() {
    const [roomId, setRoomId] = useState<string>(nanoid())
    const [username, setUsername] = useState("")
    const router = useRouter()

    const handleJoinRoom = (e: { preventDefault: () => void }) => {
        e.preventDefault()
        router.push(`/room/${roomId}`)
    }

    const handleCreateRoom = (e: { preventDefault: () => void }) => {
        e.preventDefault()
        console.log(`User ${username} joined room ${roomId}`)
        socket.emit('create-room', ({roomId, username}))

        router.push(`/room/${roomId}`)
    }

    useEffect(() => {
        socket.on('room-created', (roomId: string) => {
          router.replace(`/${roomId}`)
        });
        return () => {socket.off('room-created');}
      }, [router]);


    return (
        <form className="flex flex-col justify-center items-center">
            <div className="mt-2">
                <input type="text" placeholder="Enter user name" className="text-slate-950 rounded-md w-72 h-8 m-2 p-3"
                value={username} onChange={(e) => setUsername(e.target.value)} ></input>
            </div>
            <div className="mb-2">
                <input type="text" placeholder="Generate room code" className="border rounded-md bg-slate-900 w-72 h-8 m-2 p-4" value={roomId} disabled></input>
            </div>
            <div className="flex items-center mt-2">
                <button type="submit" className="border border-white rounded-md w-36 h-8 m-2 bg-slate-900 text-white" onClick={handleCreateRoom}>Create Room</button>
                <button type="submit" className="rounded-md w-36 h-8 m-2 bg-white text-black"
                onClick={handleJoinRoom}>Join Room</button>
            </div>
        </form>
    )
}