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
    const pickColorDifficulty = (difficulty:string):string => {
        switch(difficulty){
            case "easy":
                return "green";
            case "medium":
                return "yellow";
            case "difficult":
                return "red";
            default:
                return "green";
        }
    }
    const color = pickColorDifficulty(quest.difficulty);

    return (    
        <div className="questCard" style={{backgroundColor:color}}>
            <div className="questPoint">{quest.point}</div>
            <div className="questContent">{quest.quest}</div>
        </div>
    )
}

export default QusetCard