import React, { useEffect, useRef, useState } from "react";
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
    const tourStyle = ["歴史", "グルメ", "自然", "体験"];
    const [bgPosition, setBgPosition] = useState(0);
    const [isHolding, setIsHolding] = useState(false);
    const [progress, setProgress] = useState(0);

    
    const animationFrameId = useRef<number | null>(null);
    
    // isHoldingの状態が変わるたびにこのeffectが実行される
    useEffect(() => {
        // アニメーションのメインループ
        const animate = () => {
            if (isHolding) {
                // isHoldingがtrueの場合：progressを100に向かって増やす
                setProgress(prev => {
                    // 既に100に達していたらループを止める
                    if (prev >= 100) {
                        return 100;
                    }
                    // 次のフレームを予約
                    animationFrameId.current = requestAnimationFrame(animate);
                    // 値を更新（値が大きいほど速くアニメーションします）
                    return Math.min(prev + 0.005, 100);
                });
            } else {
                // isHoldingがfalseの場合：progressを0に向かって減らす
                setProgress(prev => {
                    if (prev <= 0) {
                        return 0;
                    }
                    // 次のフレームを予約
                    animationFrameId.current = requestAnimationFrame(animate);
                    // 値を更新
                    return Math.max(prev - 0.2, 0);
                });
            }
        };
        
        // アニメーションを開始
        animationFrameId.current = requestAnimationFrame(animate);
        
        // クリーンアップ関数
        // このeffectが再実行される前、またはコンポーネントがアンマウントされる時に実行される
        return () => {
            // 前のアニメーションフレームをキャンセルして、ループが重複しないようにする
            if (animationFrameId.current !== null) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
        
    }, [isHolding]);
    
    const handleInputDestination = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDestination(e.target.value);
    };

    const handlePressStart = ()=> setIsHolding(true);
    const handlePressEnd = () => setIsHolding(false);

    // ボタンのスタイルを変数で定義する
    const style = {
        width: '150px',
        height: '150px',
        border: '2px solid #555',
        borderRadius: '50%',
        
        // --- ここが重要 ---
        // 下(to top)から青色がprogress%の位置まで満ち、残りは透明にする
        background: `linear-gradient(to top, royalblue ${progress}%, transparent ${progress}%)`,
        
        // こちらはtransitionが効きにくいので注意
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
            <div className="styleContainerLabel">
                スタイル
            </div>
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
                style={style}
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd}
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
            >
                {isLoading ? "生成中..." : "生成"}
            </button>
        </form>
    );
};

export default InputForm;
