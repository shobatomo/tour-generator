import { useState } from "react";
import InputForm from "./components/parts/InputForm/InputForm";
import PlanDisplay from "./components/templates/PlanDisplay/PlanDisplay";
import { dummyPlan } from "./dummyData";
import axios from "axios";
import "./App.css";

export interface Plan {
    title: string;
    timeline: {
        time: string;
        spotName: string;
        description: string;
        url: string;
        quest: string;
    }[];
}

function App() {
    const [plan, setPlan] = useState<Plan | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // API呼び出し用の関数
    const handleGeneratePlan = async (destination: string, theme: string) => {
        setIsLoading(true);
        setPlan(null);
        setError(null); // エラーをリセット

        try {
            // バックエンドのAPIエンドポイントにPOSTリクエストを送信
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/generate-plan`,
                {
                    destination: destination,
                    theme: theme,
                }
            );

            // 成功したら、レスポンスデータをstateにセット
            setPlan(response.data);
        } catch (err) {
            // エラーが発生したら、エラーメッセージをstateにセット
            console.error("API Error:", err);
            setError(
                "プランの生成に失敗しました。時間をおいて再度お試しください。"
            );
        } finally {
            // 成功しても失敗しても、ローディングは終了する
            setIsLoading(false);
        }
    };

    return (
        <div className="mainBody">
            {!plan && (
                <div className="topContainer">
                    <div className="titleContainer">
                        <h1 className="titleText">Quested</h1>
                        <p className="subTitleText">
                            AIと見つける、新しい旅のカタチ
                        </p>
                        <p className="titleDescription">
                            行き先とスタイルを入力するだけで、
                            <br />
                            AIがあなたにぴったりの日帰りプランと
                            <br />
                            旅を10倍楽しくするクエストを提案します。
                        </p>
                    </div>
                    <InputForm
                        onGenerate={(destination, theme) =>
                            handleGeneratePlan(destination, theme)
                        }
                        isLoading={isLoading}
                    ></InputForm>
                    <div className="messageContainer">
                        {isLoading && <p>プラン生成中です</p>}
                        {error && <p style={{ color: "red" }}>{error}</p>}
                    </div>
                </div>
            )}
            {plan && !isLoading && <PlanDisplay planData={plan}></PlanDisplay>}
        </div>
    );
}

export default App;
