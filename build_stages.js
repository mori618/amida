import fs from 'fs';

const LANE_COUNT = 5;
const MIN_Y = 80;
const MAX_Y = 505;
const MIN_GAP = 45;

// Simple LCG for seeded random
let seed = 12345;
function random() {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
}
function randint(min, max) {
    return Math.floor(random() * (max - min + 1)) + min;
}
function choice(arr) {
    return arr[randint(0, arr.length - 1)];
}

const STAGE_CONFIGS = [
    // Tier 1: 始まりのあみだ（基本動作） (1-10)
    { desc: "アミダの基本。まずは直線をたどろう", primary: ["system"], tut: "system" },
    { desc: "線が少し増えたよ。迷わないで", primary: ["system"] },
    { desc: "遠回りする道もあるかも？", primary: ["system"] },
    { desc: "ゴールをしっかり見極めて！", primary: ["system"] },
    { desc: "複雑に交差する最初の試練", primary: ["system"] },
    { desc: "線がいっぱい！最適なルートを探せ", primary: ["system"] },
    { desc: "目が回るアミダ。どのレーンから落とす？", primary: ["system"] },
    { desc: "上下によく見て、ボールの軌道を予測しよう", primary: ["system"] },
    { desc: "基本の応用。ボールを狙い通りの場所に落とせるか", primary: ["system"] },
    { desc: "基本の総復習。ここを越えれば次のステージへ", primary: ["system"] },

    // Tier 2: 光と棘の迷宮（エナジーと罠） (11-20)
    { desc: "緑のエナジーを取ってエネルギーを回復させよう", primary: ["bonus"], tut: "bonus" },
    { desc: "赤いスパイクはダメージの危険！避けて進もう", primary: ["penalty"], tut: "penalty" },
    { desc: "エナジーとスパイクが交互に配置された最初の難所", primary: ["bonus", "penalty"] },
    { desc: "アイテムがたくさん！エナジーをたくさん集めよう", primary: ["bonus", "penalty"] },
    { desc: "スパイクの壁を越えろ。精密なラインコントロール", primary: ["system", "penalty"] },
    { desc: "エナジーのご褒美。安全なルートを進もう", primary: ["system", "bonus"] },
    { desc: "欲張ると危険？エナジーを狙うか、安全を取るか", primary: ["bonus", "penalty", "system"] },
    { desc: "複雑な道と罠。裏ルートには何がある？", primary: ["penalty", "system"] },
    { desc: "アイテムラッシュ！一気にエネルギーを満たせ", primary: ["bonus", "penalty"] },
    { desc: "トラップをかいくぐれ。アイテムの総力戦", primary: ["bonus", "penalty", "system"] },

    // Tier 3: 躍動するアミダ（動と静の試練） (21-35)
    { desc: "動く線が登場！左右に揺れるタイミングを見極めて", primary: ["moving"], tut: "moving" },
    { desc: "タイミングを見極めて。動くアミダを乗りこなそう", primary: ["moving"] },
    { desc: "左右に揺れる道。ボールが落ちる瞬間の位置は？", primary: ["moving", "system"] },
    { desc: "動く線がいっぱい！ダンスのように賑やかなステージ", primary: ["moving"] },
    { desc: "スパイクを避けるタイミング。慎重にボールを降らせ", primary: ["moving", "penalty"] },
    { desc: "止まっている道と動く道。2つの挙動を計算しよう", primary: ["moving", "system"] },
    { desc: "エナジーが逃げていく？動く線を狙い撃て", primary: ["moving", "bonus"] },
    { desc: "消える線！？点滅する道をよく見て進もう", primary: ["blink"], tut: "blink" },
    { desc: "点滅する道。記憶力が試される", primary: ["blink", "system"] },
    { desc: "見えない間は進めない。消えている時間を考慮しよう", primary: ["blink"] },
    { desc: "消えるエナジー。現れた瞬間を狙えるか", primary: ["blink", "bonus"] },
    { desc: "見えないスパイクにご用心。出現タイミングを覚えるんだ", primary: ["blink", "penalty"] },
    { desc: "チカチカする迷路。目を凝らしてルートを予測", primary: ["blink"] },
    { desc: "動いて消える幻の道。動と消滅の複合アクション", primary: ["moving", "blink"] },
    { desc: "動く消える罠の迷宮。Tier 3 of 集大成", primary: ["moving", "blink", "penalty"] },

    // Tier 4: 時空の調律（加速と減速） (36-50)
    { desc: "加速線でスピードアップ！一瞬の判断が求められる", primary: ["speedUp"], tut: "speedUp" },
    { desc: "加速線と通常線の連続。超高速のアミダ", primary: ["speedUp", "system"] },
    { desc: "急加速に注意！スパイクへ突っ込まないように", primary: ["speedUp", "penalty"] },
    { desc: "加速してエナジーゲット。スピードの中でアイテムを回収", primary: ["speedUp", "bonus"] },
    { desc: "スピードの限界へ。ボールが目にも留まらぬ速さで駆け抜ける", primary: ["speedUp"] },
    { desc: "動く加速線。揺れ動くブーストポイントを狙え", primary: ["moving", "speedUp"] },
    { desc: "消える超特急。消える加速線のタイミングを計れ", primary: ["blink", "speedUp"] },
    { desc: "スロー線が登場！ボール速度が永続で半分になる", primary: ["slow"], tut: "slow" },
    { desc: "スロー線に触れると次のボールが即時降下！同時降下を操れ", primary: ["slow"] },
    { desc: "急加速と急減速。スピードの落差に脳を慣らせ", primary: ["speedUp", "slow"] },
    { desc: "動くスローモーション。ゆっくり揺れる線をたどる旅", primary: ["moving", "slow"] },
    { desc: "消えゆくスロー線。見えない減速ポイント", primary: ["blink", "slow"] },
    { desc: "スピード＆スロー・トラップ。緩急とスパイクのコンボ", primary: ["speedUp", "slow", "penalty"] },
    { desc: "緩急の迷路.加速と減速を駆使してゴールへ導け", primary: ["speedUp", "slow", "system"] },
    { desc: "スピードマスターの試練。加速と減速、そして動と静の融合", primary: ["speedUp", "slow", "moving", "blink", "penalty"] },

    // Tier 5: 空間跳躍と自己複製 (51-65)
    { desc: "ワープ線が登場！隣ではないレーンへ瞬間移動", primary: ["warp"], tut: "warp" },
    { desc: "どこに繋がっている？ワープの繋がりを見極めろ", primary: ["warp", "system"] },
    { desc: "ワープと罠。ワープした直後の罠をかいくぐれ", primary: ["warp", "penalty"] },
    { desc: "ワープからの急加速。ジャンプした瞬間超高速になる爽快感", primary: ["warp", "speedUp"] },
    { desc: "動くワープ道。動き続けるポータルにボールを滑り込ませろ", primary: ["warp", "moving"] },
    { desc: "消えるワープポイント。タイミングを合わせて跳躍せよ", primary: ["warp", "blink"] },
    { desc: "空間跳躍の迷路。ワープだらけの不思議なあみだ", primary: ["warp", "system"] },
    { desc: "分裂線が登場！元のボールが曲がり、新しいボールが直進する", primary: ["split"], tut: "split" },
    { desc: "分裂するアミダ。ボールを2つ同時にゴールへ導く最初の試練", primary: ["split"] },
    { desc: "分裂とワープのシンフォニー。分裂した瞬間にワープへ突入！", primary: ["warp", "split"] },
    { desc: "揺れながら分裂する道。動く分裂線を乗りこなせ", primary: ["moving", "split"] },
    { desc: "消える分裂線。点滅する分裂線のタイミングを見計らえ", primary: ["blink", "split"] },
    { desc: "分裂加速カオス。2つに増えたボールが一気に加速！", primary: ["speedUp", "split"] },
    { desc: "分裂する罠。増えたボールがスパイクに突っ込む恐怖", primary: ["split", "penalty"] },
    { desc: "空間の支配者の試練。ワープと分裂が交差する超難関", primary: ["warp", "split", "moving", "blink", "penalty"] },

    // Tier 6: 色彩の秩序と逆行する重力 (66-80)
    { desc: "カラーフィルターが登場！同じ色のボールしか通れない壁", primary: ["colorFilter"], tut: "colorFilter" },
    { desc: "色を分けて進もう。赤と青のボールを正しいルートへ", primary: ["colorFilter", "system"] },
    { desc: "色の壁と罠。フィルターでスパイクを回避するテクニック", primary: ["colorFilter", "penalty"] },
    { desc: "自分の色の加速線。特定の色だけがスピードアップ", primary: ["colorFilter", "speedUp"] },
    { desc: "動く色の道。動きながらボールの色をソートする", primary: ["colorFilter", "moving"] },
    { desc: "色付きの点滅道。色と点滅の複合パズル", primary: ["colorFilter", "blink"] },
    { desc: "ワープとカラー。ワープした先で色がどう変わる？", primary: ["colorFilter", "warp"] },
    { desc: "重力反転線が登場！3秒間、ボールが上空へ向けて逆行する", primary: ["reverse"], tut: "reverse" },
    { desc: "上昇とバウンド。天井にぶつかってバウンドし、新たな道へ", primary: ["reverse"] },
    { desc: "重力反転カラーチェンジ。上昇しながら色が切り替わる", primary: ["reverse", "colorFilter"] },
    { desc: "動く重力反転線。動き回る重力反転エリア", primary: ["moving", "reverse"] },
    { desc: "消える逆走ルート。点滅する重力反転を見極めろ", primary: ["blink", "reverse"] },
    { desc: "重力反転と加速の融合。上昇した後に一気に高速落下！", primary: ["speedUp", "reverse"] },
    { desc: "天井バウンドトラップ。逆走した先で待ち構えるスパイク", primary: ["reverse", "penalty"] },
    { desc: "重力と色彩の試練。Tier 6の終わりを飾る色彩重力パズル", primary: ["reverse", "colorFilter", "moving", "blink", "penalty"] },

    // Tier 7: 究極の試練と総力戦 (81-100)
    { desc: "加速、分裂、ワープが同時に牙をむく高速多重アミダ", primary: ["speedUp", "split", "warp"] },
    { desc: "色彩と重力と消える道。すべての要素が絡み合う", primary: ["colorFilter", "reverse", "blink"] },
    { desc: "動く緩急のラビリンス。動きながら加速とスローが切り替わる", primary: ["moving", "slow", "speedUp"] },
    { desc: "逆走と分裂の混沌。ボールが増えながら上に引き戻される！", primary: ["reverse", "split"] },
    { desc: "全カラーギミック大作戦。分裂したカラーボールを完璧にソートせよ", primary: ["colorFilter", "warp", "split"] },
    { desc: "限界の迷路。新旧ギミックがぎっしり詰まった高難度", primary: ["system", "slow", "split", "reverse"] },
    { desc: "動くギミックと分裂の嵐。動きを読み切れ", primary: ["moving", "split"] },
    { desc: "点滅ギミックと重力反転の闇。記憶を頼りに逆走させろ", primary: ["blink", "reverse"] },
    { desc: "加速と減速の限界。超スピードと超スローの融合", primary: ["speedUp", "slow"] },
    { desc: "ワープと分裂の果て。無数にワープする分裂クローン", primary: ["warp", "split"] },
    { desc: "スロー中の減速ボールを、後続の高速ボールが追い抜く時間差の極限", primary: ["slow", "speedUp"] },
    { desc: "左右に配置された分裂線で、ボールが連鎖分裂するピンボールアミダ", primary: ["split", "system"] },
    { desc: "最下部で反転し、天井バウンドから別の長いルートへ引き戻すスリル", primary: ["reverse", "system"] },
    { desc: "スローで時間を稼ぎ、重力反転で上に持ち上げ、加速で一気に落とすコンボ", primary: ["slow", "speedUp", "reverse"] },
    { desc: "3つの新ギミックが完全に融合した、究極の戦略アミダ", primary: ["slow", "split", "reverse"] },
    { desc: "色彩と空間の支配者。カラーソートとワープ、分裂の集大成", primary: ["colorFilter", "warp", "split"] },
    { desc: "全ギミックが配置された、混沌と秩序が織りなす大迷宮", primary: ["bonus", "penalty", "moving", "blink", "speedUp", "warp", "colorFilter", "slow", "split", "reverse"] },
    { desc: "あなたのテクニックの限界に挑む。ノーミスでクリアできるか", primary: ["bonus", "penalty", "moving", "blink", "speedUp", "warp", "colorFilter", "slow", "split", "reverse"] },
    { desc: "アミダマスターへ送る、難攻不落の最終難関", primary: ["bonus", "penalty", "moving", "blink", "speedUp", "warp", "colorFilter", "slow", "split", "reverse"] },
    { desc: "これが本当の終わり。すべての力を出し切り、伝説のマスターへ", primary: ["bonus", "penalty", "moving", "blink", "speedUp", "warp", "colorFilter", "slow", "split", "reverse"] }
];

const stages = [];

// シード値ベースの疑似乱数を用いたシャッフル関数
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = randint(0, i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// 難易度パターンのプールを作成・割り当て
const stagePatterns = new Array(100);
for (let b = 0; b < 20; b++) {
    let pool = [1, 2, 3, 4, 5];
    if (b >= 10) { // ステージ51以降（ブロック11〜20）
        // 難しいステージに関しては4か5のパターンが続いても良い
        if (b < 15) { // ステージ51〜75
            pool = [2, 3, 4, 5, 5];
        } else { // ステージ76〜100
            pool = [3, 4, 5, 4, 5];
        }
    }
    shuffle(pool);
    for (let o = 0; o < 5; o++) {
        stagePatterns[b * 5 + o] = pool[o];
    }
}

function generateLines(stageId, config, targetLineCount) {
    const lines = [];
    const isTutorial = !!config.tut;
    const tutGimmick = config.tut;
    const primaryGimmicks = config.primary;
    const numLines = targetLineCount;

    const gimmickCounts = { 
        system: 0, bonus: 0, penalty: 0, moving: 0, blink: 0, 
        speedUp: 0, warp: 0, colorFilter: 0, colorChange: 0,
        slow: 0, split: 0, reverse: 0
    };

    // --- こだわり意図的配置（プレイスメントエンジン） ---
    
    // 1. チュートリアルのこだわり配置
    if (isTutorial && tutGimmick !== 'system') {
        // 最初の1本目として、必ずレーン 1 または 2 に、上部（Y=170）に対象ギミックを強制配置
        const lane = choice([1, 2]);
        const y = 170;
        const extra = {};
        if (tutGimmick === 'warp') extra.warpToLane = (lane === 1) ? 3 : 0;
        if (tutGimmick === 'colorFilter') extra.filterColorId = 'red';
        lines.push({ kind: tutGimmick, leftLaneIndex: lane, y, ...extra });
        gimmickCounts[tutGimmick]++;
    }

    // 2. 「急加速と急減速」などの緩急変化コンボ（speedUp と slow の両方がある場合）
    if (primaryGimmicks.includes('speedUp') && primaryGimmicks.includes('slow') && !isTutorial) {
        // 上部に speedUp、そのすぐ下部または隣のレーンに slow を配置
        lines.push({ kind: 'speedUp', leftLaneIndex: 1, y: 150 });
        lines.push({ kind: 'slow', leftLaneIndex: 2, y: 260 });
        gimmickCounts['speedUp']++;
        gimmickCounts['slow']++;
    }

    // 3. 「分裂の連鎖とピンボール」（split が含まれる場合）
    if (primaryGimmicks.includes('split') && !isTutorial) {
        // 中段（Y=210, Y=320）に split 線を階段状または左右対称に配置
        lines.push({ kind: 'split', leftLaneIndex: 1, y: 210 });
        lines.push({ kind: 'split', leftLaneIndex: 2, y: 320 });
        gimmickCounts['split'] += 2;
    }

    // 4. 「重力反転のゴール前引き戻し」（reverse が含まれる場合）
    if (primaryGimmicks.includes('reverse') && !isTutorial) {
        // ゴール直前（Y=430）のレーン 1 または 2 に必ず reverse を強制配置
        const revLane = choice([1, 2]);
        lines.push({ kind: 'reverse', leftLaneIndex: revLane, y: 430 });
        gimmickCounts['reverse']++;
    }

    // 5. 「ワープ連携コンボ」（warp が含まれる場合）
    if (primaryGimmicks.includes('warp') && !isTutorial) {
        // ワープ線とペアを配置。そしてワープ先の真下に penalty または speedUp を狙い撃ち
        const srcLane = 1;
        const dstLane = 3;
        lines.push({ kind: 'warp', leftLaneIndex: srcLane, y: 200, warpToLane: dstLane });
        gimmickCounts['warp']++;
        
        // ワープ先（レーン 3）の少し下（Y=270）に加速線またはスパイクを配置
        const comboKind = choice(['speedUp', 'penalty']);
        lines.push({ kind: comboKind, leftLaneIndex: 3, y: 270 });
        gimmickCounts[comboKind]++;
    }

    let attempts = 0;
    while (lines.length < numLines && attempts < 500) {
        attempts++;

        let kind = 'system';
        if (isTutorial) {
            // チュートリアルは、基本線(system)を配置してギミックの純度を保つ
            kind = 'system';
        } else {
            if (random() < 0.7 && primaryGimmicks.length > 0) {
                kind = choice(primaryGimmicks);
            } else {
                kind = 'system';
            }
        }

        if (kind === 'warp' && gimmickCounts['warp'] >= 1) continue;
        if (kind !== 'warp' && kind !== 'system' && gimmickCounts[kind] >= 3) continue;

        const li = randint(0, LANE_COUNT - 2);
        const y = randint(MIN_Y, MAX_Y);

        let conflict = false;
        for (const l of lines) {
            const nearLane = Math.abs(l.leftLaneIndex - li) <= 1;
            const nearY = Math.abs(l.y - y) < MIN_GAP;
            if (nearLane && nearY) {
                conflict = true;
                break;
            }
        }

        if (conflict) continue;

        const extra = {};
        if (kind === 'warp') {
            const candidates = [];
            for (let x = 0; x < LANE_COUNT; x++) {
                if (Math.abs(x - li) >= 2) candidates.push(x);
            }
            if (candidates.length === 0) continue;
            extra.warpToLane = choice(candidates);
        } else if (kind === 'colorFilter') {
            extra.filterColorId = choice(['red', 'blue']);
        } else if (kind === 'moving') {
            extra.amplitude = randint(30, 70);
        } else if (kind === 'blink') {
            extra.blinkInterval = randint(30, 70);
        }

        lines.push({ kind, leftLaneIndex: li, y, ...extra });
        gimmickCounts[kind]++;
    }
    return lines;
}

for (let i = 1; i <= 100; i++) {
    const idx = i - 1;
    let config = STAGE_CONFIGS[idx];
    if (!config) config = { desc: "がんばれ！", primary: ["system"], lines: [10, 10] };

    // 初期線の数を決定する
    let targetLineCount = 0;
    if (i === 1) targetLineCount = 2;
    else if (i === 2) targetLineCount = 4;
    else if (i === 3) targetLineCount = 7;
    else if (i === 4) targetLineCount = 4;
    else if (i === 5) targetLineCount = 10;
    else {
        let pattern = stagePatterns[idx];
        if (config.tut) {
            pattern = 1; // 各ギミックのチュートリアルステージは難易度パターン1にする
        }

        if (pattern === 1) {
            targetLineCount = randint(2, 3);
        } else if (pattern === 2) {
            targetLineCount = randint(2, 7);
        } else if (pattern === 3) {
            targetLineCount = randint(4, 6);
        } else if (pattern === 4) {
            targetLineCount = randint(5, 9);
        } else if (pattern === 5) {
            targetLineCount = randint(8, 10);
        }
    }

    const lines = generateLines(i, config, targetLineCount);

    const speed = 0.8 + (i * 0.008);

    // クリア個数を最低3個、基本3個、多くて5個、かなり多くて7個に調整
    let clearCount = 3;
    if (i >= 86) {
        clearCount = 7;
    } else if (i >= 51) {
        clearCount = 5;
    }
    const totalBalls = clearCount + randint(3, 5);
    let maxBalls = 1 + (i % 3);
    if (i < 10) maxBalls = 1 + (i % 2);
    const maxMiss = i < 50 ? 2 : 1;

    const goalPatterns = [
        ['danger', 'safe', 'target', 'safe', 'danger'],
        ['safe', 'danger', 'target', 'danger', 'safe'],
        ['danger', 'target', 'safe', 'danger', 'safe'],
        ['target', 'danger', 'safe', 'danger', 'target'],
    ];
    const goalTypes = goalPatterns[i % 4];
    const ballColors = i >= 81;

    stages.push({
        id: i,
        name: `ステージ ${i}`,
        description: config.desc,
        ballSpeed: Number(speed.toFixed(2)),
        clearCount,
        totalBalls,
        maxMiss,
        maxBalls,
        goalTypes,
        fixedLines: lines,
        gimmicks: [...config.primary],
        ballColors,
        goalRotating: i >= 40,
        timeLimit: i >= 80 ? 60 : null
    });
}

let jsContent = "/**\n * stages.js - Hardcoded 100 Stages (Themed)\n */\n\n";
jsContent += "export const STAGES = [\n";
for (const s of stages) {
    let linesStr = "[\n";
    for (const l of s.fixedLines) {
        const { kind, leftLaneIndex, y, ...extra } = l;
        const extraStr = Object.entries(extra).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(", ");
        if (extraStr) {
            linesStr += `      { kind: '${kind}', leftLaneIndex: ${leftLaneIndex}, y: ${y}, ${extraStr} },\n`;
        } else {
            linesStr += `      { kind: '${kind}', leftLaneIndex: ${leftLaneIndex}, y: ${y} },\n`;
        }
    }
    linesStr += "    ]";

    jsContent += `  {
    id: ${s.id}, name: '${s.name}', description: '${s.description}',
    ballSpeed: ${s.ballSpeed}, clearCount: ${s.clearCount}, totalBalls: ${s.totalBalls}, maxMiss: ${s.maxMiss}, maxBalls: ${s.maxBalls},
    goalTypes: ${JSON.stringify(s.goalTypes)},
    fixedLines: ${linesStr},
    gimmicks: ${JSON.stringify(s.gimmicks)}, ballColors: ${s.ballColors}, goalRotating: ${s.goalRotating}, timeLimit: ${s.timeLimit}
  },\n`;
}
jsContent += "];\n";

fs.writeFileSync('/Users/mori/Desktop/メモ/amida/src/stages.js', jsContent, 'utf-8');

const csvLines = ["no,クリア個数,初期線の数,緑ゴール数,三角ゴール数,バツゴール数,ボールの速さ（多いほど速い）,同時にあるボール個数,カラー,energy線,spike線,ワープ線,カラー線,onoff線,移動線,FAST線,ONLY線,スロー線,分裂線,重力反転線,総ボール数,ミス許容数,ゴール回転,制限時間,ギミック,description"];

const COLOR_MAP = { 'red': '赤', 'blue': '青', 'purple': '紫' };

for (const stage of stages) {
    function countKind(k) {
        const c = stage.fixedLines.filter(l => l.kind === k).length;
        return c > 0 ? String(c) : "";
    }
    function countColorKind(k, colorAttr) {
        const counts = {};
        for (const l of stage.fixedLines) {
            if (l.kind === k) {
                const c = l[colorAttr] || 'red';
                const jpColor = COLOR_MAP[c] || c;
                counts[jpColor] = (counts[jpColor] || 0) + 1;
            }
        }
        if (Object.keys(counts).length === 0) return "";
        return Object.entries(counts).map(([color, count]) => `${color}${count}`).join("");
    }

    const row = [
        stage.id,
        stage.clearCount,
        stage.fixedLines.length,
        stage.goalTypes.filter(g => g === 'safe').length,
        stage.goalTypes.filter(g => g === 'target').length,
        stage.goalTypes.filter(g => g === 'danger').length,
        stage.ballSpeed.toFixed(2),
        stage.maxBalls,
        stage.ballColors ? "赤青" : "",
        countKind('bonus'),
        countKind('penalty'),
        countKind('warp'),
        countColorKind('colorChange', 'colorChangeTarget'),
        countKind('blink'),
        countKind('moving'),
        countKind('speedUp'),
        countColorKind('colorFilter', 'filterColorId'),
        countKind('slow'),
        countKind('split'),
        countKind('reverse'),
        stage.totalBalls,
        stage.maxMiss,
        stage.goalRotating ? "あり" : "なし",
        stage.timeLimit ? `${stage.timeLimit}秒` : "なし",
        `"${stage.gimmicks.join("/")}"`,
        `"${stage.description}"`
    ];
    csvLines.push(row.join(","));
}

fs.writeFileSync('/Users/mori/Desktop/メモ/amida/stages.csv', csvLines.join("\n"), 'utf-8');

console.log("Stages generated successfully!");
