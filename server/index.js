require('dotenv').config(); // 環境変数を.envから読み込む
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

// googleAI SDKのインポート
const { GoogleGenerativeAI } = require('@google/generative-ai');

// geminiクライアントの初期化
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// ミドルウェアの設定
// ほかのドメインにアクセスすることを許可する
app.use(cors());
// リクエストをJSON形式に変換する　パース
app.use(express.json());

// ルートエンドポイント　通常はここへアクセスされる
app.get('/', (req, res) => {
    res.send('ようこそ、AI旅行プランナーへ');
});

// プラン作成のエンドポイント
app.post('/api/generate-plan', async (req, res) => {
    try {

        const { destination = '鎌倉', theme = '歴史に触れる' } = req.body;

        // geminiに送信するプロンプト
        const prompt = `
            あなたは、一人旅の背中を押すのが得意な旅行プランナーです。
            以下の条件に基づいて、ユーザーがわくわくするような日帰り旅行プランをクエスト付きで提案してください。
            各スポットで達成する「クエスト」は、少し勇気を出せば達成できる内容にしてください。
            移動手段やおおよその所要時間も考慮してください。
            出力する文章はゲームのシステムのような無機質な口調にしてください。文末は「する」などの命令形で統一してください。
            
            # 条件
            - 行き先: ${destination}
            - 旅のテーマ: ${theme}`;

        // modelの選定とJSON形式のスキーマを提供
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: 'OBJECT',
                    properties: {
                        title: { type: 'STRING' },
                        timeline: {
                            type: 'ARRAY',
                            items: {
                                type: 'OBJECT',
                                properties: {
                                    time: { type: 'STRING' },
                                    spotName: { type: 'STRING' },
                                    description: { type: 'STRING' },
                                    url: { type: 'STRING' },
                                    quest: { type: 'STRING' }
                                },
                                required: ['time', 'spotName', 'description', 'quest'],
                            },
                        },
                    },
                    required: ['title', 'timeline'],
                },
            },
        });
        const result = await model.generateContent(prompt);
        const response = result.response;
        const planJsonText = response.text();

        const planJson = JSON.parse(planJsonText);

        res.json(planJson);

    } catch (error) {
        console.error('プランの作成に失敗しました', error);
        res.status(500).json({ error: 'プランの作成に失敗しました' });
    }
})

app.listen(port, () => {
    console.log * (`サーバーがポート${port}で起動しています`);
})
