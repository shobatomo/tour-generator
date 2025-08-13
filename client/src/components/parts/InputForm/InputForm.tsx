import React, { useState } from "react";
import "./InputForm.css"; // スタイルシートのインポート
import TopInputButton from "../TopInputButton/TopInputButton";

// typeでpropsの方を定義する
type InputFormProps = {
    // 渡された関数に引数を渡すことができる
    // 元の関数に渡す引数を子コンポーネントから渡す
    onGenerate: (destination: string, theme: string) => void;
    isLoading: boolean;
};

// 定義した型を使用するReactFunctionだと明示する
const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading }) => {
    const [destination, setDestination] = useState("");
    const [theme, setTheme] = useState("");
    const [clicked, setClicked] = useState(false);
    const tourStyle = ["歴史", "グルメ", "自然", "体験"];

    const handleInputDestination = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDestination(e.target.value);
    };

    return (
        <form
            className="topForm"
            onSubmit={(e) => {
                e.preventDefault();
                onGenerate(destination, theme);
            }}
        >
            {/* 他の入力フィールドをここに追加できます */}
            <input
                className="topInput"
                type="text"
                value={destination}
                onChange={handleInputDestination}
            />
            <div className="styleButtonContainer">
                {tourStyle.map((style) => {
                    return (
                        <TopInputButton
                            key={style}
                            isActive={theme === style}
                            style={style}
                            setTheme={setTheme}
                        ></TopInputButton>
                    );
                })}
            </div>
            <button
                className="generateButton"
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? "生成中..." : "生成"}
            </button>
        </form>
    );
};

export default InputForm;
