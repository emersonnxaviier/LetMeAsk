import React, { FormEvent, useEffect, useState } from 'react';

import '../styles/room.scss';

import logoImg from '../assets/images/logo.svg';

import {useParams} from 'react-router-dom';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { type } from 'os';





type FirebaseQuestions = Record<string, {    //RECORD UTILIZADO PARA OBJETOS
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighligted: boolean;
}>

type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighligted: boolean;
}


type RoomParams = {
    id: string;
}


const Room = () => {

    const params = useParams<RoomParams>();
    const roomID = params.id;
    const {user} = useAuth();

    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');





    useEffect(() => {
        
        const roomRef = database.ref(`rooms/${roomID}`);
        roomRef.on('value', room => {  // on serve para ouvir informações em tempo real.

            const databaseRoom = room.val();
            const firebaseQuestions = databaseRoom.questions as FirebaseQuestions ?? {};

           const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighligted: value.isHighligted,
                    isAnswered: value.isAnswered,
                }
           });

           setTitle(databaseRoom.title); 
           setQuestions(parsedQuestions);
        });

    }, [roomID]);




    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if(newQuestion.trim() === ''){
            return;
        }

        if(!user){
            throw new Error('You must be logged in');
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,
            },
            isHighLighted: false, // DESTAQUE NA PERGUNTA, PARA DETERMINAR SE ESTÁ SENDO RESPONDIDA OU NÃO.
            isAnswered: false  // VERIFICA SE A PERGUNTA JÁ FOI RESPONDIDA OU NÃO.
        }

        await database.ref(`rooms/${roomID}/questions`).push(question);
        setNewQuestion('');
    }








    return(
        <div id='page-room'>
            
            <header>
                <div className='content'>
                    <img src={logoImg} alt="Letmeask"/>
                    <RoomCode code={roomID}/>
                </div>
            </header>

            <main>
                <div className='room-title'>
                    <h1>Sala {title}</h1>

                    {
                        questions.length > 0 && 
                        <span> 
                            {questions.length} pergunta{questions.length !== 1 ? 's' : ''}
                        </span>
                    }
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder='O que você quer perguntar ?'
                        onChange={e => setNewQuestion(e.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        {
                            user 
                            ?
                            (<div className='user-info'>
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>)
                            :
                            (<span>
                                Para enviar uma pergunta, 
                                <button>faça seu login</button> 
                            </span>)
                        }
                        <Button 
                            type='submit'
                            disabled={!user}
                        >
                            Enviar pergunta
                        </Button>
                    </div>
                </form>


                {
                    JSON.stringify(questions)
                }
            </main>
        </div>
    );
}

export {Room};