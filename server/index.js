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
            役割設定
            あなたは、最新の観光情報、交通網、飲食店の口コミや平均待ち時間に関する膨大な知識を持つ、経験豊富な旅行プランナーAIです。特に「一人旅」のプランニングを得意とし、ただ有名な場所を巡るだけでなく、旅する人の心に残るような、少しだけ特別な体験をデザインすることに情熱を燃やしています。
            あなたはユニークなプラン提示します。同じ場所でも違ったプランを提案します。
            

            ゴール
            以下の入力条件と満たすべき要件に従い、一人旅に最適な日帰り旅行プランを提案してください。最終的な出力は、必ず指定されたJSON形式で行ってください。

            入力条件
            destination: ${destination}
            theme: ${theme}
            満たすべき要件
            プランのコンセプト:
            一人でも気兼ねなく楽しめるスポットで構成してください。
            日常から一歩踏み出し、少しだけ勇気を出せるような場所や行動をプランに必ず含めてください。（例：カウンターだけのバー、地元の人と話すきっかけがある場所など）

            クエストは、単なる質問ではなく、以下のいずれかの要素を含む、ユニークで心に残る体験を促すものにしてください。
            クエストは必ず3つ用意してください。
            生成するクエストは簡単:普通:難しい=6:3:1の割合で生成してください。
            達成の難しさによって獲得できるポイントが異なります。
            簡単:1~10ポイント、普通:11~30ポイント、難しい31~100ポイント
            五感を刺激する体験（例：目を閉じて音に集中する、その土地の香りを探す）
            視点を変える発見（例：マンホールの蓋や建物の細部に注目する）
            自分と向き合う時間（例：景色を見ながら特定の問いを自分に投げかける）
            偶然を楽しむ小さな冒険（例：次の行動をコインで決める）
            自然な交流を生む行動（例：質問ではなく感想や感謝を伝えてみる）
            クエストの内容は、「会計の時に『ごちそうさまでした、とても美味しかったです！』と笑顔で伝えてみる」のように、具体的で実行可能なセリフや行動を提示してください。
            さらに、客観的に見てもクエストを達成していることがわかるような内容にしてください。「想像する」「考える」などのように他人から見てクエストを実行しているかどうかわからないようなものは提示しないでください。
            (例：「買う」「手を振る」「食べる」「写真を撮る」「メモをする」など)
            クエストや説明文は、ユーザーが旅に没入できるような、メタ発言（例：「AIの提案ですが…」など）を含まないワクワクする文章で記述してください。
            11:00〜13:00に昼食を、18:00〜20:00に夕食を食べ始められるようにしてください。
            お店が混雑している場合はその時間内にお店に到着することができるようにしてください。
            ご飯はお昼に1回、夜に1回となるようにしてください。食べ歩きなどの軽食は複数回あっても良いです。
            情報の正確性と具体性:
            移動時間は公共交通機関を基準に正確に計算し、実現可能なスケジュールを組んでください。
            公共交通機関を利用する場合は、路線名、料金、所要時間、乗り換え情報などを「howto」に具体的に記載してください。
            公共交通機関ではなくレンタカーや自家用車を想定する場合は車で〇〇分といった表記にしてください。
            飲食店を提案する場合、一般的な待ち時間を考慮して滞在時間を設定してください。
            spot_name（スポット名）は正式名称を記載してください。
            urlは必ず実在する公式URLや参考URLを記載してください。適切なURLが見つからない場合は、空文字（""）を出力してください。
            プランの構成:
            タイムラインの開始時間は10:00以降で設定してください。
            タイムラインの終了時間は午後20:00から22:00の間で設定してください。
            ユーザーが選択したthemeを中心にしつつも、観光、グルメ、体験など、他の要素もバランス良く取り入れた多様性のあるプランにしてください。
            可能な限り、ガイドブックには載っていないような、地元で愛されるお店や隠れた名所（穴場スポット）を一つ以上含めるよう努めてください。見つからない場合は、王道で人気のあるプランでも構いません。
            timelineは要素を5〜8個程度で構成してください。            
            
            エラーハンドリング:
            destinationに明らかに地名や観光地名でない文字列（例：「あいうえお」「こんにちは」など）が入力された場合は、プランを生成せず、"error": trueを含むJSONを出力してください。その際、titleやtimelineの他の要素は空にしてください。`

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
                                    quest: { type: 'STRING' },
                                    howto: { type: 'STRING' }
                                },
                                required: ['time', 'spotName', 'description', 'quest'],
                            },
                        },
                        error: { type: 'BOOLEAN' }
                    },
                    required: ['title', 'timeline', 'error'],
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
