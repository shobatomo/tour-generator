import React, { useEffect, useRef, useState } from "react";
import "./InputForm.css"; // スタイルシートのインポート
import TopInputButton from "../TopInputButton/TopInputButton";

type InputFormProps = {
    onGenerate: (destination: string, theme: string) => void;
    isLoading: boolean;
};

const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading }) => {
    const [destination, setDestination] = useState("");
    const [theme, setTheme] = useState("");
    const tourStyle = ["歴史", "グルメ", "自然", "体験"];
    const [isHolding, setIsHolding] = useState(false);
    const [progress, setProgress] = useState(0);

    const animationFrameId = useRef<number | null>(null);
    const submitted = useRef(false);

    // isHoldingの状態に基づいてアニメーションを制御するuseEffect
    useEffect(() => {
        const animate = () => {
            if (isHolding) {
                setProgress((prev) => {
                    if (prev >= 100) {
                        return 100;
                    }
                    animationFrameId.current = requestAnimationFrame(animate);
                    return Math.min(prev + 1.3, 100);
                });
            } else {
                setProgress((prev) => {
                    if (prev <= 0) {
                        return 0;
                    }
                    animationFrameId.current = requestAnimationFrame(animate);
                    return Math.max(prev - 4, 0);
                });
            }
        };

        animationFrameId.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId.current !== null) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [isHolding]);

    // progressが100に達したときの処理 (このロジックは正しいです)
    useEffect(() => {
        if (progress >= 100 && !submitted.current) {
            onGenerate(destination, theme);
            submitted.current = true;
        }
    }, [progress, destination, theme, onGenerate]);

    const handleInputDestination = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDestination(e.target.value);
    };

    const handlePressStart = () => {
        submitted.current = false;
        setIsHolding(true);
    };

    const handlePressEnd = () => {
        setIsHolding(false);
    };

    // ▼▼▼ ここを変更 ▼▼▼
    // <form> を <div> に変更し、onSubmitを削除
    return (
        <div className="topForm">
            {/* 他の入力フィールド */}
            <div className="inputDestination">
                <label htmlFor="destination" className="destinationLabel">
                    行き先
                </label>
                <input
                    id="destination"
                    className="topInput"
                    type="text"
                    value={destination}
                    onChange={handleInputDestination}
                />
            </div>
            <div className="styleContainerLabel">スタイル</div>
            <div className="styleButtonContainer">
                {tourStyle.map((style) => (
                    <TopInputButton
                        key={style}
                        isActive={theme === style}
                        style={style}
                        setTheme={setTheme}
                    />
                ))}
            </div>

            {/* 生成ボタン (この部分は変更なし) */}
            <button
                className="generateButton"
                type="button"
                disabled={isLoading}
                style={{
                    width: "150px",
                    height: "150px",
                    border: "2px solid #555",
                    borderRadius: "50%",
                    position: "relative",
                    overflow: "hidden",
                    backgroundColor: "transparent", // 元のコードの通り
                }}
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd}
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
            >
                {/* ...ボタンの中身は変更なし... */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        backgroundColor: "royalblue",
                        height: `${progress}%`,
                        transition: "height 0.1s linear",
                    }}
                ></div>
                <span
                    style={{ position: "relative", zIndex: 1, color: "white" }}
                >
                    {isLoading
                        ? "生成中..."
                        : progress >= 100
                        ? "完了!"
                        : "長押しで生成"}
                </span>
            </button>
        </div> // ▲▲▲ </form> を </div> に変更 ▲▲▲
    );
};

export default InputForm;
