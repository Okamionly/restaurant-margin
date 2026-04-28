#!/usr/bin/env python3
"""
migrate-tokens.py
Remplace les hex Tailwind hardcodes par des tokens mono dans client/src/.

Usage : python scripts/migrate-tokens.py [--dry-run]
"""

import os
import re
import sys
from pathlib import Path

# --- Configuration ---

EXCLUDED_FILES = {
    'ShaderBackground.tsx',
    'MintMistBackground.tsx',
    'PaperFoldBackground.tsx',
    'colors.ts',
}

EXTENSIONS = {'.tsx', '.ts', '.jsx', '.js'}

# Mapping hex -> token mono
# Ordre : du plus specifique (plus long) au plus general pour eviter les collisions
# Les hex sont en MAJUSCULES pour la normalisation
REPLACEMENTS = [
    ('#E5E7EB', 'mono-900'),
    ('#F3F4F6', 'mono-950'),
    ('#F5F5F5', 'mono-975'),
    ('#FAFAFA', 'mono-1000'),
    ('#D4D4D4', 'mono-800'),
    ('#A3A3A3', 'mono-700'),
    ('#737373', 'mono-500'),
    ('#525252', 'mono-400'),
    ('#404040', 'mono-350'),
    ('#262626', 'mono-300'),
    ('#1A1A1A', 'mono-200'),
    ('#111111', 'mono-100'),
    ('#0A0A0A', 'mono-50'),
]

def process_file(path: Path, dry_run: bool = False) -> tuple[int, int]:
    """Retourne (replacements_count, occurrences_count)"""
    try:
        content = path.read_text(encoding='utf-8')
    except Exception as e:
        print(f'  ERROR reading {path}: {e}')
        return 0, 0

    original = content
    total_replacements = 0

    for hex_val, token in REPLACEMENTS:
        # Pattern: \[#XXXXXX\] (case-insensitive pour matcher #e5e7eb et #E5E7EB)
        escaped = re.escape(f'[{hex_val}]')
        pattern = re.compile(escaped, re.IGNORECASE)
        new_content, count = pattern.subn(token, content)
        content = new_content
        total_replacements += count

    if content != original:
        if not dry_run:
            path.write_text(content, encoding='utf-8')
        return total_replacements, total_replacements
    return 0, 0


def walk_src(src_dir: Path):
    for root, dirs, files in os.walk(src_dir):
        # Exclure node_modules
        dirs[:] = [d for d in dirs if d != 'node_modules']
        for fname in files:
            if Path(fname).suffix in EXTENSIONS:
                if fname not in EXCLUDED_FILES:
                    yield Path(root) / fname


def main():
    dry_run = '--dry-run' in sys.argv
    src_dir = Path(__file__).parent.parent / 'src'

    if not src_dir.exists():
        print(f'ERROR: src directory not found at {src_dir}')
        sys.exit(1)

    print(f'{"DRY RUN - " if dry_run else ""}Scanning {src_dir}...')
    print()

    files = list(walk_src(src_dir))
    modified = []
    total_replacements = 0

    for fpath in files:
        count, _ = process_file(fpath, dry_run=dry_run)
        if count > 0:
            rel = fpath.relative_to(src_dir)
            modified.append((rel, count))
            total_replacements += count
            action = '[DRY RUN]' if dry_run else 'UPDATED'
            print(f'  {action}: src/{rel} ({count} replacements)')

    print()
    print(f'{"=" * 60}')
    print(f'Files modified : {len(modified)}/{len(files)}')
    print(f'Total replacements : {total_replacements}')
    if dry_run:
        print('(No files were written — dry run mode)')


if __name__ == '__main__':
    main()
