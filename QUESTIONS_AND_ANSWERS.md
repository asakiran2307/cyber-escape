# 📋 CAMPUS CYBER ESCAPE: MASTER 16-CASE QUESTION & ANSWER BANK
## Complete Syllabus of All 16 Station Case Modules (4 Stations × 4 Cases × 5 Questions = 80 Total Questions)

> **Event Format:** 4 Physical QR Stations + Digital SOC Cyber Terminal  
> **Anti-Cheat Engine:** Zero manual set selection. Participant enters **Name** and **PRN Number**, and the system deterministically assigns their unique path across the 16 cases.  
> **High-Stakes Rule:** Sudden-Death Elimination. Any incorrect MCQ submission triggers instant **TERMINAL LOCKDOWN**.  
> **Master Admin Password:** CYBER-ADMIN-2026  

---

## 🎯 PRN Deterministic Auto-Assignment Engine

When a student registers with their College PRN (e.g. 4010529), the cryptographic engine hashes the PRN to allocate one case per station:
- **Station 1:** Assigned to **Case 1-A**, **1-B**, **1-C**, or **1-D**
- **Station 2:** Assigned to **Case 2-A**, **2-B**, **2-C**, or **2-D**
- **Station 3:** Assigned to **Case 3-A**, **3-B**, **3-C**, or **3-D**
- **Station 4:** Assigned to **Case 4-A**, **4-B**, **4-C**, or **4-D**

This yields  \times 4 \times 4 \times 4 = 256$ possible investigative combinations. Standing next to another participant is completely useless because their questions, evidence, and formulas will be different!

---

# 🏢 STATION 01: THE SPOOFED ORIGIN (4 Cases)

---

### Case 1-A: The Dean's Executive Directive
**Story Directive:** SOC INCIDENT ALERT // PRIORITY 1: At 08:42 AM, the campus Security Operations Center detected anomalous lateral authentication bursts originating from an administrative workstation in North Hall. Mail gateway telemetry indicates three incoming communications reached administrative personnel in the 15 minutes prior to compromise. One communication bypassed secondary heuristics using an executable masking payload.

**Forensic Questions & Answer Key (5 Questions):**

#### 1. Attack Vector Identification
**Prompt:** Which email represents a compromised legitimate internal account deploying an executable masking payload?

- [A] A) Email 1 (Registrar relocation notice)
- [B] B) Email 2 (Dean grant approvals notice)
- **[C] C) Email 3 (Campus IT Helpdesk Wi-Fi patch)** *(CORRECT)*
- [D] D) None, all three are routine automated broadcasts

#### 2. Obfuscation Technique
**Prompt:** What deceptive technique is used in Email 3 to mislead the user into executing a binary file?

- [A] A) Macro injection inside an Office OpenXML spreadsheet
- **[B] B) Double Extension Masking (.pdf.exe)** *(CORRECT)*
- [C] C) Steganographic LSB payload hiding inside an image
- [D] D) Unicode Right-to-Left Override (RTLO) character substitution

#### 3. Gateway IP Forensic Triage
**Prompt:** Forensic inspection of originating IP 198.51.100.24 in Email 2 confirms which network origin?

- [A] A) Campus Core LAN Subnet (10.0.0.0/8)
- [B] B) Localhost loopback adapter (127.0.0.1)
- **[C] C) External Cloud VPS / Unverified Foreign Infrastructure** *(CORRECT)*
- [D] D) Air-gapped mainframe backup appliance

#### 4. Cryptographic Authentication Failure
**Prompt:** Why was Email 2 suspicious despite passing basic SPF checks?

- **[A] A) It lacked a valid DKIM cryptographic signature from univ.edu and used an external lookalike domain** *(CORRECT)*
- [B] B) The email was sent over an unencrypted POP3 link
- [C] C) The sender address was empty
- [D] D) The MIME boundary exceeded 64 KB

#### 5. Immediate Incident Containment
**Prompt:** What is the primary containment action the SOC team must execute upon discovering the compromised helpdesk student worker account?

- [A] A) Delete all incoming email for the university domain
- **[B] B) Revoke student worker session tokens, isolate the host, and purge the malicious email from mailboxes** *(CORRECT)*
- [C] C) Power down the university core router
- [D] D) Reply to the sender asking for clarification

---

### Case 1-B: The Payroll Direct Deposit Lure
**Story Directive:** FINANCIAL THREAT INTERCEPT: At 09:15 AM, the University Treasury received multiple alerts of employee direct-deposit changes. Forensic mail auditing intercepted two messages targeting payroll staff. One message masquerades as the Vice Chancellor using lookalike headers and forged reply-to routing.

**Forensic Questions & Answer Key (5 Questions):**

#### 1. Forged Sender Vector
**Prompt:** Which communication constitutes the fraudulent executive payroll impersonation lure?

- [A] A) Email 1 (Benefits annual open enrollment)
- **[B] B) Email 2 (Vice Chancellor payroll re-routing)** *(CORRECT)*
- [C] C) Both communications are authorized HR requests
- [D] D) Neither, both are system test messages

#### 2. Domain Spoofing Tactic
**Prompt:** What domain spoofing technique did the attacker utilize in Email 2?

- **[A] A) Lookalike / Combosquatted Domain (univ-edu-portal.com vs univ.edu)** *(CORRECT)*
- [B] B) Subdomain hijacking on the root university server
- [C] C) BGP Route Hijacking of the campus Autonomous System
- [D] D) Zero-day vulnerability in the DNS root servers

#### 3. DMARC Defense Mechanism
**Prompt:** Which DMARC policy would have instructed recipient mail servers to completely reject Email 2?

- [A] A) p=none
- **[B] B) p=reject** *(CORRECT)*
- [C] C) p=monitoring
- [D] D) p=softfail

#### 4. Exfiltration Routing Indicator
**Prompt:** What critical header in Email 2 redirects direct replies to the attacker's covert inbox?

- [A] A) X-Mailer: Microsoft Outlook 16.0
- [B] B) Content-Transfer-Encoding: 7bit
- **[C] C) Reply-To: executive-payouts@secure-vault-transfer.net** *(CORRECT)*
- [D] D) MIME-Version: 1.0

#### 5. Remediation Protocol
**Prompt:** What operational safeguard prevents successful execution of this payroll redirect scheme?

- [A] A) Forwarding the email to colleagues for a second opinion
- [B] B) Increasing the direct deposit transfer amount
- [C] C) Disabling multi-factor authentication on HR portals
- **[D] D) Enforcing out-of-band voice/in-person verification for any bank detail modification** *(CORRECT)*

---

### Case 1-C: Examination Leak Scareware
**Story Directive:** CAMPUS EMERGENCY ALERT: A mass scareware campaign targeted 4,000 undergraduate student mailboxes, claiming a critical academic integrity violation and demanding instant verification via an encrypted archive. Dissect the headers to identify the threat vector.

**Forensic Questions & Answer Key (5 Questions):**

#### 1. Malicious Message Vector
**Prompt:** Which email is the deceptive scareware phishing attempt?

- **[A] A) Email 1 (Academic Integrity Board leak notice)** *(CORRECT)*
- [B] B) Email 2 (Prof. Davis reminder)
- [C] C) Both are authentic messages
- [D] D) Neither message is malicious

#### 2. Social Engineering Trigger
**Prompt:** What primary psychological cognitive bias does Email 1 exploit to force rapid compliance?

- **[A] A) Fear & Urgency (Threat of immediate academic expulsion)** *(CORRECT)*
- [B] B) Altruism & Charity
- [C] C) Familiarity & Friendship
- [D] D) Curiosity about discount shopping

#### 3. Gateway Scanner Bypass Technique
**Prompt:** Why did the attacker password-protect the malicious ZIP archive (proof_of_leak.zip)?

- [A] A) To comply with GDPR encryption guidelines
- **[B] B) To bypass automated antivirus and sandbox deep-packet inspection** *(CORRECT)*
- [C] C) To reduce the file transfer size over TCP
- [D] D) To prevent the recipient from reading the code

#### 4. Origin Anonymizer Triage
**Prompt:** The sending IP 185.220.101.5 in Email 1 matches what specific infrastructure?

- [A] A) Internal Campus VPN Gateway
- [B] B) Google Workspace Relay
- **[C] C) Tor Anonymization Exit Node** *(CORRECT)*
- [D] D) Campus DNS Server

#### 5. SOC Broadcast Action
**Prompt:** What immediate action should the SOC team take to mitigate student panic?

- [A] A) Cancel all campus examinations indefinitely
- **[B] B) Issue an official authenticated broadcast clarifying the hoax and block the sender IP at firewall** *(CORRECT)*
- [C] C) Advise students to extract the archive to check their names
- [D] D) Shut down student Wi-Fi permanently

---

### Case 1-D: Vendor Supply Chain Invoice
**Story Directive:** SUPPLY CHAIN SECURITY BREACH: The university facilities procurement department received an invoice claiming overdue payments for physical HVAC chillers. Threat intelligence suspects a targeted Living-off-the-Land loader deployment.

**Forensic Questions & Answer Key (5 Questions):**

#### 1. Supply Chain Lure Identification
**Prompt:** Which communication represents the fraudulent supply chain invoice lure?

- [A] A) Email 1 (State Utilities Water Board)
- **[B] B) Email 2 (ClimateControl Pro Contractors)** *(CORRECT)*
- [C] C) Both are authorized vendor statements
- [D] D) Neither message originated outside the campus

#### 2. Malicious Payload Format
**Prompt:** What file extension is disguised inside the ZIP attachment of Email 2?

- **[A] A) VBS (Visual Basic Script file: Invoice_9921.vbs)** *(CORRECT)*
- [B] B) MP3 audio recording
- [C] C) Plaintext CSV table
- [D] D) Portable Network Graphic (PNG)

#### 3. SPF Authentication State
**Prompt:** The SPF header in Email 2 indicates 'SOFTFAIL' (~all). What does this signify?

- **[A] A) The sending IP is not authorized in the domain's SPF record, but the domain owner configured a non-strict transition policy** *(CORRECT)*
- [B] B) The email passed with 100% cryptographic certainty
- [C] C) The mail server is offline
- [D] D) The recipient mailbox is completely full

#### 4. Living-off-the-Land Execution Engine
**Prompt:** Which built-in Windows utility is typically abused by Windows to execute .vbs script files?

- [A] A) notepad.exe
- [B] B) calc.exe
- **[C] C) wscript.exe or cscript.exe** *(CORRECT)*
- [D] D) mspaint.exe

#### 5. Endpoint Security Policy
**Prompt:** What Windows Defender / EDR rule blocks .vbs files from downloading executable content?

- [A] A) Disabling Windows Defender Real-time Protection
- **[B] B) Attack Surface Reduction (ASR): Block JavaScript or VBScript from launching downloaded executable content** *(CORRECT)*
- [C] C) Allowing all outbound port 80 traffic
- [D] D) Setting local administrator passwords to blank

---

# 🏢 STATION 02: THE DIGITAL SHADOW (4 Cases)

---

### Case 2-A: The Midnight Data Siphon
**Story Directive:** NETWORK TRAFFIC ANOMALY // CORE FIREWALL: At 00:00 UTC, the perimeter intrusion detection system recorded repeated outbound encrypted bursts. A compromised server in the Science Department subnet is communicating with an unregistered external cloud IP. Inspect packet timing, ports, and transfer sizes.

**Forensic Questions & Answer Key (5 Questions):**

#### 1. Command & Control Target
**Prompt:** Which destination IP is receiving the recurring heartbeat and data exfiltration stream?

- [A] A) 151.101.65.140
- **[B] B) 198.51.100.99** *(CORRECT)*
- [C] C) 10.0.14.5
- [D] D) 127.0.0.1

#### 2. C2 Beacon Cadence
**Prompt:** What is the exact periodic heartbeat beacon interval observed in the packet capture?

- [A] A) Random jitter between 1 and 10 seconds
- **[B] B) Fixed 60-second intervals (00:01:14 -> 00:02:14 -> 00:03:14)** *(CORRECT)*
- [C] C) Once every 24 hours
- [D] D) Continuous unbuffered UDP stream

#### 3. Non-Standard Port Utilization
**Prompt:** Which egress destination port is being utilized to mask the command and control channel?

- [A] A) Port 21 (FTP)
- [B] B) Port 25 (SMTP)
- **[C] C) Port 8443 (Alternative HTTPS)** *(CORRECT)*
- [D] D) Port 53 (DNS)

#### 4. Threat Classification
**Prompt:** What MITRE ATT&CK technique best describes this persistent regular outbound traffic pattern?

- **[A] A) T1071.001 - Application Layer Protocol: Web Protocols (C2 Beaconing)** *(CORRECT)*
- [B] B) T1499 - Endpoint Denial of Service
- [C] C) T1056 - Input Capture (Keylogging)
- [D] D) T1565 - Data Manipulation

#### 5. Firewall Emergency Triage
**Prompt:** What immediate network configuration change neutralizes the active data siphon?

- [A] A) Open all incoming ports to allow debugging
- [B] B) Clear browser history on the firewall
- [C] C) Restart all domain controllers simultaneously
- **[D] D) Inject an edge firewall DROP rule for 198.51.100.99:8443 and isolate internal host 10.0.14.22** *(CORRECT)*

---

### Case 2-B: The Rogue Registrar Gateway
**Story Directive:** COVERT CHANNEL DETECTION: Internal DNS resolver logs recorded an explosive spike in subdomain queries exceeding 8,000 requests per minute from a single compromised library workstation. Dissect the DNS record types and payload anomalies.

**Forensic Questions & Answer Key (5 Questions):**

#### 1. Covert Channel Identification
**Prompt:** What covert data exfiltration method is active on host 10.0.18.45?

- [A] A) ICMP Ping of Death
- **[B] B) DNS Tunneling (Data exfiltration through nested subdomains)** *(CORRECT)*
- [C] C) BitTorrent peer exchange
- [D] D) SNMP community string sniffing

#### 2. Encoded Payload Structure
**Prompt:** What data format is encapsulated in the subdomain labels preceding '.exfil.darknet-relay.org'?

- **[A] A) Hexadecimal / Base32 encoded data chunks** *(CORRECT)*
- [B] B) Plain English sentences
- [C] C) Raw uncompressed JPEG image bytes
- [D] D) Executable PE binary headers in plaintext

#### 3. Source Host Triage
**Prompt:** Which internal IP address is compromised and executing the tunneling tool?

- [A] A) 10.0.0.1
- [B] B) 10.0.2.10
- **[C] C) 10.0.18.45** *(CORRECT)*
- [D] D) 127.0.0.1

#### 4. Protocol Vulnerability
**Prompt:** Why is DNS tunneling frequently overlooked by legacy boundary firewalls?

- [A] A) DNS traffic is always encrypted by default in standard IPv4
- **[B] B) Port 53 (UDP) is typically left open to internal recursive resolvers without deep payload inspection** *(CORRECT)*
- [C] C) DNS packets can only carry 1 byte of information
- [D] D) Routers do not support DNS logging

#### 5. SOC Mitigation Strategy
**Prompt:** What proactive control mitigates DNS tunneling attacks campus-wide?

- **[A] A) Deploy Response Policy Zones (RPZ), inspect query length/entropy, and restrict direct outbound port 53 to vetted recursive resolvers** *(CORRECT)*
- [B] B) Turn off all campus name resolution permanently
- [C] C) Upgrade all monitors to 4K resolution
- [D] D) Change keyboard language settings

---

### Case 2-C: The Internal Lateral Worm
**Story Directive:** ACTIVE DIRECTORY ATTACK // LATERAL MOVEMENT: Endpoint detection alerts flagged rapid horizontal network scanning over SMB port 445. The threat actor is utilizing Pass-the-Hash credentials to propagate across subnet 10.0.22.0/24 in under three minutes.

**Forensic Questions & Answer Key (5 Questions):**

#### 1. Propagation Protocol
**Prompt:** What network protocol is being leveraged for horizontal lateral movement across the subnet?

- [A] A) HTTP (Port 80)
- **[B] B) SMB (Server Message Block over Port 445)** *(CORRECT)*
- [C] C) TFTP (Port 69)
- [D] D) NTP (Port 123)

#### 2. Attack Vector Analysis
**Prompt:** What technique enables the threat actor to authenticate without knowing the plaintext password?

- **[A] A) Pass-the-Hash (PTH) utilizing the captured NTLM hash directly** *(CORRECT)*
- [B] B) Rainbow table precomputation in real-time
- [C] C) Guessing standard dictionary passwords
- [D] D) Physical keyboard keystroke logging

#### 3. Execution Mechanism
**Prompt:** The creation of service 'PSEXESVC.exe' in packet 4 indicates which Living-off-the-Land tool?

- [A] A) Wireshark
- [B] B) Microsoft Paint
- **[C] C) Sysinternals PsExec (Remote Process Execution)** *(CORRECT)*
- [D] D) Windows Media Player

#### 4. Compromised Credential Privilege
**Prompt:** The account 'Admin_Service' having authority to create remote services on multiple machines indicates what privilege tier?

- [A] A) Guest User
- [B] B) Unauthenticated Kiosk Account
- [C] C) Read-Only Database Auditor
- **[D] D) Local Administrator / High-Privilege Domain Service Account** *(CORRECT)*

#### 5. Network Hardening Control
**Prompt:** What architectural defense prevents workstation-to-workstation SMB lateral propagation?

- [A] A) Disabling all computer monitors
- **[B] B) Host-based firewall isolation blocking inbound port 445 between endpoints and disabling NTLM** *(CORRECT)*
- [C] C) Giving all students local administrator rights
- [D] D) Installing more RAM on the client machines

---

### Case 2-D: The Cloud API Token Leakage
**Story Directive:** CLOUD ENVIRONMENT BREACH: The University Cloud Operations console triggered a high-severity alert for unauthorized Amazon S3 data export. An automated script using Python requests is systematically dumping relational database backups.

**Forensic Questions & Answer Key (5 Questions):**

#### 1. Cloud Target Asset
**Prompt:** What cloud storage asset is being systematically harvested by the threat actor?

- [A] A) Azure Virtual Hard Disk
- **[B] B) AWS S3 Bucket (univ-student-database-prod)** *(CORRECT)*
- [C] C) Google Cloud Pub/Sub Topic
- [D] D) On-premise magnetic tape vault

#### 2. Initial Compromise Vector
**Prompt:** How are cloud API credentials (AWS Access Key ID & Secret Key) most commonly compromised by automated scrapers?

- **[A] A) Accidental hardcoding in public source code repositories (e.g. GitHub)** *(CORRECT)*
- [B] B) Physical theft of Amazon data centers
- [C] C) Quantum computer factoring of RSA-4096
- [D] D) Acoustic eavesdropping on CPU fans

#### 3. User-Agent Fingerprint
**Prompt:** What User-Agent string confirms the exfiltration is driven by an automated script?

- [A] A) Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebkit
- [B] B) Apple Safari / iPhone 15
- **[C] C) python-requests/2.31.0** *(CORRECT)*
- [D] D) Edge Chromium Mobile

#### 4. Exfiltrated Information Scope
**Prompt:** Based on the object keys in the GET requests, what category of sensitive data was targeted?

- [A] A) Public campus cafeteria lunch menus
- **[B] B) Student PII and confidential database tables (roster_2026.sql, ssn_export.tar.gz)** *(CORRECT)*
- [C] C) Open-source Linux distribution ISO images
- [D] D) Campus weather radar data

#### 5. Immediate Cloud Remediation
**Prompt:** What is the single most critical containment step the cloud engineer must execute immediately?

- **[A] A) Deactivate the compromised IAM Access Key and apply an explicit Deny bucket policy** *(CORRECT)*
- [B] B) Delete the entire AWS account
- [C] C) Send an email to Amazon support requesting a callback
- [D] D) Reboot the user's laptop

---

# 🏢 STATION 03: THE DOMAIN MIRAGE (4 Cases)

---

### Case 3-A: The Punycode Portal Trap
**Story Directive:** VISUAL SPOOFING INVESTIGATION: Multiple students reported being prompted for their multi-factor authentication (MFA) codes twice when accessing the student portal. Forensic triage revealed a deceptive Internationalized Domain Name (IDN) homograph mirror.

**Forensic Questions & Answer Key (5 Questions):**

#### 1. Deceptive Homoglyph Identification
**Prompt:** Which domain represents the fraudulent credential harvesting portal?

- [A] A) portal.univ.edu
- **[B] B) xn--univ-portal-08a.edu (univ-pоrtal.edu)** *(CORRECT)*
- [C] C) Both domains are legitimate university mirrors
- [D] D) Neither domain is functional

#### 2. Visual Spoofing Mechanism
**Prompt:** What deceptive technique allows the malicious domain to appear virtually identical to human eyes in address bars?

- [A] A) Buffer overflow in the browser window
- [B] B) SQL Injection inside the search parameter
- **[C] C) IDN Homograph visual substitution (Cyrillic 'о' replacing Latin 'o')** *(CORRECT)*
- [D] D) CSS z-index layering

#### 3. Certificate Telemetry Red Flag
**Prompt:** What cryptographic certificate attribute indicates a suspicious disposable attack infrastructure?

- [A] A) Issued by a globally recognized Root CA
- [B] B) 2048-bit RSA key length
- **[C] C) Free automated certificate issued less than 24 hours prior to the incident** *(CORRECT)*
- [D] D) Supported TLS 1.3 ciphers

#### 4. Multi-Factor Bypass Mechanism
**Prompt:** How does an Adversary-in-the-Middle (AiTM) proxy intercept user sessions even with 2FA enabled?

- **[A] A) Proxies authentication packets in real time and captures the authenticated session cookie** *(CORRECT)*
- [B] B) Cracks the mathematical algorithm of the authenticator app
- [C] C) Guesses the 6-digit TOTP code through brute force
- [D] D) Steals the physical smartphone from the student

#### 5. Resilient Authentication Defense
**Prompt:** Which MFA standard is cryptographically immune to AiTM reverse proxy interception?

- [A] A) SMS Text Message verification codes
- [B] B) Email verification links
- [C] C) Voice phone call verification
- **[D] D) FIDO2 / WebAuthn Hardware Security Keys (Domain-bound cryptographic credentials)** *(CORRECT)*

---

### Case 3-B: The Bit-Flipping Typo Sanctuary
**Story Directive:** TYPOSQUATTING INTERCEPT: Students frequently mistype the university web domain on mobile devices. The SOC detected an active credential cloning site hosted on bulletproof infrastructure capitalizing on a single-letter permutation.

**Forensic Questions & Answer Key (5 Questions):**

#### 1. Typosquat Variant Discovery
**Prompt:** Which URL represents the typo-squatted clone capitalizing on double-letter mistyping?

- **[A] A) univversity.edu (Double 'v')** *(CORRECT)*
- [B] B) university.edu
- [C] C) Both domains are operated by campus IT
- [D] D) Neither domain is reachable

#### 2. Attack Objective
**Prompt:** What is the primary motive behind deploying this typo-squatted portal?

- [A] A) Increasing search engine page rank for local pizza restaurants
- **[B] B) Harvesting login credentials from users who make typographical errors in browser navigation** *(CORRECT)*
- [C] C) Distributing Linux kernel patches
- [D] D) Benchmarking broadband connection speeds

#### 3. Hosting Provider Risk Triage
**Prompt:** The hosting IP 194.26.29.112 belonging to an unverified offshore privacy registrar suggests which threat environment?

- **[A] A) Bulletproof Hosting Provider designed to ignore DMCA and law enforcement takedown requests** *(CORRECT)*
- [B] B) Official Microsoft Azure Government Cloud
- [C] C) Local municipal library server
- [D] D) University computer science student laboratory

#### 4. Threat Intelligence Investigation
**Prompt:** What public monitoring system alerts defenders when lookalike certificates are generated for their brand?

- [A] A) Windows Task Manager
- [B] B) Command Prompt Ping
- **[C] C) Certificate Transparency (CT) Log Monitoring** *(CORRECT)*
- [D] D) Optical Fiber Reflectometer

#### 5. Enterprise Defensive Action
**Prompt:** What proactive measure protects campus users from reaching the typo-squatted domain?

- [A] A) Disconnecting the university fiber optic uplink
- **[B] B) Injecting a DNS Sinkhole entry on internal resolvers and initiating a UDRP registrar dispute** *(CORRECT)*
- [C] C) Advising users to type faster
- [D] D) Changing the university name

---

### Case 3-C: The Forged SSO OAuth Consent Screen
**Story Directive:** ILLICIT OAUTH GRANT ATTACK: A rogue application named 'Campus Calendar Sync Pro' prompted faculty and students for single sign-on consent. Threat actors are abusing OAuth 2.0 delegated permissions to access mailboxes without knowing user passwords.

**Forensic Questions & Answer Key (5 Questions):**

#### 1. Illicit Application Identification
**Prompt:** Which application is executing the illicit OAuth 2.0 consent phishing attack?

- **[A] A) Campus Calendar Sync Pro requesting Mail.ReadWrite and Files.ReadWrite.All** *(CORRECT)*
- [B] B) Microsoft Windows Update Service
- [C] C) Adobe Acrobat Reader DC
- [D] D) Zoom Video Communications

#### 2. Attack Mechanism
**Prompt:** What makes an Illicit Consent Grant attack particularly hazardous compared to credential theft?

- **[A] A) The attacker gains persistent API token access to emails and files without ever stealing or needing the user's password** *(CORRECT)*
- [B] B) It physically damages the motherboard
- [C] C) It deletes all local files immediately
- [D] D) It turns off the campus electricity

#### 3. Redirect URI Triage
**Prompt:** The OAuth redirect URI pointing to 'https://auth-sync.workers.dev' utilizes what serverless architecture?

- **[A] A) Serverless Cloud Edge Worker used to capture OAuth authorization codes** *(CORRECT)*
- [B] B) On-premise Active Directory Domain Controller
- [C] C) USB flash drive
- [D] D) Bluetooth beacon

#### 4. Persistence Mechanism
**Prompt:** What token grants the threat actor ongoing access even after the user logs out of their browser?

- [A] A) Temporary CSRF token
- [B] B) Browser cache cookie
- **[C] C) OAuth 2.0 Long-Lived Refresh Token** *(CORRECT)*
- [D] D) Screen resolution metadata

#### 5. Tenant Remediation Step
**Prompt:** How does the cloud tenant administrator immediately terminate the threat actor's access?

- [A] A) Ask users to change their desktop wallpaper
- [B] B) Delete all email accounts
- [C] C) Reinstall Windows on all client machines
- **[D] D) Revoke the Enterprise Application's OAuth consent and invalidate all active user refresh tokens in Microsoft Entra / Google Workspace** *(CORRECT)*

---

### Case 3-D: The Rogue Campus Captive Portal
**Story Directive:** WIRELESS EVIL TWIN DEPLOYMENT: Campus security detected a battery-powered rogue Wi-Fi access point operating near the central student union. The rogue device is broadcasting an unencrypted clone of the university network.

**Forensic Questions & Answer Key (5 Questions):**

#### 1. Rogue Wireless Identifier
**Prompt:** Which wireless network represents the unauthenticated Evil Twin access point?

- [A] A) WPA2/WPA3 Enterprise 802.1X
- [B] B) Campus Core LAN Backbone
- **[C] C) Campus-Guest-HighSpeed (Open Captive Portal on 192.168.1.1)** *(CORRECT)*
- [D] D) Bluetooth Peripheral 04

#### 2. Attack Vector Description
**Prompt:** What attack methodology is deployed when an adversary mimics a legitimate Wi-Fi network to intercept traffic?

- **[A] A) Evil Twin / Rogue AP with Captive Portal Harvesting** *(CORRECT)*
- [B] B) SQL Injection into the access point antenna
- [C] C) Ransomware encryption of radio waves
- [D] D) Overclocking the Wi-Fi router CPU

#### 3. Certificate Warning Red Flag
**Prompt:** Why does the browser trigger a severe warning when connecting through the rogue captive portal?

- **[A] A) The captive portal presents a self-signed or invalid SSL certificate not issued by a trusted CA** *(CORRECT)*
- [B] B) The user is typing on a mechanical keyboard
- [C] C) The laptop battery is below 20%
- [D] D) The screen brightness is too high

#### 4. Network Spoofing Vector
**Prompt:** What protocol manipulation allows the rogue AP to reroute all HTTP requests to its harvest portal?

- [A] A) Border Gateway Protocol AS-Path poisoning
- **[B] B) DNS Hijacking / Captive Portal DNS redirection to 192.168.1.1** *(CORRECT)*
- [C] C) BGP community tag filtering
- [D] D) Fiber optic cable splicing

#### 5. Physical Security Response
**Prompt:** How does the physical security and SOC team locate and disable the rogue access point?

- [A] A) Disabling campus email accounts
- [B] B) Turning off all fluorescent lights
- **[C] C) Triangulating the signal using a wireless spectrum analyzer (Wi-Fi directional antenna) and confiscating the device** *(CORRECT)*
- [D] D) Changing the university website font

---

# 🏢 STATION 04: THE 10-MINUTE BLACKOUT (4 Cases)

---

### Case 4-A: Operation Citadel Lockdown
**Story Directive:** SUDDEN-DEATH GRAND FINALE // BLACKOUT IMMINENT: The threat actor has reached the Domain Controller and scheduled a ransomware wipe across all campus storage arrays. The countdown is running. You must analyze the forensic timeline, detect the canary tripwire breach, and enter the verified Master Exit PIN to disarm the blackout.

**Forensic Questions & Answer Key (5 Questions):**

#### 1. Initial Beachhead Vector
**Prompt:** At what time and through which service was the initial network perimeter breached?

- [A] A) 11:21:40 via Storage SAN
- [B] B) 11:14:02 via lsass.exe
- **[C] C) 11:05:12 via CAMPUS-EDGE-VPN (sshd gateway CVE)** *(CORRECT)*
- [D] D) 11:29:50 via blackout_enc.exe

#### 2. Credential Theft Mechanism
**Prompt:** What critical system process on the Domain Controller was targeted at 11:14:02 to dump admin credentials?

- **[A] A) lsass.exe (Local Security Authority Subsystem Service)** *(CORRECT)*
- [B] B) explorer.exe
- [C] C) svchost.exe
- [D] D) spoolsv.exe

#### 3. Anti-Recovery Defense Evasion
**Prompt:** What destructive command did the adversary execute at 11:21:40 to prevent backup restoration?

- [A] A) format C: /fs:NTFS
- [B] B) ipconfig /release
- **[C] C) vssadmin delete shadows /all /quiet (Volume Shadow Copy deletion)** *(CORRECT)*
- [D] D) del *.txt /s

#### 4. Honeypot Canary Detection
**Prompt:** Which tripwire canary asset tripped at 11:27:12 confirming financial fraud?

- [A] A) Cafeteria register #02
- **[B] B) Tripwire Canary Account #9988 credited with illicit transfer** *(CORRECT)*
- [C] C) Library printer toner sensor
- [D] D) Main gate parking barrier

#### 5. Master Room Exit PIN
**Prompt:** Select the verified Room Exit PIN computed from your forensic investigation:

- [A] A) 18
- **[B] B) 25** *(CORRECT)*
- [C] C) 42
- [D] D) 89

---

### Case 4-B: The Industrial Power Grid Trip
**Story Directive:** INFRASTRUCTURE ATTACK // POWER OUTAGE THREAT: The campus electrical substation SCADA PLC controller was infiltrated via an unauthorized maintenance session. Circuit breakers controlling cooling pumps have been manipulated.

**Forensic Questions & Answer Key (5 Questions):**

#### 1. SCADA Infiltration Point
**Prompt:** From what location and protocol was the initial SCADA maintenance gateway session accessed at 11:08:30?

- [A] A) Direct satellite uplink
- **[B] B) Rogue SSH session from unmonitored contractor Wi-Fi** *(CORRECT)*
- [C] C) Physical front-panel keypad
- [D] D) Dial-up modem

#### 2. Industrial Protocol Abuse
**Prompt:** What industrial automation protocol function was manipulated to trip the electrical coils?

- **[A] A) Modbus TCP Function 0x05 (Write Single Coil)** *(CORRECT)*
- [B] B) HTTP GET request
- [C] C) FTP RETR command
- [D] D) POP3 RETR message

#### 3. Physical Sabotage Impact
**Prompt:** What physical disaster did the attacker trigger at 11:23:10 by opening circuit breakers?

- [A] A) Turning on the campus sprinkler system
- [B] B) Opening all classroom doors
- **[C] C) Forcibly disabling cooling water pumps causing critical thermal surge** *(CORRECT)*
- [D] D) Changing the digital clocks to midnight

#### 4. Honeypot Sensor Identification
**Prompt:** Which tripwire canary sensor triggered at 11:28:45 giving defenders the critical alert?

- [A] A) Motion sensor #01
- **[B] B) Canary SCADA sensor #4421 (High-voltage surge alert)** *(CORRECT)*
- [C] C) Smoke detector in cafeteria
- [D] D) Parking lot gate loop

#### 5. Master Room Exit PIN
**Prompt:** Select the verified Room Exit PIN computed from your forensic investigation:

- [A] A) 12
- **[B] B) 34** *(CORRECT)*
- [C] C) 56
- [D] D) 78

---

### Case 4-C: The Active Directory Domain Controller Wipe
**Story Directive:** CRITICAL IDENTITY DISASTER: The campus Microsoft Active Directory forest is undergoing a destructive wiper payload detonation. The attacker extracted Kerberos ticket-granting tickets and deployed HermeticWiper to destroy partition boot records.

**Forensic Questions & Answer Key (5 Questions):**

#### 1. Reconnaissance Tooling
**Prompt:** What Active Directory enumeration tool was executed at 11:04:15 to map domain trust relationships?

- [A] A) Notepad
- **[B] B) BloodHound / SharpHound LDAP enumeration** *(CORRECT)*
- [C] C) Windows Solitaire
- [D] D) Excel Macro

#### 2. Kerberos Exploitation Vector
**Prompt:** What technique was utilized at 11:12:40 via Rubeus to extract service account ticket hashes?

- **[A] A) Kerberoasting (Requesting Service Principal Name TGS tickets to crack offline)** *(CORRECT)*
- [B] B) SQL Injection into the login page
- [C] C) Overclocking the RAM
- [D] D) Sending an ICMP ping packet

#### 3. Destructive Wiper Architecture
**Prompt:** What is the primary operational objective of the HermeticWiper payload scheduled at 11:20:10?

- [A] A) To show a funny desktop meme
- **[B] B) To permanently overwrite Master Boot Records (MBR) and partition tables, rendering systems unbootable** *(CORRECT)*
- [C] C) To clean temporary browser files
- [D] D) To increase network speed

#### 4. Canary Account Tripwire
**Prompt:** Which honeypot credential trap was touched by the attacker at 11:25:30?

- [A] A) Guest
- **[B] B) Honeypot Canary Account 'administrator_backup'** *(CORRECT)*
- [C] C) DefaultAccount
- [D] D) Student_01

#### 5. Master Room Exit PIN
**Prompt:** Select the verified Room Exit PIN computed from your forensic investigation:

- [A] A) 31
- **[B] B) 49** *(CORRECT)*
- [C] C) 68
- [D] D) 95

---

### Case 4-D: The Mass Exfiltration Citadel Protocol
**Story Directive:** DATA PIRACY & EXTORTION: Threat actors have staged 2 Terabytes of proprietary campus research and student records into encrypted multi-volume archives. The final exfiltration siphon is active, coupled with an automated ledger wipe.

**Forensic Questions & Answer Key (5 Questions):**

#### 1. Data Staging Mechanism
**Prompt:** How did the threat actor prepare the massive 2TB research payload for exfiltration at 11:02:10?

- [A] A) Printing files on paper
- **[B] B) Compressing and encrypting into multi-volume archives (7z_archive.part01) with AES-256** *(CORRECT)*
- [C] C) Emailing individual files one by one
- [D] D) Changing file names to .txt

#### 2. Exfiltration Cloud Tool
**Prompt:** What command-line tool was utilized at 11:12:00 to upload files across multiple cloud storage endpoints?

- **[A] A) Rclone (Cloud storage synchronization tool)** *(CORRECT)*
- [B] B) Internet Explorer 6
- [C] C) Notepad++
- [D] D) Windows Media Player

#### 3. Financial Sabotage Vector
**Prompt:** What fraudulent activity occurred at 11:24:20 in the Finance ERP system?

- [A] A) Ordering new coffee cups
- **[B] B) Unauthorized SQL manipulation of treasury ledger tables routing funds to an offshore IBAN** *(CORRECT)*
- [C] C) Printing student grade sheets
- [D] D) Submitting a routine vacation request

#### 4. Honeypot Database Detection
**Prompt:** Which database canary tripwire record triggered the alert at 11:28:10?

- [A] A) User #0001
- **[B] B) Canary database record #8872 queried outside authorized hours** *(CORRECT)*
- [C] C) Table 'students'
- [D] D) Index 'prn'

#### 5. Master Room Exit PIN
**Prompt:** Select the verified Room Exit PIN computed from your forensic investigation:

- [A] A) 28
- **[B] B) 61** *(CORRECT)*
- [C] C) 77
- [D] D) 94

---

