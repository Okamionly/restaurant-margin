#!/usr/bin/env python3
"""
run_migration.py - Wrapper with absolute path for CI/agent use.
"""
import subprocess
import sys
from pathlib import Path

script = Path("C:/Users/mrgue/CLAUDE CODE/restaurant-margin/client/scripts/migrate-tokens.py")
result = subprocess.run(
    [sys.executable, str(script)] + sys.argv[1:],
    cwd="C:/Users/mrgue/CLAUDE CODE/restaurant-margin/client",
)
sys.exit(result.returncode)
