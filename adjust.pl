use strict;
use warnings;

open my $fh, '<', 'src/stages.js' or die "Cannot open src/stages.js: $!";
my $content = do { local $/; <$fh> };
close $fh;

# Modify clearCount
$content =~ s{(id:\s*(\d+).*?clearCount:\s*)(\d+)}{do {
    my ($prefix, $id) = ($1, $2);
    my $new_count = 3;
    if ($id >= 100) { $new_count = 7; }
    elsif ($id >= 90) { $new_count = 5; }
    elsif ($id >= 50) { $new_count = 4; }
    else { $new_count = 3; }
    $prefix . $new_count;
}}ges;

# Trim fixedLines
$content =~ s{(id:\s*(\d+).*?fixedLines:\s*\[\s*)(.*?)(\s*\]\s*,\s*gimmicks)}{do {
    my ($prefix, $id, $lines_str, $suffix) = ($1, $2, $3, $4);
    
    my $target_lines = 3;
    if ($id > 80) { $target_lines = ($id % 2 == 0) ? 7 : 6; }
    elsif ($id > 40) { $target_lines = ($id % 2 == 0) ? 6 : 5; }
    elsif ($id > 10) { $target_lines = ($id % 2 == 0) ? 5 : 4; }
    else { $target_lines = ($id % 2 == 0) ? 3 : 4; }
    
    my @lines = $lines_str =~ /(\{.*?\})/gs;
    
    if (@lines > $target_lines) {
        @lines = @lines[0 .. $target_lines - 1];
    }
    
    my $new_lines_str = "\n      " . join(",\n      ", @lines) . "\n    ";
    
    $prefix . $new_lines_str . $suffix;
}}ges;

my @lines_of_output = split /\n/, $content;
my $chunk_idx = $ARGV[0] || 0;
my $chunk_size = 200;
my $start = $chunk_idx * $chunk_size;
my $end = $start + $chunk_size - 1;
if ($end >= @lines_of_output) { $end = @lines_of_output - 1; }
for my $i ($start .. $end) {
    print $lines_of_output[$i] . "\n";
}
