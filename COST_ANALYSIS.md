# API Cost Analysis (per interview session)

## Assumptions
- Average session: 20 minutes
- Average turns: 25 (candidate + AI)
- Average tokens per turn: ~500 input, ~100 output

---

## 1. Vapi (Voice Layer)
- Price: $0.05/minute for voice processing
- 20 min session: **$1.00**

---

## 2. AI Brain: Google Gemini (Current Implementation)
We use a hybrid strategy: **Gemini 1.5 Flash** for quick, natural conversation turns, and **Gemini 1.5 Pro** for the final deep-dive evaluation and report generation.

### Gemini 1.5 Flash (Conversational Turns)
- Input pricing: $0.075 / 1M tokens
- Output pricing: $0.30 / 1M tokens
- Accumulating input context (25 turns): ~162,500 input tokens total
- Output response tokens (25 turns): ~2,500 output tokens total
- Conversational cost: $0.012 (input) + $0.00075 (output) = **~$0.013**

### Gemini 1.5 Pro (Report Generator Node)
- Input pricing: $1.25 / 1M tokens
- Output pricing: $5.00 / 1M tokens
- Inputs (Full transcript + critiques): ~20,000 input tokens
- Outputs (Detailed JSON report): ~1,500 output tokens
- Evaluation cost: $0.025 (input) + $0.0075 (output) = **~$0.0335**

### Total Gemini Cost per session: **~$0.046**

---

## 3. Alternative: Anthropic Claude 3.5 Sonnet
- Input pricing: $3.00 / 1M tokens
- Output pricing: $15.00 / 1M tokens
- Accumulated input context (25 turns): ~162,500 input tokens total
- Output response tokens (25 turns): ~2,500 output tokens total
- Sonnet conversational cost: $0.487 (input) + $0.037 (output) = **~$0.525**
- Sonnet evaluation report cost (20k input, 1.5k output): $0.06 (input) + $0.022 (output) = **~$0.082**
- Total Claude 3.5 Sonnet cost per session: **~$0.607**

---

## Summary of Total Cost per Session

| Provider Strategy | Voice Layer (Vapi) | LLM Brain (AI) | Total per Session |
| :--- | :--- | :--- | :--- |
| **Gemini Hybrid (Current)** | $1.00 | $0.046 | **~$1.05** |
| **Claude 3.5 Sonnet** | $1.00 | $0.607 | **~$1.61** |

---

## Optimisation & Savings Strategies
- **Context Trimming**: Trim transcript context window for long sessions (keep last N turns + summary) rather than sending the full history every turn.
- **Cache System Prompts**: Utilize context caching for the interviewer persona prompts (supported by Gemini).
- **Free Tier Developer Mode**: Use native Web Speech API fallback locally to bypass Vapi costs ($1.00 saved per session) during development and validation.
