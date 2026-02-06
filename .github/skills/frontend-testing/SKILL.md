---
name: frontend-testing
description: use the following when you are testing the frontend application with playwright
---
# Web Application Testing with Playwright

This skill helps you create and run browser-based tests for web applications using Playwright.

## When to use this skill

Use this skill when you need to:

- Test the frontend functionality using Playwright MCP server
- When the user asks to test the frontend using Playwright

## Playwright Testing Skill

When testing the frontend with Playwright, follow these guidelines to ensure comprehensive and effective test coverage:

1) **Setup and Configuration**:
   - Use Playwright MCP server to automate the testing of the frontend components. Do not use any manual termimal commands like npx or scripts.
2) **Test Structure**:
   - Only focus on the test case related to the implementation task at hand that was completed by the user/agent.
   - DO NOT test unrelated features or components.
3) **MCP Usage**:
   - Use the MCP GitHub server to log any issues found during testing.
   - Create issues with clear titles and detailed descriptions, including steps to reproduce, expected vs actual results, and any relevant screenshots or logs.
4) **Test Execution**:
   - Execute the Playwright tests in a controlled environment to ensure consistent results.
   - Do not make any changes to the codebase outside of the testing scope.
5) **Reporting**:
   - After completing the tests, compile a summary of findings into GitHub issues using the following GitHub CLI commmand (as an example). Make sure to include all relevant details from the test report. Do NOT use the GitHub MCP server for creating the issues report, instead use the GitHub CLI command provided below:

   ```bash
     gh issue create --title "Playwright Test Report" --body "Report of the frontend tests that were completed using playwright"
     ```