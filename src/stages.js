/**
 * stages.js - Hardcoded 100 Stages (Themed)
 */

export const STAGES = [
  {
    id: 1, name: 'ステージ 1', description: 'アミダの基本。まずは直線をたどろう',
    ballSpeed: 0.81, clearCount: 3, totalBalls: 7, maxMiss: 2, maxBalls: 2,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 3, y: 374 },
      { kind: 'system', leftLaneIndex: 2, y: 461 },
    ],
    gimmicks: ["system"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 2, name: 'ステージ 2', description: '線が少し増えたよ。迷わないで',
    ballSpeed: 0.82, clearCount: 3, totalBalls: 7, maxMiss: 2, maxBalls: 1,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 1, y: 413 },
      { kind: 'system', leftLaneIndex: 0, y: 343 },
      { kind: 'system', leftLaneIndex: 2, y: 458 },
      { kind: 'system', leftLaneIndex: 3, y: 391 },
    ],
    gimmicks: ["system"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 3, name: 'ステージ 3', description: '遠回りする道もあるかも？',
    ballSpeed: 0.82, clearCount: 3, totalBalls: 7, maxMiss: 2, maxBalls: 2,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 3, y: 246 },
      { kind: 'system', leftLaneIndex: 2, y: 118 },
      { kind: 'system', leftLaneIndex: 3, y: 318 },
      { kind: 'system', leftLaneIndex: 1, y: 167 },
      { kind: 'system', leftLaneIndex: 1, y: 239 },
      { kind: 'system', leftLaneIndex: 1, y: 442 },
      { kind: 'system', leftLaneIndex: 1, y: 325 },
    ],
    gimmicks: ["system"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 4, name: 'ステージ 4', description: 'ゴールをしっかり見極めて！',
    ballSpeed: 0.83, clearCount: 3, totalBalls: 6, maxMiss: 2, maxBalls: 1,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 1, y: 158 },
      { kind: 'system', leftLaneIndex: 0, y: 452 },
      { kind: 'system', leftLaneIndex: 0, y: 231 },
      { kind: 'system', leftLaneIndex: 0, y: 85 },
    ],
    gimmicks: ["system"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 5, name: 'ステージ 5', description: '複雑に交差する最初の試練',
    ballSpeed: 0.84, clearCount: 3, totalBalls: 6, maxMiss: 2, maxBalls: 2,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 2, y: 389 },
      { kind: 'system', leftLaneIndex: 2, y: 134 },
      { kind: 'system', leftLaneIndex: 1, y: 255 },
      { kind: 'system', leftLaneIndex: 0, y: 183 },
      { kind: 'system', leftLaneIndex: 3, y: 257 },
      { kind: 'system', leftLaneIndex: 2, y: 444 },
      { kind: 'system', leftLaneIndex: 1, y: 492 },
      { kind: 'system', leftLaneIndex: 0, y: 369 },
      { kind: 'system', leftLaneIndex: 0, y: 314 },
      { kind: 'system', leftLaneIndex: 2, y: 325 },
    ],
    gimmicks: ["system"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 6, name: 'ステージ 6', description: '線がいっぱい！最適なルートを探せ',
    ballSpeed: 0.85, clearCount: 3, totalBalls: 6, maxMiss: 2, maxBalls: 1,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 0, y: 389 },
      { kind: 'system', leftLaneIndex: 1, y: 218 },
      { kind: 'system', leftLaneIndex: 0, y: 483 },
      { kind: 'system', leftLaneIndex: 3, y: 421 },
      { kind: 'system', leftLaneIndex: 1, y: 148 },
      { kind: 'system', leftLaneIndex: 2, y: 475 },
    ],
    gimmicks: ["system"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 7, name: 'ステージ 7', description: '目が回るアミダ。どのレーンから落とす？',
    ballSpeed: 0.86, clearCount: 3, totalBalls: 8, maxMiss: 2, maxBalls: 2,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 2, y: 201 },
      { kind: 'system', leftLaneIndex: 3, y: 262 },
      { kind: 'system', leftLaneIndex: 0, y: 276 },
      { kind: 'system', leftLaneIndex: 0, y: 410 },
    ],
    gimmicks: ["system"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 8, name: 'ステージ 8', description: '上下によく見て、ボールの軌道を予測しよう',
    ballSpeed: 0.86, clearCount: 3, totalBalls: 7, maxMiss: 2, maxBalls: 1,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 2, y: 156 },
      { kind: 'system', leftLaneIndex: 3, y: 107 },
      { kind: 'system', leftLaneIndex: 0, y: 281 },
    ],
    gimmicks: ["system"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 9, name: 'ステージ 9', description: '基本の応用。ボールを狙い通りの場所に落とせるか',
    ballSpeed: 0.87, clearCount: 3, totalBalls: 8, maxMiss: 2, maxBalls: 2,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 1, y: 425 },
      { kind: 'system', leftLaneIndex: 3, y: 344 },
    ],
    gimmicks: ["system"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 10, name: 'ステージ 10', description: '基本の総復習。ここを越えれば次のステージへ',
    ballSpeed: 0.88, clearCount: 3, totalBalls: 8, maxMiss: 2, maxBalls: 2,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 2, y: 447 },
      { kind: 'system', leftLaneIndex: 1, y: 99 },
      { kind: 'system', leftLaneIndex: 2, y: 342 },
      { kind: 'system', leftLaneIndex: 2, y: 268 },
      { kind: 'system', leftLaneIndex: 3, y: 149 },
      { kind: 'system', leftLaneIndex: 0, y: 432 },
      { kind: 'system', leftLaneIndex: 0, y: 494 },
      { kind: 'system', leftLaneIndex: 0, y: 195 },
    ],
    gimmicks: ["system"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 11, name: 'ステージ 11', description: '緑のエナジーを取ってエネルギーを回復させよう',
    ballSpeed: 0.89, clearCount: 3, totalBalls: 7, maxMiss: 2, maxBalls: 3,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'bonus', leftLaneIndex: 1, y: 170 },
      { kind: 'system', leftLaneIndex: 3, y: 87 },
    ],
    gimmicks: ["bonus"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 12, name: 'ステージ 12', description: '赤いスパイクはダメージの危険！避けて進もう',
    ballSpeed: 0.9, clearCount: 3, totalBalls: 6, maxMiss: 2, maxBalls: 1,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'penalty', leftLaneIndex: 1, y: 170 },
      { kind: 'system', leftLaneIndex: 3, y: 379 },
    ],
    gimmicks: ["penalty"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 13, name: 'ステージ 13', description: 'エナジーとスパイクが交互に配置された最初の難所',
    ballSpeed: 0.9, clearCount: 3, totalBalls: 7, maxMiss: 2, maxBalls: 2,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 2, y: 163 },
      { kind: 'bonus', leftLaneIndex: 2, y: 209 },
      { kind: 'bonus', leftLaneIndex: 2, y: 484 },
    ],
    gimmicks: ["bonus","penalty"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 14, name: 'ステージ 14', description: 'アイテムがたくさん！エナジーをたくさん集めよう',
    ballSpeed: 0.91, clearCount: 3, totalBalls: 8, maxMiss: 2, maxBalls: 3,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 1, y: 420 },
      { kind: 'penalty', leftLaneIndex: 0, y: 482 },
      { kind: 'penalty', leftLaneIndex: 0, y: 179 },
      { kind: 'system', leftLaneIndex: 2, y: 198 },
      { kind: 'system', leftLaneIndex: 1, y: 318 },
    ],
    gimmicks: ["bonus","penalty"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 15, name: 'ステージ 15', description: 'スパイクの壁を越えろ。精密なラインコントロール',
    ballSpeed: 0.92, clearCount: 3, totalBalls: 6, maxMiss: 2, maxBalls: 1,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'penalty', leftLaneIndex: 2, y: 166 },
      { kind: 'system', leftLaneIndex: 2, y: 434 },
      { kind: 'system', leftLaneIndex: 3, y: 308 },
      { kind: 'penalty', leftLaneIndex: 2, y: 258 },
      { kind: 'penalty', leftLaneIndex: 2, y: 94 },
    ],
    gimmicks: ["system","penalty"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 16, name: 'ステージ 16', description: 'エナジーのご褒美。安全なルートを進もう',
    ballSpeed: 0.93, clearCount: 3, totalBalls: 8, maxMiss: 2, maxBalls: 2,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'bonus', leftLaneIndex: 1, y: 95 },
      { kind: 'bonus', leftLaneIndex: 3, y: 503 },
      { kind: 'system', leftLaneIndex: 3, y: 192 },
      { kind: 'system', leftLaneIndex: 0, y: 437 },
      { kind: 'bonus', leftLaneIndex: 0, y: 221 },
      { kind: 'system', leftLaneIndex: 0, y: 389 },
      { kind: 'system', leftLaneIndex: 1, y: 293 },
    ],
    gimmicks: ["system","bonus"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 17, name: 'ステージ 17', description: '欲張ると危険？エナジーを狙うか、安全を取るか',
    ballSpeed: 0.94, clearCount: 3, totalBalls: 7, maxMiss: 2, maxBalls: 3,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 3, y: 409 },
      { kind: 'system', leftLaneIndex: 3, y: 236 },
      { kind: 'system', leftLaneIndex: 3, y: 296 },
      { kind: 'system', leftLaneIndex: 1, y: 425 },
      { kind: 'bonus', leftLaneIndex: 1, y: 358 },
      { kind: 'system', leftLaneIndex: 1, y: 501 },
      { kind: 'bonus', leftLaneIndex: 0, y: 301 },
      { kind: 'system', leftLaneIndex: 3, y: 499 },
      { kind: 'system', leftLaneIndex: 0, y: 160 },
    ],
    gimmicks: ["bonus","penalty","system"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 18, name: 'ステージ 18', description: '複雑な道と罠。裏ルートには何がある？',
    ballSpeed: 0.94, clearCount: 3, totalBalls: 7, maxMiss: 2, maxBalls: 1,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'penalty', leftLaneIndex: 2, y: 450 },
      { kind: 'system', leftLaneIndex: 3, y: 132 },
      { kind: 'system', leftLaneIndex: 3, y: 258 },
      { kind: 'system', leftLaneIndex: 3, y: 200 },
    ],
    gimmicks: ["penalty","system"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 19, name: 'ステージ 19', description: 'アイテムラッシュ！一気にエネルギーを満たせ',
    ballSpeed: 0.95, clearCount: 3, totalBalls: 7, maxMiss: 2, maxBalls: 2,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'penalty', leftLaneIndex: 2, y: 285 },
      { kind: 'penalty', leftLaneIndex: 0, y: 119 },
      { kind: 'penalty', leftLaneIndex: 1, y: 451 },
    ],
    gimmicks: ["bonus","penalty"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 20, name: 'ステージ 20', description: 'トラップをかいくぐれ。アイテムの総力戦',
    ballSpeed: 0.96, clearCount: 3, totalBalls: 6, maxMiss: 2, maxBalls: 3,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'penalty', leftLaneIndex: 2, y: 223 },
      { kind: 'bonus', leftLaneIndex: 2, y: 346 },
      { kind: 'bonus', leftLaneIndex: 2, y: 392 },
      { kind: 'system', leftLaneIndex: 0, y: 138 },
      { kind: 'penalty', leftLaneIndex: 1, y: 279 },
      { kind: 'bonus', leftLaneIndex: 1, y: 500 },
      { kind: 'system', leftLaneIndex: 0, y: 229 },
      { kind: 'system', leftLaneIndex: 2, y: 133 },
      { kind: 'penalty', leftLaneIndex: 0, y: 402 },
    ],
    gimmicks: ["bonus","penalty","system"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 21, name: 'ステージ 21', description: '動く線が登場！左右に揺れるタイミングを見極めて',
    ballSpeed: 0.97, clearCount: 3, totalBalls: 6, maxMiss: 2, maxBalls: 1,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'moving', leftLaneIndex: 2, y: 170 },
      { kind: 'system', leftLaneIndex: 2, y: 468 },
      { kind: 'system', leftLaneIndex: 1, y: 105 },
    ],
    gimmicks: ["moving"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 22, name: 'ステージ 22', description: 'タイミングを見極めて。動くアミダを乗りこなそう',
    ballSpeed: 0.98, clearCount: 3, totalBalls: 6, maxMiss: 2, maxBalls: 2,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 3, y: 446 },
      { kind: 'moving', leftLaneIndex: 0, y: 233, amplitude: 47 },
      { kind: 'moving', leftLaneIndex: 2, y: 134, amplitude: 54 },
      { kind: 'moving', leftLaneIndex: 0, y: 296, amplitude: 44 },
      { kind: 'system', leftLaneIndex: 0, y: 129 },
    ],
    gimmicks: ["moving"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 23, name: 'ステージ 23', description: '左右に揺れる道。ボールが落ちる瞬間の位置は？',
    ballSpeed: 0.98, clearCount: 3, totalBalls: 7, maxMiss: 2, maxBalls: 3,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 2, y: 282 },
      { kind: 'moving', leftLaneIndex: 3, y: 403, amplitude: 70 },
      { kind: 'moving', leftLaneIndex: 1, y: 122, amplitude: 66 },
      { kind: 'system', leftLaneIndex: 0, y: 325 },
      { kind: 'moving', leftLaneIndex: 1, y: 427, amplitude: 64 },
      { kind: 'system', leftLaneIndex: 1, y: 495 },
      { kind: 'system', leftLaneIndex: 3, y: 196 },
      { kind: 'system', leftLaneIndex: 1, y: 197 },
      { kind: 'system', leftLaneIndex: 3, y: 329 },
    ],
    gimmicks: ["moving","system"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 24, name: 'ステージ 24', description: '動く線がいっぱい！ダンスのように賑やかなステージ',
    ballSpeed: 0.99, clearCount: 3, totalBalls: 8, maxMiss: 2, maxBalls: 1,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 0, y: 203 },
      { kind: 'system', leftLaneIndex: 2, y: 184 },
      { kind: 'moving', leftLaneIndex: 1, y: 284, amplitude: 39 },
      { kind: 'moving', leftLaneIndex: 3, y: 292, amplitude: 31 },
      { kind: 'moving', leftLaneIndex: 3, y: 87, amplitude: 38 },
    ],
    gimmicks: ["moving"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 25, name: 'ステージ 25', description: 'スパイクを避けるタイミング。慎重にボールを降らせ',
    ballSpeed: 1, clearCount: 3, totalBalls: 7, maxMiss: 2, maxBalls: 2,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 2, y: 128 },
      { kind: 'moving', leftLaneIndex: 0, y: 196, amplitude: 37 },
      { kind: 'moving', leftLaneIndex: 2, y: 202, amplitude: 52 },
      { kind: 'system', leftLaneIndex: 2, y: 367 },
      { kind: 'penalty', leftLaneIndex: 3, y: 494 },
      { kind: 'penalty', leftLaneIndex: 0, y: 104 },
      { kind: 'penalty', leftLaneIndex: 3, y: 300 },
    ],
    gimmicks: ["moving","penalty"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 26, name: 'ステージ 26', description: '止まっている道と動く道。2つの挙動を計算しよう',
    ballSpeed: 1.01, clearCount: 3, totalBalls: 6, maxMiss: 2, maxBalls: 3,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 3, y: 114 },
      { kind: 'moving', leftLaneIndex: 1, y: 278, amplitude: 45 },
      { kind: 'moving', leftLaneIndex: 2, y: 461, amplitude: 44 },
      { kind: 'moving', leftLaneIndex: 1, y: 232, amplitude: 53 },
      { kind: 'system', leftLaneIndex: 1, y: 395 },
      { kind: 'system', leftLaneIndex: 3, y: 254 },
    ],
    gimmicks: ["moving","system"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 27, name: 'ステージ 27', description: 'エナジーが逃げていく？動く線を狙い撃て',
    ballSpeed: 1.02, clearCount: 3, totalBalls: 8, maxMiss: 2, maxBalls: 1,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'moving', leftLaneIndex: 2, y: 397, amplitude: 47 },
      { kind: 'bonus', leftLaneIndex: 1, y: 256 },
    ],
    gimmicks: ["moving","bonus"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 28, name: 'ステージ 28', description: '消える線！？点滅する道をよく見て進もう',
    ballSpeed: 1.02, clearCount: 3, totalBalls: 6, maxMiss: 2, maxBalls: 2,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'blink', leftLaneIndex: 1, y: 170 },
      { kind: 'system', leftLaneIndex: 3, y: 410 },
    ],
    gimmicks: ["blink"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 29, name: 'ステージ 29', description: '点滅する道。記憶力が試される',
    ballSpeed: 1.03, clearCount: 3, totalBalls: 8, maxMiss: 2, maxBalls: 3,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 3, y: 122 },
      { kind: 'system', leftLaneIndex: 0, y: 197 },
      { kind: 'system', leftLaneIndex: 1, y: 488 },
      { kind: 'system', leftLaneIndex: 0, y: 136 },
      { kind: 'system', leftLaneIndex: 3, y: 211 },
      { kind: 'system', leftLaneIndex: 0, y: 329 },
    ],
    gimmicks: ["blink","system"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 30, name: 'ステージ 30', description: '見えない間は進めない。消えている時間を考慮しよう',
    ballSpeed: 1.04, clearCount: 3, totalBalls: 8, maxMiss: 2, maxBalls: 1,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'blink', leftLaneIndex: 0, y: 320, blinkInterval: 46 },
      { kind: 'blink', leftLaneIndex: 2, y: 289, blinkInterval: 66 },
      { kind: 'blink', leftLaneIndex: 1, y: 115, blinkInterval: 49 },
      { kind: 'system', leftLaneIndex: 2, y: 214 },
      { kind: 'system', leftLaneIndex: 2, y: 421 },
      { kind: 'system', leftLaneIndex: 1, y: 169 },
      { kind: 'system', leftLaneIndex: 0, y: 474 },
      { kind: 'system', leftLaneIndex: 0, y: 243 },
    ],
    gimmicks: ["blink"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 31, name: 'ステージ 31', description: '消えるエナジー。現れた瞬間を狙えるか',
    ballSpeed: 1.05, clearCount: 3, totalBalls: 7, maxMiss: 2, maxBalls: 2,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'blink', leftLaneIndex: 1, y: 226, blinkInterval: 50 },
      { kind: 'bonus', leftLaneIndex: 0, y: 442 },
      { kind: 'bonus', leftLaneIndex: 3, y: 116 },
      { kind: 'bonus', leftLaneIndex: 1, y: 127 },
      { kind: 'blink', leftLaneIndex: 2, y: 406, blinkInterval: 48 },
      { kind: 'blink', leftLaneIndex: 2, y: 306, blinkInterval: 31 },
    ],
    gimmicks: ["blink","bonus"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 32, name: 'ステージ 32', description: '見えないスパイクにご用心。出現タイミングを覚えるんだ',
    ballSpeed: 1.06, clearCount: 3, totalBalls: 8, maxMiss: 2, maxBalls: 3,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'penalty', leftLaneIndex: 0, y: 102 },
      { kind: 'penalty', leftLaneIndex: 2, y: 330 },
      { kind: 'system', leftLaneIndex: 2, y: 242 },
    ],
    gimmicks: ["blink","penalty"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 33, name: 'ステージ 33', description: 'チカチカする迷路。目を凝らしてルートを予測',
    ballSpeed: 1.06, clearCount: 3, totalBalls: 8, maxMiss: 2, maxBalls: 1,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 0, y: 397 },
      { kind: 'system', leftLaneIndex: 2, y: 289 },
      { kind: 'system', leftLaneIndex: 0, y: 83 },
      { kind: 'system', leftLaneIndex: 2, y: 179 },
      { kind: 'system', leftLaneIndex: 3, y: 402 },
      { kind: 'system', leftLaneIndex: 3, y: 353 },
    ],
    gimmicks: ["blink"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 34, name: 'ステージ 34', description: '動いて消える幻の道。動と消滅の複合アクション',
    ballSpeed: 1.07, clearCount: 3, totalBalls: 7, maxMiss: 2, maxBalls: 2,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'moving', leftLaneIndex: 1, y: 482, amplitude: 67 },
      { kind: 'blink', leftLaneIndex: 2, y: 82, blinkInterval: 43 },
      { kind: 'moving', leftLaneIndex: 3, y: 146, amplitude: 35 },
      { kind: 'moving', leftLaneIndex: 2, y: 417, amplitude: 65 },
      { kind: 'blink', leftLaneIndex: 0, y: 203, blinkInterval: 49 },
      { kind: 'blink', leftLaneIndex: 0, y: 344, blinkInterval: 56 },
      { kind: 'system', leftLaneIndex: 2, y: 369 },
      { kind: 'system', leftLaneIndex: 1, y: 152 },
    ],
    gimmicks: ["moving","blink"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 35, name: 'ステージ 35', description: '動く消える罠の迷宮。Tier 3 of 集大成',
    ballSpeed: 1.08, clearCount: 3, totalBalls: 7, maxMiss: 2, maxBalls: 3,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 1, y: 465 },
      { kind: 'system', leftLaneIndex: 3, y: 246 },
      { kind: 'moving', leftLaneIndex: 1, y: 355, amplitude: 53 },
      { kind: 'penalty', leftLaneIndex: 1, y: 158 },
      { kind: 'moving', leftLaneIndex: 3, y: 449, amplitude: 39 },
      { kind: 'system', leftLaneIndex: 0, y: 295 },
    ],
    gimmicks: ["moving","blink","penalty"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 36, name: 'ステージ 36', description: '加速線でスピードアップ！一瞬の判断が求められる',
    ballSpeed: 1.09, clearCount: 3, totalBalls: 8, maxMiss: 2, maxBalls: 1,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'speedUp', leftLaneIndex: 1, y: 170 },
      { kind: 'system', leftLaneIndex: 0, y: 306 },
    ],
    gimmicks: ["speedUp"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 37, name: 'ステージ 37', description: '加速線と通常線の連続。超高速のアミダ',
    ballSpeed: 1.1, clearCount: 3, totalBalls: 8, maxMiss: 2, maxBalls: 2,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 0, y: 399 },
      { kind: 'speedUp', leftLaneIndex: 0, y: 99 },
      { kind: 'system', leftLaneIndex: 1, y: 294 },
      { kind: 'speedUp', leftLaneIndex: 3, y: 365 },
      { kind: 'system', leftLaneIndex: 2, y: 103 },
    ],
    gimmicks: ["speedUp","system"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 38, name: 'ステージ 38', description: '急加速に注意！スパイクへ突っ込まないように',
    ballSpeed: 1.1, clearCount: 3, totalBalls: 7, maxMiss: 2, maxBalls: 3,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 0, y: 397 },
      { kind: 'system', leftLaneIndex: 3, y: 188 },
      { kind: 'speedUp', leftLaneIndex: 2, y: 128 },
      { kind: 'penalty', leftLaneIndex: 3, y: 297 },
      { kind: 'speedUp', leftLaneIndex: 3, y: 345 },
      { kind: 'system', leftLaneIndex: 0, y: 311 },
      { kind: 'speedUp', leftLaneIndex: 2, y: 505 },
      { kind: 'penalty', leftLaneIndex: 1, y: 213 },
      { kind: 'system', leftLaneIndex: 0, y: 474 },
    ],
    gimmicks: ["speedUp","penalty"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 39, name: 'ステージ 39', description: '加速してエナジーゲット。スピードの中でアイテムを回収',
    ballSpeed: 1.11, clearCount: 3, totalBalls: 8, maxMiss: 2, maxBalls: 1,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'bonus', leftLaneIndex: 1, y: 231 },
      { kind: 'system', leftLaneIndex: 0, y: 293 },
      { kind: 'bonus', leftLaneIndex: 2, y: 115 },
      { kind: 'system', leftLaneIndex: 1, y: 360 },
      { kind: 'speedUp', leftLaneIndex: 2, y: 480 },
      { kind: 'speedUp', leftLaneIndex: 2, y: 164 },
      { kind: 'bonus', leftLaneIndex: 0, y: 427 },
    ],
    gimmicks: ["speedUp","bonus"], ballColors: false, goalRotating: false, timeLimit: null
  },
  {
    id: 40, name: 'ステージ 40', description: 'スピードの限界へ。ボールが目にも留まらぬ速さで駆け抜ける',
    ballSpeed: 1.12, clearCount: 3, totalBalls: 6, maxMiss: 2, maxBalls: 2,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'speedUp', leftLaneIndex: 3, y: 503 },
      { kind: 'system', leftLaneIndex: 0, y: 150 },
    ],
    gimmicks: ["speedUp"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 41, name: 'ステージ 41', description: '動く加速線。揺れ動くブーストポイントを狙え',
    ballSpeed: 1.13, clearCount: 3, totalBalls: 6, maxMiss: 2, maxBalls: 3,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'moving', leftLaneIndex: 0, y: 184, amplitude: 46 },
      { kind: 'speedUp', leftLaneIndex: 3, y: 322 },
      { kind: 'moving', leftLaneIndex: 3, y: 182, amplitude: 66 },
    ],
    gimmicks: ["moving","speedUp"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 42, name: 'ステージ 42', description: '消える超特急。消える加速線のタイミングを計れ',
    ballSpeed: 1.14, clearCount: 3, totalBalls: 7, maxMiss: 2, maxBalls: 1,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'speedUp', leftLaneIndex: 0, y: 88 },
      { kind: 'blink', leftLaneIndex: 1, y: 471, blinkInterval: 45 },
      { kind: 'speedUp', leftLaneIndex: 0, y: 296 },
      { kind: 'speedUp', leftLaneIndex: 2, y: 222 },
      { kind: 'blink', leftLaneIndex: 3, y: 106, blinkInterval: 38 },
      { kind: 'system', leftLaneIndex: 2, y: 298 },
      { kind: 'system', leftLaneIndex: 0, y: 424 },
      { kind: 'system', leftLaneIndex: 2, y: 413 },
      { kind: 'system', leftLaneIndex: 0, y: 373 },
      { kind: 'blink', leftLaneIndex: 2, y: 177, blinkInterval: 45 },
    ],
    gimmicks: ["blink","speedUp"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 43, name: 'ステージ 43', description: 'スロー線が登場！ボール速度が永続で半分になる',
    ballSpeed: 1.14, clearCount: 3, totalBalls: 7, maxMiss: 2, maxBalls: 2,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'slow', leftLaneIndex: 1, y: 170 },
      { kind: 'system', leftLaneIndex: 0, y: 363 },
      { kind: 'system', leftLaneIndex: 0, y: 453 },
    ],
    gimmicks: ["slow"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 44, name: 'ステージ 44', description: 'スロー線に触れると次のボールが即時降下！同時降下を操れ',
    ballSpeed: 1.15, clearCount: 3, totalBalls: 7, maxMiss: 2, maxBalls: 3,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'slow', leftLaneIndex: 2, y: 451 },
      { kind: 'system', leftLaneIndex: 3, y: 245 },
      { kind: 'slow', leftLaneIndex: 0, y: 499 },
      { kind: 'slow', leftLaneIndex: 2, y: 505 },
      { kind: 'system', leftLaneIndex: 0, y: 246 },
    ],
    gimmicks: ["slow"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 45, name: 'ステージ 45', description: '急加速と急減速。スピードの落差に脳を慣らせ',
    ballSpeed: 1.16, clearCount: 3, totalBalls: 7, maxMiss: 2, maxBalls: 1,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'speedUp', leftLaneIndex: 1, y: 150 },
      { kind: 'slow', leftLaneIndex: 2, y: 260 },
      { kind: 'speedUp', leftLaneIndex: 3, y: 207 },
      { kind: 'speedUp', leftLaneIndex: 3, y: 326 },
      { kind: 'system', leftLaneIndex: 1, y: 412 },
    ],
    gimmicks: ["speedUp","slow"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 46, name: 'ステージ 46', description: '動くスローモーション。ゆっくり揺れる線をたどる旅',
    ballSpeed: 1.17, clearCount: 3, totalBalls: 8, maxMiss: 2, maxBalls: 2,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'slow', leftLaneIndex: 2, y: 402 },
      { kind: 'moving', leftLaneIndex: 0, y: 125, amplitude: 67 },
      { kind: 'slow', leftLaneIndex: 2, y: 349 },
      { kind: 'system', leftLaneIndex: 1, y: 295 },
    ],
    gimmicks: ["moving","slow"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 47, name: 'ステージ 47', description: '消えゆくスロー線。見えない減速ポイント',
    ballSpeed: 1.18, clearCount: 3, totalBalls: 6, maxMiss: 2, maxBalls: 3,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'slow', leftLaneIndex: 2, y: 198 },
      { kind: 'system', leftLaneIndex: 3, y: 331 },
      { kind: 'system', leftLaneIndex: 0, y: 479 },
      { kind: 'blink', leftLaneIndex: 1, y: 96, blinkInterval: 53 },
      { kind: 'slow', leftLaneIndex: 1, y: 343 },
      { kind: 'system', leftLaneIndex: 0, y: 398 },
    ],
    gimmicks: ["blink","slow"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 48, name: 'ステージ 48', description: 'スピード＆スロー・トラップ。緩急とスパイクのコンボ',
    ballSpeed: 1.18, clearCount: 3, totalBalls: 8, maxMiss: 2, maxBalls: 1,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'speedUp', leftLaneIndex: 1, y: 150 },
      { kind: 'slow', leftLaneIndex: 2, y: 260 },
      { kind: 'slow', leftLaneIndex: 1, y: 424 },
      { kind: 'system', leftLaneIndex: 3, y: 109 },
      { kind: 'slow', leftLaneIndex: 0, y: 245 },
      { kind: 'penalty', leftLaneIndex: 1, y: 326 },
      { kind: 'penalty', leftLaneIndex: 0, y: 87 },
      { kind: 'speedUp', leftLaneIndex: 3, y: 210 },
      { kind: 'speedUp', leftLaneIndex: 1, y: 377 },
    ],
    gimmicks: ["speedUp","slow","penalty"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 49, name: 'ステージ 49', description: '緩急の迷路.加速と減速を駆使してゴールへ導け',
    ballSpeed: 1.19, clearCount: 3, totalBalls: 8, maxMiss: 2, maxBalls: 2,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'speedUp', leftLaneIndex: 1, y: 150 },
      { kind: 'slow', leftLaneIndex: 2, y: 260 },
      { kind: 'speedUp', leftLaneIndex: 3, y: 139 },
      { kind: 'speedUp', leftLaneIndex: 1, y: 351 },
      { kind: 'system', leftLaneIndex: 1, y: 305 },
      { kind: 'system', leftLaneIndex: 2, y: 208 },
      { kind: 'slow', leftLaneIndex: 0, y: 204 },
      { kind: 'system', leftLaneIndex: 3, y: 315 },
    ],
    gimmicks: ["speedUp","slow","system"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 50, name: 'ステージ 50', description: 'スピードマスターの試練。加速と減速、そして動と静の融合',
    ballSpeed: 1.2, clearCount: 3, totalBalls: 7, maxMiss: 1, maxBalls: 3,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'speedUp', leftLaneIndex: 1, y: 150 },
      { kind: 'slow', leftLaneIndex: 2, y: 260 },
      { kind: 'penalty', leftLaneIndex: 2, y: 469 },
    ],
    gimmicks: ["speedUp","slow","moving","blink","penalty"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 51, name: 'ステージ 51', description: 'ワープ線が登場！隣ではないレーンへ瞬間移動',
    ballSpeed: 1.21, clearCount: 5, totalBalls: 10, maxMiss: 1, maxBalls: 1,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'warp', leftLaneIndex: 2, y: 170, warpToLane: 0 },
      { kind: 'system', leftLaneIndex: 2, y: 323 },
      { kind: 'system', leftLaneIndex: 3, y: 437 },
    ],
    gimmicks: ["warp"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 52, name: 'ステージ 52', description: 'どこに繋がっている？ワープの繋がりを見極めろ',
    ballSpeed: 1.22, clearCount: 5, totalBalls: 9, maxMiss: 1, maxBalls: 2,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'warp', leftLaneIndex: 1, y: 200, warpToLane: 3 },
      { kind: 'speedUp', leftLaneIndex: 3, y: 270 },
      { kind: 'system', leftLaneIndex: 1, y: 440 },
      { kind: 'system', leftLaneIndex: 3, y: 183 },
      { kind: 'system', leftLaneIndex: 3, y: 328 },
      { kind: 'system', leftLaneIndex: 1, y: 334 },
    ],
    gimmicks: ["warp","system"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 53, name: 'ステージ 53', description: 'ワープと罠。ワープした直後の罠をかいくぐれ',
    ballSpeed: 1.22, clearCount: 5, totalBalls: 10, maxMiss: 1, maxBalls: 3,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'warp', leftLaneIndex: 1, y: 200, warpToLane: 3 },
      { kind: 'penalty', leftLaneIndex: 3, y: 270 },
      { kind: 'penalty', leftLaneIndex: 0, y: 427 },
      { kind: 'penalty', leftLaneIndex: 2, y: 479 },
      { kind: 'system', leftLaneIndex: 0, y: 119 },
      { kind: 'system', leftLaneIndex: 0, y: 315 },
      { kind: 'system', leftLaneIndex: 3, y: 375 },
      { kind: 'system', leftLaneIndex: 2, y: 316 },
      { kind: 'system', leftLaneIndex: 3, y: 199 },
      { kind: 'system', leftLaneIndex: 2, y: 136 },
    ],
    gimmicks: ["warp","penalty"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 54, name: 'ステージ 54', description: 'ワープからの急加速。ジャンプした瞬間超高速になる爽快感',
    ballSpeed: 1.23, clearCount: 5, totalBalls: 8, maxMiss: 1, maxBalls: 1,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'warp', leftLaneIndex: 1, y: 200, warpToLane: 3 },
      { kind: 'speedUp', leftLaneIndex: 3, y: 270 },
      { kind: 'speedUp', leftLaneIndex: 1, y: 341 },
      { kind: 'speedUp', leftLaneIndex: 0, y: 407 },
      { kind: 'system', leftLaneIndex: 3, y: 342 },
      { kind: 'system', leftLaneIndex: 0, y: 250 },
      { kind: 'system', leftLaneIndex: 2, y: 476 },
      { kind: 'system', leftLaneIndex: 1, y: 83 },
    ],
    gimmicks: ["warp","speedUp"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 55, name: 'ステージ 55', description: '動くワープ道。動き続けるポータルにボールを滑り込ませろ',
    ballSpeed: 1.24, clearCount: 5, totalBalls: 9, maxMiss: 1, maxBalls: 2,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'warp', leftLaneIndex: 1, y: 200, warpToLane: 3 },
      { kind: 'penalty', leftLaneIndex: 3, y: 270 },
      { kind: 'moving', leftLaneIndex: 2, y: 395, amplitude: 53 },
      { kind: 'system', leftLaneIndex: 1, y: 252 },
      { kind: 'moving', leftLaneIndex: 3, y: 499, amplitude: 54 },
      { kind: 'system', leftLaneIndex: 0, y: 455 },
      { kind: 'moving', leftLaneIndex: 3, y: 197, amplitude: 60 },
      { kind: 'system', leftLaneIndex: 2, y: 128 },
      { kind: 'system', leftLaneIndex: 0, y: 144 },
    ],
    gimmicks: ["warp","moving"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 56, name: 'ステージ 56', description: '消えるワープポイント。タイミングを合わせて跳躍せよ',
    ballSpeed: 1.25, clearCount: 5, totalBalls: 8, maxMiss: 1, maxBalls: 3,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'warp', leftLaneIndex: 1, y: 200, warpToLane: 3 },
      { kind: 'speedUp', leftLaneIndex: 3, y: 270 },
      { kind: 'system', leftLaneIndex: 1, y: 454 },
      { kind: 'system', leftLaneIndex: 1, y: 272 },
      { kind: 'system', leftLaneIndex: 0, y: 123 },
      { kind: 'system', leftLaneIndex: 0, y: 386 },
      { kind: 'blink', leftLaneIndex: 3, y: 189, blinkInterval: 63 },
      { kind: 'system', leftLaneIndex: 3, y: 478 },
      { kind: 'blink', leftLaneIndex: 3, y: 122, blinkInterval: 48 },
    ],
    gimmicks: ["warp","blink"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 57, name: 'ステージ 57', description: '空間跳躍の迷路。ワープだらけの不思議なあみだ',
    ballSpeed: 1.26, clearCount: 5, totalBalls: 9, maxMiss: 1, maxBalls: 1,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'warp', leftLaneIndex: 1, y: 200, warpToLane: 3 },
      { kind: 'speedUp', leftLaneIndex: 3, y: 270 },
      { kind: 'system', leftLaneIndex: 2, y: 453 },
      { kind: 'system', leftLaneIndex: 0, y: 347 },
      { kind: 'system', leftLaneIndex: 2, y: 353 },
    ],
    gimmicks: ["warp","system"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 58, name: 'ステージ 58', description: '分裂線が登場！元のボールが曲がり、新しいボールが直進する',
    ballSpeed: 1.26, clearCount: 5, totalBalls: 10, maxMiss: 1, maxBalls: 2,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'split', leftLaneIndex: 1, y: 170 },
      { kind: 'system', leftLaneIndex: 2, y: 477 },
    ],
    gimmicks: ["split"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 59, name: 'ステージ 59', description: '分裂するアミダ。ボールを2つ同時にゴールへ導く最初の試練',
    ballSpeed: 1.27, clearCount: 5, totalBalls: 8, maxMiss: 1, maxBalls: 3,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'split', leftLaneIndex: 1, y: 210 },
      { kind: 'split', leftLaneIndex: 2, y: 320 },
      { kind: 'system', leftLaneIndex: 0, y: 455 },
      { kind: 'split', leftLaneIndex: 2, y: 82 },
    ],
    gimmicks: ["split"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 60, name: 'ステージ 60', description: '分裂とワープのシンフォニー。分裂した瞬間にワープへ突入！',
    ballSpeed: 1.28, clearCount: 5, totalBalls: 8, maxMiss: 1, maxBalls: 1,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'split', leftLaneIndex: 1, y: 210 },
      { kind: 'split', leftLaneIndex: 2, y: 320 },
      { kind: 'warp', leftLaneIndex: 1, y: 200, warpToLane: 3 },
      { kind: 'speedUp', leftLaneIndex: 3, y: 270 },
      { kind: 'split', leftLaneIndex: 3, y: 198 },
      { kind: 'system', leftLaneIndex: 0, y: 459 },
      { kind: 'system', leftLaneIndex: 3, y: 370 },
      { kind: 'system', leftLaneIndex: 3, y: 130 },
      { kind: 'system', leftLaneIndex: 1, y: 134 },
      { kind: 'system', leftLaneIndex: 3, y: 478 },
    ],
    gimmicks: ["warp","split"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 61, name: 'ステージ 61', description: '揺れながら分裂する道。動く分裂線を乗りこなせ',
    ballSpeed: 1.29, clearCount: 5, totalBalls: 8, maxMiss: 1, maxBalls: 2,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'split', leftLaneIndex: 1, y: 210 },
      { kind: 'split', leftLaneIndex: 2, y: 320 },
      { kind: 'moving', leftLaneIndex: 3, y: 105, amplitude: 54 },
      { kind: 'moving', leftLaneIndex: 3, y: 275, amplitude: 42 },
      { kind: 'system', leftLaneIndex: 0, y: 397 },
      { kind: 'moving', leftLaneIndex: 1, y: 118, amplitude: 59 },
      { kind: 'split', leftLaneIndex: 0, y: 334 },
      { kind: 'system', leftLaneIndex: 1, y: 256 },
    ],
    gimmicks: ["moving","split"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 62, name: 'ステージ 62', description: '消える分裂線。点滅する分裂線のタイミングを見計らえ',
    ballSpeed: 1.3, clearCount: 5, totalBalls: 9, maxMiss: 1, maxBalls: 3,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'split', leftLaneIndex: 1, y: 210 },
      { kind: 'split', leftLaneIndex: 2, y: 320 },
      { kind: 'system', leftLaneIndex: 3, y: 217 },
      { kind: 'system', leftLaneIndex: 3, y: 94 },
    ],
    gimmicks: ["blink","split"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 63, name: 'ステージ 63', description: '分裂加速カオス。2つに増えたボールが一気に加速！',
    ballSpeed: 1.3, clearCount: 5, totalBalls: 9, maxMiss: 1, maxBalls: 1,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'split', leftLaneIndex: 1, y: 210 },
      { kind: 'split', leftLaneIndex: 2, y: 320 },
      { kind: 'speedUp', leftLaneIndex: 1, y: 156 },
      { kind: 'split', leftLaneIndex: 3, y: 388 },
      { kind: 'speedUp', leftLaneIndex: 2, y: 261 },
      { kind: 'speedUp', leftLaneIndex: 0, y: 289 },
      { kind: 'system', leftLaneIndex: 0, y: 417 },
    ],
    gimmicks: ["speedUp","split"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 64, name: 'ステージ 64', description: '分裂する罠。増えたボールがスパイクに突っ込む恐怖',
    ballSpeed: 1.31, clearCount: 5, totalBalls: 10, maxMiss: 1, maxBalls: 2,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'split', leftLaneIndex: 1, y: 210 },
      { kind: 'split', leftLaneIndex: 2, y: 320 },
      { kind: 'penalty', leftLaneIndex: 3, y: 140 },
      { kind: 'system', leftLaneIndex: 1, y: 391 },
      { kind: 'split', leftLaneIndex: 0, y: 484 },
      { kind: 'system', leftLaneIndex: 0, y: 143 },
      { kind: 'system', leftLaneIndex: 1, y: 87 },
      { kind: 'penalty', leftLaneIndex: 0, y: 320 },
    ],
    gimmicks: ["split","penalty"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 65, name: 'ステージ 65', description: '空間の支配者の試練。ワープと分裂が交差する超難関',
    ballSpeed: 1.32, clearCount: 5, totalBalls: 10, maxMiss: 1, maxBalls: 3,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'split', leftLaneIndex: 1, y: 210 },
      { kind: 'split', leftLaneIndex: 2, y: 320 },
      { kind: 'warp', leftLaneIndex: 1, y: 200, warpToLane: 3 },
      { kind: 'speedUp', leftLaneIndex: 3, y: 270 },
      { kind: 'system', leftLaneIndex: 1, y: 83 },
      { kind: 'system', leftLaneIndex: 0, y: 400 },
      { kind: 'moving', leftLaneIndex: 1, y: 466, amplitude: 68 },
    ],
    gimmicks: ["warp","split","moving","blink","penalty"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 66, name: 'ステージ 66', description: 'カラーフィルターが登場！同じ色のボールしか通れない壁',
    ballSpeed: 1.33, clearCount: 5, totalBalls: 10, maxMiss: 1, maxBalls: 1,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'colorFilter', leftLaneIndex: 2, y: 170, filterColorId: "red" },
      { kind: 'system', leftLaneIndex: 0, y: 214 },
    ],
    gimmicks: ["colorFilter"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 67, name: 'ステージ 67', description: '色を分けて進もう。赤と青のボールを正しいルートへ',
    ballSpeed: 1.34, clearCount: 5, totalBalls: 10, maxMiss: 1, maxBalls: 2,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 3, y: 264 },
      { kind: 'system', leftLaneIndex: 0, y: 496 },
      { kind: 'system', leftLaneIndex: 0, y: 423 },
      { kind: 'colorFilter', leftLaneIndex: 3, y: 340, filterColorId: "blue" },
      { kind: 'colorFilter', leftLaneIndex: 0, y: 82, filterColorId: "blue" },
      { kind: 'colorFilter', leftLaneIndex: 3, y: 498, filterColorId: "red" },
    ],
    gimmicks: ["colorFilter","system"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 68, name: 'ステージ 68', description: '色の壁と罠。フィルターでスパイクを回避するテクニック',
    ballSpeed: 1.34, clearCount: 5, totalBalls: 10, maxMiss: 1, maxBalls: 3,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'penalty', leftLaneIndex: 2, y: 338 },
      { kind: 'colorFilter', leftLaneIndex: 2, y: 173, filterColorId: "blue" },
      { kind: 'penalty', leftLaneIndex: 0, y: 158 },
      { kind: 'system', leftLaneIndex: 2, y: 292 },
      { kind: 'penalty', leftLaneIndex: 0, y: 393 },
      { kind: 'colorFilter', leftLaneIndex: 0, y: 113, filterColorId: "red" },
    ],
    gimmicks: ["colorFilter","penalty"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 69, name: 'ステージ 69', description: '自分の色の加速線。特定の色だけがスピードアップ',
    ballSpeed: 1.35, clearCount: 5, totalBalls: 9, maxMiss: 1, maxBalls: 1,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 0, y: 392 },
      { kind: 'colorFilter', leftLaneIndex: 3, y: 354, filterColorId: "red" },
      { kind: 'speedUp', leftLaneIndex: 0, y: 166 },
      { kind: 'speedUp', leftLaneIndex: 3, y: 298 },
      { kind: 'speedUp', leftLaneIndex: 2, y: 417 },
      { kind: 'system', leftLaneIndex: 0, y: 245 },
      { kind: 'system', leftLaneIndex: 2, y: 167 },
      { kind: 'colorFilter', leftLaneIndex: 0, y: 438, filterColorId: "blue" },
      { kind: 'colorFilter', leftLaneIndex: 0, y: 327, filterColorId: "blue" },
      { kind: 'system', leftLaneIndex: 3, y: 117 },
    ],
    gimmicks: ["colorFilter","speedUp"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 70, name: 'ステージ 70', description: '動く色の道。動きながらボールの色をソートする',
    ballSpeed: 1.36, clearCount: 5, totalBalls: 8, maxMiss: 1, maxBalls: 2,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'moving', leftLaneIndex: 1, y: 455, amplitude: 46 },
      { kind: 'system', leftLaneIndex: 3, y: 456 },
      { kind: 'colorFilter', leftLaneIndex: 3, y: 82, filterColorId: "red" },
      { kind: 'colorFilter', leftLaneIndex: 1, y: 367, filterColorId: "red" },
      { kind: 'moving', leftLaneIndex: 1, y: 219, amplitude: 53 },
      { kind: 'moving', leftLaneIndex: 3, y: 266, amplitude: 60 },
      { kind: 'colorFilter', leftLaneIndex: 2, y: 162, filterColorId: "red" },
    ],
    gimmicks: ["colorFilter","moving"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 71, name: 'ステージ 71', description: '色付きの点滅道。色と点滅の複合パズル',
    ballSpeed: 1.37, clearCount: 5, totalBalls: 9, maxMiss: 1, maxBalls: 3,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'system', leftLaneIndex: 0, y: 149 },
      { kind: 'colorFilter', leftLaneIndex: 3, y: 232, filterColorId: "blue" },
      { kind: 'blink', leftLaneIndex: 0, y: 310, blinkInterval: 69 },
      { kind: 'blink', leftLaneIndex: 1, y: 487, blinkInterval: 65 },
      { kind: 'colorFilter', leftLaneIndex: 2, y: 136, filterColorId: "blue" },
    ],
    gimmicks: ["colorFilter","blink"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 72, name: 'ステージ 72', description: 'ワープとカラー。ワープした先で色がどう変わる？',
    ballSpeed: 1.38, clearCount: 5, totalBalls: 8, maxMiss: 1, maxBalls: 1,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'warp', leftLaneIndex: 1, y: 200, warpToLane: 3 },
      { kind: 'penalty', leftLaneIndex: 3, y: 270 },
      { kind: 'colorFilter', leftLaneIndex: 0, y: 452, filterColorId: "red" },
      { kind: 'colorFilter', leftLaneIndex: 3, y: 184, filterColorId: "red" },
      { kind: 'colorFilter', leftLaneIndex: 1, y: 88, filterColorId: "blue" },
      { kind: 'system', leftLaneIndex: 1, y: 330 },
      { kind: 'system', leftLaneIndex: 3, y: 406 },
      { kind: 'system', leftLaneIndex: 0, y: 266 },
      { kind: 'system', leftLaneIndex: 3, y: 501 },
      { kind: 'system', leftLaneIndex: 0, y: 142 },
    ],
    gimmicks: ["colorFilter","warp"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 73, name: 'ステージ 73', description: '重力反転線が登場！3秒間、ボールが上空へ向けて逆行する',
    ballSpeed: 1.38, clearCount: 5, totalBalls: 8, maxMiss: 1, maxBalls: 2,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'reverse', leftLaneIndex: 2, y: 170 },
      { kind: 'system', leftLaneIndex: 0, y: 151 },
    ],
    gimmicks: ["reverse"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 74, name: 'ステージ 74', description: '上昇とバウンド。天井にぶつかってバウンドし、新たな道へ',
    ballSpeed: 1.39, clearCount: 5, totalBalls: 9, maxMiss: 1, maxBalls: 3,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'reverse', leftLaneIndex: 1, y: 430 },
      { kind: 'reverse', leftLaneIndex: 2, y: 294 },
      { kind: 'reverse', leftLaneIndex: 1, y: 190 },
      { kind: 'system', leftLaneIndex: 1, y: 242 },
      { kind: 'system', leftLaneIndex: 3, y: 478 },
      { kind: 'system', leftLaneIndex: 0, y: 86 },
      { kind: 'system', leftLaneIndex: 2, y: 364 },
      { kind: 'system', leftLaneIndex: 0, y: 303 },
    ],
    gimmicks: ["reverse"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 75, name: 'ステージ 75', description: '重力反転カラーチェンジ。上昇しながら色が切り替わる',
    ballSpeed: 1.4, clearCount: 5, totalBalls: 10, maxMiss: 1, maxBalls: 1,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'reverse', leftLaneIndex: 2, y: 430 },
      { kind: 'colorFilter', leftLaneIndex: 3, y: 346, filterColorId: "red" },
      { kind: 'system', leftLaneIndex: 1, y: 133 },
      { kind: 'colorFilter', leftLaneIndex: 0, y: 186, filterColorId: "red" },
      { kind: 'colorFilter', leftLaneIndex: 0, y: 370, filterColorId: "blue" },
      { kind: 'reverse', leftLaneIndex: 1, y: 324 },
      { kind: 'reverse', leftLaneIndex: 2, y: 196 },
      { kind: 'system', leftLaneIndex: 3, y: 149 },
    ],
    gimmicks: ["reverse","colorFilter"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 76, name: 'ステージ 76', description: '動く重力反転線。動き回る重力反転エリア',
    ballSpeed: 1.41, clearCount: 5, totalBalls: 8, maxMiss: 1, maxBalls: 2,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'reverse', leftLaneIndex: 1, y: 430 },
      { kind: 'moving', leftLaneIndex: 3, y: 505, amplitude: 60 },
      { kind: 'reverse', leftLaneIndex: 3, y: 86 },
      { kind: 'moving', leftLaneIndex: 3, y: 187, amplitude: 69 },
      { kind: 'reverse', leftLaneIndex: 0, y: 113 },
      { kind: 'system', leftLaneIndex: 3, y: 237 },
      { kind: 'moving', leftLaneIndex: 1, y: 203, amplitude: 55 },
      { kind: 'system', leftLaneIndex: 2, y: 365 },
    ],
    gimmicks: ["moving","reverse"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 77, name: 'ステージ 77', description: '消える逆走ルート。点滅する重力反転を見極めろ',
    ballSpeed: 1.42, clearCount: 5, totalBalls: 8, maxMiss: 1, maxBalls: 3,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'reverse', leftLaneIndex: 1, y: 430 },
      { kind: 'system', leftLaneIndex: 2, y: 241 },
      { kind: 'blink', leftLaneIndex: 3, y: 420, blinkInterval: 59 },
      { kind: 'blink', leftLaneIndex: 0, y: 370, blinkInterval: 66 },
    ],
    gimmicks: ["blink","reverse"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 78, name: 'ステージ 78', description: '重力反転と加速の融合。上昇した後に一気に高速落下！',
    ballSpeed: 1.42, clearCount: 5, totalBalls: 9, maxMiss: 1, maxBalls: 1,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'reverse', leftLaneIndex: 2, y: 430 },
      { kind: 'system', leftLaneIndex: 0, y: 113 },
      { kind: 'reverse', leftLaneIndex: 0, y: 215 },
      { kind: 'speedUp', leftLaneIndex: 3, y: 275 },
      { kind: 'reverse', leftLaneIndex: 0, y: 282 },
      { kind: 'system', leftLaneIndex: 2, y: 139 },
      { kind: 'system', leftLaneIndex: 1, y: 344 },
      { kind: 'system', leftLaneIndex: 2, y: 192 },
      { kind: 'speedUp', leftLaneIndex: 0, y: 456 },
    ],
    gimmicks: ["speedUp","reverse"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 79, name: 'ステージ 79', description: '天井バウンドトラップ。逆走した先で待ち構えるスパイク',
    ballSpeed: 1.43, clearCount: 5, totalBalls: 9, maxMiss: 1, maxBalls: 2,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'reverse', leftLaneIndex: 2, y: 430 },
      { kind: 'penalty', leftLaneIndex: 3, y: 248 },
      { kind: 'penalty', leftLaneIndex: 3, y: 315 },
      { kind: 'penalty', leftLaneIndex: 1, y: 283 },
      { kind: 'reverse', leftLaneIndex: 1, y: 361 },
      { kind: 'system', leftLaneIndex: 1, y: 138 },
      { kind: 'system', leftLaneIndex: 3, y: 146 },
      { kind: 'reverse', leftLaneIndex: 3, y: 199 },
    ],
    gimmicks: ["reverse","penalty"], ballColors: false, goalRotating: true, timeLimit: null
  },
  {
    id: 80, name: 'ステージ 80', description: '重力と色彩の試練。Tier 6の終わりを飾る色彩重力パズル',
    ballSpeed: 1.44, clearCount: 5, totalBalls: 9, maxMiss: 1, maxBalls: 3,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'reverse', leftLaneIndex: 2, y: 430 },
      { kind: 'moving', leftLaneIndex: 1, y: 482, amplitude: 68 },
      { kind: 'blink', leftLaneIndex: 0, y: 406, blinkInterval: 39 },
      { kind: 'penalty', leftLaneIndex: 1, y: 162 },
      { kind: 'reverse', leftLaneIndex: 0, y: 270 },
      { kind: 'system', leftLaneIndex: 2, y: 117 },
      { kind: 'reverse', leftLaneIndex: 0, y: 340 },
      { kind: 'system', leftLaneIndex: 2, y: 334 },
    ],
    gimmicks: ["reverse","colorFilter","moving","blink","penalty"], ballColors: false, goalRotating: true, timeLimit: 60
  },
  {
    id: 81, name: 'ステージ 81', description: '加速、分裂、ワープが同時に牙をむく高速多重アミダ',
    ballSpeed: 1.45, clearCount: 5, totalBalls: 10, maxMiss: 1, maxBalls: 1,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'split', leftLaneIndex: 1, y: 210 },
      { kind: 'split', leftLaneIndex: 2, y: 320 },
      { kind: 'warp', leftLaneIndex: 1, y: 200, warpToLane: 3 },
      { kind: 'speedUp', leftLaneIndex: 3, y: 270 },
      { kind: 'system', leftLaneIndex: 3, y: 483 },
      { kind: 'split', leftLaneIndex: 3, y: 81 },
    ],
    gimmicks: ["speedUp","split","warp"], ballColors: true, goalRotating: true, timeLimit: 60
  },
  {
    id: 82, name: 'ステージ 82', description: '色彩と重力と消える道。すべての要素が絡み合う',
    ballSpeed: 1.46, clearCount: 5, totalBalls: 8, maxMiss: 1, maxBalls: 2,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'reverse', leftLaneIndex: 2, y: 430 },
      { kind: 'colorFilter', leftLaneIndex: 1, y: 177, filterColorId: "red" },
      { kind: 'system', leftLaneIndex: 0, y: 314 },
      { kind: 'reverse', leftLaneIndex: 2, y: 267 },
      { kind: 'blink', leftLaneIndex: 2, y: 481, blinkInterval: 57 },
      { kind: 'blink', leftLaneIndex: 0, y: 397, blinkInterval: 48 },
      { kind: 'system', leftLaneIndex: 3, y: 166 },
      { kind: 'colorFilter', leftLaneIndex: 0, y: 486, filterColorId: "blue" },
      { kind: 'blink', leftLaneIndex: 1, y: 93, blinkInterval: 54 },
    ],
    gimmicks: ["colorFilter","reverse","blink"], ballColors: true, goalRotating: true, timeLimit: 60
  },
  {
    id: 83, name: 'ステージ 83', description: '動く緩急のラビリンス。動きながら加速とスローが切り替わる',
    ballSpeed: 1.46, clearCount: 5, totalBalls: 9, maxMiss: 1, maxBalls: 3,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'speedUp', leftLaneIndex: 1, y: 150 },
      { kind: 'slow', leftLaneIndex: 2, y: 260 },
      { kind: 'moving', leftLaneIndex: 0, y: 313, amplitude: 59 },
      { kind: 'speedUp', leftLaneIndex: 2, y: 436 },
      { kind: 'speedUp', leftLaneIndex: 2, y: 327 },
      { kind: 'system', leftLaneIndex: 0, y: 85 },
      { kind: 'slow', leftLaneIndex: 2, y: 482 },
      { kind: 'moving', leftLaneIndex: 3, y: 115, amplitude: 61 },
    ],
    gimmicks: ["moving","slow","speedUp"], ballColors: true, goalRotating: true, timeLimit: 60
  },
  {
    id: 84, name: 'ステージ 84', description: '逆走と分裂の混沌。ボールが増えながら上に引き戻される！',
    ballSpeed: 1.47, clearCount: 5, totalBalls: 9, maxMiss: 1, maxBalls: 1,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'split', leftLaneIndex: 1, y: 210 },
      { kind: 'split', leftLaneIndex: 2, y: 320 },
      { kind: 'reverse', leftLaneIndex: 1, y: 430 },
      { kind: 'split', leftLaneIndex: 2, y: 94 },
      { kind: 'system', leftLaneIndex: 1, y: 480 },
      { kind: 'reverse', leftLaneIndex: 0, y: 122 },
      { kind: 'system', leftLaneIndex: 0, y: 292 },
      { kind: 'system', leftLaneIndex: 2, y: 165 },
      { kind: 'system', leftLaneIndex: 3, y: 484 },
    ],
    gimmicks: ["reverse","split"], ballColors: true, goalRotating: true, timeLimit: 60
  },
  {
    id: 85, name: 'ステージ 85', description: '全カラーギミック大作戦。分裂したカラーボールを完璧にソートせよ',
    ballSpeed: 1.48, clearCount: 5, totalBalls: 9, maxMiss: 1, maxBalls: 2,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'split', leftLaneIndex: 1, y: 210 },
      { kind: 'split', leftLaneIndex: 2, y: 320 },
      { kind: 'warp', leftLaneIndex: 1, y: 200, warpToLane: 3 },
      { kind: 'penalty', leftLaneIndex: 3, y: 270 },
      { kind: 'system', leftLaneIndex: 2, y: 389 },
    ],
    gimmicks: ["colorFilter","warp","split"], ballColors: true, goalRotating: true, timeLimit: 60
  },
  {
    id: 86, name: 'ステージ 86', description: '限界の迷路。新旧ギミックがぎっしり詰まった高難度',
    ballSpeed: 1.49, clearCount: 7, totalBalls: 12, maxMiss: 1, maxBalls: 3,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'split', leftLaneIndex: 1, y: 210 },
      { kind: 'split', leftLaneIndex: 2, y: 320 },
      { kind: 'reverse', leftLaneIndex: 1, y: 430 },
      { kind: 'slow', leftLaneIndex: 3, y: 242 },
      { kind: 'system', leftLaneIndex: 0, y: 161 },
    ],
    gimmicks: ["system","slow","split","reverse"], ballColors: true, goalRotating: true, timeLimit: 60
  },
  {
    id: 87, name: 'ステージ 87', description: '動くギミックと分裂の嵐。動きを読み切れ',
    ballSpeed: 1.5, clearCount: 7, totalBalls: 11, maxMiss: 1, maxBalls: 1,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'split', leftLaneIndex: 1, y: 210 },
      { kind: 'split', leftLaneIndex: 2, y: 320 },
      { kind: 'split', leftLaneIndex: 2, y: 408 },
      { kind: 'moving', leftLaneIndex: 2, y: 256, amplitude: 30 },
      { kind: 'moving', leftLaneIndex: 2, y: 473, amplitude: 44 },
      { kind: 'system', leftLaneIndex: 0, y: 404 },
      { kind: 'moving', leftLaneIndex: 0, y: 119, amplitude: 41 },
      { kind: 'system', leftLaneIndex: 2, y: 160 },
      { kind: 'system', leftLaneIndex: 2, y: 112 },
      { kind: 'system', leftLaneIndex: 0, y: 318 },
    ],
    gimmicks: ["moving","split"], ballColors: true, goalRotating: true, timeLimit: 60
  },
  {
    id: 88, name: 'ステージ 88', description: '点滅ギミックと重力反転の闇。記憶を頼りに逆走させろ',
    ballSpeed: 1.5, clearCount: 7, totalBalls: 10, maxMiss: 1, maxBalls: 2,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'reverse', leftLaneIndex: 1, y: 430 },
      { kind: 'reverse', leftLaneIndex: 2, y: 199 },
      { kind: 'system', leftLaneIndex: 0, y: 283 },
      { kind: 'blink', leftLaneIndex: 0, y: 366, blinkInterval: 49 },
      { kind: 'blink', leftLaneIndex: 3, y: 413, blinkInterval: 53 },
      { kind: 'blink', leftLaneIndex: 1, y: 131, blinkInterval: 46 },
      { kind: 'reverse', leftLaneIndex: 2, y: 345 },
      { kind: 'system', leftLaneIndex: 3, y: 485 },
    ],
    gimmicks: ["blink","reverse"], ballColors: true, goalRotating: true, timeLimit: 60
  },
  {
    id: 89, name: 'ステージ 89', description: '加速と減速の限界。超スピードと超スローの融合',
    ballSpeed: 1.51, clearCount: 7, totalBalls: 11, maxMiss: 1, maxBalls: 3,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'speedUp', leftLaneIndex: 1, y: 150 },
      { kind: 'slow', leftLaneIndex: 2, y: 260 },
      { kind: 'slow', leftLaneIndex: 0, y: 458 },
      { kind: 'speedUp', leftLaneIndex: 0, y: 382 },
      { kind: 'speedUp', leftLaneIndex: 3, y: 463 },
    ],
    gimmicks: ["speedUp","slow"], ballColors: true, goalRotating: true, timeLimit: 60
  },
  {
    id: 90, name: 'ステージ 90', description: 'ワープと分裂の果て。無数にワープする分裂クローン',
    ballSpeed: 1.52, clearCount: 7, totalBalls: 11, maxMiss: 1, maxBalls: 1,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'split', leftLaneIndex: 1, y: 210 },
      { kind: 'split', leftLaneIndex: 2, y: 320 },
      { kind: 'warp', leftLaneIndex: 1, y: 200, warpToLane: 3 },
      { kind: 'penalty', leftLaneIndex: 3, y: 270 },
      { kind: 'system', leftLaneIndex: 3, y: 504 },
    ],
    gimmicks: ["warp","split"], ballColors: true, goalRotating: true, timeLimit: 60
  },
  {
    id: 91, name: 'ステージ 91', description: 'スロー中の減速ボールを、後続の高速ボールが追い抜く時間差の極限',
    ballSpeed: 1.53, clearCount: 7, totalBalls: 11, maxMiss: 1, maxBalls: 2,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'speedUp', leftLaneIndex: 1, y: 150 },
      { kind: 'slow', leftLaneIndex: 2, y: 260 },
      { kind: 'speedUp', leftLaneIndex: 0, y: 321 },
      { kind: 'system', leftLaneIndex: 3, y: 90 },
      { kind: 'speedUp', leftLaneIndex: 2, y: 431 },
      { kind: 'slow', leftLaneIndex: 2, y: 197 },
      { kind: 'system', leftLaneIndex: 0, y: 465 },
      { kind: 'slow', leftLaneIndex: 0, y: 234 },
    ],
    gimmicks: ["slow","speedUp"], ballColors: true, goalRotating: true, timeLimit: 60
  },
  {
    id: 92, name: 'ステージ 92', description: '左右に配置された分裂線で、ボールが連鎖分裂するピンボールアミダ',
    ballSpeed: 1.54, clearCount: 7, totalBalls: 11, maxMiss: 1, maxBalls: 3,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'split', leftLaneIndex: 1, y: 210 },
      { kind: 'split', leftLaneIndex: 2, y: 320 },
      { kind: 'split', leftLaneIndex: 2, y: 500 },
      { kind: 'system', leftLaneIndex: 0, y: 367 },
      { kind: 'system', leftLaneIndex: 3, y: 413 },
    ],
    gimmicks: ["split","system"], ballColors: true, goalRotating: true, timeLimit: 60
  },
  {
    id: 93, name: 'ステージ 93', description: '最下部で反転し、天井バウンドから別の長いルートへ引き戻すスリル',
    ballSpeed: 1.54, clearCount: 7, totalBalls: 12, maxMiss: 1, maxBalls: 1,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'reverse', leftLaneIndex: 2, y: 430 },
      { kind: 'reverse', leftLaneIndex: 3, y: 498 },
      { kind: 'reverse', leftLaneIndex: 0, y: 157 },
      { kind: 'system', leftLaneIndex: 0, y: 315 },
      { kind: 'system', leftLaneIndex: 2, y: 88 },
      { kind: 'system', leftLaneIndex: 2, y: 234 },
      { kind: 'system', leftLaneIndex: 2, y: 290 },
      { kind: 'system', leftLaneIndex: 3, y: 380 },
      { kind: 'system', leftLaneIndex: 0, y: 460 },
    ],
    gimmicks: ["reverse","system"], ballColors: true, goalRotating: true, timeLimit: 60
  },
  {
    id: 94, name: 'ステージ 94', description: 'スローで時間を稼ぎ、重力反転で上に持ち上げ、加速で一気に落とすコンボ',
    ballSpeed: 1.55, clearCount: 7, totalBalls: 10, maxMiss: 1, maxBalls: 2,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'speedUp', leftLaneIndex: 1, y: 150 },
      { kind: 'slow', leftLaneIndex: 2, y: 260 },
      { kind: 'reverse', leftLaneIndex: 2, y: 430 },
      { kind: 'system', leftLaneIndex: 0, y: 346 },
      { kind: 'speedUp', leftLaneIndex: 0, y: 418 },
      { kind: 'system', leftLaneIndex: 0, y: 495 },
      { kind: 'reverse', leftLaneIndex: 1, y: 210 },
      { kind: 'reverse', leftLaneIndex: 3, y: 318 },
    ],
    gimmicks: ["slow","speedUp","reverse"], ballColors: true, goalRotating: true, timeLimit: 60
  },
  {
    id: 95, name: 'ステージ 95', description: '3つの新ギミックが完全に融合した、究極の戦略アミダ',
    ballSpeed: 1.56, clearCount: 7, totalBalls: 12, maxMiss: 1, maxBalls: 3,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'split', leftLaneIndex: 1, y: 210 },
      { kind: 'split', leftLaneIndex: 2, y: 320 },
      { kind: 'reverse', leftLaneIndex: 2, y: 430 },
      { kind: 'system', leftLaneIndex: 0, y: 480 },
      { kind: 'system', leftLaneIndex: 0, y: 373 },
      { kind: 'slow', leftLaneIndex: 1, y: 267 },
      { kind: 'reverse', leftLaneIndex: 0, y: 149 },
      { kind: 'split', leftLaneIndex: 3, y: 174 },
    ],
    gimmicks: ["slow","split","reverse"], ballColors: true, goalRotating: true, timeLimit: 60
  },
  {
    id: 96, name: 'ステージ 96', description: '色彩と空間の支配者。カラーソートとワープ、分裂の集大成',
    ballSpeed: 1.57, clearCount: 7, totalBalls: 11, maxMiss: 1, maxBalls: 1,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'split', leftLaneIndex: 1, y: 210 },
      { kind: 'split', leftLaneIndex: 2, y: 320 },
      { kind: 'warp', leftLaneIndex: 1, y: 200, warpToLane: 3 },
      { kind: 'penalty', leftLaneIndex: 3, y: 270 },
      { kind: 'colorFilter', leftLaneIndex: 1, y: 101, filterColorId: "blue" },
      { kind: 'colorFilter', leftLaneIndex: 0, y: 434, filterColorId: "red" },
      { kind: 'split', leftLaneIndex: 0, y: 323 },
      { kind: 'system', leftLaneIndex: 0, y: 500 },
      { kind: 'system', leftLaneIndex: 2, y: 487 },
    ],
    gimmicks: ["colorFilter","warp","split"], ballColors: true, goalRotating: true, timeLimit: 60
  },
  {
    id: 97, name: 'ステージ 97', description: '全ギミックが配置された、混沌と秩序が織りなす大迷宮',
    ballSpeed: 1.58, clearCount: 7, totalBalls: 10, maxMiss: 1, maxBalls: 2,
    goalTypes: ["safe","danger","target","danger","safe"],
    fixedLines: [
      { kind: 'speedUp', leftLaneIndex: 1, y: 150 },
      { kind: 'slow', leftLaneIndex: 2, y: 260 },
      { kind: 'split', leftLaneIndex: 1, y: 210 },
      { kind: 'split', leftLaneIndex: 2, y: 320 },
      { kind: 'reverse', leftLaneIndex: 2, y: 430 },
      { kind: 'warp', leftLaneIndex: 1, y: 200, warpToLane: 3 },
      { kind: 'speedUp', leftLaneIndex: 3, y: 270 },
    ],
    gimmicks: ["bonus","penalty","moving","blink","speedUp","warp","colorFilter","slow","split","reverse"], ballColors: true, goalRotating: true, timeLimit: 60
  },
  {
    id: 98, name: 'ステージ 98', description: 'あなたのテクニックの限界に挑む。ノーミスでクリアできるか',
    ballSpeed: 1.58, clearCount: 7, totalBalls: 12, maxMiss: 1, maxBalls: 3,
    goalTypes: ["danger","target","safe","danger","safe"],
    fixedLines: [
      { kind: 'speedUp', leftLaneIndex: 1, y: 150 },
      { kind: 'slow', leftLaneIndex: 2, y: 260 },
      { kind: 'split', leftLaneIndex: 1, y: 210 },
      { kind: 'split', leftLaneIndex: 2, y: 320 },
      { kind: 'reverse', leftLaneIndex: 2, y: 430 },
      { kind: 'warp', leftLaneIndex: 1, y: 200, warpToLane: 3 },
      { kind: 'penalty', leftLaneIndex: 3, y: 270 },
      { kind: 'system', leftLaneIndex: 0, y: 413 },
      { kind: 'moving', leftLaneIndex: 0, y: 282, amplitude: 57 },
      { kind: 'system', leftLaneIndex: 2, y: 86 },
    ],
    gimmicks: ["bonus","penalty","moving","blink","speedUp","warp","colorFilter","slow","split","reverse"], ballColors: true, goalRotating: true, timeLimit: 60
  },
  {
    id: 99, name: 'ステージ 99', description: 'アミダマスターへ送る、難攻不落の最終難関',
    ballSpeed: 1.59, clearCount: 7, totalBalls: 10, maxMiss: 1, maxBalls: 1,
    goalTypes: ["target","danger","safe","danger","target"],
    fixedLines: [
      { kind: 'speedUp', leftLaneIndex: 1, y: 150 },
      { kind: 'slow', leftLaneIndex: 2, y: 260 },
      { kind: 'split', leftLaneIndex: 1, y: 210 },
      { kind: 'split', leftLaneIndex: 2, y: 320 },
      { kind: 'reverse', leftLaneIndex: 2, y: 430 },
      { kind: 'warp', leftLaneIndex: 1, y: 200, warpToLane: 3 },
      { kind: 'speedUp', leftLaneIndex: 3, y: 270 },
    ],
    gimmicks: ["bonus","penalty","moving","blink","speedUp","warp","colorFilter","slow","split","reverse"], ballColors: true, goalRotating: true, timeLimit: 60
  },
  {
    id: 100, name: 'ステージ 100', description: 'これが本当の終わり。すべての力を出し切り、伝説のマスターへ',
    ballSpeed: 1.6, clearCount: 7, totalBalls: 10, maxMiss: 1, maxBalls: 2,
    goalTypes: ["danger","safe","target","safe","danger"],
    fixedLines: [
      { kind: 'speedUp', leftLaneIndex: 1, y: 150 },
      { kind: 'slow', leftLaneIndex: 2, y: 260 },
      { kind: 'split', leftLaneIndex: 1, y: 210 },
      { kind: 'split', leftLaneIndex: 2, y: 320 },
      { kind: 'reverse', leftLaneIndex: 1, y: 430 },
      { kind: 'warp', leftLaneIndex: 1, y: 200, warpToLane: 3 },
      { kind: 'penalty', leftLaneIndex: 3, y: 270 },
    ],
    gimmicks: ["bonus","penalty","moving","blink","speedUp","warp","colorFilter","slow","split","reverse"], ballColors: true, goalRotating: true, timeLimit: 60
  },
];
