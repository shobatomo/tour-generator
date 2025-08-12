import React from "react";
import "./TopInputButton.css";

type TopInputButtonProps = {
    style: string;
    setTheme: (theme: string) => void;
};

const TopInputButton: React.FC<TopInputButtonProps> = ({ style, setTheme }) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setTheme(style);
    };

    return (
        <button className="inputStyleButton" onClick={handleClick}>
            {style}
        </button>
    );
};

export default TopInputButton;
