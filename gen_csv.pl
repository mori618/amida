use strict;
use warnings;

open my $fh, '<', 'src/stages.js' or die "Cannot open src/stages.js: $!";
my $content = do { local $/; <$fh> };
close $fh;

print "no,ステージ名,クリア個数,初期線の数,緑ゴール数,三角ゴール数,バツゴール数,ボールの速さ,同時にあるボール個数,カラー,energy線,spike線,ワープ線,カラー線,onoff線,移動線,FAST線,ONLY線,制限時間,description\n";

while ($content =~ /\{\s*id:\s*(\d+).*?name:\s*'([^']*)',\s*description:\s*'([^']*)'.*?ballSpeed:\s*([\d\.]+).*?clearCount:\s*(\d+).*?maxBalls:\s*(\d+).*?goalTypes:\s*\[(.*?)\].*?fixedLines:\s*\[(.*?)\]\s*,\s*gimmicks:.*?timeLimit:\s*(null|\d+)/gs) {
    my ($id, $name, $desc, $speed, $clear_cnt, $max_balls, $goals_str, $lines_str, $timeLimit) = ($1, $2, $3, $4, $5, $6, $7, $8, $9);
    
    my $targets = () = $goals_str =~ /'target'/g;
    my $safes = () = $goals_str =~ /'safe'/g;
    my $dangers = () = $goals_str =~ /'danger'/g;
    
    my $initial_lines = () = $lines_str =~ /\{/g;
    
    my $bonus = () = $lines_str =~ /'bonus'/g;
    my $penalty = () = $lines_str =~ /'penalty'/g;
    my $warp = () = $lines_str =~ /'warp'/g;
    my $colorFilter = () = $lines_str =~ /'colorFilter'/g;
    my $blink = () = $lines_str =~ /'blink'/g;
    my $moving = () = $lines_str =~ /'moving'/g;
    my $speedUp = () = $lines_str =~ /'speedUp'/g;
    
    my $colors = "";
    if ($content =~ /id:\s*$id,.*?ballColors:\s*true/s) {
        $colors = "赤青";
    }
    
    my $limit_val = ($timeLimit eq 'null') ? "" : $timeLimit;
    my @row = (
        $id, "\"$name\"", $clear_cnt, $initial_lines, $safes, $targets, $dangers,
        $speed, $max_balls, $colors,
        $bonus || "", $penalty || "", $warp || "", $colorFilter || "",
        $blink || "", $moving || "", $speedUp || "", "", $limit_val, "\"$desc\""
    );
    print join(",", @row) . "\n";
}
