// scratch/test_quiz_game.js
// 実際の QuizGame クラスを Node.js 上でモックして動作検証するスクリプト

import { QuizGame } from '../src/quizGame.js';
import { QUIZ_STAGES } from '../src/quizStages.js';

// DOMとブラウザAPIのモック
global.window = {
  innerWidth: 360,
  innerHeight: 640,
  addEventListener: () => {},
};
global.performance = {
  now: () => Date.now(),
};
global.requestAnimationFrame = (callback) => setTimeout(callback, 16);
global.cancelAnimationFrame = (id) => clearTimeout(id);

const canvasMock = {
  width: 360,
  height: 640,
  getContext: () => ({
    clearRect: () => {},
    save: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {},
    fill: () => {},
    arc: () => {},
    fillRect: () => {},
    fillText: () => {},
    setLineDash: () => {},
    closePath: () => {},
    measureText: () => ({ width: 0 }),
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} }),
  }),
  classList: {
    add: () => {},
    remove: () => {},
  },
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 360, height: 640 }),
  addEventListener: () => {},
};

// QuizGame インスタンス作成
const game = new QuizGame(canvasMock);

// ステージ1の読み込み
const stage1 = QUIZ_STAGES[0];
console.log(`--- ステージ1読み込み: ${stage1.name} ---`);
game.loadQuiz(stage1);

console.log(`初期線数: ${game.lines.length}`);
game.lines.forEach((l, idx) => {
  console.log(`  線[${idx}]: id=${l.id}, leftLane=${l.leftLaneIndex}, y=${l.y}, kind=${l.kind}`);
});

// 選択肢 'B' を選ぶ
console.log(`\n--- 選択肢 B を選択 ---`);
game.selectChoice('B');
console.log(`選択選択肢: ${game.selectedChoice}`);
console.log(`選択後の線数: ${game.lines.length}`);

// ボール発射
console.log(`\n--- ボール発射 ---`);
let completeCalled = false;
game.runBall((success) => {
  completeCalled = true;
  console.log(`\n--- クイズシミュレーション完了判定 ---`);
  console.log(`成功したか: ${success}`);
  console.log(`到達したゴールリスト:`, game.reachedGoals);
});

// ゲームループのシミュレーション (最大1000ステップ)
let steps = 0;
while (game.isRunning && steps < 1000) {
  // game._update を手動で呼び出す (delta = 16.6ms)
  game._update(16.6);
  
  if (game.items.length > 0) {
    const ball = game.items[0];
    console.log(`Step ${steps}: ball.lane=${ball.currentLane}, ball.x=${ball.x.toFixed(2)}, ball.y=${ball.y.toFixed(2)}, state=${ball.state}`);
  }
  steps++;
}

console.log(`\nシミュレーション終了: steps = ${steps}, completeCalled = ${completeCalled}`);
