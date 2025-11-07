#!/usr/bin/env python3
import re
from pathlib import Path

# Config
ROOT = Path(__file__).resolve().parent.parent
EXCLUDE_DIRS = {'assets/sources', '.git'}
EXTENSIONS = {'.js', '.css', '.html'}

# Tokens that indicate comment should be kept
KEEP_TOKENS = [
    '===', '====', '================',
    'CRIT', 'CRÍTIC', 'CRITICO', 'CRÍTICO', 'CRÍTIC', 'CRITIC', 'CRIT',
    'IMPORTANT', 'CRÍTICO', 'CRITICO', 'CRITIC', 'CRITICAL',
    'RESPONS', 'BARRA', 'SECCION', 'SECTION', 'RESPONSIVIDAD'
]

# Helpers

def should_keep_comment(text: str) -> bool:
    t = text.upper()
    # Keep if contains an obvious separator or any keep token
    for token in KEEP_TOKENS:
        if token in t:
            return True
    # Keep if there is a long run of = characters
    if re.search(r'=\s*={2,}', text):
        return True
    return False


def process_file(path: Path) -> bool:
    """Return True if file was modified"""
    orig = path.read_text(encoding='utf-8')
    s = orig

    # 1) Remove block comments /* ... */ unless they should be kept
    def repl_block(m):
        block = m.group(0)
        if should_keep_comment(block):
            return block
        return ''

    s = re.sub(r'/\*[\s\S]*?\*/', repl_block, s)

    # 2) Remove HTML comments <!-- ... --> unless keep
    def repl_html(m):
        block = m.group(0)
        if should_keep_comment(block):
            return block
        return ''

    s = re.sub(r'<!--([\s\S]*?)-->', repl_html, s)

    # 3) Remove single-line // comments unless keep
    def repl_line(m):
        line = m.group(0)
        if should_keep_comment(line):
            return line
        # remove the comment portion but keep preceding code if any
        code = re.sub(r'//.*$', '', line)
        # If only whitespace left, remove entire line
        if code.strip() == '':
            return ''
        return code.rstrip()

    s = re.sub(r'^\s*//.*$|[^\n]*//.*$', repl_line, s, flags=re.M)

    # 4) Collapse 3+ blank lines to 2
    s = re.sub(r'\n{3,}', '\n\n', s)

    if s != orig:
        path.write_text(s, encoding='utf-8')
        return True
    return False


if __name__ == '__main__':
    modified = []
    for p in ROOT.rglob('*'):
        if p.is_dir():
            # Skip excluded directories
            if any(str(p).startswith(str(ROOT / d)) for d in EXCLUDE_DIRS):
                continue
            continue
        if p.suffix.lower() not in EXTENSIONS:
            continue
        # Skip files in excluded dirs
        if any(str(p).startswith(str(ROOT / d)) for d in EXCLUDE_DIRS):
            continue
        try:
            changed = process_file(p)
            if changed:
                modified.append(str(p.relative_to(ROOT)))
        except Exception as e:
            print(f'ERROR processing {p}: {e}')
    if modified:
        print('Modified files:')
        for m in modified:
            print(' -', m)
    else:
        print('No files modified.')
