// src/components/TimeLineItem.tsx

import React from "react";
import QuestCard from "../QuestCard/QusetCard";

// コンポーネントが受け取るPropsのデータ型
type Quest ={
    quest: string;
    point:number;
    difficulty:string;
}

type ItemType = {
    time: string;
    spotName: string;
    description: string;
    url: string;
    quests: Array<Quest>;
    howto: string;
    error: boolean;
};

// Propsの型を定義する
type TimeLineItemProps = {
    item: ItemType;
};

// Reactコンポーネントは、Propsを引数として受け取り、
// JSXを返す「関数」として定義します。
const TimeLineItem: React.FC<TimeLineItemProps> = ({ item }) => {
    return (
        <div
            style={{
                border: "1px solid #ccc",
                margin: "10px",
                padding: "10px",
            }}
        >
            {/* 受け取った 'item' オブジェクトの各プロパティを表示します */}
            <h3>
                {item.time} - {item.spotName}
            </h3>
            <p>{item.description}</p>
            <div className="howto">{item.howto}</div>

            {/* URLが存在する場合のみ、リンクを表示する */}
            {item.url && (
                <p>
                    <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        関連情報を見る
                    </a>
                </p>
            )}

            <div
                style={{
                    marginTop: "10px",
                    padding: "10px",
                    background: "transparent",
                }}
            >
                <strong>クエスト：</strong>
                <div className="questsContainer">
                    {item.quests.map((quest, index) => (
                            <QuestCard quest={quest} key={index}></QuestCard>
                    )
                    )}
                </div>
            </div>
        </div>
    );
};

export default TimeLineItem;
