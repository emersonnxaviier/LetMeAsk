import React from 'react';

import '../styles/room-code.scss';

import copyImg from '../assets/images/copy.svg';


type RoomCodeProps = {
    code: string;
}

const RoomCode = (props: RoomCodeProps) => {

    function copyRoomCodeToClipboard(){
        navigator.clipboard.writeText(props.code);  //CLIQUE PARA COPIAR O TEXTO
    }




    return(
        <button 
            className='room-code'
            onClick={copyRoomCodeToClipboard}
        >
            <div>
                <img src={copyImg} alt="copy room code" />
            </div>

            <span>Sala #{props.code}</span>
        </button>
    );

}

export {RoomCode}