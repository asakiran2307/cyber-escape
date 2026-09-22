# 🚨 CAMPUS CYBER ESCAPE: BLACKOUT PROTOCOL
## Official Event Facilitator & Game Master Runbook

> **Event Format:** 4 Physical QR Stations + Digital SOC Cyber Terminal  
> **Duration:** 20–25 Minutes  
> **Target Audience:** College / University Students (Beginner to Medium/Advanced)  
> **System Stack:** Zero-dependency standalone HTML/CSS/JS (Run locally or hosted online)  
> **Master Admin Password:** `CYBER-ADMIN-2026`  

---

## 1. Event Overview & Core Rules

Unlike basic trivia quizzes, **Blackout Protocol** is an authentic cybersecurity investigation simulation. Participants step into the shoes of Incident Responders in a campus Security Operations Center (SOC).

### ⚡ Sudden-Death Elimination Rule
- Every station verification is **high stakes**.
- Submitting an **incorrect answer immediately triggers TERMINAL LOCKDOWN / ELIMINATION**.
- Eliminated participants cannot proceed unless granted an override by the Game Master.
- Only correct submissions unlock progression tokens to advance to the next round.

### 🛡️ Anti-Cheating Architecture
1. **No Plaintext Answers:** All validation occurs via salted SHA-256 cryptographic hashes. Inspecting browser source code or DevTools will not reveal answers.
2. **Randomized Case Variations:** 4 distinct case variations (Alpha, Bravo, Charlie, Delta) ensure neighboring participants receive different clues, numbers, and formulas.
3. **Tab-Switching Watcher:** The application detects when a participant unfocuses the tab and logs security infractions.

---

## 2. Physical Station Setup & Room Map

Arrange 4 distinct areas in your venue or classroom to encourage physical movement and separation:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          [ NORTH WALL / DOOR ]                         │
│                    STATION 01: THE SPOOFED ORIGIN                      │
│                (Spear-Phishing & Deceptive Headers)                    │
│                                                                        │
│                                                                        │
│   [ WEST CORNER ]                                   [ EAST DESK ]      │
│   Spectator Seating /                         STATION 02: THE SHADOW   │
│   Briefing Area                               (OSINT & Password Recon) │
│                                                                        │
│                                                                        │
│   [ SOUTH DESK ]                              [ CENTRAL TABLE ]        │
│   STATION 03: THE MIRAGE                      STATION 04: THE BLACKOUT │
│   (Deceptive URLs & Hostnames)                (Incident SIEM Timeline) │
│                                                          +             │
│                                               GAME MASTER COMMAND POST │
└────────────────────────────────────────────────────────────────────────┘
```

| Station | Location | Physical Props Recommended |
| :--- | :--- | :--- |
| **Station 1** | North Entrance Wall | A4 Station 1 Poster, Printouts of mock phishing emails or warning notices. |
| **Station 2** | East Desk | A4 Station 2 Poster, Simulated ID badge card on lanyard, printed forum clippings. |
| **Station 3** | South Desk | A4 Station 3 Poster, Network diagram printout, whiteboard with mock DNS records. |
| **Station 4** | Central GM Table | A4 Station 4 Poster, Countdown projector/monitor, Stop clock buzzer. |

---

## 3. How to Print the 4 A4 QR Code Posters

1. Open `index.html` in your browser (or host it via Python/Node or GitHub Pages).
2. Click **🛡️ ADMIN LOGIN** in the top right header.
3. Enter Master Password: `CYBER-ADMIN-2026`.
4. In the **Physical Station A4 Poster & QR Generator** section:
   - Ensure the **Host URL** matches your actual address (e.g. `http://192.168.1.50:8000/` or `https://your-domain.com/`).
   - Click **🖨️ PRINT 4 A4 QR POSTERS (Ctrl+P)**.
5. In your browser print dialog:
   - Select paper size **A4**.
   - Enable **Background Graphics**.
   - Print all 4 sheets and tape them at Stations 1, 2, 3, and 4!

---

## 4. Game Master Briefing Speech (2 Minutes)

Gather participants at the briefing area and read this prompt:

> *"Attention Incident Responders. At 08:59 this morning, our campus core mainframe suffered a catastrophic intrusion. Network access has been severed under the BLACKOUT PROTOCOL.*  
>  
> *Your mission is to physically navigate 4 investigative stations across this room. Using your smartphone, scan each station’s QR code to triage forensic emails, reconstruct password habits from public OSINT, dissect deceptive hostnames, and sequence the SIEM incident timeline.*  
>  
> *A warning: **SUDDEN-DEATH ELIMINATION IS ACTIVE.** If you submit a wrong verification token, your terminal will immediately lock down and you will be eliminated from the investigation. Double-check your evidence before submitting.*  
>  
> *The first analyst to calculate the Master Exit PIN at Station 4 and report it to this table wins the Cyber Defense Championship. Scan Station 1 now—your 25-minute clock starts now!"*

---

## 5. Master Solution & Cheat-Sheet Table

Keep this reference at the Game Master table for rapid verification and grading:

| Station & Challenge | Case ALPHA (Ghost_Dean) | Case BRAVO (Cipher_Queen) | Case CHARLIE (Cloud_Valve) | Case DELTA (Falcon_Strike) | CLASSIC (Beginner) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Station 1: Origin** | Evidence **C**<br/>Code: **84**<br/>Octet: **198**<br/>*Key:* **285** | Evidence **B**<br/>Code: **91**<br/>Scope: **43**<br/>*Key:* **146** | Evidence **A**<br/>Code: **76**<br/>Subnet: **240**<br/>*Key:* **319** | Evidence **B**<br/>Code: **68**<br/>Gap: **401**<br/>*Key:* **472** | Email **B**<br/>*Pass:* **SAFE-PASS-101** |
| **Station 2: Shadow** | Pwd: `Bust!r#308`<br/>Entropy: **24**<br/>*Key:* **72** | Pwd: `Kasparov!2840`<br/>Metric: **31**<br/>*Key:* **58** | Pwd: `Mustang@67#`<br/>Entropy: **28**<br/>*Key:* **83** | Pwd: `Vot3!Falcon25`<br/>Slogan: **35**<br/>*Key:* **64** | Pwd: `Sunny2024`<br/>*Pass:* **LOCK-OUT-404** |
| **Station 3: Mirage** | Host: **B**<br/>Domain: `account-verification.info`<br/>Code: **19**<br/>*Key:* **108** | Host: **A**<br/>Punycode: `xn--univ-ofa.edu`<br/>Code: **42**<br/>*Key:* **95** | Vector: **C**<br/>Host: `exam-cloud.storage.aws`<br/>Code: **38**<br/>*Key:* **114** | Vector: **D**<br/>Host: `short-link.co`<br/>Code: **29**<br/>*Key:* **87** | Link: **3** (.edu)<br/>*Pass:* **SHIELD-77** |
| **Station 4: Blackout** | Root: `08:54:10`<br/>Trap: **22**<br/>Canary: **57** | Root: `09:12:04`<br/>Trap: **18**<br/>Canary: **62** | Root: `14:02:15`<br/>Trap: **33**<br/>Canary: **71** | Root: `11:22:40`<br/>Trap: **41**<br/>Canary: **48** | Recap:<br/>Sunny / .edu / Report |
| **FINAL ROOM EXIT PIN** | **`25`** | **`34`** | **`49`** | **`61`** | **`5599`** |

---

## 6. Managing Eliminations & Facilitator Overrides

When an agent enters a wrong answer, their smartphone screen flashes red with:
> **"TERMINAL LOCKDOWN - AGENT STATUS: ELIMINATED"**

The agent must walk to the Game Master table. The Game Master has two options:

1. **Strict Competitive Tournament:** The agent is out of the running for top prizes.
2. **Second Chance / Learning Event:**
   - The Game Master enters the Master Override Key (`CYBER-ADMIN-2026`) directly on the agent's locked phone, or
   - The Game Master opens the **Admin Login** on their laptop and clicks **🔓 REVIVE AGENT**.
   - The phone unlocks immediately and allows the agent to re-triage the station with a 3-minute time deduction.

---

## 7. Victory & Leaderboard Ranking

When a player solves Station 4, their screen presents the **OFFICIAL ROOM EXIT PIN** and a verified **ELITE SOC ANALYST CLEARANCE PASS**.

1. The participant rushes to the Game Master table and calls out their PIN.
2. Cross-reference the PIN with the cheat-sheet table above.
3. Record the participant's elapsed time on the whiteboard.
4. **Scoring Formula:**
   $$\text{Final Score} = 1500 - \text{Elapsed Seconds} - (\text{Tab Infractions} \times 60)$$
5. Present certificates or prizes to the top 3 fastest finishers!
