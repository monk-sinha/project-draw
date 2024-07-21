import { CirclePicker } from 'react-color';

import { useDraw } from "../hooks/useDraw";
import { useEffect, useState } from 'react';
import React from 'react';
import { drawLine } from '../utils/drawLine';
import { io } from 'socket.io-client';
const socket = io('http://localhost:3001');
import { useParams } from 'next/navigation'

type DrawLineProps = {
  prevPoint: Point | null,
  currentPoint: Point,
  color: string
}

export default function Canvas() {
    const[color, setColor] = useState<string>('#000000');

  const { canvasRef, onMouseDown, clearCanvas } = useDraw(createLine);
  const { roomId } = useParams()

  useEffect(() => {
    const ctx  = canvasRef.current?.getContext('2d');

    socket.emit('client-ready', roomId)

    socket.on('get-canvas-state', ()=>{
      if(!canvasRef.current?.toDataURL()) return;
      console.log('sending canvas state')
      socket.emit('canvas-state', canvasRef.current.toDataURL())
    })

    socket.on('server-canvas-state', (state: string,) =>{
      console.log('State received!')
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      } 
    })

    socket.on('draw-line', ({prevPoint, currentPoint, color}: DrawLineProps) =>{
      if(!ctx) return;
      drawLine({prevPoint, currentPoint, ctx, color})
    })
    socket.on('clear', clearCanvas)

    return () => {
      socket.off('get-canvas-state')
      socket.off('server-canvas state')
      socket.off('draw-line')
      socket.off('clear')
    }
  }, [canvasRef])

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    socket.emit('draw-line', {prevPoint, currentPoint, color})
    drawLine({prevPoint, currentPoint, ctx, color})
  }
    return (
        <div className="w-screen h-screen flex justify-center items-center bg-slate-600">
        <div className='flex flex-col gap-10 pr-10'>
        <CirclePicker className='' color={color} onChange={(e:any) => setColor(e.hex)} />
        <button className='border border-black rounded-lg p-2 m-2' onClick={() => socket.emit('clear', roomId)} type='button'>Clear canvas</button>
        <a className='border border-black rounded-lg p-2 m-2 pl-5' href='https://www.discord.com' type='button'>Click for rooms and chat</a>
        </div>
        <canvas ref={canvasRef} onMouseDown={onMouseDown}  width="750" height="500" className="border border-black rounded-md bg-white "></canvas>
      </div>
    )
}