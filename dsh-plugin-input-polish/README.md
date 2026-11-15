# Input polish

A composer control that rewrites the message you are drafting so the agent has
less to guess, on a model you pick, without blocking your main conversation.

## What it does

A **Polish** (润色) button sits at the left of the chat composer's tool row, next
to the permission and plan controls. Clicking it:

1. reads the current draft from the composer,
2. starts a Host-side job that rewrites the draft with the **polish model**,
   using this conversation's recent messages as context, and
3. writes the rewritten message back into the same composer when the job
   finishes.

The plugin never sends the message. You still review, edit, and submit it
yourself, and the rewritten text stays an ordinary draft.

The rewrite keeps your language, intent, and concrete facts (paths, versions,
identifiers, code), turns vague wording into an explicit goal or expected
result, and does not invent requirements. A draft that is already specific is
only tightened.

## Choosing the polish model

The polish model is **not** the Session model: polishing is a small,
high-frequency task, so it never runs on the expensive model you may have
selected for a hard conversation.

Settings → General → **Input polish model** (输入润色模型) offers:

- **Model** — every model the installed providers actually advertise, grouped by
  provider.
- **Reasoning effort** — the efforts that model declares, plus **Model default**.
- **Edit prompt** — opens a multi-line editor for the system instructions the
  polisher receives, pre-filled with the built-in prompt. Editing it stores a
  custom prompt; leaving it unchanged stores none.
- **Restore default** — inside the editor, restores the built-in prompt into the
  editor and saves immediately, clearing the stored custom value. It asks for
  one confirmation click first.
- **Save** — stores the choice in this profile's patch layer, so it survives
  restarts and upgrades.

Defaults before any choice: `deepseek-account` / `deepseek-flash` at `low`. If a
configured route is no longer registered, the job fails with a
model-unavailable message that points at this setting instead of silently
switching models; a provider that disappeared falls back to the first registered
provider.

## Running in the background

The model call runs in the Host, in a Session-keyed job table, so:

- switching to another Session, or leaving the conversation view, does **not**
  cancel a running polish;
- the finished rewrite is applied when you return to that Session, as long as
  the draft is still the one the job started from (an edited or sent draft wins
  and the answer is dropped);
- the button keeps a spinner while the job runs, and clicking it again cancels
  the job;
- a job gives up after 120 seconds, and an uncollected result is kept for 30
  minutes.

## Behaviour and limits

- One click makes one model request. That request is not written to the Session
  log, so it does not appear in the transcript or consume context.
- The rewrite replaces the whole composer draft. Because of that, the button is
  disabled while the draft contains `@file` / `@session` reference chips: those
  chips cannot be restored after a replacement.
- Drafts longer than 4000 characters are refused in the composer, before any
  request.
- The request carries at most 6000 characters of recent conversation (the last
  12 messages, 1200 characters each).
- A truncated model answer (`max-tokens`) is reported instead of applied.
- A custom prompt replaces the system instructions only: the context transcript
  and the draft are still appended by the same fixed template. It is stored under
  the same `input-polish.config` as `provider`, `model`, and `reasoningEffort`,
  cleared instead of emptied when restored, and capped at 8000 characters.
- The single Host route is `POST /api/input-polish` (commands: `start`, `poll`,
  `consume`, `cancel`, `models`, `modelInfo`, `getSettings`, `saveSettings`),
  served on the authenticated owner connection channel only.
- Turning the plugin off removes the button, the settings row, and the route,
  and aborts any running job.

## Layout

| Path | Role |
| --- | --- |
| `index.js` | Host half: the route, the job table, the model call, settings persistence. |
| `client.js` | Client half: composer button, job follow-up, settings row. |
| `cordis.patch.yml` | Inserts the plugin row into the profile. |
| `locale/*.json` | Plugin Manager title and description. |
| `icon.svg` | Plugin icon. |
