# Casino Dealer Evaluation — Design Document
*2026-03-17*

---

## Overview

A cross-platform desktop and tablet application for casino pit management to evaluate dealer performance. Data stays entirely on the casino's local device. No cloud storage, no network calls during normal use. The app is sold as a licensed product under the Dice Floor brand.

---

## Platform

Single **Flutter** codebase compiling natively to:
- Windows (desktop)
- macOS (desktop)
- iPadOS (tablet — primary pit use)

Flutter is chosen because it is the only mature framework targeting all three platforms from one codebase, with strong charting, PDF, and SQLite library support.

---

## Licensing Model

### Trial
- Automatic on first launch — no code required
- 3 dealers maximum
- 30-day limit from first launch date
- On expiry or hitting the dealer limit, app prompts for a paid license key

### Paid tiers
| Type | Dealers | Updates | Pricing basis |
|---|---|---|---|
| One-time | Fixed limit (e.g. 10) | None | Flat fee |
| Yearly | Unlimited | Included | Per-dealer count |

### Key format
License keys are RSA-signed tokens encoding:
- Casino name
- License type (one-time / yearly)
- Dealer limit (or unlimited)
- Expiry date (yearly licenses only)
- Issue date

The app verifies keys using a public key baked into the build. No internet connection is ever required. Keys cannot be revoked remotely (acceptable trade-off for full offline operation).

### Key generator (internal tool)
A private Dice Floor script/tool used to issue keys to paying customers. Takes: casino name, license type, dealer limit, expiry. Signs with the private RSA key. Outputs the activation code sent to the customer.

---

## Security

- **Optional PIN** — can be enabled in Settings. Locks the entire app. Anyone without the PIN can only see the app is locked, nothing else.
- **Admin mode** — full access to enter evaluations, manage dealers and games, configure settings
- **View mode** — (future consideration) read-only access for floor staff

---

## Data Model

All data stored in a local SQLite database on the device. Five tables:

### Settings
One row. Stores casino name (from license key), PIN (hashed, optional), and license details. Also stores casino profile for PDF headers: logo, address, phone, email, registration/license number.

### Dealers
| Field | Notes |
|---|---|
| id | |
| name | |
| employee_number | Optional |
| active | Boolean — inactive dealers kept for historical reports |
| created_at | |

### Games
| Field | Notes |
|---|---|
| id | |
| name | e.g. Blackjack, Roulette, Baccarat, Poker |
| default_hph_target | Default hands per hour target for this game |

### Dealer_Games
Links dealers to the games they are certified to deal. One row per dealer–game pair.

### Evaluations
| Field | Notes |
|---|---|
| id | |
| dealer_id | |
| game_id | |
| date | |
| session_duration | In minutes, optional |
| hph_target | Copied from game default, overridable per session |
| hph_actual | Observed hands per hour |
| tips_amount | Optional |
| evaluator_name | Supervisor or manager on duty |
| notes | Free text, optional |

All fields except dealer_id and date are optional.

Performance score per session: `hph_actual ÷ hph_target × 100%`

---

## Screens

### Dashboard
- Total active dealers
- Evaluations this week
- **Top and bottom performers** shown in two layers:
  - Per-game breakdown — HPH actual vs target for each game dealt in the period
  - Overall — combined score across all games dealt, weighted by sessions
- Quick-access button: New Evaluation

### Dealers
- List of all dealers (active/inactive toggle)
- Tap dealer → profile view: games assigned, evaluation history, average performance summary
- Add / edit form: name, employee number, game assignments

### Games
- List of games offered by the casino
- Each game: name + default HPH target
- Set once, auto-fills all future evaluations for that game

### New Evaluation
Designed for speed — usable on an iPad in the pit in under 60 seconds:
1. Select dealer
2. Select game → HPH target pre-fills (editable)
3. Enter actual HPH
4. Enter tips (optional)
5. Evaluator name
6. Notes (optional)
7. Save

### Reports
- Time range selector: weekly / monthly / quarterly / 6-month / yearly
- Filter by dealer or game (optional)
- Charts:
  - HPH performance over time (line chart)
  - Tips trend over time
  - Dealer comparison (bar chart — per game and overall)
- Per-game breakdown and overall performance for every dealer in the selected period
- **Generate PDF** button

### Settings
- Casino profile: name (read-only from license), logo upload, address, phone, email, registration number
- PIN: enable/disable, change
- License info: type, dealer limit, expiry (if yearly), slots used
- Games management

---

## PDF Report

A formal evaluation document suitable for internal records and as an employment reference for the dealer.

### Header
- Casino logo (uploaded in settings)
- Casino name, address, phone, email, registration number
- Report period and date generated
- Evaluator name

### Dealer Summary
- Name, employee number
- Total sessions in period
- Total hours evaluated

### Per-Game Performance Table
One row per game dealt in the period:
- Game name
- Number of sessions
- Average HPH actual vs target
- Performance percentage
- Average tips per hour
- Visual indicator: on target / below target

### Overall Performance
- Combined weighted score across all games
- Total tips for the period
- Trend chart: HPH performance week by week within the report period

### Notes
Chronological list of free-text notes from individual evaluation sessions. Omitted if no notes were recorded.

### Signature Block
- Management: signature line + printed name + date
- Dealer: signature line + printed name + date

Sections with no data are automatically omitted from the PDF.

---

## Trial-to-Paid Flow

1. First launch → trial starts automatically (no code needed)
2. Trial badge visible in corner of app showing days remaining
3. On day 30 or when 4th dealer is added → modal prompt: "Your trial has ended. Enter a license key to continue."
4. User enters key purchased from dicefloor.com
5. Casino name populates from key, full access unlocked

---

## Future Considerations (out of scope for v1)

- Cash Desk Accounting module
- Poker Tournament Director module
- Online Poker Player Behaviour Analyser module
- View-only PIN mode for floor staff
- Multi-device sync within same casino network
