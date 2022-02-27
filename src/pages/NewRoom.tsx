import {FormEvent, useState} from 'react';

import '../styles/auth.scss';

import {Link, useHistory} from 'react-router-dom';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';


const NewRoom = () => {

    const [nameNewRoom, setNameNewRoom] = useState('');
    const history = useHistory();
    const {user} = useAuth();




    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        if(nameNewRoom.trim() === ''){
            return;
        }

        const roomRef = database.ref('rooms');

        const firebaseRoom = await roomRef.push({
            title: nameNewRoom,
            authorId: user?.id
        });

        history.push(`/rooms/${firebaseRoom.key}`);
    }




    
    return (
        <div id='page-auth'>
            <aside>
                <img src={illustrationImg} alt="Perguntas e respostas" />
                <strong> Crie salas de Q&amp;A ao-vivo </strong>
                <p> Tire as dúvidas da sua audiência em tempo-real </p>
            </aside>

            <main>
                <div className='main-content'>
                    <img src={logoImg} alt="letmeask" />

                    <h2>Criar uma nova sala</h2>

                    <form action="" onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            onChange={e => setNameNewRoom(e.target.value)}
                            value={nameNewRoom}
                        />

                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>

                    <p>
                        Quer entrar em uma sala existente?
                        <Link to='/'>
                            clique aqui.
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );

}

export default NewRoom;