/**
 * BLACKOUT PROTOCOL: 16-Case Multi-Station Repository
 * Exactly 4 distinct cases per station = 16 total investigative modules.
 * All questions are 100% Multiple Choice (MCQ) with options A, B, C, D.
 */

const STATION_CASES = {
  // =========================================================================
  // STATION 01: THE SPOOFED ORIGIN (4 Distinct Cases: A, B, C, D)
  // =========================================================================
  1: {
    A: {
      caseLetter: "A",
      title: "Station 01 // The Spoofed Origin",
      subtitle: "Case 1-A: The Dean's Executive Directive",
      briefing: "Three communications hit the email gateway this morning. One of them breached an administrator's machine via an executable masking payload.",
      emails: [
        { id: "1", sender: "Office of the Registrar <registrar@univ.edu>", date: "08:42 AM", subject: "Classroom Relocation Notice: Building 4", headers: "SPF: PASS | DKIM: PASS | IP: 10.0.12.5 (Internal LAN)", body: "Rooms 401-408 in North Hall are closed for HVAC maintenance today. Classes moved to Wing B." },
        { id: "2", sender: "Dr. Aris (Dean of Faculty) <dean@univ-academic-portal.org>", date: "08:49 AM", subject: "Confidential: Q3 Faculty Grant Approvals", headers: "SPF: PASS | DKIM: NONE | IP: 198.51.100.24 (External Cloud)", body: "Access your revised research grant allocations immediately at https://univ.edu.login-portal.org/auth." },
        { id: "3", sender: "Campus IT Helpdesk <helpdesk@univ.edu>", date: "08:51 AM", subject: "ACTION REQUIRED: Mandatory Wi-Fi 6 Certificate Patch", headers: "SPF: PASS | DKIM: PASS (Compromised Student Worker Account)\nAttachment: WiFi_Secure_Installer.pdf.exe [2.4 MB]", body: "Double-click the attached PDF installer to certify your machine for enterprise Wi-Fi access." }
      ],
      questions: [
        {
          id: "q1",
          label: "1. Attack Vector Identification",
          prompt: "Which email represents a compromised legitimate internal account deploying an executable masking payload?",
          options: [
            { value: "A", text: "A) Email 1 (Registrar relocation notice)" },
            { value: "B", text: "B) Email 2 (Dean grant approvals notice)" },
            { value: "C", text: "C) Email 3 (Campus IT Helpdesk Wi-Fi patch)" },
            { value: "D", text: "D) None, all three are routine automated broadcasts" }
          ]
        },
        {
          id: "q2",
          label: "2. Obfuscation Technique",
          prompt: "What deceptive technique is used in Email 3 to mislead the user into executing a binary?",
          options: [
            { value: "A", text: "A) Macro Injection inside an Office XML document" },
            { value: "B", text: "B) Double Extension Masking (.pdf.exe)" },
            { value: "C", text: "C) Steganographic LSB payload hiding" },
            { value: "D", text: "D) Unicode Right-to-Left Override (RTLO)" }
          ]
        },
        {
          id: "q3",
          label: "3. Gateway IP Forensic Triage",
          prompt: "Forensic inspection of originating IP 198.51.100.24 in Email 2 confirms which network origin?",
          options: [
            { value: "A", text: "A) Campus Core LAN Subnet (10.0.0.0/8)" },
            { value: "B", text: "B) Localhost loopback adapter (127.0.0.1)" },
            { value: "C", text: "C) External Cloud VPS / Unverified Foreign Infrastructure" },
            { value: "D", text: "D) Air-gapped mainframe backup appliance" }
          ]
        }
      ]
    },

    B: {
      caseLetter: "B",
      title: "Station 01 // The Spoofed Origin",
      subtitle: "Case 1-B: Weaponized OAuth Cloud Authorization",
      briefing: "Adversaries attempted to hijack cloud mailboxes using weaponized single-sign-on application consent grants.",
      emails: [
        { id: "1", sender: "Campus Health Center <health@univ.edu>", date: "09:01 AM", subject: "Annual Lab Safety Attestation", headers: "SPF: PASS | DKIM: PASS", body: "Please submit your laboratory ventilation certification before Friday." },
        { id: "2", sender: "Microsoft 365 Cloud Admin <service@univ.edu>", date: "09:05 AM", subject: "ACTION REQUIRED: Consent to BioCloud Sync v4.2", headers: "App: Azure-BioSync [Unverified Publisher]", body: "Grant Single Sign-On sync privileges: Read All Mail, Send Mail, Read All OneDrive Files, Offline Access (Maintain access to data you gave it access to)." },
        { id: "3", sender: "BioGen Lab Supplies <orders@biogen-equip.com>", date: "09:08 AM", subject: "Equipment Delivery Receipt #9910", headers: "SPF: PASS | DKIM: PASS", body: "Your centrifuge rotor shipment is scheduled for Thursday delivery." }
      ],
      questions: [
        {
          id: "q1",
          label: "1. Vector Identification",
          prompt: "Which email contains the weaponized OAuth consent application grant?",
          options: [
            { value: "A", text: "A) Email 1 (Campus Health Center)" },
            { value: "B", text: "B) Email 2 (Microsoft 365 Cloud Admin - BioCloud Sync)" },
            { value: "C", text: "C) Email 3 (BioGen Lab Supplies receipt)" },
            { value: "D", text: "D) None of the above" }
          ]
        },
        {
          id: "q2",
          label: "2. Attack Technique Classification",
          prompt: "What is the industry term for tricking users into authorizing rogue cloud permissions?",
          options: [
            { value: "A", text: "A) Illicit Consent Grant (OAuth Phishing)" },
            { value: "B", text: "B) SQL Injection" },
            { value: "C", text: "C) ARP Poisoning" },
            { value: "D", text: "D) Buffer Overflow" }
          ]
        },
        {
          id: "q3",
          label: "3. Persistent Access Scope",
          prompt: "Which requested OAuth permission scope allows attackers persistent access even after password rotation?",
          options: [
            { value: "A", text: "A) Read Mail (Mail.Read)" },
            { value: "B", text: "B) Offline Access (offline_access)" },
            { value: "C", text: "C) User Profile Read (User.Read)" },
            { value: "D", text: "D) Calendar View (Calendars.Read)" }
          ]
        }
      ]
    },

    C: {
      caseLetter: "C",
      title: "Station 01 // The Spoofed Origin",
      subtitle: "Case 1-C: Examination Leak Scareware",
      briefing: "A scareware blast reached student mailing lists threatening academic suspension. Dissect the MIME headers.",
      emails: [
        { id: "1", sender: "Academic Integrity Board <integrity@univ-exam-leak.net>", date: "13:55 PM", subject: "URGENT: CS301 Final Exam Cancelled due to Security Breach", headers: "SPF: FAIL | DKIM: NONE | DMARC: REJECT\nIP: 185.220.101.5 (Tor Exit Node)", body: "Download 'proof_of_leak.zip' immediately to prove you were not involved in the leak." },
        { id: "2", sender: "Prof. Davis <prof.davis@univ.edu>", date: "13:58 PM", subject: "CS301 Room Assignments", headers: "SPF: PASS | DKIM: PASS | IP: 10.0.5.12", body: "Exam starts promptly at 9 AM tomorrow in Hall C." }
      ],
      questions: [
        {
          id: "q1",
          label: "1. Malicious Message Vector",
          prompt: "Which email is the deceptive scareware phishing attempt?",
          options: [
            { value: "A", text: "A) Email 1 (Academic Integrity Board leak notice)" },
            { value: "B", text: "B) Email 2 (Prof. Davis reminder)" },
            { value: "C", text: "C) Both are authentic messages" },
            { value: "D", text: "D) Neither message is malicious" }
          ]
        },
        {
          id: "q2",
          label: "2. DMARC Enforcement",
          prompt: "What does an email authentication policy of DMARC p=reject instruct the gateway to do?",
          options: [
            { value: "A", text: "A) Immediately drop and discard the email without inbox delivery" },
            { value: "B", text: "B) Move the message to the user's spam folder" },
            { value: "C", text: "C) Deliver normally with an informational banner" },
            { value: "D", text: "D) Forward the message to law enforcement" }
          ]
        },
        {
          id: "q3",
          label: "3. Origin Anonymizer Triage",
          prompt: "The sending IP 185.220.101.5 matches what specific network infrastructure?",
          options: [
            { value: "A", text: "A) Internal Campus VPN Gateway" },
            { value: "B", text: "B) Tor Anonymization Exit Node" },
            { value: "C", text: "C) Google Cloud Datacenter" },
            { value: "D", text: "D) University DNS Resolver" }
          ]
        }
      ]
    },

    D: {
      caseLetter: "D",
      title: "Station 01 // The Spoofed Origin",
      subtitle: "Case 1-D: Quishing (QR Phishing) Triage",
      briefing: "An email offered an emergency $1,000 laptop scholarship via a QR code graphic.",
      emails: [
        { id: "1", sender: "Financial Aid Office <finaid@univ.edu>", date: "11:10 AM", subject: "Semester 2 Tuition Schedule", headers: "SPF: PASS | DKIM: PASS", body: "Tuition deadlines are published on the official registrar portal." },
        { id: "2", sender: "Student Relief Grant <relief@emergency-student-funds.co>", date: "11:15 AM", subject: "Approved: $1,000 Emergency Laptop Grant (Scan QR to Claim)", headers: "Attachment: Grant_Claim_QR.png\nOrigin: 194.26.29.11", body: "Scan the attached QR code with your mobile camera to authenticate direct deposit." }
      ],
      questions: [
        {
          id: "q1",
          label: "1. Quishing Vector Identification",
          prompt: "Which email carries the deceptive Quishing payload?",
          options: [
            { value: "A", text: "A) Email 1 (Financial Aid Office)" },
            { value: "B", text: "B) Email 2 (Emergency Student Funds Grant QR)" },
            { value: "C", text: "C) Both emails" },
            { value: "D", text: "D) Neither email" }
          ]
        },
        {
          id: "q2",
          label: "2. Quishing Attack Mechanism",
          prompt: "Why are QR code phishing attacks dangerous compared to standard text links?",
          options: [
            { value: "A", text: "A) Mobile scanners bypass desktop email gateway URL filters and hide destination URLs" },
            { value: "B", text: "B) QR codes inject machine code into the smartphone camera hardware" },
            { value: "C", text: "C) QR codes cannot be rendered on desktop monitors" },
            { value: "D", text: "D) Image files cannot be scanned by anti-virus engines" }
          ]
        },
        {
          id: "q3",
          label: "3. Gateway Inspection Gap",
          prompt: "What is the primary technical reason automated perimeter firewalls fail to inspect Quishing links?",
          options: [
            { value: "A", text: "A) The URL is encoded within an image raster rather than raw plaintext HTML" },
            { value: "B", text: "B) QR codes use UDP protocol instead of TCP" },
            { value: "C", text: "C) Smartphone cameras communicate via satellite" },
            { value: "D", text: "D) Mobile operating systems disable TLS encryption" }
          ]
        }
      ]
    }
  },

  // =========================================================================
  // STATION 02: THE DIGITAL SHADOW (4 Distinct Cases: A, B, C, D)
  // =========================================================================
  2: {
    A: {
      caseLetter: "A",
      title: "Station 02 // The Digital Shadow",
      subtitle: "Case 2-A: Senior Admin Marcus Vance",
      briefing: "Marcus Vance's domain account was accessed without MFA. Analyze his public OSINT dossier to expose his password habits.",
      dossier: {
        name: "Marcus Vance",
        title: "Senior Network Admin",
        socialPosts: [
          { platform: "Instagram (@vance_runs_99)", imageCaption: "Dublin Half-Marathon completed! Official bib #308. My beagle Buster was happy to see me.", badge: "Bib: #308 | Pet: Buster" },
          { platform: "Staff GitHub (@mvance-admin)", imageCaption: "Commit msg: 'AD Policy: Must contain Uppercase + word + number + symbol (!, @, #, $).'", badge: "Policy: [Upper][Word][Symbol][Number]" },
          { platform: "Tech Forum Post", imageCaption: "Forum reply: 'I always replace the second vowel in any name with an exclamation mark (!).'", badge: "Habit: Second vowel -> !" }
        ]
      },
      questions: [
        {
          id: "q1",
          label: "1. Password Pattern Reconstruction",
          prompt: "Reconstruct Marcus's password using his pet name (Buster), second vowel leet-speak rule ('e' -> '!'), policy symbol '#', and bib (308):",
          options: [
            { value: "A", text: "A) Buster2024!" },
            { value: "B", text: "B) Bust!r#308" },
            { value: "C", text: "C) Dublin!308#" },
            { value: "D", text: "D) Bust3r@Dublin" }
          ]
        },
        {
          id: "q2",
          label: "2. Credential Entropy Assessment",
          prompt: "Why is Marcus's complex-looking password vulnerable to brute-force attack?",
          options: [
            { value: "A", text: "A) The character length exceeds domain controller limits" },
            { value: "B", text: "B) Predictable personal OSINT elements reduce effective search space to < 25 bits" },
            { value: "C", text: "C) Active Directory disallows special punctuation symbols" },
            { value: "D", text: "D) Leet-speak characters are automatically stripped by authentication protocols" }
          ]
        },
        {
          id: "q3",
          label: "3. Forensic Extraction Key Calculation",
          prompt: "Evaluate the entropy formula (Password character count [9] * Bib number [308]) % 100:",
          options: [
            { value: "A", text: "A) 48" },
            { value: "B", text: "B) 56" },
            { value: "C", text: "C) 72" },
            { value: "D", text: "D) 94" }
          ]
        }
      ]
    },

    B: {
      caseLetter: "B",
      title: "Station 02 // The Digital Shadow",
      subtitle: "Case 2-B: Lead Bio-Genomics Researcher Elena Rostova",
      briefing: "Dr. Elena Rostova's password was compromised. Uncover her credential formation rule from her lab badge and chess tournament profile.",
      dossier: {
        name: "Dr. Elena Rostova",
        title: "Lead Bio-Genomics Researcher",
        socialPosts: [
          { platform: "Campus Chess Club", imageCaption: "Elena won the Blitz tournament! Trophy dedicated to chess idol Garry Kasparov.", badge: "Hero: Kasparov" },
          { platform: "Lab Badge ID", imageCaption: "Bio-containment badge #2840. Format rule: [Hero]![BadgeID].", badge: "Format: [Hero]![BadgeID]" }
        ]
      },
      questions: [
        {
          id: "q1",
          label: "1. Password Pattern Reconstruction",
          prompt: "Reconstruct Elena's password using her chess idol (Kasparov), separator '!', and badge ID (2840):",
          options: [
            { value: "A", text: "A) Elena#2024" },
            { value: "B", text: "B) Kasparov!2840" },
            { value: "C", text: "C) ChessMaster!28" },
            { value: "D", text: "D) Kasparov#Bio" }
          ]
        },
        {
          id: "q2",
          label: "2. OSINT Credential Vulnerability",
          prompt: "Why is combining public personal interests with employee ID numbers an insecure practice?",
          options: [
            { value: "A", text: "A) Both pieces of information are publicly observable through social media and badge photos" },
            { value: "B", text: "B) Special characters corrupt LDAP directories" },
            { value: "C", text: "C) Numbers decrease password complexity" },
            { value: "D", text: "D) Garry Kasparov's name is in common dictionary wordlists" }
          ]
        }
      ]
    },

    C: {
      caseLetter: "C",
      title: "Station 02 // The Digital Shadow",
      subtitle: "Case 2-C: Cloud Architect Devon Chen",
      briefing: "Devon Chen's cloud admin credentials were leaked. Decode his secret key formula from his vintage car restoration profile.",
      dossier: {
        name: "Devon Chen",
        title: "Cloud Infrastructure Architect",
        socialPosts: [
          { platform: "Classic Auto Forum", imageCaption: "Restored dream 1967 Ford Mustang!", badge: "Car: Mustang | Year: 67" },
          { platform: "GitLab Snippet", imageCaption: "Policy rule: [CarModel]@[TwoDigitYear]#.", badge: "Format: Mustang@67#" }
        ]
      },
      questions: [
        {
          id: "q1",
          label: "1. Password Pattern Reconstruction",
          prompt: "Reconstruct Devon's password following his car model and two-digit year rule:",
          options: [
            { value: "A", text: "A) Ford1967#" },
            { value: "B", text: "B) Mustang@67#" },
            { value: "C", text: "C) Mustang2024!" },
            { value: "D", text: "D) Devon@1967#" }
          ]
        },
        {
          id: "q2",
          label: "2. Credential Entropy Risk",
          prompt: "What makes hobby-based passwords vulnerable to offline dictionary attacks?",
          options: [
            { value: "A", text: "A) Common vehicles and two-digit years exist in popular dictionary brute-force rulesets" },
            { value: "B", text: "B) Ford vehicles have known software vulnerabilities" },
            { value: "C", text: "C) Special symbols @ and # weaken encryption algorithms" },
            { value: "D", text: "D) Two-digit numbers cause database buffer overflows" }
          ]
        }
      ]
    },

    D: {
      caseLetter: "D",
      title: "Station 02 // The Digital Shadow",
      subtitle: "Case 2-D: Student Body President Sarah Jenkins",
      briefing: "Sarah Jenkins used an easily guessed password constructed from her public campaign flyers.",
      dossier: {
        name: "Sarah Jenkins",
        title: "Student Body President",
        socialPosts: [
          { platform: "Student Campaign Flyer", imageCaption: "Vote Sarah! Slogan: 'Vot3!Falcon25'.", badge: "Slogan: Vot3!Falcon25" }
        ]
      },
      questions: [
        {
          id: "q1",
          label: "1. Password Pattern Reconstruction",
          prompt: "Reconstruct Sarah's password derived from her public campaign flyer:",
          options: [
            { value: "A", text: "A) Sarah2024!" },
            { value: "B", text: "B) Vot3!Falcon25" },
            { value: "C", text: "C) President#25" },
            { value: "D", text: "D) FalconStrike#1" }
          ]
        },
        {
          id: "q2",
          label: "2. Campaign Slogan Vulnerability",
          prompt: "Why does using a campaign slogan violate password hygiene standards?",
          options: [
            { value: "A", text: "A) Slogans are printed on public posters and memorized by hundreds of campus peers" },
            { value: "B", text: "B) Slogans lack alphabetical characters" },
            { value: "C", text: "C) Slogans contain too many uppercase characters" },
            { value: "D", text: "D) Slogans cannot be typed on mobile keyboards" }
          ]
        }
      ]
    }
  },

  // =========================================================================
  // STATION 03: THE DOMAIN MIRAGE (4 Distinct Cases: A, B, C, D)
  // =========================================================================
  3: {
    A: {
      caseLetter: "A",
      title: "Station 03 // The Domain Mirage",
      subtitle: "Case 3-A: RFC 3986 Userinfo Deception",
      briefing: "Network perimeter logs captured 4 URLs. Expose the adversary's DNS deception tactics.",
      urls: [
        { id: "1", fullUrl: "https://portal.univ.edu@auth.secure-gateway.cloud/login?session=991", breakdown: { userinfo: "portal.univ.edu", actualHost: "auth.secure-gateway.cloud", path: "/login" }, note: "RFC 3986 URI parsing: String before @ is treated as HTTP Basic Auth userinfo." },
        { id: "2", fullUrl: "https://univ.edu.portal-v3.account-verification.info/signin", breakdown: { subdomain: "univ.edu.portal-v3", actualHost: "account-verification.info", path: "/signin" } },
        { id: "3", fullUrl: "https://univ.edu/gateway/redirect?url=http://exfil-data.net/login", note: "Open Redirect: Legitimate host bouncing traffic to an unvalidated external endpoint." }
      ],
      questions: [
        {
          id: "q1",
          label: "1. RFC 3986 URI Parsing Deception",
          prompt: "In Link 1 (https://portal.univ.edu@auth.secure-gateway.cloud/login), which destination host receives the incoming HTTP connection?",
          options: [
            { value: "A", text: "A) portal.univ.edu" },
            { value: "B", text: "B) auth.secure-gateway.cloud" },
            { value: "C", text: "C) Both servers simultaneously via round-robin DNS" },
            { value: "D", text: "D) Browser rejects the URL with a protocol error" }
          ]
        },
        {
          id: "q2",
          label: "2. Authoritative Registered Domain (eTLD+1)",
          prompt: "In Link 2 (https://univ.edu.portal-v3.account-verification.info/signin), what is the authoritative registered domain?",
          options: [
            { value: "A", text: "A) univ.edu" },
            { value: "B", text: "B) portal-v3.univ.edu" },
            { value: "C", text: "C) account-verification.info" },
            { value: "D", text: "D) signin.info" }
          ]
        },
        {
          id: "q3",
          label: "3. Web Exploit Vector Classification",
          prompt: "What vulnerability enables Link 3 to redirect visitors from univ.edu to an external attacker server?",
          options: [
            { value: "A", text: "A) SQL Injection (SQLi)" },
            { value: "B", text: "B) Cross-Site Scripting (XSS)" },
            { value: "C", text: "C) Unvalidated Open Redirect" },
            { value: "D", text: "D) Server-Side Request Forgery (SSRF)" }
          ]
        }
      ]
    },

    B: {
      caseLetter: "B",
      title: "Station 03 // The Domain Mirage",
      subtitle: "Case 3-B: IDN Homograph & Punycode Deception",
      briefing: "Adversaries registered a domain with an internationalized lookalike character (Cyrillic 'а' replacing Latin 'a').",
      urls: [
        { id: "1", fullUrl: "https://univеrsity.edu/portal (with Cyrillic 'е')" },
        { id: "2", fullUrl: "https://portal.univ.edu:8080/secure" }
      ],
      questions: [
        {
          id: "q1",
          label: "1. Homograph Vector Identification",
          prompt: "Which link conceals an IDN Homograph / Punycode registration trick?",
          options: [
            { value: "A", text: "A) Link 1 (univеrsity.edu with Cyrillic 'е')" },
            { value: "B", text: "B) Link 2 (portal.univ.edu:8080)" },
            { value: "C", text: "C) Neither link is deceptive" },
            { value: "D", text: "D) Both links use Punycode" }
          ]
        },
        {
          id: "q2",
          label: "2. Punycode Decoded Hostname",
          prompt: "What is the actual ASCII Punycode string assigned to the lookalike Cyrillic domain?",
          options: [
            { value: "A", text: "A) xn--univ-cyr.edu" },
            { value: "B", text: "B) xn--univ-ofa.edu" },
            { value: "C", text: "C) univ-fake.edu" },
            { value: "D", text: "D) xn--college-88.edu" }
          ]
        },
        {
          id: "q3",
          label: "3. Client Defense Mechanism",
          prompt: "What browser security mechanism translates lookalike non-ASCII domains into visible xn-- strings?",
          options: [
            { value: "A", text: "A) Punycode Normalization & IDN Spoof Detection" },
            { value: "B", text: "B) DNSSEC Verification" },
            { value: "C", text: "C) Transport Layer Security (TLS)" },
            { value: "D", text: "D) Content Security Policy (CSP)" }
          ]
        }
      ]
    },

    C: {
      caseLetter: "C",
      title: "Station 03 // The Domain Mirage",
      subtitle: "Case 3-C: Cloud Bucket Subdomain Takeover",
      briefing: "Adversaries intercepted traffic via an abandoned AWS S3 bucket CNAME alias.",
      urls: [
        { id: "1", fullUrl: "https://exam-cloud.storage.aws/portal" },
        { id: "2", fullUrl: "https://univ.edu/exam/s3" }
      ],
      questions: [
        {
          id: "q1",
          label: "1. Rogue Cloud Storage Vector",
          prompt: "Which option represents the attacker-controlled cloud storage impersonation?",
          options: [
            { value: "A", text: "A) Link 1 (exam-cloud.storage.aws)" },
            { value: "B", text: "B) Link 2 (univ.edu/exam/s3)" },
            { value: "C", text: "C) Neither link" },
            { value: "D", text: "D) Both links" }
          ]
        },
        {
          id: "q2",
          label: "2. Deceptive Domain Structure",
          prompt: "Why is exam-cloud.storage.aws NOT an authentic Amazon Web Services domain?",
          options: [
            { value: "A", text: "A) The authoritative registered domain is storage.aws, which is not an official AWS endpoint" },
            { value: "B", text: "B) AWS only uses .com, never any other TLD" },
            { value: "C", text: "C) The URL lacks HTTPS encryption" },
            { value: "D", text: "D) S3 bucket names cannot contain hyphens" }
          ]
        },
        {
          id: "q3",
          label: "3. DNS Vulnerability Classification",
          prompt: "What vulnerability occurs when a DNS CNAME points to a deleted or abandoned cloud resource?",
          options: [
            { value: "A", text: "A) Subdomain / CNAME Takeover" },
            { value: "B", text: "B) Cross-Site Scripting (XSS)" },
            { value: "C", text: "C) SQL Injection" },
            { value: "D", text: "D) Directory Traversal" }
          ]
        }
      ]
    },

    D: {
      caseLetter: "D",
      title: "Station 03 // The Domain Mirage",
      subtitle: "Case 3-D: Shortened URL Obfuscation",
      briefing: "The QR code redirected through a shortened URL masking an offshore banking credential harvester.",
      urls: [
        { id: "1", fullUrl: "https://short-link.co/claim-grant (Redirects to bank-auth.scam.ru)" }
      ],
      questions: [
        {
          id: "q1",
          label: "1. URL Shortener Deception",
          prompt: "What deceptive technique disguises a malicious destination behind an HTTP 301/302 redirect service?",
          options: [
            { value: "A", text: "A) Cross-Site Scripting (XSS)" },
            { value: "B", text: "B) DNS Cache Poisoning" },
            { value: "C", text: "C) URL Shortener Masking" },
            { value: "D", text: "D) Path Traversal" }
          ]
        },
        {
          id: "q2",
          label: "2. Intermediate Host Inspection",
          prompt: "What is the intermediate shortener domain used to hide the phishing destination?",
          options: [
            { value: "A", text: "A) short-link.co" },
            { value: "B", text: "B) bank-auth.scam.ru" },
            { value: "C", text: "C) claim-grant.org" },
            { value: "D", text: "D) univ-aid.edu" }
          ]
        },
        {
          id: "q3",
          label: "3. Unshortening Defense Strategy",
          prompt: "How can an analyst inspect a shortened link safely without loading the final malicious webpage in a browser?",
          options: [
            { value: "A", text: "A) Send an HTTP HEAD request or use an unshortening API to inspect the Location redirect header" },
            { value: "B", text: "B) Click the link in an incognito window" },
            { value: "C", text: "C) Print the QR code on paper" },
            { value: "D", text: "D) Change the browser screen resolution" }
          ]
        }
      ]
    }
  },

  // =========================================================================
  // STATION 04: THE 10-MINUTE BLACKOUT (4 Distinct Cases: A, B, C, D)
  // =========================================================================
  4: {
    A: {
      caseLetter: "A",
      title: "Station 04 // The 10-Minute Blackout",
      subtitle: "Case 4-A: Hypervisor Ransomware Timeline",
      briefing: "At 08:59:00, campus mainframes lost network access. Reconstruct the 10-minute intrusion timeline to isolate Patient Zero and compute Exit PIN.",
      timeline: [
        { time: "08:50:12", source: "Perimeter Firewall", event: "Inbound SYN port scan from 45.33.32.156 targeting port 22/80/443. Result: BLOCKED at edge.", tag: "NOISE" },
        { time: "08:51:45", source: "Mail Gateway", event: "Message delivered to Marcus Vance with attachment: WiFi_Secure_Installer.pdf.exe.", tag: "DELIVERY" },
        { time: "08:53:02", source: "DNS Resolver", event: "Marcus's PC resolved auth.secure-gateway.cloud.", tag: "RECON" },
        { time: "08:54:10", source: "Workstation EDR", event: "Process WiFi_Secure_Installer.pdf.exe spawned cmd.exe with parent PID 4410.", tag: "EXECUTION" },
        { time: "08:55:30", source: "Active Directory", event: "TGS Kerberos Ticket requested for service cifs/dc01 using Marcus Vance credentials.", tag: "PRIVILEGE" },
        { time: "08:57:00", source: "Honeytoken Canary", event: "ALERT: Table tbl_admin_passwords read accessed by host 10.0.84.19.", tag: "CANARY" },
        { time: "08:58:15", source: "Shared Storage", event: "Bulk file renaming detected on Z:\\Research_Data (Ransomware extension .blackout).", tag: "IMPACT" },
        { time: "08:59:00", source: "SOC System", event: "Blackout Protocol triggered. Complete campus network isolated.", tag: "LOCKDOWN" }
      ],
      exitPin: "25",
      questions: [
        {
          id: "q1",
          label: "1. Patient Zero Execution Timestamp",
          prompt: "Based on the SIEM telemetry, at what timestamp did the adversary achieve Patient Zero persistent code execution?",
          options: [
            { value: "A", text: "A) 08:50:12" },
            { value: "B", text: "B) 08:51:45" },
            { value: "C", text: "C) 08:54:10" },
            { value: "D", text: "D) 08:58:15" }
          ]
        },
        {
          id: "q2",
          label: "2. False Lead Elimination",
          prompt: "Why was the 08:50:12 inbound SYN port scan discarded as the intrusion root cause?",
          options: [
            { value: "A", text: "A) It was automated perimeter scanning successfully dropped by edge firewalls" },
            { value: "B", text: "B) SYN packets cannot carry executable code" },
            { value: "C", text: "C) Port 22 is an authorized internal channel" },
            { value: "D", text: "D) The traffic originated from an internal workstation" }
          ]
        },
        {
          id: "q3",
          label: "3. Decoy Canary Tripwire Verification",
          prompt: "Which canary tripwire alert provided definitive evidence of malicious credential abuse?",
          options: [
            { value: "A", text: "A) Active Directory ticket request at 08:55:30" },
            { value: "B", text: "B) DNS query at 08:53:02" },
            { value: "C", text: "C) Honeytoken table tbl_admin_passwords read at 08:57:00" },
            { value: "D", text: "D) Storage alert at 08:58:15" }
          ]
        },
        {
          id: "q4",
          label: "4. Master Room Exit PIN",
          prompt: "Select the verified Room Exit PIN computed from your forensic investigation:",
          options: [
            { value: "A", text: "A) 18" },
            { value: "B", text: "B) 25" },
            { value: "C", text: "C) 36" },
            { value: "D", text: "D) 52" }
          ]
        }
      ]
    },

    B: {
      caseLetter: "B",
      title: "Station 04 // The 10-Minute Blackout",
      subtitle: "Case 4-B: Genomic Cloud Exfiltration Timeline",
      briefing: "At 09:18:00, 400 GB of proprietary genomic research data was exported. Isolate the initial access call.",
      timeline: [
        { time: "09:08:15", source: "Perimeter", event: "Automated vulnerability scan from Shodan crawler (BLOCKED).", tag: "NOISE" },
        { time: "09:12:04", source: "Azure AD", event: "OAuth App 'Azure-BioSync' granted offline scope by Elena.", tag: "INITIAL_ACCESS" },
        { time: "09:14:30", source: "Graph API", event: "Bulk e-discovery export initiated for mailbox e.rostova@univ.edu.", tag: "COLLECTION" },
        { time: "09:16:02", source: "Canary Alert", event: "Tripwire decoy document 'COVID_Gene_Sequence_Raw.xlsx' downloaded.", tag: "CANARY" },
        { time: "09:18:00", source: "SOC Firewall", event: "Outbound connection to mega.nz cloud server severed.", tag: "ISOLATION" }
      ],
      exitPin: "34",
      questions: [
        {
          id: "q1",
          label: "1. Initial Access Timestamp",
          prompt: "What exact timestamp marks the rogue OAuth application authorization?",
          options: [
            { value: "A", text: "A) 09:08:15" },
            { value: "B", text: "B) 09:12:04" },
            { value: "C", text: "C) 09:14:30" },
            { value: "D", text: "D) 09:18:00" }
          ]
        },
        {
          id: "q2",
          label: "2. Benign Event Filter",
          prompt: "Why was the 09:08:15 Shodan probe harmless?",
          options: [
            { value: "A", text: "A) It was internet background crawler noise stopped by perimeter filters" },
            { value: "B", text: "B) Shodan is an internal university tool" },
            { value: "C", text: "C) Port 443 cannot be scanned" },
            { value: "D", text: "D) The probe carried encrypted payload" }
          ]
        },
        {
          id: "q3",
          label: "3. Decoy Canary Minute Value",
          prompt: "What was the minute marker when the decoy file was accessed (09:16:02)?",
          options: [
            { value: "A", text: "A) 08" },
            { value: "B", text: "B) 12" },
            { value: "C", text: "C) 16" },
            { value: "D", text: "D) 18" }
          ]
        },
        {
          id: "q4",
          label: "4. Master Room Exit PIN",
          prompt: "Select the verified Room Exit PIN computed from your forensic investigation:",
          options: [
            { value: "A", text: "A) 22" },
            { value: "B", text: "B) 34" },
            { value: "C", text: "C) 41" },
            { value: "D", text: "D) 58" }
          ]
        }
      ]
    },

    C: {
      caseLetter: "C",
      title: "Station 04 // The 10-Minute Blackout",
      subtitle: "Case 4-C: AWS API Hijack Timeline",
      briefing: "At 14:10:00, root database snapshots were deleted. Find the Patient Zero API call.",
      timeline: [
        { time: "13:59:10", source: "AWS WAF", event: "Automated rate-limiting blocked requests (NOISE).", tag: "NOISE" },
        { time: "14:02:15", source: "CloudTrail", event: "AssumeRole called for 'Devon-Admin' with leaked credentials.", tag: "ROOT_CAUSE" },
        { time: "14:05:40", source: "S3 API", event: "PutBucketPolicy modified to public-read.", tag: "MODIFICATION" },
        { time: "14:08:00", source: "Honeytoken", event: "Canary IAM user 'audit-temp' accessed secret vault.", tag: "CANARY" },
        { time: "14:10:00", source: "KMS", event: "Master encryption key scheduled for deletion.", tag: "DESTRUCTION" }
      ],
      exitPin: "49",
      questions: [
        {
          id: "q1",
          label: "1. Initial API Compromise Timestamp",
          prompt: "At what exact timestamp did the attacker first invoke the compromised AWS AssumeRole API?",
          options: [
            { value: "A", text: "A) 13:59:10" },
            { value: "B", text: "B) 14:02:15" },
            { value: "C", text: "C) 14:05:40" },
            { value: "D", text: "D) 14:10:00" }
          ]
        },
        {
          id: "q2",
          label: "2. Automated Edge Defense",
          prompt: "Why was the 13:59:10 WAF alert benign?",
          options: [
            { value: "A", text: "A) It was automated rate-limiting suppression that prevented traffic from reaching the backend" },
            { value: "B", text: "B) WAF logs are always simulated" },
            { value: "C", text: "C) Rate-limiting indicates legitimate user activity" },
            { value: "D", text: "D) The traffic originated from internal IP" }
          ]
        },
        {
          id: "q3",
          label: "3. Decoy Canary Account",
          prompt: "What canary IAM identity triggered the unauthorized credential alert?",
          options: [
            { value: "A", text: "A) Devon-Admin" },
            { value: "B", text: "B) audit-temp" },
            { value: "C", text: "C) root" },
            { value: "D", text: "D) kms-manager" }
          ]
        },
        {
          id: "q4",
          label: "4. Master Room Exit PIN",
          prompt: "Select the verified Room Exit PIN computed from your forensic investigation:",
          options: [
            { value: "A", text: "A) 32" },
            { value: "B", text: "B) 49" },
            { value: "C", text: "C) 58" },
            { value: "D", text: "D) 64" }
          ]
        }
      ]
    },

    D: {
      caseLetter: "D",
      title: "Station 04 // The 10-Minute Blackout",
      subtitle: "Case 4-D: Wire Fraud & Quishing Timeline",
      briefing: "At 11:30:00, $50,000 in student grants was routed to foreign accounts. Unravel the attack and find the Master Exit PIN.",
      timeline: [
        { time: "11:20:00", source: "Network IDS", event: "Routine ping sweep from printer subnet (NOISE).", tag: "NOISE" },
        { time: "11:22:40", source: "Mobile Gateway", event: "Sarah Jenkins mobile scanned QR code and authorized wire API.", tag: "PATIENT_ZERO" },
        { time: "11:25:00", source: "FinAid Portal", event: "Automated batch wire transfer created.", tag: "EXFIL" },
        { time: "11:27:12", source: "Canary Bank Account", event: "Decoy account #9988 credited $1,000 (Tripwire alarmed).", tag: "CANARY" },
        { time: "11:30:00", source: "Treasury SOC", event: "ACH wire processing halted by treasury freeze.", tag: "HALT" }
      ],
      exitPin: "61",
      questions: [
        {
          id: "q1",
          label: "1. Initial QR Scan Timestamp",
          prompt: "At what exact timestamp did Sarah's mobile device execute the QR authorization?",
          options: [
            { value: "A", text: "A) 11:20:00" },
            { value: "B", text: "B) 11:22:40" },
            { value: "C", text: "C) 11:25:00" },
            { value: "D", text: "D) 11:30:00" }
          ]
        },
        {
          id: "q2",
          label: "2. Printer Subnet Noise Filter",
          prompt: "Why was the 11:20:00 IDS ping sweep alert discarded?",
          options: [
            { value: "A", text: "A) It was routine local subnet printer broadcast chatter" },
            { value: "B", text: "B) Printers cannot connect to networks" },
            { value: "C", text: "C) The alert was an anti-virus false alarm" },
            { value: "D", text: "D) Ping packets carry ransomware" }
          ]
        },
        {
          id: "q3",
          label: "3. Decoy Canary Account Alert",
          prompt: "Which event confirmed unauthorized financial manipulation?",
          options: [
            { value: "A", text: "A) Mobile connection at 11:22:40" },
            { value: "B", text: "B) Tripwire canary bank account #9988 credited at 11:27:12" },
            { value: "C", text: "C) Treasury freeze at 11:30:00" },
            { value: "D", text: "D) Printer broadcast at 11:20:00" }
          ]
        },
        {
          id: "q4",
          label: "4. Master Room Exit PIN",
          prompt: "Select the verified Room Exit PIN computed from your forensic investigation:",
          options: [
            { value: "A", text: "A) 45" },
            { value: "B", text: "B) 61" },
            { value: "C", text: "C) 72" },
            { value: "D", text: "D) 88" }
          ]
        }
      ]
    }
  }
};

window.STATION_CASES = STATION_CASES;
