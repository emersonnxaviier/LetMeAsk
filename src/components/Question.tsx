import React from 'react';


type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    }
}
                                                        //00:10:35 AULA 4

const Question = ({content, author}: QuestionProps) => {

    return (
        <div className="question">
            <p>{content}</p>

            <footer>
                <div className='user-Info'>

                </div>
            </footer>
        </div>
    );
}

export {Question};