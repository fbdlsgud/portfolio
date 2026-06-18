# Ralph Skill

Use when the user wants the agent to continue until verifiable completion
criteria pass or safeguards stop the loop.

Read and follow:

```text
.agents/workflows/ralph.md
```

Runtime state:

```text
.agents/runtime/active-workflow
.agents/runtime/ralph-state.yaml
docs/ai/ralph-runs/<timestamp>-ralph.md
```

Keep these files accurate while the loop is active. Clear them when all criteria
pass, the user stops the loop, or a safeguard blocks further progress.
Each iteration needs concrete evidence in the Ralph report before finalizing.
