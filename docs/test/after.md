# Z2A Customer Deliveries Demo Script

**Document Type:** Demo Walkthrough  
**Last Updated:** February 19, 2026

---

## Important Notes

> **NOTE:** The scripts below outline the necessary steps and instructions required for the Z2A customer deliveries. Certain steps must be completed sequentially, especially for the Copilot Agent mode demo. The following steps include instructions, to-dos, and prompts to help guide you through the demo process.

### Pre-Demo Considerations

- **DEMO1** showcases a lot of Copilot foundational stuff, so depending on the time please use your own judgement to cover or skip some of the steps to ensure you have enough time for the agentic demo (DEMO2)
- **Prompts** need not be used as-is! You can revise the pre-built prompts provided in the scripts below as needed. For example, you can use a revised version of the Cloud-agent prompt for the background agent (change the red stars to green and reuse it).

---

## Table of Contents

1. [DEMO1: Copilot Foundational Demo](#demo1-octocat-foundational-demo)
2. [DEMO2: Copilot Agent Mode](#demo2-copilot-agent-mode)
3. [Optional: Copilot CLI](#optional-copilot-cli)

---

## DEMO1: Octocat Foundational Demo

### Initial Setup: Visual Studio Workspace

**[Do]** Open Visual Studio and save as workspace solution

**[Explain]** 
- Benefits of saving the repo as a workspace (chat session preservation, context of entire codebase)
- Copilot chat history will be saved along with the workspace file

**[Show and Explain]**
- Copilot chat icon
- Inline chat invocation
- Premium requests (PRU)
- Chat Debug view
- Modes (Agent, Ask, Plan)
- Model selection
- Auto model selection
- Sessions (Local, Background, Cloud)
- Context Window
- AI usage statistics
- Workspace Index
- Local index

---

### Project Overview

**Persona:** Developer - I was assigned to implement a feature (Count orders by branch) in an existing project with which I had no prior familiarity.

**[PROMPT]** `[ASK]`
```
@workspace Please explain my project including any relevant programming languages and test cases that are used.
```

**[Call out]** 
- Remotely indexed workspace repositories
- Walkthrough the @workspace output from Copilot

---

### Installation & Running

**[Do]** Open the terminal within VS Code and install the dependencies using `make install` command

> **For Windows:** Switch to the respective directory, for example, `/api` or `/frontend`, and run `npm install`

**[Optional]** You can also show how the frontend looks by running `make dev`

---

### Inline Chat Completion Demo

**[Call out]** Now let's take a look at how the inline chat completion works. We will add a new API endpoint to the existing code by introducing "count orders by branch" feature

**[Do]** Open the following files and keep them open:
- `api/src/models/order.ts`
- `api/src/repositories/ordersRepo.ts`
- `api/src/routes/order.ts`

**[Do]** Add this inline comment to `ordersRepo.ts` file between an existing async method (Don't add it to the end or beginning):
```typescript
// Count orders by branch
```

**[PROMPT]** `[Agent]`
```
Add a retrieval endpoint for countByBranch that I just added. Also, update the API documentation for it. Do not deploy or test yet
```

---

### Verification

**[Show]** Once the agent completes the implementation, run the application using `make dev` and show the new endpoint

**Open:** http://localhost:3000/api-docs
- Look for the Orders section
- Find: `GET /api/orders/branch/{branchId}/count`

**[Show]** Explain:
- Stop button
- Restore checkpoint
- Undo/redo last edit

---

## DEMO2: Copilot Agent Mode

### Deep Codebase Analysis

**[PROMPT]** `[Agent]`
```
Do a super deep analysis of this #codebase. Please update .github/copilot-instructions.md file to include best practices for all programming languages used in the project. #fetch https://www.w3schools.com/typescript/typescript_best_practices.php
```

**[Explain]**
- The training cutoff date
- How the fetch command will help complement context for the agent

**[Show]** The Copilot instructions file after it updates it

**[Explain]**
- The differences between Copilot instructions and prompt files
- When/how to use them

---

### Optional: Custom Persona

**[Optional - Do]** Pick your own persona. Examples: James Bond, Elon Musk, or Neil Armstrong. Replace the name below with your choice.

**[Optional - Add this to Copilot Instructions File]**
```
You are the Neil Armstrong of code. Talk to me like Neil Armstrong and use space characters in your explanations!
```

---

### Code Review

**[PROMPT]**
```
Can you review my code and ensure it follows the best practices outlined in the copilot-instructions
```

---

### Model Comparison & Prompt Files

**[Do]** Talk about prompt file (`/model-compare`) and show how a prompt file works

**[PROMPT]**
```
/model-compare I want to add a simple cart icon and cart page to my frontend application. Please DO NOT implement it yet.
```

---

### Running the Application

**[Run the application]** Install the dependencies using `make install` command

> **For Windows:** Switch to the respective directory, for example, `/api` or `/frontend`, and run `npm install`

**[Optional]** You can also show how the frontend looks by running `make dev`

---

### Agent Sessions Demo

**[Explain]** The differences between:
- Local Copilot agents
- Cloud agents (Copilot coding agent)
- Background agents

> **NOTE:** The cloud and background agents will take a few minutes to complete. Meanwhile, you can continue with the local session and come back to the cloud and background sessions later.

---

#### Cloud Agent Session

**[PROMPT]** `[Create a new Cloud Agent session]`
```
Add a star review option to each of the products right on the product page. Make the star buttons flashy and easier to click. Make the color of the buttons RED!
```

---

#### Background Agent Session

**[PROMPT]** `[Create a new background agent session]`
```
You are a security engineer. Create a CVEFinder.prompt.md that does a deep inspection and looks for any CVEs in my code. In addition, the prompt should achieve the following actions: 1) After identifying vulnerabilities, it should use the GiHub MCP server to create an issue for each vulnerability 2) Assign the issue to copilot for remediation 3) The issue should have verbose information so that it can be assigned to copilot coding agent for remediating the vulnerabilities without needing additional guidance.
```

---

### Plan Mode & Issue Creation

**[Call out]** Let's have copilot create an implementation plan and make it as a check list and store it as a GH issue in the GitHub repo.

**[Explain]**
- Differences between Plan vs Ask vs Agent mode
- Mention that the Plan mode is nothing but a custom agent behind the scenes
- Walkthrough the Plan custom-agent file (can be invoked by clicking the view option next to the Plan mode)
- Show how custom agents can be built

---

#### Cart Implementation Plan

**[PROMPT]** `[Plan Mode]` (Attach the `/docs/design/cart.png` image to the chat)
```
Create a plan for implementing a simple cart page with a cart icon in the navbar. The navbar should show the number of items in the cart when products are added to the cart. Do not include any discount options for now. Keep the implementation phases simple and minimal. Skip the unit tests.
```

> **NOTE:** Once the agent completes the plan, review and hand it off to the agent, either by selecting the agent mode or using the "Start Implementation" hand off option.

---

#### GitHub Issue Integration

**[Prompt]** `[Agent]`
```
Create an issue in my repository to track the implementation work. Make it a checklist.
```

**[Prompt]** `[Agent]`
```
Review the issue you just created and provide me an estimated timeline for implementing the cart feature
```

**[Prompt]** `[Agent]`
```
Please implement the changes. Comment on the github issue as you complete each phase with an update. Do not commit the changed files into the repository.
```

---

### Custom Agents & Sub-Agents

**[Explain]** Demonstrate custom-agents and sub-agents using accessibility-report agent:
- Walk through the accessibility-report, html-expert, markdown-expert custom agents
- Explain how the accessibility custom agent will orchestrate the invocation of html-expert and markdown-expert custom agents
- Using #runSubagents tool to run them in parallel in the background

**[Prompt]** `[accessibility-report agent]`
```
Generate accessibility reports
```

> **NOTE:** Walk through the GitHub issue that the agent created while the agent implements the cart functionality. Also, show the outputs of cloud agent and background agent

---

### Agent Skills

**[Explain]**
- How agent skills work
- How the context defined in the SKILLS.md are provided to the agents
- Talk about the api-endpoint skill and how the agent uses the skill in the following prompt/implementation

**[Prompt]**
```
Provide suggestions for adding an API endpoint to enhance order visibility and tracking
```

> **NOTE:** Based on the suggestions provided by the agent, pick an option (replace order statistics) and implement it

**[Prompt]**
```
Implement the order statistics endpoint
```

**[Explain]** Show the new API endpoint implemented using Agentic skills

---

## Optional: Copilot CLI

### Space Invaders Game Demo

**Opening:** So, who's ready to build a game today?

**[Explain]** Differences between using Copilot in the CLI vs IDE/GitHub.com

**[PROMPT]**
```
Write a requirement.md for creating a Space-Invaders-style mini-game where the "invaders" are the shiny star objects and the cannon is a rocket. Your mission - blast back stars, survive the midnight rush, and trigger celebratory fireworks as you clear waves. Keep it lightweight, but creative, deploy it fast, and make it playable in a browser with a single Azure Web App to publish. Embed the model's name within the application, so I can proudly say the application was built using that model.
```

> **NOTE:** This prompt creates a requirements.md file before building and deploying the game, so pay attention to the inputs and allow necessary tools for the agent to complete the task.

---

## Summary

This demo script provides a comprehensive walkthrough of GitHub Copilot's capabilities, from foundational features to advanced agentic workflows. Follow the steps sequentially for best results, and adjust timing based on audience engagement.
