/**
 * quizStages.js - クイズモード用の全面刷新・全50ステージ定義データ
 * 
 * すべて of あみだ軌道が偶数レーン (0: A, 2: B, 4: C) に落ちて、完璧に判定されるように設計しています。
 * プレイヤーが一歩先を脳内で予測し、ギミックの性質を活かして解く楽しさを提供する最高品質のパズルです。
 * 
 * クイズタイプ一覧:
 * - WHICH_GOAL (WG): どのゴールに到達するか？
 * - REMOVE_LINE (RL): どの線を取り除けば丸ゴールに入るか？
 * - ADD_LINE (AL): どの線を引けば丸ゴールに入るか？
 * - WHICH_ARROW (WA): どの矢印から落とせば丸ゴールに入るか？
 * - NOT_GOAL (NG): 入らないゴールはどれか？
 * - FASTEST_BALL (FB): 最速でゴールに到達するのはどれか？
 * - SPIKE_BALL (SB): トゲトゲに変身してゴールするのはどれか？
 * - COLOR_MIX (CM): 最終的に何色にブレンドされるか？
 * - COUNT_BALLS (CB): ゴールにたどり着くボールの合計個数は何個か？
 */

export const QUIZ_STAGES = [
  // ==========================================
  // 【初級】ステージ 1〜10：基本操作と単一ギミックの理解
  // ==========================================
  {
    id: 1,
    type: 'WHICH_GOAL',
    name: 'クイズ 1: 基礎あみだ',
    description: 'あみだくじの基本！矢印（▼）から落ちたボールは A、B、C どのゴールにたどり着くでしょうか？先の線をよくたどりましょう。',
    startLane: 2,
    fixedLines: [
      { leftLaneIndex: 1, y: 200, kind: 'system' },
      { leftLaneIndex: 0, y: 400, kind: 'system' }
    ],
    goals: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'A'
  },
  {
    id: 2,
    type: 'REMOVE_LINE',
    name: 'クイズ 2: 不要な線を取り除け！',
    description: 'A、B、C のうち、どの線が「無ければ」矢印から落ちたボールは「◎（丸ゴール）」に入るでしょうか？引き算のパズルです。',
    startLane: 0,
    targetGoalLane: 2,
    fixedLines: [
      { label: 'A', leftLaneIndex: 0, y: 180, kind: 'system' },
      { label: 'B', leftLaneIndex: 1, y: 280, kind: 'system' },
      { label: 'C', leftLaneIndex: 1, y: 380, kind: 'system' }
    ],
    correctAnswer: 'C'
  },
  {
    id: 3,
    type: 'ADD_LINE',
    name: 'クイズ 3: 架け橋を架けろ！',
    description: 'A、B、C のうち、どこに線を「引けば」矢印から落ちたボールは「◎（丸ゴール）」に入るでしょうか？足し算のパズルです。',
    startLane: 4,
    targetGoalLane: 2,
    fixedLines: [
      { leftLaneIndex: 2, y: 320, kind: 'system' }
    ],
    candidateLines: [
      { label: 'A', leftLaneIndex: 3, y: 200, kind: 'system' },
      { label: 'B', leftLaneIndex: 0, y: 200, kind: 'system' },
      { label: 'C', leftLaneIndex: 1, y: 200, kind: 'system' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 4,
    type: 'WHICH_ARROW',
    name: 'クイズ 4: 正しいスタートは？',
    description: 'A、B、C のうち、どの矢印からボールを落とせば、ボールは無事に「◎（丸ゴール）」に入るでしょうか？',
    targetGoalLane: 2,
    fixedLines: [
      { leftLaneIndex: 0, y: 200, kind: 'system' },
      { leftLaneIndex: 1, y: 350, kind: 'system' }
    ],
    arrows: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'A'
  },
  {
    id: 5,
    type: 'FASTEST_BALL',
    name: 'クイズ 5: スローモーション入門',
    description: '黄緑色の線は「スロー（減速）」効果があります！A、B、C のうち、最初に「◎（丸ゴール）」に到達するボールはどれでしょうか？',
    targetGoalLane: 2,
    fixedLines: [
      { leftLaneIndex: 0, y: 150, kind: 'slow' },
      { leftLaneIndex: 1, y: 250, kind: 'system' },
      { leftLaneIndex: 3, y: 350, kind: 'system' },
      { leftLaneIndex: 2, y: 450, kind: 'system' }
    ],
    arrows: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'C'
  },
  {
    id: 6,
    type: 'COLOR_MIX',
    name: 'クイズ 6: はじめてのカラーミックス',
    description: '「青」のボールが落ちて赤色のインクに衝突し、ブレンドされます。最終的に何色のボールとしてゴールに到達するでしょうか？',
    startLane: 2,
    startBallColor: 'blue',
    fixedLines: [
      { leftLaneIndex: 2, y: 200, kind: 'paintRed' },
      { leftLaneIndex: 1, y: 320, kind: 'system' },
      { leftLaneIndex: 2, y: 420, kind: 'system' }
    ],
    choices: {
      'A': '紫',
      'B': '緑',
      'C': 'オレンジ'
    },
    correctAnswer: 'A'
  },
  {
    id: 7,
    type: 'NOT_GOAL',
    name: 'クイズ 7: 青き分裂 of 波紋',
    description: '水色のギミック線は「分裂」！ボールが左右に増殖しながら落下します。A、B、C のうち、ボールが「入らない」ゴールはどれでしょうか？',
    startLane: 2,
    fixedLines: [
      { leftLaneIndex: 1, y: 200, kind: 'split' },
      { leftLaneIndex: 0, y: 320, kind: 'system' },
      { leftLaneIndex: 3, y: 420, kind: 'system' }
    ],
    goals: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'C'
  },
  {
    id: 8,
    type: 'FASTEST_BALL',
    name: 'クイズ 8: 急加速！スピードスター',
    description: 'オレンジ色の線は「スピードアップ」！A、B、C の矢印から同時にボールを落としたとき、最初に「◎（丸ゴール）」に辿り着くのはどれ？',
    targetGoalLane: 2,
    fixedLines: [
      { leftLaneIndex: 0, y: 180, kind: 'speedUp' },
      { leftLaneIndex: 1, y: 300, kind: 'system' },
      { leftLaneIndex: 3, y: 400, kind: 'system' }
    ],
    arrows: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'A'
  },
  {
    id: 9,
    type: 'COUNT_BALLS',
    name: 'クイズ 9: 分裂カウントの初歩',
    description: 'ボールは途中で分裂ギミックを通過します。最終的にゴールに到達するボールの合計個数は何個でしょうか？',
    startLane: 2,
    fixedLines: [
      { leftLaneIndex: 1, y: 220, kind: 'split' },
      { leftLaneIndex: 0, y: 350, kind: 'system' },
      { leftLaneIndex: 2, y: 450, kind: 'system' }
    ],
    choices: {
      'A': '1個',
      'B': '2個',
      'C': '3個'
    },
    correctAnswer: 'B'
  },
  {
    id: 10,
    type: 'SPIKE_BALL',
    name: 'クイズ 10: トゲトゲ襲来！',
    description: '紫色のトゲトゲ線は「スパイクギミック」！A、B、C から同時に落としたとき、最終的にトゲトゲに変身して「◎（丸ゴール）」にゴールするのはどれ？',
    targetGoalLane: 2,
    fixedLines: [
      { leftLaneIndex: 0, y: 150, kind: 'spike' },
      { leftLaneIndex: 1, y: 280, kind: 'system' },
      { leftLaneIndex: 3, y: 400, kind: 'system' }
    ],
    arrows: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'A'
  },

  // ==========================================
  // 【中級】ステージ 11〜25：複数ギミックの融合と予測
  // ==========================================
  {
    id: 11,
    type: 'WHICH_GOAL',
    name: 'クイズ 11: 複合あみだの試練',
    description: 'スピードアップと通常の横線が組み合わさりました。矢印（▼）から落ちたボールはどのゴールに到達するでしょうか？',
    startLane: 0,
    fixedLines: [
      { leftLaneIndex: 0, y: 150, kind: 'speedUp' },
      { leftLaneIndex: 1, y: 250, kind: 'system' },
      { leftLaneIndex: 2, y: 350, kind: 'system' },
      { leftLaneIndex: 2, y: 450, kind: 'system' }
    ],
    goals: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'B'
  },
  {
    id: 12,
    type: 'REMOVE_LINE',
    name: 'クイズ 12: スパイク回避の引き算',
    description: 'A、B、C のうち、どの線が「無ければ」ボールはトゲトゲ（SPIKE）にならずに「◎（丸ゴール）」へたどり着くでしょうか？',
    startLane: 0,
    targetGoalLane: 2,
    fixedLines: [
      { label: 'A', leftLaneIndex: 0, y: 160, kind: 'spike' },
      { label: 'B', leftLaneIndex: 0, y: 260, kind: 'system' },
      { label: 'C', leftLaneIndex: 1, y: 380, kind: 'system' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 13,
    type: 'ADD_LINE',
    name: 'クイズ 13: 急加速の架け橋',
    description: 'A、B、C のうち、どこに線を「引けば」スピードアップの加速を活かして「◎（丸ゴール）」にボールを入れることができるでしょうか？',
    startLane: 0,
    targetGoalLane: 2,
    fixedLines: [
      { leftLaneIndex: 1, y: 350, kind: 'system' }
    ],
    candidateLines: [
      { label: 'A', leftLaneIndex: 0, y: 200, kind: 'speedUp' },
      { label: 'B', leftLaneIndex: 2, y: 200, kind: 'system' },
      { label: 'C', leftLaneIndex: 3, y: 200, kind: 'system' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 14,
    type: 'WHICH_ARROW',
    name: 'クイズ 14: スローを避ける選択',
    description: 'A、B、C のうち、どの矢印からボールを落とせば、スロー線を避けて無事に「◎（丸ゴール）」へ到達できるでしょうか？',
    targetGoalLane: 2,
    fixedLines: [
      { leftLaneIndex: 1, y: 180, kind: 'slow' },
      { leftLaneIndex: 3, y: 300, kind: 'system' },
      { leftLaneIndex: 2, y: 420, kind: 'system' }
    ],
    arrows: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'C'
  },
  {
    id: 15,
    type: 'COLOR_MIX',
    name: 'クイズ 15: 二重のカラーブレンド',
    description: '「青」のボールがあみだを渡り、黄色インクと衝突して緑色になります。あみだの移動と混色の仕様をよく考えましょう。',
    startLane: 2,
    startBallColor: 'blue',
    fixedLines: [
      { leftLaneIndex: 2, y: 160, kind: 'system' },
      { leftLaneIndex: 3, y: 280, kind: 'paintYellow' },
      { leftLaneIndex: 3, y: 400, kind: 'system' },
      { leftLaneIndex: 2, y: 460, kind: 'system' }
    ],
    choices: {
      'A': '紫',
      'B': '緑',
      'C': 'オレンジ'
    },
    correctAnswer: 'B'
  },
  {
    id: 16,
    type: 'NOT_GOAL',
    name: 'クイズ 16: スパイクと分裂の二重奏',
    description: '分裂したボールたちが落下します。A、B、C のうち、ボールが「入らない」ゴールはどれでしょうか？罠の配置に注意してください。',
    startLane: 2,
    fixedLines: [
      { leftLaneIndex: 1, y: 180, kind: 'split' },
      { leftLaneIndex: 0, y: 300, kind: 'system' },
      { leftLaneIndex: 2, y: 420, kind: 'spike' }
    ],
    goals: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'C'
  },
  {
    id: 17,
    type: 'FASTEST_BALL',
    name: 'クイズ 17: スピード vs スロー',
    description: 'スピードアップ線とスロー線が交差します！A、B、C のうち、最初に「◎（丸ゴール）」に到達するボールはどれでしょうか？',
    targetGoalLane: 2,
    fixedLines: [
      { leftLaneIndex: 0, y: 150, kind: 'slow' },
      { leftLaneIndex: 1, y: 250, kind: 'speedUp' },
      { leftLaneIndex: 2, y: 350, kind: 'system' },
      { leftLaneIndex: 1, y: 450, kind: 'system' }
    ],
    arrows: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'B'
  },
  {
    id: 18,
    type: 'COUNT_BALLS',
    name: 'クイズ 18: ブラックホールの脅威',
    description: '分裂したボールの一部がブラックホールに吸い込まれて消滅します。最終的に無事にゴールへたどり着くボールの総数は何個？',
    startLane: 2,
    fixedLines: [
      { leftLaneIndex: 1, y: 180, kind: 'split' },
      { leftLaneIndex: 0, y: 300, kind: 'blackhole' },
      { leftLaneIndex: 2, y: 420, kind: 'system' }
    ],
    choices: {
      'A': '0個',
      'B': '1個',
      'C': '2個'
    },
    correctAnswer: 'B'
  },
  {
    id: 19,
    type: 'WHICH_GOAL',
    name: 'クイズ 19: はじめてのワープゾーン',
    description: 'ピンクの二重線は「ワープ」！入ったボールは瞬時にペアのワープ先へテレポートします。ボールはどのゴールへ行くでしょうか？',
    startLane: 0,
    fixedLines: [
      { leftLaneIndex: 0, y: 180, kind: 'warp', warpToLane: 1 },
      { leftLaneIndex: 3, y: 320, kind: 'system' }
    ],
    goals: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'B'
  },
  {
    id: 20,
    type: 'REMOVE_LINE',
    name: 'クイズ 20: 加速あみだの引き算',
    description: 'ボールが勢いよく落ちていきます。A、B、C のうちどの線を取り除けば、ボールは無事に「◎（丸ゴール）」に到着するでしょうか？',
    startLane: 4,
    targetGoalLane: 2,
    fixedLines: [
      { label: 'A', leftLaneIndex: 3, y: 180, kind: 'speedUp' },
      { label: 'B', leftLaneIndex: 2, y: 300, kind: 'system' },
      { label: 'C', leftLaneIndex: 2, y: 420, kind: 'system' }
    ],
    correctAnswer: 'C'
  },
  {
    id: 21,
    type: 'ADD_LINE',
    name: 'クイズ 21: ブラックホール回避の架け橋',
    description: 'ボールをブラックホールに吸い込ませず、無事「◎（丸ゴール）」に届けるため、どこに線を引けば良いでしょうか？',
    startLane: 0,
    targetGoalLane: 0,
    fixedLines: [
      { leftLaneIndex: 0, y: 150, kind: 'system' },
      { leftLaneIndex: 1, y: 300, kind: 'blackhole' }
    ],
    candidateLines: [
      { label: 'A', leftLaneIndex: 0, y: 220, kind: 'system' },
      { label: 'B', leftLaneIndex: 2, y: 320, kind: 'system' },
      { label: 'C', leftLaneIndex: 3, y: 440, kind: 'system' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 22,
    type: 'WHICH_ARROW',
    name: 'クイズ 22: 分裂とワープの迷宮',
    description: '分裂したあとにワープ！A、B、C のうち、どの矢印からボールを落とせば「◎（丸ゴール）」に到達するでしょうか？',
    targetGoalLane: 2,
    fixedLines: [
      { leftLaneIndex: 0, y: 150, kind: 'split' },
      { leftLaneIndex: 0, y: 280, kind: 'warp', warpToLane: 1 },
      { leftLaneIndex: 0, y: 350, kind: 'blackhole' }
    ],
    arrows: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'A'
  },
  {
    id: 23,
    type: 'COLOR_MIX',
    name: 'クイズ 23: 混色スピードスター',
    description: '「黄」のボールが加速しながら青インクと混ざり合います。最終的にゴールに到達するボールの色を予測してください。',
    startLane: 2,
    startBallColor: 'yellow',
    fixedLines: [
      { leftLaneIndex: 2, y: 180, kind: 'speedUp' },
      { leftLaneIndex: 2, y: 300, kind: 'paintBlue' },
      { leftLaneIndex: 1, y: 420, kind: 'system' }
    ],
    choices: {
      'A': '紫',
      'B': '緑',
      'C': 'オレンジ'
    },
    correctAnswer: 'B'
  },
  {
    id: 24,
    type: 'NOT_GOAL',
    name: 'クイズ 24: 重力反転の驚異',
    description: '紫のギミック線は「重力反転」！ボールが上昇に転じることに注意して、A、B、C のうちボールが「入らない」ゴールを当てましょう。',
    startLane: 2,
    fixedLines: [
      { leftLaneIndex: 2, y: 220, kind: 'reverse' },
      { leftLaneIndex: 1, y: 140, kind: 'system' },
      { leftLaneIndex: 0, y: 320, kind: 'system' }
    ],
    goals: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'C'
  },
  {
    id: 25,
    type: 'SPIKE_BALL',
    name: 'クイズ 25: トゲトゲ・ワープの罠',
    description: 'ワープの先にはスパイクが…？A、B、C から同時に落としたとき、最終的にトゲトゲ（SPIKE）に変身して「◎（丸ゴール）」に到達するボールはどれ？',
    targetGoalLane: 2,
    fixedLines: [
      { leftLaneIndex: 0, y: 150, kind: 'warp', warpToLane: 2 },
      { leftLaneIndex: 2, y: 260, kind: 'spike' },
      { leftLaneIndex: 3, y: 380, kind: 'system' }
    ],
    arrows: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'A'
  },

  // ==========================================
  // 【上級】ステージ 26〜40：ギミックの有機的活用と本格パズル
  // ==========================================
  {
    id: 26,
    type: 'WHICH_GOAL',
    name: 'クイズ 26: カラーフィルター突破',
    description: '破線は「カラーフィルター」！一致する色のボールしか通れません。青のボールは無事にどのゴールに到達するでしょうか？',
    startLane: 1,
    startBallColor: 'blue',
    fixedLines: [
      { leftLaneIndex: 1, y: 200, kind: 'colorFilter', filterColorId: 'blue' },
      { leftLaneIndex: 0, y: 350, kind: 'system' }
    ],
    goals: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'B'
  },
  {
    id: 27,
    type: 'REMOVE_LINE',
    name: 'クイズ 27: スローラインの除去',
    description: 'ボールをスロー（減速）させずに、無事「◎（丸ゴール）」へ届けるため、A、B、C のうちどの線を取り除けば良いでしょうか？',
    startLane: 0,
    targetGoalLane: 2,
    fixedLines: [
      { label: 'A', leftLaneIndex: 0, y: 150, kind: 'slow' },
      { label: 'B', leftLaneIndex: 0, y: 260, kind: 'system' },
      { label: 'C', leftLaneIndex: 1, y: 380, kind: 'system' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 28,
    type: 'ADD_LINE',
    name: 'クイズ 28: 重力反転を乗り越えろ',
    description: '上昇ギミックを考慮して、ボールを「◎（丸ゴール）」に入れるには、A、B、C どこに架け橋を架ければ良いでしょうか？',
    startLane: 2,
    targetGoalLane: 4,
    fixedLines: [
      { leftLaneIndex: 2, y: 300, kind: 'reverse' }
    ],
    candidateLines: [
      { label: 'A', leftLaneIndex: 3, y: 200, kind: 'system' },
      { label: 'B', leftLaneIndex: 0, y: 200, kind: 'system' },
      { label: 'C', leftLaneIndex: 1, y: 200, kind: 'system' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 29,
    type: 'WHICH_ARROW',
    name: 'クイズ 29: ダブルワープの選択',
    description: 'テレポート先を予測しましょう。A、B、C のうち、どの矢印からボールを落とせば「◎（丸ゴール）」に入るでしょうか？',
    targetGoalLane: 2,
    fixedLines: [
      { leftLaneIndex: 0, y: 100, kind: 'blackhole' },
      { leftLaneIndex: 3, y: 100, kind: 'blackhole' },
      { leftLaneIndex: 2, y: 150, kind: 'warp', warpToLane: 0 },
      { leftLaneIndex: 1, y: 250, kind: 'system' },
      { leftLaneIndex: 2, y: 320, kind: 'warp', warpToLane: 0 },
      { leftLaneIndex: 1, y: 400, kind: 'system' }
    ],
    arrows: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'B'
  },
  {
    id: 30,
    type: 'COLOR_MIX',
    name: 'クイズ 30: フィルターと混色のダンス',
    description: '「黄」のボールがあみだを渡り、青色のインクを浴び、さらに緑色のカラーフィルターを通過します。最終的な色は？',
    startLane: 2,
    startBallColor: 'yellow',
    fixedLines: [
      { leftLaneIndex: 2, y: 150, kind: 'paintBlue' },
      { leftLaneIndex: 2, y: 260, kind: 'colorFilter', filterColorId: 'green' },
      { leftLaneIndex: 2, y: 380, kind: 'system' }
    ],
    choices: {
      'A': '紫',
      'B': '緑',
      'C': 'オレンジ'
    },
    correctAnswer: 'B'
  },
  {
    id: 31,
    type: 'WHICH_ARROW',
    name: 'クイズ 31: 終焉のあみだ・クロニクル',
    description: 'ワープ、ブラックホール、重力反転が複雑に絡み合います！A、B、C どの矢印から落とせば「◎（丸ゴール）」に無事たどり着くでしょうか？',
    targetGoalLane: 2,
    fixedLines: [
      { leftLaneIndex: 2, y: 100, kind: 'blackhole' },
      { leftLaneIndex: 3, y: 100, kind: 'blackhole' },
      { leftLaneIndex: 0, y: 120, kind: 'warp', warpToLane: 2 },
      { leftLaneIndex: 1, y: 150, kind: 'system' },
      { leftLaneIndex: 2, y: 200, kind: 'reverse' },
      { leftLaneIndex: 1, y: 300, kind: 'system' }
    ],
    arrows: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'A'
  },
  {
    id: 32,
    type: 'NOT_GOAL',
    name: 'クイズ 32: 分裂とワープの狂想曲',
    description: '分裂したボールがワープゾーンへ突入します。A、B、C のうち、ボールが「絶対に到達しない」ゴールはどれでしょうか？',
    startLane: 2,
    fixedLines: [
      { leftLaneIndex: 1, y: 150, kind: 'split' },
      { leftLaneIndex: 0, y: 280, kind: 'warp', warpToLane: 2 },
      { leftLaneIndex: 2, y: 400, kind: 'system' }
    ],
    goals: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'C'
  },
  {
    id: 33,
    type: 'FASTEST_BALL',
    name: 'クイズ 33: 高速あみだスピードバトル',
    description: '非常に複雑なジグザグ加速経路！A、B、C のうち、最初に「◎（丸ゴール）」に到達するボールはどれでしょうか？',
    targetGoalLane: 2,
    fixedLines: [
      { leftLaneIndex: 0, y: 150, kind: 'speedUp' },
      { leftLaneIndex: 1, y: 250, kind: 'system' },
      { leftLaneIndex: 0, y: 350, kind: 'system' },
      { leftLaneIndex: 3, y: 400, kind: 'system' }
    ],
    arrows: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'A'
  },
  {
    id: 34,
    type: 'COUNT_BALLS',
    name: 'クイズ 34: 大分裂のカウント',
    description: '多くの分裂線が配置されたあみだです。途中で分裂を繰り返した結果、最終的にゴールに到達するボールの総数は何個？',
    startLane: 2,
    fixedLines: [
      { leftLaneIndex: 1, y: 160, kind: 'split' },
      { leftLaneIndex: 0, y: 280, kind: 'split' },
      { leftLaneIndex: 2, y: 400, kind: 'system' }
    ],
    choices: {
      'A': '2個',
      'B': '3個',
      'C': '4個'
    },
    correctAnswer: 'B'
  },
  {
    id: 35,
    type: 'SPIKE_BALL',
    name: 'クイズ 35: スパイク・ワープの嵐',
    description: 'A、B、C のうち、どの矢印からボールを落とせば、無事にトゲトゲ（SPIKE）に変身して「◎（丸ゴール）」へ到達できる？',
    targetGoalLane: 2,
    fixedLines: [
      { leftLaneIndex: 0, y: 140, kind: 'warp', warpToLane: 2 },
      { leftLaneIndex: 2, y: 250, kind: 'spike' },
      { leftLaneIndex: 3, y: 380, kind: 'system' }
    ],
    arrows: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'A'
  },
  {
    id: 36,
    type: 'COLOR_MIX',
    name: 'クイズ 36: カラーミックスと二重移動',
    description: '「青」のボールがあみだをジグザグに渡り、赤インクに衝突します。最終的に何色のボールとしてゴールに到達するでしょうか？',
    startLane: 2,
    startBallColor: 'blue',
    fixedLines: [
      { leftLaneIndex: 2, y: 150, kind: 'system' },
      { leftLaneIndex: 3, y: 250, kind: 'paintRed' },
      { leftLaneIndex: 2, y: 380, kind: 'system' }
    ],
    choices: {
      'A': '紫',
      'B': '緑',
      'C': 'オレンジ'
    },
    correctAnswer: 'A'
  },
  {
    id: 37,
    type: 'COUNT_BALLS',
    name: 'クイズ 37: 分裂とブラックホールの交差',
    description: 'A、B、C から同時にボールを発射！多くの分裂とブラックホールへの消去を経て、無事にゴールするボールは合計何個でしょうか？',
    fixedLines: [
      { leftLaneIndex: 0, y: 150, kind: 'split' },
      { leftLaneIndex: 2, y: 250, kind: 'blackhole' },
      { leftLaneIndex: 3, y: 320, kind: 'blackhole' },
      { leftLaneIndex: 1, y: 380, kind: 'system' }
    ],
    arrows: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    choices: {
      'A': '1個',
      'B': '2個',
      'C': '3個'
    },
    correctAnswer: 'B'
  },
  {
    id: 38,
    type: 'WHICH_GOAL',
    name: 'クイズ 38: 重力反転とカラー移動',
    description: '上昇と通常の横線のコンビネーション！「青」のボールはどのゴールへたどり着くでしょうか？',
    startLane: 2,
    startBallColor: 'blue',
    fixedLines: [
      { leftLaneIndex: 2, y: 200, kind: 'reverse' },
      { leftLaneIndex: 2, y: 100, kind: 'system' },
      { leftLaneIndex: 1, y: 150, kind: 'system' },
      { leftLaneIndex: 1, y: 250, kind: 'system' }
    ],
    goals: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'B'
  },
  {
    id: 39,
    type: 'REMOVE_LINE',
    name: 'クイズ 39: ブラックホールからの救出',
    description: 'ボールをブラックホールに吸い込ませず、無事「◎（丸ゴール）」に届けるため、どの線を取り除けば良いでしょうか？',
    startLane: 0,
    targetGoalLane: 0,
    fixedLines: [
      { label: 'A', leftLaneIndex: 0, y: 180, kind: 'system' },
      { leftLaneIndex: 1, y: 280, kind: 'blackhole' },
      { label: 'B', leftLaneIndex: 1, y: 380, kind: 'system' },
      { label: 'C', leftLaneIndex: 2, y: 450, kind: 'system' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 40,
    type: 'ADD_LINE',
    name: 'クイズ 40: 急加速のルート作成',
    description: 'ボールをブラックホールを越えさせて「◎（丸ゴール）」へ届けるため、どこに加速線を引けば良いでしょうか？',
    startLane: 0,
    targetGoalLane: 2,
    fixedLines: [
      { leftLaneIndex: 1, y: 350, kind: 'system' },
      { leftLaneIndex: 2, y: 250, kind: 'blackhole' }
    ],
    candidateLines: [
      { label: 'A', leftLaneIndex: 0, y: 150, kind: 'speedUp' },
      { label: 'B', leftLaneIndex: 2, y: 150, kind: 'system' },
      { label: 'C', leftLaneIndex: 3, y: 150, kind: 'system' }
    ],
    correctAnswer: 'A'
  },

  // ==========================================
  // 【究極/最難関】ステージ 41〜50：最高峰のあみだパズル
  // ==========================================
  {
    id: 41,
    type: 'WHICH_GOAL',
    name: 'クイズ 41: 三原色の交差点',
    description: '「黄」のボールがワープを通過し、さらに青インクを浴びます。あみだの移動とブレンド結果からゴールを予測しましょう。',
    startLane: 2,
    startBallColor: 'yellow',
    fixedLines: [
      { leftLaneIndex: 2, y: 150, kind: 'warp', warpToLane: 0 },
      { leftLaneIndex: 0, y: 260, kind: 'paintBlue' },
      { leftLaneIndex: 0, y: 320, kind: 'system' },
      { leftLaneIndex: 1, y: 380, kind: 'system' }
    ],
    goals: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'B'
  },
  {
    id: 42,
    type: 'NOT_GOAL',
    name: 'クイズ 42: 重力・分裂・ワープの混沌',
    description: '重力反転、分裂、ワープがすべて組み合わさった超難問！A、B、C のうち、ボールが「絶対に入らない」ゴールはどれでしょうか？',
    startLane: 2,
    fixedLines: [
      { leftLaneIndex: 3, y: 120, kind: 'warp', warpToLane: 1 },
      { leftLaneIndex: 2, y: 160, kind: 'split' },
      { leftLaneIndex: 3, y: 180, kind: 'system' },
      { leftLaneIndex: 1, y: 200, kind: 'system' },
      { leftLaneIndex: 3, y: 260, kind: 'reverse' },
      { leftLaneIndex: 0, y: 300, kind: 'system' }
    ],
    goals: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'C'
  },
  {
    id: 43,
    type: 'FASTEST_BALL',
    name: 'クイズ 43: 超高速とスローの境界線',
    description: '重力反転、スピードアップ、スローの複合！A、B、C の矢印から同時にボールを落としたとき、最初に「◎（丸ゴール）」に辿り着くのはどれ？',
    targetGoalLane: 2,
    fixedLines: [
      { leftLaneIndex: 2, y: 120, kind: 'slow' },
      { leftLaneIndex: 0, y: 160, kind: 'speedUp' },
      { leftLaneIndex: 3, y: 200, kind: 'reverse' },
      { leftLaneIndex: 1, y: 360, kind: 'system' }
    ],
    arrows: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'A'
  },
  {
    id: 44,
    type: 'COUNT_BALLS',
    name: 'クイズ 44: ブラックホール・シールド',
    description: '3つの矢印から同時に発射！ブラックホールに吸い込まれないようにあみだで逃がした結果、ゴールに到達するボールは何個でしょうか？',
    fixedLines: [
      { leftLaneIndex: 0, y: 150, kind: 'system' },
      { leftLaneIndex: 1, y: 250, kind: 'system' },
      { leftLaneIndex: 2, y: 300, kind: 'blackhole' }
    ],
    arrows: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    choices: {
      'A': '1個',
      'B': '2個',
      'C': '3個'
    },
    correctAnswer: 'B'
  },
  {
    id: 45,
    type: 'WHICH_GOAL',
    name: 'クイズ 45: 幻想 of ダブルワープ',
    description: 'ワープした直後に、さらに別のワープへ！矢印から落ちたボールは A、B、C どのゴールにたどり着くでしょうか？',
    startLane: 2,
    fixedLines: [
      { leftLaneIndex: 2, y: 160, kind: 'warp', warpToLane: 0 },
      { leftLaneIndex: 0, y: 260, kind: 'system' },
      { leftLaneIndex: 1, y: 360, kind: 'warp', warpToLane: 3 },
      { leftLaneIndex: 3, y: 460, kind: 'system' }
    ],
    goals: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    correctAnswer: 'A'
  },
  {
    id: 46,
    type: 'REMOVE_LINE',
    name: 'クイズ 46: トゲトゲ回避の分かれ道',
    description: 'ボールをトゲトゲ（SPIKE）に「させずに」無事「◎（丸ゴール）」へ届けるため、A、B、C のうちどの線を取り除けば良いでしょうか？',
    startLane: 0,
    targetGoalLane: 2,
    fixedLines: [
      { label: 'A', leftLaneIndex: 0, y: 180, kind: 'system' },
      { leftLaneIndex: 1, y: 240, kind: 'spike' },
      { label: 'B', leftLaneIndex: 1, y: 300, kind: 'system' },
      { leftLaneIndex: 0, y: 340, kind: 'system' },
      { label: 'C', leftLaneIndex: 1, y: 400, kind: 'system' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 47,
    type: 'COLOR_MIX',
    name: 'クイズ 47: 究極のカラーフィルター突破',
    description: '「赤」のボールがあみだを通り、黄色インクと衝突し、さらにカラーフィルターに到達します。最終的に何色のボールとしてゴールに到達するでしょうか？最終的な色を予測してください。',
    startLane: 2,
    startBallColor: 'red',
    fixedLines: [
      { leftLaneIndex: 2, y: 150, kind: 'system' },
      { leftLaneIndex: 3, y: 220, kind: 'paintYellow' },
      { leftLaneIndex: 3, y: 300, kind: 'colorFilter', filterColorId: 'orange' },
      { leftLaneIndex: 2, y: 400, kind: 'system' }
    ],
    choices: {
      'A': '紫',
      'B': '緑',
      'C': 'オレンジ'
    },
    correctAnswer: 'C'
  },
  {
    id: 48,
    type: 'COUNT_BALLS',
    name: 'クイズ 48: 終焉のカウントダウン',
    description: 'これが最後の試練！大分裂とワープ、そして吸い込みの強力なブラックホール。ゴールにたどり着くボールは最終的に何個でしょうか？',
    startLane: 2,
    fixedLines: [
      { leftLaneIndex: 2, y: 140, kind: 'split' },
      { leftLaneIndex: 1, y: 220, kind: 'split' },
      { leftLaneIndex: 3, y: 300, kind: 'blackhole' },
      { leftLaneIndex: 2, y: 380, kind: 'warp', warpToLane: 0 },
      { leftLaneIndex: 0, y: 460, kind: 'blackhole' }
    ],
    choices: {
      'A': '1個',
      'B': '2個',
      'C': '3個'
    },
    correctAnswer: 'A'
  },
  {
    id: 49,
    type: 'COLOR_MIX',
    name: 'クイズ 49: 虹色の交響曲',
    description: '「青」のボールが黄色インクを浴び、さらに緑色のカラーフィルターを通過します。最終的に何色のボールとしてゴールするでしょうか？',
    startLane: 2,
    startBallColor: 'blue',
    fixedLines: [
      { leftLaneIndex: 2, y: 150, kind: 'paintYellow' },
      { leftLaneIndex: 2, y: 260, kind: 'colorFilter', filterColorId: 'green' },
      { leftLaneIndex: 2, y: 380, kind: 'system' }
    ],
    choices: {
      'A': '紫',
      'B': '緑',
      'C': 'オレンジ'
    },
    correctAnswer: 'B'
  },
  {
    id: 50,
    type: 'COUNT_BALLS',
    name: 'クイズ 50: 神々のあみだくじ',
    description: '全50ステージのラストを飾る究極のあみだくじ！分裂、ブラックホール、ワープが無限の連鎖を生み出します。ゴールに到達するボールの合計個数を正確に数え切れるでしょうか？',
    fixedLines: [
      { leftLaneIndex: 0, y: 100, kind: 'split' },
      { leftLaneIndex: 3, y: 120, kind: 'blackhole' },
      { leftLaneIndex: 2, y: 150, kind: 'warp', warpToLane: 0 },
      { leftLaneIndex: 1, y: 180, kind: 'system' },
      { leftLaneIndex: 0, y: 200, kind: 'warp', warpToLane: 3 },
      { leftLaneIndex: 0, y: 250, kind: 'split' },
      { leftLaneIndex: 3, y: 300, kind: 'blackhole' },
      { leftLaneIndex: 1, y: 350, kind: 'system' }
    ],
    arrows: {
      0: 'A',
      2: 'B',
      4: 'C'
    },
    choices: {
      'A': '2個',
      'B': '3個',
      'C': '4個'
    },
    correctAnswer: 'B'
  }
];
