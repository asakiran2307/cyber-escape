# 📋 CAMPUS CYBER ESCAPE: MASTER 16-CASE QUESTION & ANSWER BANK
## Complete Syllabus of All 16 Station Case Modules (4 Stations × 4 Cases)

> **Event Format:** 4 Physical QR Stations + Digital SOC Cyber Terminal  
> **Anti-Cheat Engine:** Zero manual set selection. Participant enters **Name** and **PRN Number**, and the system deterministically assigns their unique path across the 16 cases.  
> **High-Stakes Rule:** Sudden-Death Elimination. Any incorrect MCQ submission triggers instant **TERMINAL LOCKDOWN**.  
> **Master Admin Password:** `CYBER-ADMIN-2026`  

---

## 🎯 PRN Deterministic Auto-Assignment Engine

When a student registers with their College PRN (e.g. `2024010529`), the cryptographic engine hashes the PRN to allocate one case per station:
- **Station 1:** Assigned to **Case 1-A**, **1-B**, **1-C**, or **1-D**
- **Station 2:** Assigned to **Case 2-A**, **2-B**, **2-C**, or **2-D**
- **Station 3:** Assigned to **Case 3-A**, **3-B**, **3-C**, or **3-D**
- **Station 4:** Assigned to **Case 4-A**, **4-B**, **4-C**, or **4-D**

This yields $4 \times 4 \times 4 \times 4 = 256$ possible investigative combinations. Standing next to another participant is completely useless because their questions, evidence, and formulas will be different!

---

# 🏢 STATION 01: THE SPOOFED ORIGIN (4 Cases)
**Theme:** Spear-Phishing, OAuth Consent Abuse, Tor Anonymizers, and Quishing.

---

### Case 1-A: The Dean's Executive Directive
- **Evidence Set:**
  - Email 1: Registrar relocation memo (Internal LAN).
  - Email 2: Dean's grant approvals from `dean@univ-academic-portal.org` (External Cloud IP `198.51.100.24`).
  - Email 3: IT Helpdesk notice from compromised student worker account with attachment `WiFi_Secure_Installer.pdf.exe`.

- **Questions & Answers:**
  - **Q1. Attack Vector Identification:** Which email represents a compromised legitimate internal account deploying an executable masking payload?
    - A) Email 1 (Registrar relocation notice)
    - B) Email 2 (Dean grant approvals notice)
    - **C) Email 3 (Campus IT Helpdesk Wi-Fi patch)** *(CORRECT)*
    - D) None, all three are routine automated broadcasts
  - **Q2. Obfuscation Technique:** What deceptive technique is used in Email 3 to mislead the user into executing a binary?
    - A) Macro Injection inside an Office XML document
    - **B) Double Extension Masking (.pdf.exe)** *(CORRECT)*
    - C) Steganographic LSB payload hiding
    - D) Unicode Right-to-Left Override (RTLO)
  - **Q3. Gateway IP Forensic Triage:** Forensic inspection of originating IP `198.51.100.24` in Email 2 confirms which network origin?
    - A) Campus Core LAN Subnet (10.0.0.0/8)
    - B) Localhost loopback adapter (127.0.0.1)
    - **C) External Cloud VPS / Unverified Foreign Infrastructure** *(CORRECT)*
    - D) Air-gapped mainframe backup appliance

---

### Case 1-B: Weaponized OAuth Cloud Authorization
- **Evidence Set:**
  - Email 1: Campus Health safety attestation.
  - Email 2: Microsoft 365 notice requesting consent for unverified app `Azure-BioSync` with `offline_access`.
  - Email 3: BioGen equipment delivery receipt.

- **Questions & Answers:**
  - **Q1. Vector Identification:** Which email contains the weaponized OAuth consent application grant?
    - A) Email 1 (Campus Health Center)
    - **B) Email 2 (Microsoft 365 Cloud Admin - BioCloud Sync)** *(CORRECT)*
    - C) Email 3 (BioGen Lab Supplies receipt)
    - D) None of the above
  - **Q2. Attack Technique Classification:** What is the industry term for tricking users into authorizing rogue cloud permissions?
    - **A) Illicit Consent Grant (OAuth Phishing)** *(CORRECT)*
    - B) SQL Injection
    - C) ARP Poisoning
    - D) Buffer Overflow
  - **Q3. Persistent Access Scope:** Which requested OAuth permission scope allows attackers persistent access even after password rotation?
    - A) Read Mail (`Mail.Read`)
    - **B) Offline Access (`offline_access`)** *(CORRECT)*
    - C) User Profile Read (`User.Read`)
    - D) Calendar View (`Calendars.Read`)

---

### Case 1-C: Examination Leak Scareware
- **Evidence Set:**
  - Email 1: Notice from `integrity@univ-exam-leak.net` with Tor Exit Node origin `185.220.101.5` and DMARC Reject.
  - Email 2: Routine exam room assignment from Prof. Davis.

- **Questions & Answers:**
  - **Q1. Malicious Message Vector:** Which email is the deceptive scareware phishing attempt?
    - **A) Email 1 (Academic Integrity Board leak notice)** *(CORRECT)*
    - B) Email 2 (Prof. Davis reminder)
    - C) Both are authentic messages
    - D) Neither message is malicious
  - **Q2. DMARC Enforcement:** What does an email authentication policy of DMARC `p=reject` instruct the gateway to do?
    - **A) Immediately drop and discard the email without inbox delivery** *(CORRECT)*
    - B) Move the message to the user's spam folder
    - C) Deliver normally with an informational banner
    - D) Forward the message to law enforcement
  - **Q3. Origin Anonymizer Triage:** The sending IP `185.220.101.5` matches what specific network infrastructure?
    - A) Internal Campus VPN Gateway
    - **B) Tor Anonymization Exit Node** *(CORRECT)*
    - C) Google Cloud Datacenter
    - D) University DNS Resolver

---

### Case 1-D: Quishing (QR Phishing) Triage
- **Evidence Set:**
  - Email 1: Financial Aid Office tuition schedule.
  - Email 2: Emergency $1,000 laptop grant notice with QR code attachment (`relief@emergency-student-funds.co`).

- **Questions & Answers:**
  - **Q1. Quishing Vector Identification:** Which email carries the deceptive Quishing payload?
    - A) Email 1 (Financial Aid Office)
    - **B) Email 2 (Emergency Student Funds Grant QR)** *(CORRECT)*
    - C) Both emails
    - D) Neither email
  - **Q2. Quishing Attack Mechanism:** Why are QR code phishing attacks dangerous compared to standard text links?
    - **A) Mobile scanners bypass desktop email gateway URL filters and hide destination URLs** *(CORRECT)*
    - B) QR codes inject machine code into the smartphone camera hardware
    - C) QR codes cannot be rendered on desktop monitors
    - D) Image files cannot be scanned by anti-virus engines
  - **Q3. Gateway Inspection Gap:** What is the primary technical reason automated perimeter firewalls fail to inspect Quishing links?
    - **A) The URL is encoded within an image raster rather than raw plaintext HTML** *(CORRECT)*
    - B) QR codes use UDP protocol instead of TCP
    - C) Smartphone cameras communicate via satellite
    - D) Mobile operating systems disable TLS encryption

---

# 🕵️ STATION 02: THE DIGITAL SHADOW (4 Cases)
**Theme:** OSINT Profiling, Identity Hygiene, and Credential Predictability.

---

### Case 2-A: Senior Admin Marcus Vance
- **Dossier:** Dublin half-marathon bib `#308`, beagle Buster, habit of replacing second vowel with `!`, AD policy requiring symbol `#`.
- **Questions & Answers:**
  - **Q1. Password Pattern Reconstruction:** Reconstruct Marcus's password using his pet name (Buster), second vowel leet-speak rule ('e' -> '!'), policy symbol '#', and bib (308):
    - A) `Buster2024!`
    - **B) `Bust!r#308`** *(CORRECT)*
    - C) `Dublin!308#`
    - D) `Bust3r@Dublin`
  - **Q2. Credential Entropy Assessment:** Why is Marcus's complex-looking password vulnerable to brute-force attack?
    - A) The character length exceeds domain controller limits
    - **B) Predictable personal OSINT elements reduce effective search space to < 25 bits** *(CORRECT)*
    - C) Active Directory disallows special punctuation symbols
    - D) Leet-speak characters are automatically stripped by authentication protocols
  - **Q3. Forensic Extraction Key Calculation:** Evaluate the entropy formula `(Password character count [9] * Bib number [308]) % 100`:
    - A) 48
    - B) 56
    - **C) 72** *(CORRECT)*
    - D) 94

---

### Case 2-B: Lead Bio-Genomics Researcher Elena Rostova
- **Dossier:** Chess idol Garry Kasparov, bio-containment badge `#2840`, format rule `[Hero]![BadgeID]`.
- **Questions & Answers:**
  - **Q1. Password Pattern Reconstruction:** Reconstruct Elena's password using her chess idol (Kasparov), separator '!', and badge ID (2840):
    - A) `Elena#2024`
    - **B) `Kasparov!2840`** *(CORRECT)*
    - C) `ChessMaster!28`
    - D) `Kasparov#Bio`
  - **Q2. OSINT Credential Vulnerability:** Why is combining public personal interests with employee ID numbers an insecure practice?
    - **A) Both pieces of information are publicly observable through social media and badge photos** *(CORRECT)*
    - B) Special characters corrupt LDAP directories
    - C) Numbers decrease password complexity
    - D) Garry Kasparov's name is in common dictionary wordlists

---

### Case 2-C: Cloud Architect Devon Chen
- **Dossier:** Vintage car forum post (1967 Ford Mustang), GitLab script comment `[CarModel]@[TwoDigitYear]#`.
- **Questions & Answers:**
  - **Q1. Password Pattern Reconstruction:** Reconstruct Devon's password following his car model and two-digit year rule:
    - A) `Ford1967#`
    - **B) `Mustang@67#`** *(CORRECT)*
    - C) `Mustang2024!`
    - D) `Devon@1967#`
  - **Q2. Credential Entropy Risk:** What makes hobby-based passwords vulnerable to offline dictionary attacks?
    - **A) Common vehicles and two-digit years exist in popular dictionary brute-force rulesets** *(CORRECT)*
    - B) Ford vehicles have known software vulnerabilities
    - C) Special symbols `@` and `#` weaken encryption algorithms
    - D) Two-digit numbers cause database buffer overflows

---

### Case 2-D: Student Body President Sarah Jenkins
- **Dossier:** Campus campaign flyer with slogan `Vot3!Falcon25`.
- **Questions & Answers:**
  - **Q1. Password Pattern Reconstruction:** Reconstruct Sarah's password derived from her public campaign flyer:
    - A) `Sarah2024!`
    - **B) `Vot3!Falcon25`** *(CORRECT)*
    - C) `President#25`
    - D) `FalconStrike#1`
  - **Q2. Campaign Slogan Vulnerability:** Why does using a campaign slogan violate password hygiene standards?
    - **A) Slogans are printed on public posters and memorized by hundreds of campus peers** *(CORRECT)*
    - B) Slogans lack alphabetical characters
    - C) Slogans contain too many uppercase characters
    - D) Slogans cannot be typed on mobile keyboards

---

# 🌐 STATION 03: THE DOMAIN MIRAGE (4 Cases)
**Theme:** RFC 3986 `@` Userinfo Tricks, IDN Homographs, S3 CNAME Takeovers, and URL Shorteners.

---

### Case 3-A: RFC 3986 Userinfo Deception
- **Captured URLs:**
  - Link 1: `https://portal.univ.edu@auth.secure-gateway.cloud/login?session=991`
  - Link 2: `https://univ.edu.portal-v3.account-verification.info/signin`
  - Link 3: `https://univ.edu/gateway/redirect?url=http://exfil-data.net/login`
- **Questions & Answers:**
  - **Q1. RFC 3986 URI Parsing Deception:** In Link 1, which destination host receives the incoming HTTP connection?
    - A) `portal.univ.edu`
    - **B) `auth.secure-gateway.cloud`** *(CORRECT)*
    - C) Both servers simultaneously via round-robin DNS
    - D) Browser rejects the URL with a protocol error
  - **Q2. Authoritative Registered Domain (eTLD+1):** In Link 2, what is the authoritative registered domain?
    - A) `univ.edu`
    - B) `portal-v3.univ.edu`
    - **C) `account-verification.info`** *(CORRECT)*
    - D) `signin.info`
  - **Q3. Web Exploit Vector Classification:** What vulnerability enables Link 3 to redirect visitors from `univ.edu` to an external attacker server?
    - A) SQL Injection (SQLi)
    - B) Cross-Site Scripting (XSS)
    - **C) Unvalidated Open Redirect** *(CORRECT)*
    - D) Server-Side Request Forgery (SSRF)

---

### Case 3-B: IDN Homograph & Punycode Deception
- **Captured URLs:**
  - Link 1: `https://univеrsity.edu/portal` (Cyrillic 'е' U+0435).
  - Link 2: `https://portal.univ.edu:8080/secure`
- **Questions & Answers:**
  - **Q1. Homograph Vector Identification:** Which link conceals an IDN Homograph / Punycode registration trick?
    - **A) Link 1 (`univеrsity.edu` with Cyrillic 'е')** *(CORRECT)*
    - B) Link 2 (`portal.univ.edu:8080`)
    - C) Neither link is deceptive
    - D) Both links use Punycode
  - **Q2. Punycode Decoded Hostname:** What is the actual ASCII Punycode string assigned to the lookalike Cyrillic domain?
    - A) `xn--univ-cyr.edu`
    - **B) `xn--univ-ofa.edu`** *(CORRECT)*
    - C) `univ-fake.edu`
    - D) `xn--college-88.edu`
  - **Q3. Client Defense Mechanism:** What browser security mechanism translates lookalike non-ASCII domains into visible `xn--` strings?
    - **A) Punycode Normalization & IDN Spoof Detection** *(CORRECT)*
    - B) DNSSEC Verification
    - C) Transport Layer Security (TLS)
    - D) Content Security Policy (CSP)

---

### Case 3-C: Cloud Bucket Subdomain Takeover
- **Captured URLs:**
  - Link 1: `https://exam-cloud.storage.aws/portal`
  - Link 2: `https://univ.edu/exam/s3`
- **Questions & Answers:**
  - **Q1. Rogue Cloud Storage Vector:** Which option represents the attacker-controlled cloud storage impersonation?
    - **A) Link 1 (`exam-cloud.storage.aws`)** *(CORRECT)*
    - B) Link 2 (`univ.edu/exam/s3`)
    - C) Neither link
    - D) Both links
  - **Q2. Deceptive Domain Structure:** Why is `exam-cloud.storage.aws` NOT an authentic Amazon Web Services domain?
    - **A) The authoritative registered domain is `storage.aws`, which is not an official AWS endpoint** *(CORRECT)*
    - B) AWS only uses `.com`, never any other TLD
    - C) The URL lacks HTTPS encryption
    - D) S3 bucket names cannot contain hyphens
  - **Q3. DNS Vulnerability Classification:** What vulnerability occurs when a DNS CNAME points to a deleted or abandoned cloud resource?
    - **A) Subdomain / CNAME Takeover** *(CORRECT)*
    - B) Cross-Site Scripting (XSS)
    - C) SQL Injection
    - D) Directory Traversal

---

### Case 3-D: Shortened URL Obfuscation
- **Captured URLs:**
  - Link 1: `https://short-link.co/claim-grant` (Redirects to `bank-auth.scam.ru`).
- **Questions & Answers:**
  - **Q1. URL Shortener Deception:** What deceptive technique disguises a malicious destination behind an HTTP 301/302 redirect service?
    - A) Cross-Site Scripting (XSS)
    - B) DNS Cache Poisoning
    - **C) URL Shortener Masking** *(CORRECT)*
    - D) Path Traversal
  - **Q2. Intermediate Host Inspection:** What is the intermediate shortener domain used to hide the phishing destination?
    - **A) `short-link.co`** *(CORRECT)*
    - B) `bank-auth.scam.ru`
    - C) `claim-grant.org`
    - D) `univ-aid.edu`
  - **Q3. Unshortening Defense Strategy:** How can an analyst inspect a shortened link safely without loading the final malicious webpage in a browser?
    - **A) Send an HTTP HEAD request or use an unshortening API to inspect the Location redirect header** *(CORRECT)*
    - B) Click the link in an incognito window
    - C) Print the QR code on paper
    - D) Change the browser screen resolution

---

# 🚨 STATION 04: THE 10-MINUTE BLACKOUT (4 Cases)
**Theme:** Incident Timeline Sequencing, Patient Zero Identification, and Room Exit PINs.

---

### Case 4-A: Hypervisor Ransomware Timeline
- **Timeline:** 08:50 (Port scan dropped), 08:51 (Email delivered), 08:54:10 (WiFi_Secure_Installer.pdf.exe spawned cmd.exe), 08:57:00 (Canary table `tbl_admin_passwords` read).
- **Questions & Answers:**
  - **Q1. Patient Zero Execution Timestamp:** Based on the SIEM telemetry, at what timestamp did the adversary achieve Patient Zero persistent code execution?
    - A) 08:50:12
    - B) 08:51:45
    - **C) 08:54:10** *(CORRECT)*
    - D) 08:58:15
  - **Q2. False Lead Elimination:** Why was the 08:50:12 inbound SYN port scan discarded as the intrusion root cause?
    - **A) It was automated perimeter scanning successfully dropped by edge firewalls** *(CORRECT)*
    - B) SYN packets cannot carry executable code
    - C) Port 22 is an authorized internal channel
    - D) The traffic originated from an internal workstation
  - **Q3. Decoy Canary Tripwire Verification:** Which canary tripwire alert provided definitive evidence of malicious credential abuse?
    - A) Active Directory ticket request at 08:55:30
    - B) DNS query at 08:53:02
    - **C) Honeytoken table `tbl_admin_passwords` read at 08:57:00** *(CORRECT)*
    - D) Storage alert at 08:58:15
  - **Q4. Master Room Exit PIN:** Select the verified Room Exit PIN:
    - A) 18
    - **B) 25** *(CORRECT)*
    - C) 36
    - D) 52
- 🏁 **CASE 4-A EXIT PIN:** **`25`**

---

### Case 4-B: Genomic Cloud Exfiltration Timeline
- **Timeline:** 09:08:15 (Shodan scan blocked), 09:12:04 (OAuth app Azure-BioSync granted offline scope), 09:16:02 (Canary file COVID_Gene_Sequence_Raw.xlsx downloaded).
- **Questions & Answers:**
  - **Q1. Initial Access Timestamp:** What exact timestamp marks the rogue OAuth application authorization?
    - A) 09:08:15
    - **B) 09:12:04** *(CORRECT)*
    - C) 09:14:30
    - D) 09:18:00
  - **Q2. Benign Event Filter:** Why was the 09:08:15 Shodan probe harmless?
    - **A) It was internet background crawler noise stopped by perimeter filters** *(CORRECT)*
    - B) Shodan is an internal university tool
    - C) Port 443 cannot be scanned
    - D) The probe carried encrypted payload
  - **Q3. Decoy Canary Minute Value:** What was the minute marker when the decoy file was accessed (09:16:02)?
    - A) 08
    - B) 12
    - **C) 16** *(CORRECT)*
    - D) 18
  - **Q4. Master Room Exit PIN:** Select the verified Room Exit PIN:
    - A) 22
    - **B) 34** *(CORRECT)*
    - C) 41
    - D) 58
- 🏁 **CASE 4-B EXIT PIN:** **`34`**

---

### Case 4-C: AWS API Hijack Timeline
- **Timeline:** 13:59:10 (WAF rate-limit noise), 14:02:15 (AssumeRole invoked with leaked credentials), 14:08:00 (Canary IAM user `audit-temp` accessed).
- **Questions & Answers:**
  - **Q1. Initial API Compromise Timestamp:** At what exact timestamp did the attacker first invoke the compromised AWS AssumeRole API?
    - A) 13:59:10
    - **B) 14:02:15** *(CORRECT)*
    - C) 14:05:40
    - D) 14:10:00
  - **Q2. Automated Edge Defense:** Why was the 13:59:10 WAF alert benign?
    - **A) It was automated rate-limiting suppression that prevented traffic from reaching the backend** *(CORRECT)*
    - B) WAF logs are always simulated
    - C) Rate-limiting indicates legitimate user activity
    - D) The traffic originated from internal IP
  - **Q3. Decoy Canary Account:** What canary IAM identity triggered the unauthorized credential alert?
    - A) `Devon-Admin`
    - **B) `audit-temp`** *(CORRECT)*
    - C) `root`
    - D) `kms-manager`
  - **Q4. Master Room Exit PIN:** Select the verified Room Exit PIN:
    - A) 32
    - **B) 49** *(CORRECT)*
    - C) 58
    - D) 64
- 🏁 **CASE 4-C EXIT PIN:** **`49`**

---

### Case 4-D: Wire Fraud & Quishing Timeline
- **Timeline:** 11:20:00 (Printer ping sweep noise), 11:22:40 (Sarah Jenkins mobile authorized wire API via QR), 11:27:12 (Decoy bank account #9988 credited).
- **Questions & Answers:**
  - **Q1. Initial QR Scan Timestamp:** At what exact timestamp did Sarah's mobile device execute the QR authorization?
    - A) 11:20:00
    - **B) 11:22:40** *(CORRECT)*
    - C) 11:25:00
    - D) 11:30:00
  - **Q2. Printer Subnet Noise Filter:** Why was the 11:20:00 IDS ping sweep alert discarded?
    - **A) It was routine local subnet printer broadcast chatter** *(CORRECT)*
    - B) Printers cannot connect to networks
    - C) The alert was an anti-virus false alarm
    - D) Ping packets carry ransomware
  - **Q3. Decoy Canary Account Alert:** Which event confirmed unauthorized financial manipulation?
    - A) Mobile connection at 11:22:40
    - **B) Tripwire canary bank account #9988 credited at 11:27:12** *(CORRECT)*
    - C) Treasury freeze at 11:30:00
    - D) Printer broadcast at 11:20:00
  - **Q4. Master Room Exit PIN:** Select the verified Room Exit PIN:
    - A) 45
    - **B) 61** *(CORRECT)*
    - C) 72
    - D) 88
- 🏁 **CASE 4-D EXIT PIN:** **`61`**

---

## ⚡ Quick Facilitator Cheat-Sheet

| Station | Case Set A | Case Set B | Case Set C | Case Set D |
| :--- | :--- | :--- | :--- | :--- |
| **Station 1 (Emails)** | **C**, **B**, **C** | **B**, **A**, **B** | **A**, **A**, **B** | **B**, **A**, **A** |
| **Station 2 (OSINT)** | **B**, **B**, **C** | **B**, **A** | **B**, **A** | **B**, **A** |
| **Station 3 (URLs)** | **B**, **C**, **C** | **A**, **B**, **A** | **A**, **A**, **A** | **C**, **A**, **A** |
| **Station 4 (Timeline)** | **C**, **A**, **C**, **B** | **B**, **A**, **C**, **B** | **B**, **A**, **B**, **B** | **B**, **A**, **B**, **B** |
| **FINAL EXIT PIN** | **`25`** | **`34`** | **`49`** | **`61`** |
