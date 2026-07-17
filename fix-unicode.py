import re, sys
p = sys.argv[1]
with open(p, 'r', encoding='utf-8') as f:
    content = f.read()
new_content = re.sub(r'\\u([0-9a-fA-F]{4})', lambda m: chr(int(m.group(1), 16)), content)
with open(p, 'w', encoding='utf-8') as f:
    f.write(new_content)
print(f"Done: {p}")
