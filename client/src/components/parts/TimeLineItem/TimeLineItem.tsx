// src/components/TimeLineItem.tsx

import React from "react";

// コンポーネントが受け取るPropsのデータ型
type ItemType = {
    time: string;
    spotName: string;
    description: string;
    url: string;
    quest: string;
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
                {item.quest}
            </div>
        </div>
    );
};

export default TimeLineItem;
