import React, { useEffect, useRef, useState } from "react";
import "./InputForm.css"; // スタイルシートのインポート
import TopInputButton from "../TopInputButton/TopInputButton";

type InputFormProps = {
    onGenerate: (destination: string, theme: string) => void;
    isLoading: boolean;
};

const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading }) => {
    const [destination, setDestination] = useState<string>("");
    const [theme, setTheme] = useState<string>("");
    const [isHolding, setIsHolding] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);

    const tourStyle = ["歴史", "グルメ", "自然", "体験"];
    const animationFrameId = useRef<number | null>(null);
    const submitted = useRef(false);

    const progressRef = useRef(progress);

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

    useEffect(() => {
        progressRef.current = progress;
    }, [progress]);

    const handleInputDestination = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDestination(e.target.value);
    };

    const handlePressStart = () => {
        if (isHolding) {
            return;
        }
        submitted.current = false;
        setIsHolding(true);
    };

    const handlePressEnd = () => {
        setIsHolding(false);
        if (progressRef.current >= 100 && !submitted.current) {
            onGenerate(destination, theme);
            submitted.current = true;
        }
    };

    // ボタンが押せるか押せないかを決める
    const shouldButtonDisabled = (): boolean => {
        // ロード中はボタンが押せないように
        if (isLoading) {
            return true;
        }
        // 行先とスタイルが決まっていないときはボタンを押せないようにする
        if (destination.trim() === "" || theme.trim() === "") {
            return true;
        }
        return false;
    };

    return (
        <div className="topForm">
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

            <button
                className="generateButton"
                type="button"
                disabled={shouldButtonDisabled()}
                style={{
                    width: "150px",
                    height: "150px",
                    border: "2px solid #555",
                    borderRadius: "50%",
                    position: "relative",
                    overflow: "hidden",
                    backgroundColor: "transparent",
                }}
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd}
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
            >
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
        </div>
    );
};

export default InputForm;
