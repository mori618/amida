import random
import json

random.seed(12345)

LANE_COUNT = 5
MIN_Y = 80
MAX_Y = 505
MIN_GAP = 45

# --- レベルデザイン定義 (100ステージ) ---
# primary: 出現しやすくなる、または確定で配置されるギミック
# num_lines: 配置する線の本数 (min, max)

STAGE_CONFIGS = [
    {"desc": "アミダの基本。まずは直線をたどろう", "primary": ["system"], "lines": (2, 2)},
    {"desc": "線が少し増えたよ。迷わないで", "primary": ["system"], "lines": (4, 4)},
    {"desc": "遠回りする道もあるかも？", "primary": ["system"], "lines": (5, 5)},
    {"desc": "ゴールをしっかり見極めて！", "primary": ["system"], "lines": (6, 6)},
    {"desc": "複雑な交差点", "primary": ["system"], "lines": (8, 8)},
    {"desc": "スピードアップ！焦らずに", "primary": ["system"], "lines": (8, 8)},
    {"desc": "線がいっぱい！", "primary": ["system"], "lines": (10, 10)},
    {"desc": "目が回るアミダ", "primary": ["system"], "lines": (10, 10)},
    {"desc": "上下によく見て", "primary": ["system"], "lines": (9, 9)},
    {"desc": "基本の総復習", "primary": ["system"], "lines": (10, 10)},

    {"desc": "緑のエナジーを取ってみよう", "primary": ["bonus"], "lines": (3, 3), "tut": "bonus"},
    {"desc": "赤のスパイクは避けて！", "primary": ["penalty"], "lines": (3, 3), "tut": "penalty"},
    {"desc": "エナジーとスパイクが混ざっているよ", "primary": ["bonus", "penalty"], "lines": (6, 6)},
    {"desc": "アイテムがたくさん！", "primary": ["bonus", "penalty"], "lines": (8, 8)},
    {"desc": "スパイクの壁を越えろ", "primary": ["system", "penalty"], "lines": (8, 8)},
    {"desc": "エナジーのご褒美", "primary": ["system", "bonus"], "lines": (8, 8)},
    {"desc": "欲張ると危険？", "primary": ["bonus", "penalty", "system"], "lines": (9, 9)},
    {"desc": "複雑な道と罠", "primary": ["penalty", "system"], "lines": (10, 10)},
    {"desc": "アイテムラッシュ！", "primary": ["bonus", "penalty"], "lines": (10, 10)},
    {"desc": "トラップをかいくぐれ", "primary": ["bonus", "penalty", "system"], "lines": (10, 10)},

    {"desc": "動く線が登場！", "primary": ["moving"], "lines": (3, 3), "tut": "moving"},
    {"desc": "タイミングを見極めて", "primary": ["moving"], "lines": (5, 5)},
    {"desc": "左右に揺れる道", "primary": ["moving", "system"], "lines": (6, 6)},
    {"desc": "動く線がいっぱい！", "primary": ["moving"], "lines": (8, 8)},
    {"desc": "スパイクを避けるタイミング", "primary": ["moving", "penalty"], "lines": (7, 7)},
    {"desc": "止まっている道と動く道", "primary": ["moving", "system"], "lines": (8, 8)},
    {"desc": "エナジーが逃げていく？", "primary": ["moving", "bonus"], "lines": (8, 8)},
    {"desc": "動く罠", "primary": ["moving", "penalty"], "lines": (8, 8)},
    {"desc": "大きく揺れる橋", "primary": ["moving"], "lines": (8, 8)},
    {"desc": "スピードとタイミング", "primary": ["moving", "system"], "lines": (9, 9)},
    {"desc": "複雑に絡み合う動く線", "primary": ["moving"], "lines": (10, 10)},
    {"desc": "波打つアミダ", "primary": ["moving", "system"], "lines": (10, 10)},
    {"desc": "動くスパイクの迷宮", "primary": ["moving", "penalty"], "lines": (10, 10)},
    {"desc": "踊る線たち", "primary": ["moving", "bonus"], "lines": (10, 10)},
    {"desc": "動く道の総仕上げ", "primary": ["moving", "penalty", "system"], "lines": (10, 10)},

    {"desc": "消える線！？", "primary": ["blink"], "lines": (3, 3), "tut": "blink"},
    {"desc": "点滅する道。記憶力が試される", "primary": ["blink", "system"], "lines": (5, 5)},
    {"desc": "見えない間は進めない", "primary": ["blink"], "lines": (6, 6)},
    {"desc": "消えるエナジー", "primary": ["blink", "bonus"], "lines": (7, 7)},
    {"desc": "見えないスパイクにご用心", "primary": ["blink", "penalty"], "lines": (7, 7)},
    {"desc": "チカチカする迷路", "primary": ["blink"], "lines": (8, 8)},
    {"desc": "動いて消える幻の道", "primary": ["moving", "blink"], "lines": (6, 6)},
    {"desc": "消える橋と揺れる橋", "primary": ["moving", "blink"], "lines": (8, 8)},
    {"desc": "記憶とタイミング", "primary": ["moving", "blink", "penalty"], "lines": (8, 8)},
    {"desc": "罠が隠れているかも", "primary": ["blink", "penalty"], "lines": (9, 9)},
    {"desc": "パニックアミダ", "primary": ["blink", "moving"], "lines": (9, 9)},
    {"desc": "消える線ラッシュ！", "primary": ["blink"], "lines": (10, 10)},
    {"desc": "見えない道を見破れ", "primary": ["blink", "system"], "lines": (10, 10)},
    {"desc": "幻惑のワルツ", "primary": ["blink", "moving", "bonus"], "lines": (10, 10)},
    {"desc": "点滅の試練", "primary": ["blink", "penalty", "moving"], "lines": (10, 10)},

    {"desc": "加速線でスピードアップ！", "primary": ["speedUp"], "lines": (3, 3), "tut": "speedUp"},
    {"desc": "ジェットコースターアミダ", "primary": ["speedUp", "system"], "lines": (5, 5)},
    {"desc": "急加速に注意！", "primary": ["speedUp", "penalty"], "lines": (6, 6)},
    {"desc": "加速してエナジーゲット", "primary": ["speedUp", "bonus"], "lines": (7, 7)},
    {"desc": "スピードの限界へ", "primary": ["speedUp"], "lines": (8, 8)},
    {"desc": "動く加速線", "primary": ["moving", "speedUp"], "lines": (7, 7)},
    {"desc": "消える超特急", "primary": ["blink", "speedUp"], "lines": (7, 7)},
    {"desc": "制御不能！？", "primary": ["speedUp", "moving", "blink"], "lines": (8, 8)},
    {"desc": "速すぎると危険！", "primary": ["speedUp", "penalty"], "lines": (9, 9)},
    {"desc": "見えない高速道", "primary": ["blink", "speedUp", "penalty"], "lines": (9, 9)},
    {"desc": "爆速の迷宮", "primary": ["speedUp", "system"], "lines": (10, 10)},
    {"desc": "超速で罠を避けろ", "primary": ["speedUp", "penalty"], "lines": (10, 10)},
    {"desc": "動く超特急", "primary": ["speedUp", "moving"], "lines": (10, 10)},
    {"desc": "目にも止まらぬ速さ", "primary": ["speedUp"], "lines": (10, 10)},
    {"desc": "スピードマスターの試練", "primary": ["speedUp", "blink", "moving", "penalty"], "lines": (10, 10)},

    {"desc": "ワープでひとっ飛び！", "primary": ["warp"], "lines": (2, 2), "tut": "warp"},
    {"desc": "どこに繋がっている？", "primary": ["warp", "system"], "lines": (6, 6)},
    {"desc": "ワープと罠", "primary": ["warp", "penalty"], "lines": (7, 7)},
    {"desc": "ワープからの急加速", "primary": ["warp", "speedUp"], "lines": (7, 7)},
    {"desc": "動くワープ道", "primary": ["warp", "moving"], "lines": (8, 8)},
    {"desc": "消えるワープポイント", "primary": ["warp", "blink"], "lines": (8, 8)},
    {"desc": "空間跳躍の迷路", "primary": ["warp", "system"], "lines": (9, 9)},
    {"desc": "ワープでエナジーへ", "primary": ["warp", "bonus"], "lines": (8, 8)},
    {"desc": "罠だらけの転送先", "primary": ["warp", "penalty"], "lines": (9, 9)},
    {"desc": "見えないワープ", "primary": ["warp", "blink", "penalty"], "lines": (9, 9)},
    {"desc": "加速と跳躍", "primary": ["warp", "speedUp", "moving"], "lines": (9, 9)},
    {"desc": "四次元アミダ", "primary": ["warp", "moving", "blink"], "lines": (10, 10)},
    {"desc": "混乱のワープゾーン", "primary": ["warp", "system", "penalty"], "lines": (10, 10)},
    {"desc": "どこへ行くかわからない", "primary": ["warp", "speedUp", "blink"], "lines": (10, 10)},
    {"desc": "空間の支配者", "primary": ["warp", "speedUp", "moving", "blink", "penalty"], "lines": (10, 10)},

    {"desc": "赤玉と青玉の専用道", "primary": ["colorFilter"], "lines": (3, 3), "tut": "colorFilter"},
    {"desc": "色を分けて進もう", "primary": ["colorFilter", "system"], "lines": (6, 6)},
    {"desc": "色の壁", "primary": ["colorFilter", "penalty"], "lines": (7, 7)},
    {"desc": "自分の色の加速線", "primary": ["colorFilter", "speedUp"], "lines": (7, 7)},
    {"desc": "動く色の道", "primary": ["colorFilter", "moving"], "lines": (8, 8)},
    {"desc": "色付きの点滅道", "primary": ["colorFilter", "blink"], "lines": (8, 8)},
    {"desc": "ワープとカラー", "primary": ["colorFilter", "warp"], "lines": (8, 8)},
    {"desc": "二色の迷宮", "primary": ["colorFilter", "system"], "lines": (9, 9)},
    {"desc": "罠と色のコンボ", "primary": ["colorFilter", "penalty", "moving"], "lines": (9, 9)},
    {"desc": "高速カラーチェンジ", "primary": ["colorFilter", "speedUp", "blink"], "lines": (9, 9)},
    {"desc": "極限の迷路", "primary": ["system"], "lines": (10, 10)},
    {"desc": "究極のアミダ地獄：動", "primary": ["moving"], "lines": (10, 10)},
    {"desc": "究極のアミダ地獄：滅", "primary": ["blink"], "lines": (10, 10)},
    {"desc": "究極のアミダ地獄：速", "primary": ["speedUp"], "lines": (10, 10)},
    {"desc": "究極のアミダ地獄：跳", "primary": ["warp"], "lines": (10, 10)},
    {"desc": "究極のアミダ地獄：色", "primary": ["colorFilter"], "lines": (10, 10)},
    {"desc": "全ギミック総力戦！", "primary": ["bonus", "penalty", "moving", "blink", "speedUp", "warp", "colorFilter"], "lines": (10, 10)},
    {"desc": "限界を超えていけ", "primary": ["bonus", "penalty", "moving", "blink", "speedUp", "warp", "colorFilter"], "lines": (10, 10)},
    {"desc": "最後の試練", "primary": ["bonus", "penalty", "moving", "blink", "speedUp", "warp", "colorFilter"], "lines": (10, 10)},
    {"desc": "アミダマスター", "primary": ["bonus", "penalty", "moving", "blink", "speedUp", "warp", "colorFilter"], "lines": (10, 10)},
]

stages = []

def generate_lines(stage_id, config):
    lines = []
    
    is_tutorial = "tut" in config
    tut_gimmick = config.get("tut")
    primary_gimmicks = config["primary"]
    num_lines = random.randint(config["lines"][0], config["lines"][1])
    
    gimmick_counts = {g: 0 for g in ['system', 'bonus', 'penalty', 'moving', 'blink', 'speedUp', 'warp', 'colorFilter', 'colorChange']}
    
    attempts = 0
    while len(lines) < num_lines and attempts < 300:
        attempts += 1
        
        # ギミックの選定
        if is_tutorial:
            kind = tut_gimmick
        else:
            # primaryに指定されたものが選ばれやすい
            if random.random() < 0.7 and len(primary_gimmicks) > 0:
                kind = random.choice(primary_gimmicks)
            else:
                kind = 'system'
        
        # 制約チェック
        if kind == 'warp' and gimmick_counts['warp'] >= 1:
            continue
        if kind != 'warp' and kind != 'system' and gimmick_counts[kind] >= 3:
            continue
            
        li = random.randint(0, LANE_COUNT - 2)
        y = random.randint(MIN_Y, MAX_Y)
        
        # 衝突チェック
        conflict = False
        for l in lines:
            near_lane = abs(l['leftLaneIndex'] - li) <= 1
            near_y = abs(l['y'] - y) < MIN_GAP
            if near_lane and near_y:
                conflict = True
                break
        
        if conflict:
            continue
            
        extra = {}
        if kind == 'warp':
            candidates = [x for x in range(LANE_COUNT) if abs(x - li) >= 2]
            if not candidates:
                continue
            to_lane = random.choice(candidates)
            extra['warpToLane'] = to_lane
        elif kind == 'colorFilter':
            extra['filterColorId'] = random.choice(['red', 'blue'])
        elif kind == 'moving':
            extra['amplitude'] = random.randint(30, 70)
        elif kind == 'blink':
            extra['blinkInterval'] = random.randint(30, 70)
            
        lines.append({"kind": kind, "leftLaneIndex": li, "y": y, **extra})
        gimmick_counts[kind] += 1
        
    return lines

for i in range(1, 101):
    idx = i - 1
    if idx < len(STAGE_CONFIGS):
        config = STAGE_CONFIGS[idx]
    else:
        config = {"desc": "がんばれ！", "primary": ["system"], "lines": (10, 10)}
        
    lines = generate_lines(i, config)
    
    # 難易度パラメータ
    tier = (i - 1) // 10
    speed = 0.8 + (i * 0.008)
    
    clearCount = 5 + (i // 10)
    totalBalls = clearCount + random.randint(3, 5)
    maxBalls = 1 + (i % 3)
    if i < 10: maxBalls = 1 + (i % 2)
    maxMiss = 2 if i < 50 else 1
    
    goal_patterns = [
        ['danger','safe','target','safe','danger'],
        ['safe','danger','target','danger','safe'],
        ['danger','target','safe','danger','safe'],
        ['target','danger','safe','danger','target'],
    ]
    goalTypes = goal_patterns[i % 4]
    
    ballColors = True if i >= 81 else False
    
    stages.append({
        "id": i,
        "name": f"ステージ {i}",
        "description": config["desc"],
        "ballSpeed": round(speed, 2),
        "clearCount": clearCount,
        "totalBalls": totalBalls,
        "maxMiss": maxMiss,
        "maxBalls": maxBalls,
        "goalTypes": goalTypes,
        "fixedLines": lines,
        "gimmicks": config["primary"].copy(),
        "ballColors": ballColors,
        "goalRotating": True if i >= 40 else False,
        "timeLimit": 60 if i >= 80 else None
    })

# Write stages.js
js_content = "/**\n * stages.js - Hardcoded 100 Stages (Themed)\n */\n\n"
js_content += "export const STAGES = [\n"
for s in stages:
    lines_str = "[\n"
    for l in s['fixedLines']:
        kind = l['kind']
        li = l['leftLaneIndex']
        y = l['y']
        extra = {k: v for k, v in l.items() if k not in ['kind', 'leftLaneIndex', 'y']}
        extra_str = ", ".join([f"{k}: {json.dumps(v)}" for k, v in extra.items()])
        if extra_str:
            lines_str += f"      {{ kind: '{kind}', leftLaneIndex: {li}, y: {y}, {extra_str} }},\n"
        else:
            lines_str += f"      {{ kind: '{kind}', leftLaneIndex: {li}, y: {y} }},\n"
    lines_str += "    ]"
    
    js_content += f"""  {{
    id: {s['id']}, name: '{s['name']}', description: '{s['description']}',
    ballSpeed: {s['ballSpeed']}, clearCount: {s['clearCount']}, totalBalls: {s['totalBalls']}, maxMiss: {s['maxMiss']}, maxBalls: {s['maxBalls']},
    goalTypes: {json.dumps(s['goalTypes'])},
    fixedLines: {lines_str},
    gimmicks: {json.dumps(s['gimmicks'])}, ballColors: {'true' if s['ballColors'] else 'false'}, goalRotating: {'true' if s['goalRotating'] else 'false'}, timeLimit: {s['timeLimit'] if s['timeLimit'] else 'null'}
  }},
"""
js_content += "];\n"

# Write stages.js to stdout
print("===BEGIN JS===")
print(js_content)
print("===END JS===")

# Write stages.csv to stdout
print("===BEGIN CSV===")
csv_lines = ["no,クリア個数,初期線の数,緑ゴール数,三角ゴール数,バツゴール数,ボールの速さ（多いほど速い）,同時にあるボール個数,カラー,energy線,spike線,ワープ線,カラー線,onoff線,移動線,FAST線,ONLY線,description"]

COLOR_MAP = {
    'red': '赤',
    'blue': '青',
    'purple': '紫'
}

for stage in stages:
    def count_kind(k):
        c = sum(1 for l in stage['fixedLines'] if l['kind'] == k)
        return str(c) if c > 0 else ""
        
    def count_color_kind(k, color_attr):
        counts = {}
        for l in stage['fixedLines']:
            if l['kind'] == k:
                c = l.get(color_attr, 'red')
                jp_color = COLOR_MAP.get(c, c)
                counts[jp_color] = counts.get(jp_color, 0) + 1
        
        if not counts: return ""
        return "".join([f"{color}{count}" for color, count in counts.items()])

    row = [
        str(stage['id']),
        str(stage['clearCount']),
        str(len(stage['fixedLines'])),
        str(stage['goalTypes'].count('safe')),
        str(stage['goalTypes'].count('target')),
        str(stage['goalTypes'].count('danger')),
        f"{stage['ballSpeed']:.2f}",
        str(stage['maxBalls']),
        "赤青" if stage['ballColors'] else "",
        count_kind('bonus'),
        count_kind('penalty'),
        count_kind('warp'),
        count_color_kind('colorChange', 'colorChangeTarget'),
        count_kind('blink'),
        count_kind('moving'),
        count_kind('speedUp'),
        count_color_kind('colorFilter', 'filterColorId'),
        f"\"{stage['description']}\""
    ]
    csv_lines.append(",".join(row))

print("\n".join(csv_lines))
print("===END CSV===")
