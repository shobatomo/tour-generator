import React from "react";
import "./TopInputButton.css";

type TopInputButtonProps = {
    style: string;
    isActive: boolean;
    setTheme: (theme: string) => void;
};

const TopInputButton: React.FC<TopInputButtonProps> = ({
    style,
    isActive,
    setTheme,
}) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        console.log("clicked⇒", style);
        setTheme(style);
    };

    return isActive ? (
        <button className="inputStyleButton active" onClick={handleClick}>
            {style}
        </button>
    ) : (
        <button className="inputStyleButton" onClick={handleClick}>
            {style}
        </button>
    );
};

export default TopInputButton;
