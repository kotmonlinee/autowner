# Diagnostic Context Module — Step 4 Enhancement

## Overview
Add 4 optional diagnostic context fields to Step 4 of the AI Diagnosis Wizard, placed between the Vehicle selects and the "Anything else?" textarea. These fields give the AI richer signal for more accurate diagnoses.

## Fields

| # | Field | Type | Values | Default |
|---|-------|------|--------|---------|
| 1 | Check Engine Light | Toggle (3-way) | Off / On / Flashing | empty |
| 2 | Duration | Toggle (3-way) | Just started / Days / Weeks+ | empty |
| 3 | Odometer | Number input | free text (miles) | empty |
| 4 | Recent Repairs | Toggle (2-way) | None / Yes | empty |

All fields optional. No validation. User can skip any or all and still diagnose.

## Layout (Option B — minimal inline)

No card wrapper. Fields flow vertically between Vehicle block and "Anything else?":

```
[Your Symptoms chips]
[Vehicle make/model/year selects]

Check Engine Light    [Off] [On] [Flashing]
How long?             [Just started] [Days] [Weeks+]
Odometer (miles)      [________________]
Recent repairs?       [None] [Yes]

Anything else?        [________________]
[✨ Diagnose with AI]
```

## Interaction

- **CEL**: Always visible. 3 buttons, single-select. Re-click deselects.
- **Duration**: Always visible. 3 buttons, single-select. Re-click deselects.
- **Odometer**: `input[type=number]`, `inputMode=numeric`. Placeholder: "e.g., 85,000".
- **Recent Repairs**: 2 buttons. Selecting "Yes" does NOT show additional input — user is guided to describe in the existing "Anything else?" textarea (update placeholder text when "Yes" is active).

Toggle style: Inactive = `bg-surface-0 border-surface-border text-text-muted`. Active = `bg-primary text-white border-primary`.

## Data Flow

State variables added to `DiagnosisWizard.tsx`:
- `celStatus: string` ("off" | "on" | "flashing" | "")
- `duration: string` ("just_started" | "days" | "weeks" | "")
- `mileage: string`
- `recentWork: string` ("none" | "yes" | "")

`handleDiagnose()` constructs a context string appended to the symptoms prompt:

```
Context: Check engine light: on. Duration: days. Odometer: 85000 miles. Recent work: yes. Additional notes: {extraNotes}.
```

Each field is only included if non-empty.

## API Changes

**`route.ts`**: System prompt already updated to describe how DeepSeek should interpret each context field. No route signature changes.

## Implementation Checklist

1. Add 4 state variables + reset logic in `DiagnosisWizard.tsx`
2. Add UI blocks between vehicle grid and extra notes textarea
3. Update `handleDiagnose()` to build context string
4. Update `reset()` to clear new fields
5. Verify type check passes
