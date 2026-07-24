import re
import csv

def generate_csv():
    with open('src/stages.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    stages = []
    
    # Simple parsing logic
    blocks = re.findall(r'\{\s*id:\s*(\d+).*?name:\s*\'[^\']*\',\s*description:\s*\'([^\']*)\'.*?ballSpeed:\s*([\d\.]+).*?clearCount:\s*(\d+).*?maxBalls:\s*(\d+).*?goalTypes:\s*\[(.*?)\](.*?)gimmicks:', content, re.DOTALL)
    
    for block in blocks:
        id_str, desc, speed, clear_cnt, max_balls, goals_str, fixed_lines_str = block
        
        # Parse goals
        targets = goals_str.count("'target'")
        safes = goals_str.count("'safe'")
        dangers = goals_str.count("'danger'")
        
        # Parse fixed lines
        lines = re.findall(r'\{\s*kind:\s*\'([^\']+)\'', fixed_lines_str)
        initial_lines = len(lines)
        
        counts = {
            'bonus': 0, 'penalty': 0, 'warp': 0, 'colorFilter': 0,
            'blink': 0, 'moving': 0, 'speedUp': 0
        }
        for k in lines:
            if k in counts:
                counts[k] += 1
                
        # ballColors is after gimmicks
        ball_colors_match = re.search(r'id:\s*' + id_str + r'.*?ballColors:\s*(true|false)', content, re.DOTALL)
        colors = '赤青' if ball_colors_match and ball_colors_match.group(1) == 'true' else ''
        
        stages.append({
            'no': id_str,
            'clear': clear_cnt,
            'lines': initial_lines,
            'safe': safes,
            'target': targets,
            'danger': dangers,
            'speed': speed,
            'maxBalls': max_balls,
            'colors': colors,
            'energy': counts['bonus'] or '',
            'spike': counts['penalty'] or '',
            'warp': counts['warp'] or '',
            'color': counts['colorFilter'] or '',
            'onoff': counts['blink'] or '',
            'moving': counts['moving'] or '',
            'fast': counts['speedUp'] or '',
            'only': '', # Not used in these 100 stages?
            'description': desc
        })

    import sys
    writer = csv.writer(sys.stdout)
    writer.writerow([
        'no', 'クリア個数', '初期線の数', '緑ゴール数', '三角ゴール数', 'バツゴール数', 
        'ボールの速さ（多いほど速い）', '同時にあるボール個数', 'カラー', 
        'energy線', 'spike線', 'ワープ線', 'カラー線', 'onoff線', '移動線', 'FAST線', 'ONLY線', 'description'
    ])
    for s in stages:
        writer.writerow([
            s['no'], s['clear'], s['lines'], s['safe'], s['target'], s['danger'],
            s['speed'], s['maxBalls'], s['colors'],
            s['energy'], s['spike'], s['warp'], s['color'], s['onoff'], s['moving'], s['fast'], s['only'], s['description']
        ])
        
generate_csv()
