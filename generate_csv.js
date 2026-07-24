const fs = require('fs');

try {
  let code = fs.readFileSync('src/stages.js', 'utf-8');
  // モジュールのimport/exportを削除してevalで実行できるようにする
  code = code.replace(/import .*/g, '');
  code = code.replace(/export .*/g, '');

  // STAGESを生成するコードを評価
  eval(code);

  const lines = [];
  lines.push("no,クリア個数,初期線の数,緑ゴール数,三角ゴール数,バツゴール数,ボールの速さ（多いほど速い）,同時にあるボール個数,カラー,energy線,spike線,ワープ線,カラー線,onoff線,移動線,FAST線,ONLY線");

  if (typeof STAGES === 'undefined') {
    throw new Error("STAGES is not defined after eval.");
  }

  STAGES.forEach(stage => {
    // 線の種類ごとにカウントするヘルパー関数
    const getCount = (kind) => {
      const c = stage.fixedLines.filter(l => l && l.kind === kind).length;
      return c > 0 ? c : "";
    };
    
    const validLines = stage.fixedLines.filter(l => l);

    const cols = [
      stage.id,
      stage.clearCount,
      validLines.length,
      stage.goalTypes.filter(t => t === 'safe').length,
      stage.goalTypes.filter(t => t === 'target').length,
      stage.goalTypes.filter(t => t === 'danger').length,
      Number(stage.ballSpeed).toFixed(2),
      stage.maxBalls,
      stage.ballColors ? "有" : "",
      getCount('bonus'),
      getCount('penalty'),
      getCount('warp'),
      getCount('colorChange'),
      getCount('blink'),
      getCount('moving'),
      getCount('speedUp'),
      getCount('colorFilter')
    ];
    lines.push(cols.join(','));
  });

  fs.writeFileSync('stages.csv', lines.join('\n'), 'utf-8');
  console.log("CSV generation complete.");
} catch (e) {
  console.error("Error generating CSV:", e);
}
