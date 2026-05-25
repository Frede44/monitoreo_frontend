import {  Cpu, Trash2, SquarePen, Wifi  } from 'lucide-react';
import Button from '../Button';

export default function CardsDispositivos({nombre, ubicacion, mac, token, estado, onClickEditar}) {
    return(
        <div className='bg-white rounded border p-4'>
            <div className='flex flex-row justify-between items-center mb-4'>
                <div className='flex flex-row gap-3'>
                    <Cpu/>
                    <h1>{nombre}</h1>
                </div>
                <div className='bg-green-500 text-white p-2 rounded-2xl flex flex-row gap-2 items-center'>
                    <Wifi className='size-3'/>
                    <p className='text-xs'>{estado}</p>
                </div>

            </div>

            <div >
                <div className='mb-2'>
                    <p className='text-gray-400'>Ubicacion</p>
                    <p >{ubicacion}</p>
                </div>
                <div className='mb-2'>
                    <p className='text-gray-400'>MAC</p>
                    <p>{mac}</p>
                </div>
                <div className='mb-2 break-words'>
                    <p className='text-gray-400'>Token</p>
                    <p className=''>{token}</p>
                </div>
            </div>

            <div className='flex flex-row gap-2 mt-4'>
                <Button estile='text-black w-full flex flex-row gap-2 justify-center items-center text-sm border border-black hover:bg-gray-200' onClick={onClickEditar}> <SquarePen className='size-4' />  Editar</Button>
                <Button estile='text-white bg-red-500 hover:bg-red-600 flex flex-row gap-2 items-center text-sm' > <Trash2 className='size-4' /></Button>
            </div>
        </div>
    )
}