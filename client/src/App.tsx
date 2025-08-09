import { useState } from "react";
import InputForm from "./components/parts/InputForm/InputForm";
import PlanDisplay from "./components/templates/PlanDisplay/PlanDisplay";
import { dummyPlan } from "./dummyData";

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

    // API呼び出し用の関数
    const handleGeneratePlan = (destination: string, theme: string) => {
        setIsLoading(true);
        setPlan(null);
        console.log("プラン生成開始", { destination, theme });

        // 2秒経ったらダミーデータをセット
        setTimeout(() => {
            setPlan(dummyPlan);
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="">
            <h1>AI旅行プランナー</h1>
            <InputForm
                onGenerate={(destination, theme) =>
                    handleGeneratePlan(destination, theme)
                }
                isLoading={isLoading}
            ></InputForm>
            {isLoading && <p>プラン生成中です</p>}
            {plan && <PlanDisplay planData={plan}></PlanDisplay>}
        </div>
    );
}

export default App;
