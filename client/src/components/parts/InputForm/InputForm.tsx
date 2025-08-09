import React, { useState } from "react";
import "./InputForm.css"; // スタイルシートのインポート

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

    const handleInputDestination = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDestination(e.target.value);
    };

    const handleInputTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTheme(e.target.value);
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onGenerate(destination, theme);
            }}
        >
            {/* 他の入力フィールドをここに追加できます */}
            <input
                type="text"
                value={destination}
                onChange={handleInputDestination}
            />
            <input type="text" value={theme} onChange={handleInputTheme} />
            <button type="submit" disabled={isLoading}>
                {isLoading ? "生成中..." : "生成"}
            </button>
        </form>
    );
};

export default InputForm;
