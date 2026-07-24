#!/usr/bin/perl
use strict;
use warnings;
use JSON::PP;

my $seed = 12345;
sub my_random {
    $seed = ($seed * 1664525 + 1013904223) % 4294967296;
    return $seed / 4294967296;
}
sub my_randint {
    my ($min, $max) = @_;
    return int(my_random() * ($max - $min + 1)) + $min;
}
sub my_choice {
    my ($arr) = @_;
    return $arr->[my_randint(0, scalar(@$arr) - 1)];
}

my $LANE_COUNT = 5;
my $MIN_Y = 80;
my $MAX_Y = 505;
my $MIN_GAP = 45;

my @STAGE_CONFIGS = (
    {desc => "アミダの基本。まずは直線をたどろう", primary => ["system"], lines => [2, 2]},
    {desc => "線が少し増えたよ。迷わないで", primary => ["system"], lines => [4, 4]},
    {desc => "遠回りする道もあるかも？", primary => ["system"], lines => [5, 5]},
    {desc => "ゴールをしっかり見極めて！", primary => ["system"], lines => [6, 6]},
    {desc => "複雑な交差点", primary => ["system"], lines => [8, 8]},
    {desc => "スピードアップ！焦らずに", primary => ["system"], lines => [8, 8]},
    {desc => "線がいっぱい！", primary => ["system"], lines => [10, 10]},
    {desc => "目が回るアミダ", primary => ["system"], lines => [10, 10]},
    {desc => "上下によく見て", primary => ["system"], lines => [9, 9]},
    {desc => "基本の総復習", primary => ["system"], lines => [10, 10]},

    {desc => "緑のエナジーを取ってみよう", primary => ["bonus"], lines => [3, 3], tut => "bonus"},
    {desc => "赤のスパイクは避けて！", primary => ["penalty"], lines => [3, 3], tut => "penalty"},
    {desc => "エナジーとスパイクが混ざっているよ", primary => ["bonus", "penalty"], lines => [6, 6]},
    {desc => "アイテムがたくさん！", primary => ["bonus", "penalty"], lines => [8, 8]},
    {desc => "スパイクの壁を越えろ", primary => ["system", "penalty"], lines => [8, 8]},
    {desc => "エナジーのご褒美", primary => ["system", "bonus"], lines => [8, 8]},
    {desc => "欲張ると危険？", primary => ["bonus", "penalty", "system"], lines => [9, 9]},
    {desc => "複雑な道と罠", primary => ["penalty", "system"], lines => [10, 10]},
    {desc => "アイテムラッシュ！", primary => ["bonus", "penalty"], lines => [10, 10]},
    {desc => "トラップをかいくぐれ", primary => ["bonus", "penalty", "system"], lines => [10, 10]},

    {desc => "動く線が登場！", primary => ["moving"], lines => [3, 3], tut => "moving"},
    {desc => "タイミングを見極めて", primary => ["moving"], lines => [5, 5]},
    {desc => "左右に揺れる道", primary => ["moving", "system"], lines => [6, 6]},
    {desc => "動く線がいっぱい！", primary => ["moving"], lines => [8, 8]},
    {desc => "スパイクを避けるタイミング", primary => ["moving", "penalty"], lines => [7, 7]},
    {desc => "止まっている道と動く道", primary => ["moving", "system"], lines => [8, 8]},
    {desc => "エナジーが逃げていく？", primary => ["moving", "bonus"], lines => [8, 8]},
    {desc => "動く罠", primary => ["moving", "penalty"], lines => [8, 8]},
    {desc => "大きく揺れる橋", primary => ["moving"], lines => [8, 8]},
    {desc => "スピードとタイミング", primary => ["moving", "system"], lines => [9, 9]},
    {desc => "複雑に絡み合う動く線", primary => ["moving"], lines => [10, 10]},
    {desc => "波打つアミダ", primary => ["moving", "system"], lines => [10, 10]},
    {desc => "動くスパイクの迷宮", primary => ["moving", "penalty"], lines => [10, 10]},
    {desc => "踊る線たち", primary => ["moving", "bonus"], lines => [10, 10]},
    {desc => "動く道の総仕上げ", primary => ["moving", "penalty", "system"], lines => [10, 10]},

    {desc => "消える線！？", primary => ["blink"], lines => [3, 3], tut => "blink"},
    {desc => "点滅する道。記憶力が試される", primary => ["blink", "system"], lines => [5, 5]},
    {desc => "見えない間は進めない", primary => ["blink"], lines => [6, 6]},
    {desc => "消えるエナジー", primary => ["blink", "bonus"], lines => [7, 7]},
    {desc => "見えないスパイクにご用心", primary => ["blink", "penalty"], lines => [7, 7]},
    {desc => "チカチカする迷路", primary => ["blink"], lines => [8, 8]},
    {desc => "動いて消える幻の道", primary => ["moving", "blink"], lines => [6, 6]},
    {desc => "消える橋と揺れる橋", primary => ["moving", "blink"], lines => [8, 8]},
    {desc => "記憶とタイミング", primary => ["moving", "blink", "penalty"], lines => [8, 8]},
    {desc => "罠が隠れているかも", primary => ["blink", "penalty"], lines => [9, 9]},
    {desc => "パニックアミダ", primary => ["blink", "moving"], lines => [9, 9]},
    {desc => "消える線ラッシュ！", primary => ["blink"], lines => [10, 10]},
    {desc => "見えない道を見破れ", primary => ["blink", "system"], lines => [10, 10]},
    {desc => "幻惑のワルツ", primary => ["blink", "moving", "bonus"], lines => [10, 10]},
    {desc => "点滅の試練", primary => ["blink", "penalty", "moving"], lines => [10, 10]},

    {desc => "加速線でスピードアップ！", primary => ["speedUp"], lines => [3, 3], tut => "speedUp"},
    {desc => "ジェットコースターアミダ", primary => ["speedUp", "system"], lines => [5, 5]},
    {desc => "急加速に注意！", primary => ["speedUp", "penalty"], lines => [6, 6]},
    {desc => "加速してエナジーゲット", primary => ["speedUp", "bonus"], lines => [7, 7]},
    {desc => "スピードの限界へ", primary => ["speedUp"], lines => [8, 8]},
    {desc => "動く加速線", primary => ["moving", "speedUp"], lines => [7, 7]},
    {desc => "消える超特急", primary => ["blink", "speedUp"], lines => [7, 7]},
    {desc => "制御不能！？", primary => ["speedUp", "moving", "blink"], lines => [8, 8]},
    {desc => "速すぎると危険！", primary => ["speedUp", "penalty"], lines => [9, 9]},
    {desc => "見えない高速道", primary => ["blink", "speedUp", "penalty"], lines => [9, 9]},
    {desc => "爆速の迷宮", primary => ["speedUp", "system"], lines => [10, 10]},
    {desc => "超速で罠を避けろ", primary => ["speedUp", "penalty"], lines => [10, 10]},
    {desc => "動く超特急", primary => ["speedUp", "moving"], lines => [10, 10]},
    {desc => "目にも止まらぬ速さ", primary => ["speedUp"], lines => [10, 10]},
    {desc => "スピードマスターの試練", primary => ["speedUp", "blink", "moving", "penalty"], lines => [10, 10]},

    {desc => "ワープでひとっ飛び！", primary => ["warp"], lines => [2, 2], tut => "warp"},
    {desc => "どこに繋がっている？", primary => ["warp", "system"], lines => [6, 6]},
    {desc => "ワープと罠", primary => ["warp", "penalty"], lines => [7, 7]},
    {desc => "ワープからの急加速", primary => ["warp", "speedUp"], lines => [7, 7]},
    {desc => "動くワープ道", primary => ["warp", "moving"], lines => [8, 8]},
    {desc => "消えるワープポイント", primary => ["warp", "blink"], lines => [8, 8]},
    {desc => "空間跳躍の迷路", primary => ["warp", "system"], lines => [9, 9]},
    {desc => "ワープでエナジーへ", primary => ["warp", "bonus"], lines => [8, 8]},
    {desc => "罠だらけの転送先", primary => ["warp", "penalty"], lines => [9, 9]},
    {desc => "見えないワープ", primary => ["warp", "blink", "penalty"], lines => [9, 9]},
    {desc => "加速と跳躍", primary => ["warp", "speedUp", "moving"], lines => [9, 9]},
    {desc => "四次元アミダ", primary => ["warp", "moving", "blink"], lines => [10, 10]},
    {desc => "混乱のワープゾーン", primary => ["warp", "system", "penalty"], lines => [10, 10]},
    {desc => "どこへ行くかわからない", primary => ["warp", "speedUp", "blink"], lines => [10, 10]},
    {desc => "空間の支配者", primary => ["warp", "speedUp", "moving", "blink", "penalty"], lines => [10, 10]},

    {desc => "赤玉と青玉の専用道", primary => ["colorFilter"], lines => [3, 3], tut => "colorFilter"},
    {desc => "色を分けて進もう", primary => ["colorFilter", "system"], lines => [6, 6]},
    {desc => "色の壁", primary => ["colorFilter", "penalty"], lines => [7, 7]},
    {desc => "自分の色の加速線", primary => ["colorFilter", "speedUp"], lines => [7, 7]},
    {desc => "動く色の道", primary => ["colorFilter", "moving"], lines => [8, 8]},
    {desc => "色付きの点滅道", primary => ["colorFilter", "blink"], lines => [8, 8]},
    {desc => "ワープとカラー", primary => ["colorFilter", "warp"], lines => [8, 8]},
    {desc => "二色の迷宮", primary => ["colorFilter", "system"], lines => [9, 9]},
    {desc => "罠と色のコンボ", primary => ["colorFilter", "penalty", "moving"], lines => [9, 9]},
    {desc => "高速カラーチェンジ", primary => ["colorFilter", "speedUp", "blink"], lines => [9, 9]},
    {desc => "極限の迷路", primary => ["system"], lines => [10, 10]},
    {desc => "究極のアミダ地獄：動", primary => ["moving"], lines => [10, 10]},
    {desc => "究極のアミダ地獄：滅", primary => ["blink"], lines => [10, 10]},
    {desc => "究極のアミダ地獄：速", primary => ["speedUp"], lines => [10, 10]},
    {desc => "究極のアミダ地獄：跳", primary => ["warp"], lines => [10, 10]},
    {desc => "究極のアミダ地獄：色", primary => ["colorFilter"], lines => [10, 10]},
    {desc => "全ギミック総力戦！", primary => ["bonus", "penalty", "moving", "blink", "speedUp", "warp", "colorFilter"], lines => [10, 10]},
    {desc => "限界を超えていけ", primary => ["bonus", "penalty", "moving", "blink", "speedUp", "warp", "colorFilter"], lines => [10, 10]},
    {desc => "最後の試練", primary => ["bonus", "penalty", "moving", "blink", "speedUp", "warp", "colorFilter"], lines => [10, 10]},
    {desc => "アミダマスター", primary => ["bonus", "penalty", "moving", "blink", "speedUp", "warp", "colorFilter"], lines => [10, 10]},
);

my @stages;
for my $i (1..100) {
    my $idx = $i - 1;
    my $config = $STAGE_CONFIGS[$idx];
    if (!$config) {
        $config = {desc => "がんばれ！", primary => ["system"], lines => [10, 10]};
    }

    my @lines;
    my $isTutorial = defined $config->{tut} ? 1 : 0;
    my $tutGimmick = $config->{tut};
    my $primaryGimmicks = $config->{primary};
    my $numLines = my_randint($config->{lines}->[0], $config->{lines}->[1]);
    
    my %gimmickCounts = (system=>0, bonus=>0, penalty=>0, moving=>0, blink=>0, speedUp=>0, warp=>0, colorFilter=>0, colorChange=>0);
    
    my $attempts = 0;
    while (scalar(@lines) < $numLines && $attempts < 300) {
        $attempts++;
        my $kind = 'system';
        if ($isTutorial) {
            $kind = $tutGimmick;
        } else {
            if (my_random() < 0.7 && scalar(@$primaryGimmicks) > 0) {
                $kind = my_choice($primaryGimmicks);
            } else {
                $kind = 'system';
            }
        }
        
        next if ($kind eq 'warp' && $gimmickCounts{'warp'} >= 1);
        next if ($kind ne 'warp' && $kind ne 'system' && $gimmickCounts{$kind} >= 3);
            
        my $li = my_randint(0, $LANE_COUNT - 2);
        my $y = my_randint($MIN_Y, $MAX_Y);
        
        my $conflict = 0;
        foreach my $l (@lines) {
            my $nearLane = abs($l->{leftLaneIndex} - $li) <= 1;
            my $nearY = abs($l->{y} - $y) < $MIN_GAP;
            if ($nearLane && $nearY) {
                $conflict = 1;
                last;
            }
        }
        next if $conflict;
            
        my $extra = {};
        if ($kind eq 'warp') {
            my @candidates;
            for my $x (0..$LANE_COUNT-1) {
                push @candidates, $x if abs($x - $li) >= 2;
            }
            next if scalar(@candidates) == 0;
            $extra->{warpToLane} = my_choice(\@candidates);
        } elsif ($kind eq 'colorFilter') {
            $extra->{filterColorId} = my_choice(['red', 'blue']);
        } elsif ($kind eq 'moving') {
            $extra->{amplitude} = my_randint(30, 70);
        } elsif ($kind eq 'blink') {
            $extra->{blinkInterval} = my_randint(30, 70);
        }
            
        push @lines, { kind => $kind, leftLaneIndex => $li, y => $y, %$extra };
        $gimmickCounts{$kind}++;
    }

    my $tier = int(($i - 1) / 10);
    my $speed = 0.8 + ($i * 0.008);
    
    my $clearCount = 5 + int($i / 10);
    my $totalBalls = $clearCount + my_randint(3, 5);
    my $maxBalls = 1 + ($i % 3);
    if ($i < 10) { $maxBalls = 1 + ($i % 2); }
    my $maxMiss = $i < 50 ? 2 : 1;
    
    my @goalPatterns = (
        ['danger','safe','target','safe','danger'],
        ['safe','danger','target','danger','safe'],
        ['danger','target','safe','danger','safe'],
        ['target','danger','safe','danger','target'],
    );
    my $goalTypes = $goalPatterns[$i % 4];
    my $ballColors = $i >= 81 ? 1 : 0;

    push @stages, {
        id => $i,
        name => "ステージ $i",
        description => $config->{desc},
        ballSpeed => sprintf("%.2f", $speed) + 0,
        clearCount => $clearCount,
        totalBalls => $totalBalls,
        maxMiss => $maxMiss,
        maxBalls => $maxBalls,
        goalTypes => $goalTypes,
        fixedLines => \@lines,
        gimmicks => $primaryGimmicks,
        ballColors => $ballColors,
        goalRotating => $i >= 40 ? 1 : 0,
        timeLimit => $i >= 80 ? 60 : undef
    };
}

# --- WRITE stages.js ---
print "===BEGIN JS===\n";
print "/**\n * stages.js - Hardcoded 100 Stages (Themed)\n */\n\n";
print "export const STAGES = [\n";

for my $s (@stages) {
    print "  {\n";
    print "    id: $s->{id}, name: '$s->{name}', description: '$s->{description}',\n";
    
    my $bc = $s->{ballColors} ? 'true' : 'false';
    my $gr = $s->{goalRotating} ? 'true' : 'false';
    my $tl = defined $s->{timeLimit} ? $s->{timeLimit} : 'null';
    
    print "    ballSpeed: $s->{ballSpeed}, clearCount: $s->{clearCount}, totalBalls: $s->{totalBalls}, maxMiss: $s->{maxMiss}, maxBalls: $s->{maxBalls},\n";
    print "    goalTypes: " . encode_json($s->{goalTypes}) . ",\n";
    
    print "    fixedLines: [\n";
    for my $l (@{$s->{fixedLines}}) {
        my $kind = $l->{kind};
        my $li = $l->{leftLaneIndex};
        my $y = $l->{y};
        
        my @extra;
        for my $k (keys %$l) {
            next if $k eq 'kind' || $k eq 'leftLaneIndex' || $k eq 'y';
            my $val = $l->{$k};
            $val = "'$val'" if $val =~ /^[a-zA-Z]+$/;
            push @extra, "$k: $val";
        }
        my $extra_str = join(', ', @extra);
        $extra_str = ", $extra_str" if $extra_str ne "";
        
        print "      { kind: '$kind', leftLaneIndex: $li, y: $y$extra_str },\n";
    }
    print "    ],\n";
    
    print "    gimmicks: " . encode_json($s->{gimmicks}) . ", ballColors: $bc, goalRotating: $gr, timeLimit: $tl\n";
    print "  },\n";
}
print "];\n";
print "===END JS===\n";

# --- WRITE stages.csv ---
my %COLOR_MAP = ('red' => '赤', 'blue' => '青', 'purple' => '紫');

print "===BEGIN CSV===\n";
print "no,クリア個数,初期線の数,緑ゴール数,三角ゴール数,バツゴール数,ボールの速さ（多いほど速い）,同時にあるボール個数,カラー,energy線,spike線,ワープ線,カラー線,onoff線,移動線,FAST線,ONLY線,description\n";

for my $s (@stages) {
    sub countKind {
        my ($k) = @_;
        my $c = 0;
        for my $l (@{$s->{fixedLines}}) { $c++ if $l->{kind} eq $k; }
        return $c > 0 ? $c : "";
    }
    sub countColorKind {
        my ($k, $attr) = @_;
        my %counts;
        for my $l (@{$s->{fixedLines}}) {
            if ($l->{kind} eq $k) {
                my $c = defined $l->{$attr} ? $l->{$attr} : 'red';
                my $jp = defined $COLOR_MAP{$c} ? $COLOR_MAP{$c} : $c;
                $counts{$jp}++;
            }
        }
        my $res = "";
        for my $color (keys %counts) {
            $res .= "$color$counts{$color}";
        }
        return $res;
    }

    my $safeCount = 0; my $dangerCount = 0; my $targetCount = 0;
    for my $g (@{$s->{goalTypes}}) {
        $safeCount++ if $g eq 'safe';
        $dangerCount++ if $g eq 'danger';
        $targetCount++ if $g eq 'target';
    }

    my @row = (
        $s->{id}, $s->{clearCount}, scalar(@{$s->{fixedLines}}),
        $safeCount, $targetCount, $dangerCount,
        sprintf("%.2f", $s->{ballSpeed}), $s->{maxBalls},
        $s->{ballColors} ? "赤青" : "",
        countKind('bonus'), countKind('penalty'), countKind('warp'),
        countColorKind('colorChange', 'colorChangeTarget'),
        countKind('blink'), countKind('moving'), countKind('speedUp'),
        countColorKind('colorFilter', 'filterColorId'),
        "\"$s->{description}\""
    );
    print join(",", @row) . "\n";
}

print "===END CSV===\n";
