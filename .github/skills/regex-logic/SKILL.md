---
name: regex-logic
description: use this skill for advanced pattern matching, data extraction, and text manipulation using Regex
---
# Regular Expression Logic & Text Processing

This skill provides a framework for implementing robust regex patterns to parse logs, validate input, and transform text data within shell environments.

## When to use this skill

Use this skill when you need to:

- Extract specific data points from unstructured text or log files.
- Validate strings (emails, IP addresses, dates) within automation scripts.
- Perform complex "search and replace" operations using `sed`, `grep`, or `awk`.

## Regex Implementation Guidelines

When applying regex logic, adhere to the following standards to ensure cross-platform compatibility and readability:

1) **Engine Selection**:
   - Prefer **PCRE** (Perl Compatible Regular Expressions) via `grep -P` or `perl` for complex lookaheads/lookbehinds.
   - Use **Extended Regular Expressions (ERE)** via `grep -E` or `sed -E` for standard scripting to avoid "backslash-itis."
2) **Validation Strategy**:
   - Always anchor patterns using `^` (start) and `$` (end) when validating full strings to prevent partial matches.
   - Use `[[:alnum:]]` or `[[:space:]]` POSIX classes for better portability across different locales.
3) **Readability**:
   - Break down complex patterns into named variables or multi-line strings when possible to make the logic self-documenting.

---

## Example Bash Scripts

### 1. Extracting IP Addresses from Logs

This script uses `grep` with an ERE pattern to find all unique IPv4 addresses within a file.

```bash
#!/bin/bash
# Usage: ./extract_ips.sh access.log

LOG_FILE=$1

# Regex for a standard IPv4 address (0-255 per octet)
IP_REGEX="([0-9]{1,3}\.){3}[0-9]{1,3}"

echo "Extracting unique IP addresses from $LOG_FILE..."
grep -E -o "$IP_REGEX" "$LOG_FILE" | sort -u
```

### 2. Batch Renaming Files (Date Reformatting)

This script uses sed to reformat filenames from MM-DD-YYYY.log to YYYY-MM-DD.log for better chronological sorting.

```bash
#!/bin/bash
# Transforms filenames like '12-31-2023.log' to '2023-12-31.log'

for file in [0-9][0-9]-[0-9][0-9]-[0-9][0-9][0-9][0-9].log; do
    # Use capture groups \1, \2, \3 to rearrange the date segments
    new_name=$(echo "$file" | sed -E 's/([0-9]{2})-([0-9]{2})-([0-9]{4})/\3-\1-\2/')
    
    if [ "$file" != "$new_name" ]; then
        mv "$file" "$new_name"
        echo "Renamed: $file -> $new_name"
    fi
done
```

### 3. Advanced Data Extraction with Capture Groups

Using perl for non-greedy matching to extract a specific value from a configuration string.

```bash
#!/bin/bash
# Extracts the value of 'api_key' from a config string regardless of order

CONFIG_LINE='server_auth_token="AIzaSyA12345" debug_mode=true api_key="KEY_987654" region="us-east-1"'

# Uses a capture group to find the key and extract the quoted value
API_KEY=$(echo "$CONFIG_LINE" | perl -nle 'print $1 if /api_key="([^"]+)"/')

if [ -n "$API_KEY" ]; then
    echo "The extracted API Key is: $API_KEY"
else
    echo "API Key not found."
fi
```