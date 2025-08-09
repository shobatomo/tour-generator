import React from "react";
import { Plan } from "../../../App";
import TimeLineItem from "../../parts/TimeLineItem/TimeLineItem";

type PlanDisplayProps = {
    planData: Plan;
};

// PlanDisplayProps型を使用してPropsを受け取る関数であることを明示する
const PlanDisplay: React.FC<PlanDisplayProps> = ({ planData }) => {
    return (
        <div>
            <h2>{planData.title}</h2>
            {planData.timeline.map((item, index) => (
                <div key={index}>
                    <TimeLineItem item={item}></TimeLineItem>
                </div>
            ))}
        </div>
    );
};

export default PlanDisplay;
