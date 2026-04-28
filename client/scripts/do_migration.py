#!/usr/bin/env python3
"""
do_migration.py
Full case-insensitive migration of ALL hex tokens across client/src/.
Writes a log to client/scripts/migration_log.txt.
"""
import os
import re
from pathlib import Path

EXCLUDED_FILES = {
    'ShaderBackground.tsx',
    'MintMistBackground.tsx',
    'PaperFoldBackground.tsx',
    'colors.ts',
}

EXTENSIONS = {'.tsx', '.ts', '.jsx', '.js'}

# Each tuple: (hex_uppercase, token)
REPLACEMENTS = [
    ('E5E7EB', 'mono-900'),
    ('F3F4F6', 'mono-950'),
    ('F5F5F5', 'mono-975'),
    ('FAFAFA', 'mono-1000'),
    ('D4D4D4', 'mono-800'),
    ('A3A3A3', 'mono-700'),
    ('737373', 'mono-500'),
    ('525252', 'mono-400'),
    ('404040', 'mono-350'),
    ('262626', 'mono-300'),
    ('1A1A1A', 'mono-200'),
    ('111111', 'mono-100'),
    ('0A0A0A', 'mono-50'),
]

# Build case-insensitive patterns
PATTERNS = []
for (hex_val, token) in REPLACEMENTS:
    # Match [#XXXXXX] case-insensitively
    pattern = re.compile(r'\[#' + hex_val + r'\]', re.IGNORECASE)
    PATTERNS.append((pattern, token, hex_val))

src_dir = Path('C:/Users/mrgue/CLAUDE CODE/restaurant-margin/client/src')

log_lines = []
total_files = 0
total_modified = 0
total_replacements = 0

for root, dirs, files in os.walk(src_dir):
    dirs[:] = [d for d in dirs if d != 'node_modules']
    for fname in files:
        if Path(fname).suffix not in EXTENSIONS:
            continue
        if fname in EXCLUDED_FILES:
            continue
        fpath = Path(root) / fname
        total_files += 1
        try:
            content = fpath.read_text(encoding='utf-8')
        except Exception as e:
            log_lines.append(f'ERROR reading {fpath}: {e}')
            continue

        original = content
        file_count = 0
        for (pattern, token, hex_val) in PATTERNS:
            new_content, n = pattern.subn(f'[{token}]', content)
            if n > 0:
                file_count += n
                total_replacements += n
            content = new_content

        if content != original:
            fpath.write_text(content, encoding='utf-8')
            total_modified += 1
            rel = fpath.relative_to(src_dir)
            log_lines.append(f'  UPDATED: src/{rel} ({file_count} replacements)')

log_path = Path('C:/Users/mrgue/CLAUDE CODE/restaurant-margin/client/scripts/migration_log.txt')
summary = [
    f'Files scanned : {total_files}',
    f'Files modified: {total_modified}',
    f'Total replacements: {total_replacements}',
    '',
    'Details:',
] + log_lines

log_path.write_text('\n'.join(summary), encoding='utf-8')
print('\n'.join(summary[:5]))
print(f'Full log: {log_path}')
