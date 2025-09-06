import React from 'react'

type Quest = {
    quest:string;
    point:number;
    difficulty:string;
}

type QuestCardProps ={
    quest:Quest;
}

const QusetCard:React.FC<QuestCardProps> = ({quest}) =>{
    // クエストの難易度によって色や形を変えるため変数を分岐する

    return (
        <>
            <div className="questPoint">{quest.point}</div>
            <div className="questContent">{quest.quest}</div>
        </>
        
    )
}

export default QusetCard