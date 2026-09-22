/**
 * BLACKOUT PROTOCOL: 16-Case Multi-Station Repository
 * Exactly 4 distinct cases per station = 16 total investigative modules.
 * Every case features 5 high-fidelity forensic multiple-choice questions (q1-q5).
 */

const STATION_CASES = {
  "1": {
    "A": {
      "caseLetter": "A",
      "title": "Station 01 // The Spoofed Origin",
      "subtitle": "Case 1-A: The Dean's Executive Directive",
      "briefing": "SOC INCIDENT ALERT // PRIORITY 1: At 08:42 AM, the campus Security Operations Center detected anomalous lateral authentication bursts originating from an administrative workstation in North Hall. Mail gateway telemetry indicates three incoming communications reached administrative personnel in the 15 minutes prior to compromise. One communication bypassed secondary heuristics using an executable masking payload.",
      "emails": [
        {
          "id": "1",
          "sender": "Office of the Registrar <registrar@univ.edu>",
          "date": "08:42 AM",
          "subject": "Classroom Relocation Notice: Building 4",
          "headers": "SPF: PASS | DKIM: PASS | IP: 10.0.12.5 (Internal Campus LAN)\nAuthentication-Results: univ.edu; dkim=pass (signature verified)",
          "body": "Rooms 401-408 in North Hall are closed for HVAC compressor replacement today. All scheduled lectures have been relocated to Wing B Lecture Halls."
        },
        {
          "id": "2",
          "sender": "Dr. Aris (Dean of Faculty) <dean@univ-academic-portal.org>",
          "date": "08:49 AM",
          "subject": "Confidential: Q3 Faculty Research Grant Allocations",
          "headers": "SPF: PASS | DKIM: NONE | IP: 198.51.100.24 (External Cloud VPS)\nAuthentication-Results: univ.edu; dkim=none; spf=pass (external host)",
          "body": "Please access your revised research grant allocations immediately at https://univ.edu.login-portal.org/auth. Immediate digital signature required before 12:00 PM."
        },
        {
          "id": "3",
          "sender": "Campus IT Helpdesk <helpdesk@univ.edu>",
          "date": "08:51 AM",
          "subject": "ACTION REQUIRED: Mandatory Wi-Fi 6 Enterprise Certificate Patch",
          "headers": "SPF: PASS | DKIM: PASS (Compromised Student Worker Account)\nReturn-Path: <helpdesk@univ.edu>\nAttachment: WiFi_Secure_Installer.pdf.exe [2.4 MB]",
          "body": "Our automated telemetry detected legacy TLS certificates on your device. Double-click the attached PDF installer package to certify your machine for enterprise Wi-Fi 6 access."
        }
      ],
      "questions": [
        {
          "id": "q1",
          "label": "1. Attack Vector Identification",
          "prompt": "Which email represents a compromised legitimate internal account deploying an executable masking payload?",
          "options": [
            {
              "value": "A",
              "text": "A) Email 1 (Registrar relocation notice)"
            },
            {
              "value": "B",
              "text": "B) Email 2 (Dean grant approvals notice)"
            },
            {
              "value": "C",
              "text": "C) Email 3 (Campus IT Helpdesk Wi-Fi patch)"
            },
            {
              "value": "D",
              "text": "D) None, all three are routine automated broadcasts"
            }
          ]
        },
        {
          "id": "q2",
          "label": "2. Obfuscation Technique",
          "prompt": "What deceptive technique is used in Email 3 to mislead the user into executing a binary file?",
          "options": [
            {
              "value": "A",
              "text": "A) Macro injection inside an Office OpenXML spreadsheet"
            },
            {
              "value": "B",
              "text": "B) Double Extension Masking (.pdf.exe)"
            },
            {
              "value": "C",
              "text": "C) Steganographic LSB payload hiding inside an image"
            },
            {
              "value": "D",
              "text": "D) Unicode Right-to-Left Override (RTLO) character substitution"
            }
          ]
        },
        {
          "id": "q3",
          "label": "3. Gateway IP Forensic Triage",
          "prompt": "Forensic inspection of originating IP 198.51.100.24 in Email 2 confirms which network origin?",
          "options": [
            {
              "value": "A",
              "text": "A) Campus Core LAN Subnet (10.0.0.0/8)"
            },
            {
              "value": "B",
              "text": "B) Localhost loopback adapter (127.0.0.1)"
            },
            {
              "value": "C",
              "text": "C) External Cloud VPS / Unverified Foreign Infrastructure"
            },
            {
              "value": "D",
              "text": "D) Air-gapped mainframe backup appliance"
            }
          ]
        },
        {
          "id": "q4",
          "label": "4. Cryptographic Authentication Failure",
          "prompt": "Why was Email 2 suspicious despite passing basic SPF checks?",
          "options": [
            {
              "value": "A",
              "text": "A) It lacked a valid DKIM cryptographic signature from univ.edu and used an external lookalike domain"
            },
            {
              "value": "B",
              "text": "B) The email was sent over an unencrypted POP3 link"
            },
            {
              "value": "C",
              "text": "C) The sender address was empty"
            },
            {
              "value": "D",
              "text": "D) The MIME boundary exceeded 64 KB"
            }
          ]
        },
        {
          "id": "q5",
          "label": "5. Immediate Incident Containment",
          "prompt": "What is the primary containment action the SOC team must execute upon discovering the compromised helpdesk student worker account?",
          "options": [
            {
              "value": "A",
              "text": "A) Delete all incoming email for the university domain"
            },
            {
              "value": "B",
              "text": "B) Revoke student worker session tokens, isolate the host, and purge the malicious email from mailboxes"
            },
            {
              "value": "C",
              "text": "C) Power down the university core router"
            },
            {
              "value": "D",
              "text": "D) Reply to the sender asking for clarification"
            }
          ]
        }
      ]
    },
    "B": {
      "caseLetter": "B",
      "title": "Station 01 // The Spoofed Origin",
      "subtitle": "Case 1-B: The Payroll Direct Deposit Lure",
      "briefing": "FINANCIAL THREAT INTERCEPT: At 09:15 AM, the University Treasury received multiple alerts of employee direct-deposit changes. Forensic mail auditing intercepted two messages targeting payroll staff. One message masquerades as the Vice Chancellor using lookalike headers and forged reply-to routing.",
      "emails": [
        {
          "id": "1",
          "sender": "Benefits Department <benefits@univ.edu>",
          "date": "09:05 AM",
          "subject": "Annual Open Enrollment Deadline",
          "headers": "SPF: PASS | DKIM: PASS | IP: 10.0.2.14 (Internal HR Server)",
          "body": "Open enrollment for medical and retirement plans concludes this Friday at 5:00 PM. Access your benefit portal on the intranet."
        },
        {
          "id": "2",
          "sender": "Office of the Vice Chancellor <chancellor@univ-edu-portal.com>",
          "date": "09:12 AM",
          "subject": "URGENT: Re-routing Q1 Executive Payroll Routing",
          "headers": "SPF: PASS | DKIM: NONE | DMARC: NONE\nReply-To: executive-payouts@secure-vault-transfer.net\nIP: 203.0.113.77 (Unregistered Proxy Node)",
          "body": "Please re-route my upcoming direct deposit to our new offshore institutional foundation account before 11:00 AM today. Routing slip attached in secure link."
        }
      ],
      "questions": [
        {
          "id": "q1",
          "label": "1. Forged Sender Vector",
          "prompt": "Which communication constitutes the fraudulent executive payroll impersonation lure?",
          "options": [
            {
              "value": "A",
              "text": "A) Email 1 (Benefits annual open enrollment)"
            },
            {
              "value": "B",
              "text": "B) Email 2 (Vice Chancellor payroll re-routing)"
            },
            {
              "value": "C",
              "text": "C) Both communications are authorized HR requests"
            },
            {
              "value": "D",
              "text": "D) Neither, both are system test messages"
            }
          ]
        },
        {
          "id": "q2",
          "label": "2. Domain Spoofing Tactic",
          "prompt": "What domain spoofing technique did the attacker utilize in Email 2?",
          "options": [
            {
              "value": "A",
              "text": "A) Lookalike / Combosquatted Domain (univ-edu-portal.com vs univ.edu)"
            },
            {
              "value": "B",
              "text": "B) Subdomain hijacking on the root university server"
            },
            {
              "value": "C",
              "text": "C) BGP Route Hijacking of the campus Autonomous System"
            },
            {
              "value": "D",
              "text": "D) Zero-day vulnerability in the DNS root servers"
            }
          ]
        },
        {
          "id": "q3",
          "label": "3. DMARC Defense Mechanism",
          "prompt": "Which DMARC policy would have instructed recipient mail servers to completely reject Email 2?",
          "options": [
            {
              "value": "A",
              "text": "A) p=none"
            },
            {
              "value": "B",
              "text": "B) p=reject"
            },
            {
              "value": "C",
              "text": "C) p=monitoring"
            },
            {
              "value": "D",
              "text": "D) p=softfail"
            }
          ]
        },
        {
          "id": "q4",
          "label": "4. Exfiltration Routing Indicator",
          "prompt": "What critical header in Email 2 redirects direct replies to the attacker's covert inbox?",
          "options": [
            {
              "value": "A",
              "text": "A) X-Mailer: Microsoft Outlook 16.0"
            },
            {
              "value": "B",
              "text": "B) Content-Transfer-Encoding: 7bit"
            },
            {
              "value": "C",
              "text": "C) Reply-To: executive-payouts@secure-vault-transfer.net"
            },
            {
              "value": "D",
              "text": "D) MIME-Version: 1.0"
            }
          ]
        },
        {
          "id": "q5",
          "label": "5. Remediation Protocol",
          "prompt": "What operational safeguard prevents successful execution of this payroll redirect scheme?",
          "options": [
            {
              "value": "A",
              "text": "A) Forwarding the email to colleagues for a second opinion"
            },
            {
              "value": "B",
              "text": "B) Increasing the direct deposit transfer amount"
            },
            {
              "value": "C",
              "text": "C) Disabling multi-factor authentication on HR portals"
            },
            {
              "value": "D",
              "text": "D) Enforcing out-of-band voice/in-person verification for any bank detail modification"
            }
          ]
        }
      ]
    },
    "C": {
      "caseLetter": "C",
      "title": "Station 01 // The Spoofed Origin",
      "subtitle": "Case 1-C: Examination Leak Scareware",
      "briefing": "CAMPUS EMERGENCY ALERT: A mass scareware campaign targeted 4,000 undergraduate student mailboxes, claiming a critical academic integrity violation and demanding instant verification via an encrypted archive. Dissect the headers to identify the threat vector.",
      "emails": [
        {
          "id": "1",
          "sender": "Academic Integrity Board <integrity@univ-exam-leak.net>",
          "date": "13:55 PM",
          "subject": "URGENT: CS301 Final Exam Cancelled due to Security Breach",
          "headers": "SPF: FAIL | DKIM: NONE | DMARC: REJECT\nIP: 185.220.101.5 (Tor Exit Node)\nAttachment: proof_of_leak.zip [Password: 1234]",
          "body": "Your student PRN has been flagged in a cheating syndicate. Extract and execute proof_of_leak.zip immediately to sign the non-involvement declaration."
        },
        {
          "id": "2",
          "sender": "Prof. Davis <prof.davis@univ.edu>",
          "date": "13:58 PM",
          "subject": "CS301 Room Assignments",
          "headers": "SPF: PASS | DKIM: PASS | IP: 10.0.5.12 (Campus Core)",
          "body": "Final examination starts promptly at 9:00 AM tomorrow in Hall C. Please bring your student ID and a blue/black ballpoint pen."
        }
      ],
      "questions": [
        {
          "id": "q1",
          "label": "1. Malicious Message Vector",
          "prompt": "Which email is the deceptive scareware phishing attempt?",
          "options": [
            {
              "value": "A",
              "text": "A) Email 1 (Academic Integrity Board leak notice)"
            },
            {
              "value": "B",
              "text": "B) Email 2 (Prof. Davis reminder)"
            },
            {
              "value": "C",
              "text": "C) Both are authentic messages"
            },
            {
              "value": "D",
              "text": "D) Neither message is malicious"
            }
          ]
        },
        {
          "id": "q2",
          "label": "2. Social Engineering Trigger",
          "prompt": "What primary psychological cognitive bias does Email 1 exploit to force rapid compliance?",
          "options": [
            {
              "value": "A",
              "text": "A) Fear & Urgency (Threat of immediate academic expulsion)"
            },
            {
              "value": "B",
              "text": "B) Altruism & Charity"
            },
            {
              "value": "C",
              "text": "C) Familiarity & Friendship"
            },
            {
              "value": "D",
              "text": "D) Curiosity about discount shopping"
            }
          ]
        },
        {
          "id": "q3",
          "label": "3. Gateway Scanner Bypass Technique",
          "prompt": "Why did the attacker password-protect the malicious ZIP archive (proof_of_leak.zip)?",
          "options": [
            {
              "value": "A",
              "text": "A) To comply with GDPR encryption guidelines"
            },
            {
              "value": "B",
              "text": "B) To bypass automated antivirus and sandbox deep-packet inspection"
            },
            {
              "value": "C",
              "text": "C) To reduce the file transfer size over TCP"
            },
            {
              "value": "D",
              "text": "D) To prevent the recipient from reading the code"
            }
          ]
        },
        {
          "id": "q4",
          "label": "4. Origin Anonymizer Triage",
          "prompt": "The sending IP 185.220.101.5 in Email 1 matches what specific infrastructure?",
          "options": [
            {
              "value": "A",
              "text": "A) Internal Campus VPN Gateway"
            },
            {
              "value": "B",
              "text": "B) Google Workspace Relay"
            },
            {
              "value": "C",
              "text": "C) Tor Anonymization Exit Node"
            },
            {
              "value": "D",
              "text": "D) Campus DNS Server"
            }
          ]
        },
        {
          "id": "q5",
          "label": "5. SOC Broadcast Action",
          "prompt": "What immediate action should the SOC team take to mitigate student panic?",
          "options": [
            {
              "value": "A",
              "text": "A) Cancel all campus examinations indefinitely"
            },
            {
              "value": "B",
              "text": "B) Issue an official authenticated broadcast clarifying the hoax and block the sender IP at firewall"
            },
            {
              "value": "C",
              "text": "C) Advise students to extract the archive to check their names"
            },
            {
              "value": "D",
              "text": "D) Shut down student Wi-Fi permanently"
            }
          ]
        }
      ]
    },
    "D": {
      "caseLetter": "D",
      "title": "Station 01 // The Spoofed Origin",
      "subtitle": "Case 1-D: Vendor Supply Chain Invoice",
      "briefing": "SUPPLY CHAIN SECURITY BREACH: The university facilities procurement department received an invoice claiming overdue payments for physical HVAC chillers. Threat intelligence suspects a targeted Living-off-the-Land loader deployment.",
      "emails": [
        {
          "id": "1",
          "sender": "State Utilities Water Board <billing@citywater.gov>",
          "date": "10:14 AM",
          "subject": "Monthly Water & Sewage Statement",
          "headers": "SPF: PASS | DKIM: PASS | IP: 192.0.2.88",
          "body": "Your institutional water and sewage utility statement for Building Complex 3 is now available for review on the state billing portal."
        },
        {
          "id": "2",
          "sender": "ClimateControl Pro Contractors <invoicing@climatecontrol-univ-services.com>",
          "date": "10:20 AM",
          "subject": "FINAL NOTICE: Overdue Payment Invoice #INV-9921",
          "headers": "SPF: SOFTFAIL | DKIM: NONE\nAttachment: Invoice_9921.vbs.zip [180 KB]",
          "body": "Please find your past-due HVAC maintenance invoice attached. Open the billing manifest script immediately to avoid construction lien filing."
        }
      ],
      "questions": [
        {
          "id": "q1",
          "label": "1. Supply Chain Lure Identification",
          "prompt": "Which communication represents the fraudulent supply chain invoice lure?",
          "options": [
            {
              "value": "A",
              "text": "A) Email 1 (State Utilities Water Board)"
            },
            {
              "value": "B",
              "text": "B) Email 2 (ClimateControl Pro Contractors)"
            },
            {
              "value": "C",
              "text": "C) Both are authorized vendor statements"
            },
            {
              "value": "D",
              "text": "D) Neither message originated outside the campus"
            }
          ]
        },
        {
          "id": "q2",
          "label": "2. Malicious Payload Format",
          "prompt": "What file extension is disguised inside the ZIP attachment of Email 2?",
          "options": [
            {
              "value": "A",
              "text": "A) VBS (Visual Basic Script file: Invoice_9921.vbs)"
            },
            {
              "value": "B",
              "text": "B) MP3 audio recording"
            },
            {
              "value": "C",
              "text": "C) Plaintext CSV table"
            },
            {
              "value": "D",
              "text": "D) Portable Network Graphic (PNG)"
            }
          ]
        },
        {
          "id": "q3",
          "label": "3. SPF Authentication State",
          "prompt": "The SPF header in Email 2 indicates 'SOFTFAIL' (~all). What does this signify?",
          "options": [
            {
              "value": "A",
              "text": "A) The sending IP is not authorized in the domain's SPF record, but the domain owner configured a non-strict transition policy"
            },
            {
              "value": "B",
              "text": "B) The email passed with 100% cryptographic certainty"
            },
            {
              "value": "C",
              "text": "C) The mail server is offline"
            },
            {
              "value": "D",
              "text": "D) The recipient mailbox is completely full"
            }
          ]
        },
        {
          "id": "q4",
          "label": "4. Living-off-the-Land Execution Engine",
          "prompt": "Which built-in Windows utility is typically abused by Windows to execute .vbs script files?",
          "options": [
            {
              "value": "A",
              "text": "A) notepad.exe"
            },
            {
              "value": "B",
              "text": "B) calc.exe"
            },
            {
              "value": "C",
              "text": "C) wscript.exe or cscript.exe"
            },
            {
              "value": "D",
              "text": "D) mspaint.exe"
            }
          ]
        },
        {
          "id": "q5",
          "label": "5. Endpoint Security Policy",
          "prompt": "What Windows Defender / EDR rule blocks .vbs files from downloading executable content?",
          "options": [
            {
              "value": "A",
              "text": "A) Disabling Windows Defender Real-time Protection"
            },
            {
              "value": "B",
              "text": "B) Attack Surface Reduction (ASR): Block JavaScript or VBScript from launching downloaded executable content"
            },
            {
              "value": "C",
              "text": "C) Allowing all outbound port 80 traffic"
            },
            {
              "value": "D",
              "text": "D) Setting local administrator passwords to blank"
            }
          ]
        }
      ]
    }
  },
  "2": {
    "A": {
      "caseLetter": "A",
      "title": "Station 02 // The Digital Shadow",
      "subtitle": "Case 2-A: The Midnight Data Siphon",
      "briefing": "NETWORK TRAFFIC ANOMALY // CORE FIREWALL: At 00:00 UTC, the perimeter intrusion detection system recorded repeated outbound encrypted bursts. A compromised server in the Science Department subnet is communicating with an unregistered external cloud IP. Inspect packet timing, ports, and transfer sizes.",
      "packets": [
        {
          "time": "00:01:14",
          "proto": "TCP",
          "src": "10.0.14.22:49812",
          "dst": "198.51.100.99:8443",
          "length": "1420",
          "flags": "ACK, PSH",
          "info": "TLS 1.3 Application Data [Encrypted Payload Stream]"
        },
        {
          "time": "00:02:14",
          "proto": "TCP",
          "src": "10.0.14.22:49812",
          "dst": "198.51.100.99:8443",
          "length": "248",
          "flags": "ACK",
          "info": "Heartbeat Beacon (Interval: Exactly 60.00s)"
        },
        {
          "time": "00:03:14",
          "proto": "TCP",
          "src": "10.0.14.22:49812",
          "dst": "198.51.100.99:8443",
          "length": "1420",
          "flags": "ACK, PSH",
          "info": "Exfiltration Burst: Chunk #01 [100 MB total session]"
        },
        {
          "time": "00:03:15",
          "proto": "TCP",
          "src": "10.0.14.5:443",
          "dst": "151.101.65.140:443",
          "length": "98",
          "flags": "ACK",
          "info": "Routine University Web Gateway CDN Cache Sync"
        }
      ],
      "questions": [
        {
          "id": "q1",
          "label": "1. Command & Control Target",
          "prompt": "Which destination IP is receiving the recurring heartbeat and data exfiltration stream?",
          "options": [
            {
              "value": "A",
              "text": "A) 151.101.65.140"
            },
            {
              "value": "B",
              "text": "B) 198.51.100.99"
            },
            {
              "value": "C",
              "text": "C) 10.0.14.5"
            },
            {
              "value": "D",
              "text": "D) 127.0.0.1"
            }
          ]
        },
        {
          "id": "q2",
          "label": "2. C2 Beacon Cadence",
          "prompt": "What is the exact periodic heartbeat beacon interval observed in the packet capture?",
          "options": [
            {
              "value": "A",
              "text": "A) Random jitter between 1 and 10 seconds"
            },
            {
              "value": "B",
              "text": "B) Fixed 60-second intervals (00:01:14 -> 00:02:14 -> 00:03:14)"
            },
            {
              "value": "C",
              "text": "C) Once every 24 hours"
            },
            {
              "value": "D",
              "text": "D) Continuous unbuffered UDP stream"
            }
          ]
        },
        {
          "id": "q3",
          "label": "3. Non-Standard Port Utilization",
          "prompt": "Which egress destination port is being utilized to mask the command and control channel?",
          "options": [
            {
              "value": "A",
              "text": "A) Port 21 (FTP)"
            },
            {
              "value": "B",
              "text": "B) Port 25 (SMTP)"
            },
            {
              "value": "C",
              "text": "C) Port 8443 (Alternative HTTPS)"
            },
            {
              "value": "D",
              "text": "D) Port 53 (DNS)"
            }
          ]
        },
        {
          "id": "q4",
          "label": "4. Threat Classification",
          "prompt": "What MITRE ATT&CK technique best describes this persistent regular outbound traffic pattern?",
          "options": [
            {
              "value": "A",
              "text": "A) T1071.001 - Application Layer Protocol: Web Protocols (C2 Beaconing)"
            },
            {
              "value": "B",
              "text": "B) T1499 - Endpoint Denial of Service"
            },
            {
              "value": "C",
              "text": "C) T1056 - Input Capture (Keylogging)"
            },
            {
              "value": "D",
              "text": "D) T1565 - Data Manipulation"
            }
          ]
        },
        {
          "id": "q5",
          "label": "5. Firewall Emergency Triage",
          "prompt": "What immediate network configuration change neutralizes the active data siphon?",
          "options": [
            {
              "value": "A",
              "text": "A) Open all incoming ports to allow debugging"
            },
            {
              "value": "B",
              "text": "B) Clear browser history on the firewall"
            },
            {
              "value": "C",
              "text": "C) Restart all domain controllers simultaneously"
            },
            {
              "value": "D",
              "text": "D) Inject an edge firewall DROP rule for 198.51.100.99:8443 and isolate internal host 10.0.14.22"
            }
          ]
        }
      ]
    },
    "B": {
      "caseLetter": "B",
      "title": "Station 02 // The Digital Shadow",
      "subtitle": "Case 2-B: The Rogue Registrar Gateway",
      "briefing": "COVERT CHANNEL DETECTION: Internal DNS resolver logs recorded an explosive spike in subdomain queries exceeding 8,000 requests per minute from a single compromised library workstation. Dissect the DNS record types and payload anomalies.",
      "packets": [
        {
          "time": "02:15:01",
          "proto": "DNS",
          "src": "10.0.18.45:51294",
          "dst": "10.0.0.1:53",
          "length": "420",
          "flags": "Standard Query",
          "info": "TXT query: a8f91c7b88e1a2f4001.exfil.darknet-relay.org"
        },
        {
          "time": "02:15:02",
          "proto": "DNS",
          "src": "10.0.18.45:51295",
          "dst": "10.0.0.1:53",
          "length": "418",
          "flags": "Standard Query",
          "info": "TXT query: f901bca76291e018a11.exfil.darknet-relay.org"
        },
        {
          "time": "02:15:03",
          "proto": "DNS",
          "src": "10.0.18.45:51296",
          "dst": "10.0.0.1:53",
          "length": "425",
          "flags": "Standard Query",
          "info": "TXT query: 38bf8192a0174ca9910.exfil.darknet-relay.org"
        },
        {
          "time": "02:15:04",
          "proto": "DNS",
          "src": "10.0.2.10:60111",
          "dst": "10.0.0.1:53",
          "length": "68",
          "flags": "Standard Query",
          "info": "A query: mail.google.com (Normal user request)"
        }
      ],
      "questions": [
        {
          "id": "q1",
          "label": "1. Covert Channel Identification",
          "prompt": "What covert data exfiltration method is active on host 10.0.18.45?",
          "options": [
            {
              "value": "A",
              "text": "A) ICMP Ping of Death"
            },
            {
              "value": "B",
              "text": "B) DNS Tunneling (Data exfiltration through nested subdomains)"
            },
            {
              "value": "C",
              "text": "C) BitTorrent peer exchange"
            },
            {
              "value": "D",
              "text": "D) SNMP community string sniffing"
            }
          ]
        },
        {
          "id": "q2",
          "label": "2. Encoded Payload Structure",
          "prompt": "What data format is encapsulated in the subdomain labels preceding '.exfil.darknet-relay.org'?",
          "options": [
            {
              "value": "A",
              "text": "A) Hexadecimal / Base32 encoded data chunks"
            },
            {
              "value": "B",
              "text": "B) Plain English sentences"
            },
            {
              "value": "C",
              "text": "C) Raw uncompressed JPEG image bytes"
            },
            {
              "value": "D",
              "text": "D) Executable PE binary headers in plaintext"
            }
          ]
        },
        {
          "id": "q3",
          "label": "3. Source Host Triage",
          "prompt": "Which internal IP address is compromised and executing the tunneling tool?",
          "options": [
            {
              "value": "A",
              "text": "A) 10.0.0.1"
            },
            {
              "value": "B",
              "text": "B) 10.0.2.10"
            },
            {
              "value": "C",
              "text": "C) 10.0.18.45"
            },
            {
              "value": "D",
              "text": "D) 127.0.0.1"
            }
          ]
        },
        {
          "id": "q4",
          "label": "4. Protocol Vulnerability",
          "prompt": "Why is DNS tunneling frequently overlooked by legacy boundary firewalls?",
          "options": [
            {
              "value": "A",
              "text": "A) DNS traffic is always encrypted by default in standard IPv4"
            },
            {
              "value": "B",
              "text": "B) Port 53 (UDP) is typically left open to internal recursive resolvers without deep payload inspection"
            },
            {
              "value": "C",
              "text": "C) DNS packets can only carry 1 byte of information"
            },
            {
              "value": "D",
              "text": "D) Routers do not support DNS logging"
            }
          ]
        },
        {
          "id": "q5",
          "label": "5. SOC Mitigation Strategy",
          "prompt": "What proactive control mitigates DNS tunneling attacks campus-wide?",
          "options": [
            {
              "value": "A",
              "text": "A) Deploy Response Policy Zones (RPZ), inspect query length/entropy, and restrict direct outbound port 53 to vetted recursive resolvers"
            },
            {
              "value": "B",
              "text": "B) Turn off all campus name resolution permanently"
            },
            {
              "value": "C",
              "text": "C) Upgrade all monitors to 4K resolution"
            },
            {
              "value": "D",
              "text": "D) Change keyboard language settings"
            }
          ]
        }
      ]
    },
    "C": {
      "caseLetter": "C",
      "title": "Station 02 // The Digital Shadow",
      "subtitle": "Case 2-C: The Internal Lateral Worm",
      "briefing": "ACTIVE DIRECTORY ATTACK // LATERAL MOVEMENT: Endpoint detection alerts flagged rapid horizontal network scanning over SMB port 445. The threat actor is utilizing Pass-the-Hash credentials to propagate across subnet 10.0.22.0/24 in under three minutes.",
      "packets": [
        {
          "time": "04:10:01",
          "proto": "SMB2",
          "src": "10.0.22.10:49201",
          "dst": "10.0.22.11:445",
          "length": "380",
          "flags": "Session Setup",
          "info": "NTLMSSP Auth Request: Admin_Service [NTLM Hash: e59cbbc02f72...]"
        },
        {
          "time": "04:10:02",
          "proto": "SMB2",
          "src": "10.0.22.10:49202",
          "dst": "10.0.22.12:445",
          "length": "380",
          "flags": "Session Setup",
          "info": "NTLMSSP Auth Request: Admin_Service [NTLM Hash: e59cbbc02f72...]"
        },
        {
          "time": "04:10:03",
          "proto": "SMB2",
          "src": "10.0.22.10:49203",
          "dst": "10.0.22.13:445",
          "length": "380",
          "flags": "Session Setup",
          "info": "NTLMSSP Auth Request: Admin_Service [NTLM Hash: e59cbbc02f72...]"
        },
        {
          "time": "04:10:04",
          "proto": "SMB2",
          "src": "10.0.22.10:49204",
          "dst": "10.0.22.14:445",
          "length": "380",
          "flags": "Session Setup",
          "info": "SVCCTL: CreateServiceW (Service: PSEXESVC.exe)"
        }
      ],
      "questions": [
        {
          "id": "q1",
          "label": "1. Propagation Protocol",
          "prompt": "What network protocol is being leveraged for horizontal lateral movement across the subnet?",
          "options": [
            {
              "value": "A",
              "text": "A) HTTP (Port 80)"
            },
            {
              "value": "B",
              "text": "B) SMB (Server Message Block over Port 445)"
            },
            {
              "value": "C",
              "text": "C) TFTP (Port 69)"
            },
            {
              "value": "D",
              "text": "D) NTP (Port 123)"
            }
          ]
        },
        {
          "id": "q2",
          "label": "2. Attack Vector Analysis",
          "prompt": "What technique enables the threat actor to authenticate without knowing the plaintext password?",
          "options": [
            {
              "value": "A",
              "text": "A) Pass-the-Hash (PTH) utilizing the captured NTLM hash directly"
            },
            {
              "value": "B",
              "text": "B) Rainbow table precomputation in real-time"
            },
            {
              "value": "C",
              "text": "C) Guessing standard dictionary passwords"
            },
            {
              "value": "D",
              "text": "D) Physical keyboard keystroke logging"
            }
          ]
        },
        {
          "id": "q3",
          "label": "3. Execution Mechanism",
          "prompt": "The creation of service 'PSEXESVC.exe' in packet 4 indicates which Living-off-the-Land tool?",
          "options": [
            {
              "value": "A",
              "text": "A) Wireshark"
            },
            {
              "value": "B",
              "text": "B) Microsoft Paint"
            },
            {
              "value": "C",
              "text": "C) Sysinternals PsExec (Remote Process Execution)"
            },
            {
              "value": "D",
              "text": "D) Windows Media Player"
            }
          ]
        },
        {
          "id": "q4",
          "label": "4. Compromised Credential Privilege",
          "prompt": "The account 'Admin_Service' having authority to create remote services on multiple machines indicates what privilege tier?",
          "options": [
            {
              "value": "A",
              "text": "A) Guest User"
            },
            {
              "value": "B",
              "text": "B) Unauthenticated Kiosk Account"
            },
            {
              "value": "C",
              "text": "C) Read-Only Database Auditor"
            },
            {
              "value": "D",
              "text": "D) Local Administrator / High-Privilege Domain Service Account"
            }
          ]
        },
        {
          "id": "q5",
          "label": "5. Network Hardening Control",
          "prompt": "What architectural defense prevents workstation-to-workstation SMB lateral propagation?",
          "options": [
            {
              "value": "A",
              "text": "A) Disabling all computer monitors"
            },
            {
              "value": "B",
              "text": "B) Host-based firewall isolation blocking inbound port 445 between endpoints and disabling NTLM"
            },
            {
              "value": "C",
              "text": "C) Giving all students local administrator rights"
            },
            {
              "value": "D",
              "text": "D) Installing more RAM on the client machines"
            }
          ]
        }
      ]
    },
    "D": {
      "caseLetter": "D",
      "title": "Station 02 // The Digital Shadow",
      "subtitle": "Case 2-D: The Cloud API Token Leakage",
      "briefing": "CLOUD ENVIRONMENT BREACH: The University Cloud Operations console triggered a high-severity alert for unauthorized Amazon S3 data export. An automated script using Python requests is systematically dumping relational database backups.",
      "packets": [
        {
          "time": "06:40:01",
          "proto": "HTTPS",
          "src": "198.51.100.18:54201",
          "dst": "52.216.144.3:443",
          "length": "890",
          "flags": "TLS Application",
          "info": "s3.amazonaws.com GET /univ-student-database-prod/roster_2026.sql"
        },
        {
          "time": "06:40:02",
          "proto": "HTTPS",
          "src": "198.51.100.18:54202",
          "dst": "52.216.144.3:443",
          "length": "890",
          "flags": "TLS Application",
          "info": "s3.amazonaws.com GET /univ-student-database-prod/ssn_export.tar.gz"
        },
        {
          "time": "06:40:03",
          "proto": "HTTPS",
          "src": "198.51.100.18:54203",
          "dst": "52.216.144.3:443",
          "length": "890",
          "flags": "TLS Application",
          "info": "User-Agent: python-requests/2.31.0 | Authorization: AWS4-HMAC-SHA256"
        }
      ],
      "questions": [
        {
          "id": "q1",
          "label": "1. Cloud Target Asset",
          "prompt": "What cloud storage asset is being systematically harvested by the threat actor?",
          "options": [
            {
              "value": "A",
              "text": "A) Azure Virtual Hard Disk"
            },
            {
              "value": "B",
              "text": "B) AWS S3 Bucket (univ-student-database-prod)"
            },
            {
              "value": "C",
              "text": "C) Google Cloud Pub/Sub Topic"
            },
            {
              "value": "D",
              "text": "D) On-premise magnetic tape vault"
            }
          ]
        },
        {
          "id": "q2",
          "label": "2. Initial Compromise Vector",
          "prompt": "How are cloud API credentials (AWS Access Key ID & Secret Key) most commonly compromised by automated scrapers?",
          "options": [
            {
              "value": "A",
              "text": "A) Accidental hardcoding in public source code repositories (e.g. GitHub)"
            },
            {
              "value": "B",
              "text": "B) Physical theft of Amazon data centers"
            },
            {
              "value": "C",
              "text": "C) Quantum computer factoring of RSA-4096"
            },
            {
              "value": "D",
              "text": "D) Acoustic eavesdropping on CPU fans"
            }
          ]
        },
        {
          "id": "q3",
          "label": "3. User-Agent Fingerprint",
          "prompt": "What User-Agent string confirms the exfiltration is driven by an automated script?",
          "options": [
            {
              "value": "A",
              "text": "A) Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebkit"
            },
            {
              "value": "B",
              "text": "B) Apple Safari / iPhone 15"
            },
            {
              "value": "C",
              "text": "C) python-requests/2.31.0"
            },
            {
              "value": "D",
              "text": "D) Edge Chromium Mobile"
            }
          ]
        },
        {
          "id": "q4",
          "label": "4. Exfiltrated Information Scope",
          "prompt": "Based on the object keys in the GET requests, what category of sensitive data was targeted?",
          "options": [
            {
              "value": "A",
              "text": "A) Public campus cafeteria lunch menus"
            },
            {
              "value": "B",
              "text": "B) Student PII and confidential database tables (roster_2026.sql, ssn_export.tar.gz)"
            },
            {
              "value": "C",
              "text": "C) Open-source Linux distribution ISO images"
            },
            {
              "value": "D",
              "text": "D) Campus weather radar data"
            }
          ]
        },
        {
          "id": "q5",
          "label": "5. Immediate Cloud Remediation",
          "prompt": "What is the single most critical containment step the cloud engineer must execute immediately?",
          "options": [
            {
              "value": "A",
              "text": "A) Deactivate the compromised IAM Access Key and apply an explicit Deny bucket policy"
            },
            {
              "value": "B",
              "text": "B) Delete the entire AWS account"
            },
            {
              "value": "C",
              "text": "C) Send an email to Amazon support requesting a callback"
            },
            {
              "value": "D",
              "text": "D) Reboot the user's laptop"
            }
          ]
        }
      ]
    }
  },
  "3": {
    "A": {
      "caseLetter": "A",
      "title": "Station 03 // The Domain Mirage",
      "subtitle": "Case 3-A: The Punycode Portal Trap",
      "briefing": "VISUAL SPOOFING INVESTIGATION: Multiple students reported being prompted for their multi-factor authentication (MFA) codes twice when accessing the student portal. Forensic triage revealed a deceptive Internationalized Domain Name (IDN) homograph mirror.",
      "urls": [
        {
          "id": "1",
          "label": "Official Campus Portal",
          "url": "https://portal.univ.edu/login",
          "punycode": "portal.univ.edu",
          "ip": "10.0.1.20",
          "registrar": "Educause (Accredited .edu)",
          "ssl": "DigiCert High-Assurance TLS 1.3 | Valid 1 Year",
          "flags": "LEGITIMATE OFFICIAL"
        },
        {
          "id": "2",
          "label": "Harvesting Gateway",
          "url": "https://xn--univ-portal-08a.edu/login",
          "punycode": "univ-pоrtal.edu (Cyrillic 'о' U+043E)",
          "ip": "185.193.125.10",
          "registrar": "Offshore Anonymous Registrar Ltd",
          "ssl": "Let's Encrypt TLS (Issued 14 hours ago)",
          "flags": "HOMOGLYPH SPOOF / AiTM PHISH"
        }
      ],
      "questions": [
        {
          "id": "q1",
          "label": "1. Deceptive Homoglyph Identification",
          "prompt": "Which domain represents the fraudulent credential harvesting portal?",
          "options": [
            {
              "value": "A",
              "text": "A) portal.univ.edu"
            },
            {
              "value": "B",
              "text": "B) xn--univ-portal-08a.edu (univ-pоrtal.edu)"
            },
            {
              "value": "C",
              "text": "C) Both domains are legitimate university mirrors"
            },
            {
              "value": "D",
              "text": "D) Neither domain is functional"
            }
          ]
        },
        {
          "id": "q2",
          "label": "2. Visual Spoofing Mechanism",
          "prompt": "What deceptive technique allows the malicious domain to appear virtually identical to human eyes in address bars?",
          "options": [
            {
              "value": "A",
              "text": "A) Buffer overflow in the browser window"
            },
            {
              "value": "B",
              "text": "B) SQL Injection inside the search parameter"
            },
            {
              "value": "C",
              "text": "C) IDN Homograph visual substitution (Cyrillic 'о' replacing Latin 'o')"
            },
            {
              "value": "D",
              "text": "D) CSS z-index layering"
            }
          ]
        },
        {
          "id": "q3",
          "label": "3. Certificate Telemetry Red Flag",
          "prompt": "What cryptographic certificate attribute indicates a suspicious disposable attack infrastructure?",
          "options": [
            {
              "value": "A",
              "text": "A) Issued by a globally recognized Root CA"
            },
            {
              "value": "B",
              "text": "B) 2048-bit RSA key length"
            },
            {
              "value": "C",
              "text": "C) Free automated certificate issued less than 24 hours prior to the incident"
            },
            {
              "value": "D",
              "text": "D) Supported TLS 1.3 ciphers"
            }
          ]
        },
        {
          "id": "q4",
          "label": "4. Multi-Factor Bypass Mechanism",
          "prompt": "How does an Adversary-in-the-Middle (AiTM) proxy intercept user sessions even with 2FA enabled?",
          "options": [
            {
              "value": "A",
              "text": "A) Proxies authentication packets in real time and captures the authenticated session cookie"
            },
            {
              "value": "B",
              "text": "B) Cracks the mathematical algorithm of the authenticator app"
            },
            {
              "value": "C",
              "text": "C) Guesses the 6-digit TOTP code through brute force"
            },
            {
              "value": "D",
              "text": "D) Steals the physical smartphone from the student"
            }
          ]
        },
        {
          "id": "q5",
          "label": "5. Resilient Authentication Defense",
          "prompt": "Which MFA standard is cryptographically immune to AiTM reverse proxy interception?",
          "options": [
            {
              "value": "A",
              "text": "A) SMS Text Message verification codes"
            },
            {
              "value": "B",
              "text": "B) Email verification links"
            },
            {
              "value": "C",
              "text": "C) Voice phone call verification"
            },
            {
              "value": "D",
              "text": "D) FIDO2 / WebAuthn Hardware Security Keys (Domain-bound cryptographic credentials)"
            }
          ]
        }
      ]
    },
    "B": {
      "caseLetter": "B",
      "title": "Station 03 // The Domain Mirage",
      "subtitle": "Case 3-B: The Bit-Flipping Typo Sanctuary",
      "briefing": "TYPOSQUATTING INTERCEPT: Students frequently mistype the university web domain on mobile devices. The SOC detected an active credential cloning site hosted on bulletproof infrastructure capitalizing on a single-letter permutation.",
      "urls": [
        {
          "id": "1",
          "label": "Typosquat Lure",
          "url": "https://univversity.edu/student-hub",
          "punycode": "univversity.edu",
          "ip": "194.26.29.112",
          "registrar": "Panama Privacy Guardian",
          "ssl": "ZeroSSL (12 Days Old)",
          "flags": "TYPO VARIANT / HARVESTER"
        },
        {
          "id": "2",
          "label": "Legitimate Campus",
          "url": "https://university.edu/student-hub",
          "punycode": "university.edu",
          "ip": "10.0.1.5",
          "registrar": "Educause",
          "ssl": "Enterprise DigiCert EV",
          "flags": "GENUINE HOST"
        }
      ],
      "questions": [
        {
          "id": "q1",
          "label": "1. Typosquat Variant Discovery",
          "prompt": "Which URL represents the typo-squatted clone capitalizing on double-letter mistyping?",
          "options": [
            {
              "value": "A",
              "text": "A) univversity.edu (Double 'v')"
            },
            {
              "value": "B",
              "text": "B) university.edu"
            },
            {
              "value": "C",
              "text": "C) Both domains are operated by campus IT"
            },
            {
              "value": "D",
              "text": "D) Neither domain is reachable"
            }
          ]
        },
        {
          "id": "q2",
          "label": "2. Attack Objective",
          "prompt": "What is the primary motive behind deploying this typo-squatted portal?",
          "options": [
            {
              "value": "A",
              "text": "A) Increasing search engine page rank for local pizza restaurants"
            },
            {
              "value": "B",
              "text": "B) Harvesting login credentials from users who make typographical errors in browser navigation"
            },
            {
              "value": "C",
              "text": "C) Distributing Linux kernel patches"
            },
            {
              "value": "D",
              "text": "D) Benchmarking broadband connection speeds"
            }
          ]
        },
        {
          "id": "q3",
          "label": "3. Hosting Provider Risk Triage",
          "prompt": "The hosting IP 194.26.29.112 belonging to an unverified offshore privacy registrar suggests which threat environment?",
          "options": [
            {
              "value": "A",
              "text": "A) Bulletproof Hosting Provider designed to ignore DMCA and law enforcement takedown requests"
            },
            {
              "value": "B",
              "text": "B) Official Microsoft Azure Government Cloud"
            },
            {
              "value": "C",
              "text": "C) Local municipal library server"
            },
            {
              "value": "D",
              "text": "D) University computer science student laboratory"
            }
          ]
        },
        {
          "id": "q4",
          "label": "4. Threat Intelligence Investigation",
          "prompt": "What public monitoring system alerts defenders when lookalike certificates are generated for their brand?",
          "options": [
            {
              "value": "A",
              "text": "A) Windows Task Manager"
            },
            {
              "value": "B",
              "text": "B) Command Prompt Ping"
            },
            {
              "value": "C",
              "text": "C) Certificate Transparency (CT) Log Monitoring"
            },
            {
              "value": "D",
              "text": "D) Optical Fiber Reflectometer"
            }
          ]
        },
        {
          "id": "q5",
          "label": "5. Enterprise Defensive Action",
          "prompt": "What proactive measure protects campus users from reaching the typo-squatted domain?",
          "options": [
            {
              "value": "A",
              "text": "A) Disconnecting the university fiber optic uplink"
            },
            {
              "value": "B",
              "text": "B) Injecting a DNS Sinkhole entry on internal resolvers and initiating a UDRP registrar dispute"
            },
            {
              "value": "C",
              "text": "C) Advising users to type faster"
            },
            {
              "value": "D",
              "text": "D) Changing the university name"
            }
          ]
        }
      ]
    },
    "C": {
      "caseLetter": "C",
      "title": "Station 03 // The Domain Mirage",
      "subtitle": "Case 3-C: The Forged SSO OAuth Consent Screen",
      "briefing": "ILLICIT OAUTH GRANT ATTACK: A rogue application named 'Campus Calendar Sync Pro' prompted faculty and students for single sign-on consent. Threat actors are abusing OAuth 2.0 delegated permissions to access mailboxes without knowing user passwords.",
      "urls": [
        {
          "id": "1",
          "label": "Malicious OAuth Application",
          "url": "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=8921fa-malicious-app",
          "punycode": "auth-sync.workers.dev",
          "ip": "104.21.5.12",
          "registrar": "Cloudflare Workers",
          "ssl": "Cloudflare TLS",
          "flags": "PERMISSIONS: Mail.ReadWrite, Files.ReadWrite.All"
        }
      ],
      "questions": [
        {
          "id": "q1",
          "label": "1. Illicit Application Identification",
          "prompt": "Which application is executing the illicit OAuth 2.0 consent phishing attack?",
          "options": [
            {
              "value": "A",
              "text": "A) Campus Calendar Sync Pro requesting Mail.ReadWrite and Files.ReadWrite.All"
            },
            {
              "value": "B",
              "text": "B) Microsoft Windows Update Service"
            },
            {
              "value": "C",
              "text": "C) Adobe Acrobat Reader DC"
            },
            {
              "value": "D",
              "text": "D) Zoom Video Communications"
            }
          ]
        },
        {
          "id": "q2",
          "label": "2. Attack Mechanism",
          "prompt": "What makes an Illicit Consent Grant attack particularly hazardous compared to credential theft?",
          "options": [
            {
              "value": "A",
              "text": "A) The attacker gains persistent API token access to emails and files without ever stealing or needing the user's password"
            },
            {
              "value": "B",
              "text": "B) It physically damages the motherboard"
            },
            {
              "value": "C",
              "text": "C) It deletes all local files immediately"
            },
            {
              "value": "D",
              "text": "D) It turns off the campus electricity"
            }
          ]
        },
        {
          "id": "q3",
          "label": "3. Redirect URI Triage",
          "prompt": "The OAuth redirect URI pointing to 'https://auth-sync.workers.dev' utilizes what serverless architecture?",
          "options": [
            {
              "value": "A",
              "text": "A) Serverless Cloud Edge Worker used to capture OAuth authorization codes"
            },
            {
              "value": "B",
              "text": "B) On-premise Active Directory Domain Controller"
            },
            {
              "value": "C",
              "text": "C) USB flash drive"
            },
            {
              "value": "D",
              "text": "D) Bluetooth beacon"
            }
          ]
        },
        {
          "id": "q4",
          "label": "4. Persistence Mechanism",
          "prompt": "What token grants the threat actor ongoing access even after the user logs out of their browser?",
          "options": [
            {
              "value": "A",
              "text": "A) Temporary CSRF token"
            },
            {
              "value": "B",
              "text": "B) Browser cache cookie"
            },
            {
              "value": "C",
              "text": "C) OAuth 2.0 Long-Lived Refresh Token"
            },
            {
              "value": "D",
              "text": "D) Screen resolution metadata"
            }
          ]
        },
        {
          "id": "q5",
          "label": "5. Tenant Remediation Step",
          "prompt": "How does the cloud tenant administrator immediately terminate the threat actor's access?",
          "options": [
            {
              "value": "A",
              "text": "A) Ask users to change their desktop wallpaper"
            },
            {
              "value": "B",
              "text": "B) Delete all email accounts"
            },
            {
              "value": "C",
              "text": "C) Reinstall Windows on all client machines"
            },
            {
              "value": "D",
              "text": "D) Revoke the Enterprise Application's OAuth consent and invalidate all active user refresh tokens in Microsoft Entra / Google Workspace"
            }
          ]
        }
      ]
    },
    "D": {
      "caseLetter": "D",
      "title": "Station 03 // The Domain Mirage",
      "subtitle": "Case 3-D: The Rogue Campus Captive Portal",
      "briefing": "WIRELESS EVIL TWIN DEPLOYMENT: Campus security detected a battery-powered rogue Wi-Fi access point operating near the central student union. The rogue device is broadcasting an unencrypted clone of the university network.",
      "urls": [
        {
          "id": "1",
          "label": "Official Enterprise SSID",
          "url": "WPA2/WPA3 Enterprise (802.1X EAP-TLS)",
          "punycode": "univ-wifi.edu",
          "ip": "10.0.0.1",
          "registrar": "Campus Network Infrastructure",
          "ssl": "Enterprise Internal Radius Root CA",
          "flags": "LEGITIMATE ACCESS POINT"
        },
        {
          "id": "2",
          "label": "Rogue Evil Twin SSID",
          "url": "Campus-Guest-HighSpeed (Open / Captive Portal)",
          "punycode": "portal-univ-wifi.net",
          "ip": "192.168.1.1",
          "registrar": "Anonymous VPS Gateway",
          "ssl": "Self-Signed Untrusted Certificate",
          "flags": "EVIL TWIN / CREDENTIAL TRAP"
        }
      ],
      "questions": [
        {
          "id": "q1",
          "label": "1. Rogue Wireless Identifier",
          "prompt": "Which wireless network represents the unauthenticated Evil Twin access point?",
          "options": [
            {
              "value": "A",
              "text": "A) WPA2/WPA3 Enterprise 802.1X"
            },
            {
              "value": "B",
              "text": "B) Campus Core LAN Backbone"
            },
            {
              "value": "C",
              "text": "C) Campus-Guest-HighSpeed (Open Captive Portal on 192.168.1.1)"
            },
            {
              "value": "D",
              "text": "D) Bluetooth Peripheral 04"
            }
          ]
        },
        {
          "id": "q2",
          "label": "2. Attack Vector Description",
          "prompt": "What attack methodology is deployed when an adversary mimics a legitimate Wi-Fi network to intercept traffic?",
          "options": [
            {
              "value": "A",
              "text": "A) Evil Twin / Rogue AP with Captive Portal Harvesting"
            },
            {
              "value": "B",
              "text": "B) SQL Injection into the access point antenna"
            },
            {
              "value": "C",
              "text": "C) Ransomware encryption of radio waves"
            },
            {
              "value": "D",
              "text": "D) Overclocking the Wi-Fi router CPU"
            }
          ]
        },
        {
          "id": "q3",
          "label": "3. Certificate Warning Red Flag",
          "prompt": "Why does the browser trigger a severe warning when connecting through the rogue captive portal?",
          "options": [
            {
              "value": "A",
              "text": "A) The captive portal presents a self-signed or invalid SSL certificate not issued by a trusted CA"
            },
            {
              "value": "B",
              "text": "B) The user is typing on a mechanical keyboard"
            },
            {
              "value": "C",
              "text": "C) The laptop battery is below 20%"
            },
            {
              "value": "D",
              "text": "D) The screen brightness is too high"
            }
          ]
        },
        {
          "id": "q4",
          "label": "4. Network Spoofing Vector",
          "prompt": "What protocol manipulation allows the rogue AP to reroute all HTTP requests to its harvest portal?",
          "options": [
            {
              "value": "A",
              "text": "A) Border Gateway Protocol AS-Path poisoning"
            },
            {
              "value": "B",
              "text": "B) DNS Hijacking / Captive Portal DNS redirection to 192.168.1.1"
            },
            {
              "value": "C",
              "text": "C) BGP community tag filtering"
            },
            {
              "value": "D",
              "text": "D) Fiber optic cable splicing"
            }
          ]
        },
        {
          "id": "q5",
          "label": "5. Physical Security Response",
          "prompt": "How does the physical security and SOC team locate and disable the rogue access point?",
          "options": [
            {
              "value": "A",
              "text": "A) Disabling campus email accounts"
            },
            {
              "value": "B",
              "text": "B) Turning off all fluorescent lights"
            },
            {
              "value": "C",
              "text": "C) Triangulating the signal using a wireless spectrum analyzer (Wi-Fi directional antenna) and confiscating the device"
            },
            {
              "value": "D",
              "text": "D) Changing the university website font"
            }
          ]
        }
      ]
    }
  },
  "4": {
    "A": {
      "caseLetter": "A",
      "title": "Station 04 // 10-Min Blackout",
      "subtitle": "Case 4-A: Operation Citadel Lockdown",
      "briefing": "SUDDEN-DEATH GRAND FINALE // BLACKOUT IMMINENT: The threat actor has reached the Domain Controller and scheduled a ransomware wipe across all campus storage arrays. The countdown is running. You must analyze the forensic timeline, detect the canary tripwire breach, and enter the verified Master Exit PIN to disarm the blackout.",
      "timeline": [
        {
          "time": "11:05:12",
          "host": "CAMPUS-EDGE-VPN",
          "process": "sshd",
          "event": "Initial beachhead: Authentication bypass exploiting unpatched CVE in edge gateway",
          "alert": "EXTERNAL INTRUSION"
        },
        {
          "time": "11:14:02",
          "host": "DC01-CORE-SRV",
          "process": "lsass.exe",
          "event": "Memory dump executed via Mimikatz: Domain Admin credentials harvested",
          "alert": "CREDENTIAL THEFT"
        },
        {
          "time": "11:21:40",
          "host": "STORAGE-SAN-01",
          "process": "vssadmin.exe",
          "event": "Volume Shadow Copies deleted: 'vssadmin delete shadows /all /quiet'",
          "alert": "DEFENSE EVASION"
        },
        {
          "time": "11:27:12",
          "host": "FINANCE-TREASURY",
          "process": "db_client.exe",
          "event": "Tripwire Canary Account #9988 credited with illicit $500,000 wire transfer",
          "alert": "TRIPWIRE BREACH"
        },
        {
          "time": "11:29:50",
          "host": "DC01-CORE-SRV",
          "process": "blackout_enc.exe",
          "event": "Ransomware encryption payload armed. Detonation sequence initiated.",
          "alert": "CRITICAL BLACKOUT"
        }
      ],
      "questions": [
        {
          "id": "q1",
          "label": "1. Initial Beachhead Vector",
          "prompt": "At what time and through which service was the initial network perimeter breached?",
          "options": [
            {
              "value": "A",
              "text": "A) 11:21:40 via Storage SAN"
            },
            {
              "value": "B",
              "text": "B) 11:14:02 via lsass.exe"
            },
            {
              "value": "C",
              "text": "C) 11:05:12 via CAMPUS-EDGE-VPN (sshd gateway CVE)"
            },
            {
              "value": "D",
              "text": "D) 11:29:50 via blackout_enc.exe"
            }
          ]
        },
        {
          "id": "q2",
          "label": "2. Credential Theft Mechanism",
          "prompt": "What critical system process on the Domain Controller was targeted at 11:14:02 to dump admin credentials?",
          "options": [
            {
              "value": "A",
              "text": "A) lsass.exe (Local Security Authority Subsystem Service)"
            },
            {
              "value": "B",
              "text": "B) explorer.exe"
            },
            {
              "value": "C",
              "text": "C) svchost.exe"
            },
            {
              "value": "D",
              "text": "D) spoolsv.exe"
            }
          ]
        },
        {
          "id": "q3",
          "label": "3. Anti-Recovery Defense Evasion",
          "prompt": "What destructive command did the adversary execute at 11:21:40 to prevent backup restoration?",
          "options": [
            {
              "value": "A",
              "text": "A) format C: /fs:NTFS"
            },
            {
              "value": "B",
              "text": "B) ipconfig /release"
            },
            {
              "value": "C",
              "text": "C) vssadmin delete shadows /all /quiet (Volume Shadow Copy deletion)"
            },
            {
              "value": "D",
              "text": "D) del *.txt /s"
            }
          ]
        },
        {
          "id": "q4",
          "label": "4. Honeypot Canary Detection",
          "prompt": "Which tripwire canary asset tripped at 11:27:12 confirming financial fraud?",
          "options": [
            {
              "value": "A",
              "text": "A) Cafeteria register #02"
            },
            {
              "value": "B",
              "text": "B) Tripwire Canary Account #9988 credited with illicit transfer"
            },
            {
              "value": "C",
              "text": "C) Library printer toner sensor"
            },
            {
              "value": "D",
              "text": "D) Main gate parking barrier"
            }
          ]
        },
        {
          "id": "q5",
          "label": "5. Master Room Exit PIN",
          "prompt": "Select the verified Room Exit PIN computed from your forensic investigation:",
          "options": [
            {
              "value": "A",
              "text": "A) 18"
            },
            {
              "value": "B",
              "text": "B) 25"
            },
            {
              "value": "C",
              "text": "C) 42"
            },
            {
              "value": "D",
              "text": "D) 89"
            }
          ]
        }
      ]
    },
    "B": {
      "caseLetter": "B",
      "title": "Station 04 // 10-Min Blackout",
      "subtitle": "Case 4-B: The Industrial Power Grid Trip",
      "briefing": "INFRASTRUCTURE ATTACK // POWER OUTAGE THREAT: The campus electrical substation SCADA PLC controller was infiltrated via an unauthorized maintenance session. Circuit breakers controlling cooling pumps have been manipulated.",
      "timeline": [
        {
          "time": "11:08:30",
          "host": "SCADA-GATEWAY",
          "process": "sshd",
          "event": "Rogue maintenance session initiated from unmonitored contractor Wi-Fi",
          "alert": "UNAUTHORIZED ACCESS"
        },
        {
          "time": "11:15:20",
          "host": "SUBSTATION-PLC-02",
          "process": "modbus_cli",
          "event": "Modbus TCP Function 0x05 Write Single Coil executed targeting main bus",
          "alert": "PROTOCOL MANIPULATION"
        },
        {
          "time": "11:23:10",
          "host": "SUBSTATION-PLC-02",
          "process": "modbus_cli",
          "event": "Cooling water pump circuit breakers forcibly opened: Thermal alarms sounding",
          "alert": "CRITICAL FAILURE"
        },
        {
          "time": "11:28:45",
          "host": "SCADA-CANARY",
          "process": "tripwire",
          "event": "Canary SCADA sensor #4421 tripped high-voltage surge alert",
          "alert": "TRIPWIRE DETECTED"
        },
        {
          "time": "11:29:55",
          "host": "POWER-GRID",
          "process": "emergency_trip",
          "event": "Total campus power grid trip countdown armed. Detonation in progress.",
          "alert": "IMMINENT BLACKOUT"
        }
      ],
      "questions": [
        {
          "id": "q1",
          "label": "1. SCADA Infiltration Point",
          "prompt": "From what location and protocol was the initial SCADA maintenance gateway session accessed at 11:08:30?",
          "options": [
            {
              "value": "A",
              "text": "A) Direct satellite uplink"
            },
            {
              "value": "B",
              "text": "B) Rogue SSH session from unmonitored contractor Wi-Fi"
            },
            {
              "value": "C",
              "text": "C) Physical front-panel keypad"
            },
            {
              "value": "D",
              "text": "D) Dial-up modem"
            }
          ]
        },
        {
          "id": "q2",
          "label": "2. Industrial Protocol Abuse",
          "prompt": "What industrial automation protocol function was manipulated to trip the electrical coils?",
          "options": [
            {
              "value": "A",
              "text": "A) Modbus TCP Function 0x05 (Write Single Coil)"
            },
            {
              "value": "B",
              "text": "B) HTTP GET request"
            },
            {
              "value": "C",
              "text": "C) FTP RETR command"
            },
            {
              "value": "D",
              "text": "D) POP3 RETR message"
            }
          ]
        },
        {
          "id": "q3",
          "label": "3. Physical Sabotage Impact",
          "prompt": "What physical disaster did the attacker trigger at 11:23:10 by opening circuit breakers?",
          "options": [
            {
              "value": "A",
              "text": "A) Turning on the campus sprinkler system"
            },
            {
              "value": "B",
              "text": "B) Opening all classroom doors"
            },
            {
              "value": "C",
              "text": "C) Forcibly disabling cooling water pumps causing critical thermal surge"
            },
            {
              "value": "D",
              "text": "D) Changing the digital clocks to midnight"
            }
          ]
        },
        {
          "id": "q4",
          "label": "4. Honeypot Sensor Identification",
          "prompt": "Which tripwire canary sensor triggered at 11:28:45 giving defenders the critical alert?",
          "options": [
            {
              "value": "A",
              "text": "A) Motion sensor #01"
            },
            {
              "value": "B",
              "text": "B) Canary SCADA sensor #4421 (High-voltage surge alert)"
            },
            {
              "value": "C",
              "text": "C) Smoke detector in cafeteria"
            },
            {
              "value": "D",
              "text": "D) Parking lot gate loop"
            }
          ]
        },
        {
          "id": "q5",
          "label": "5. Master Room Exit PIN",
          "prompt": "Select the verified Room Exit PIN computed from your forensic investigation:",
          "options": [
            {
              "value": "A",
              "text": "A) 12"
            },
            {
              "value": "B",
              "text": "B) 34"
            },
            {
              "value": "C",
              "text": "C) 56"
            },
            {
              "value": "D",
              "text": "D) 78"
            }
          ]
        }
      ]
    },
    "C": {
      "caseLetter": "C",
      "title": "Station 04 // 10-Min Blackout",
      "subtitle": "Case 4-C: The Active Directory Domain Controller Wipe",
      "briefing": "CRITICAL IDENTITY DISASTER: The campus Microsoft Active Directory forest is undergoing a destructive wiper payload detonation. The attacker extracted Kerberos ticket-granting tickets and deployed HermeticWiper to destroy partition boot records.",
      "timeline": [
        {
          "time": "11:04:15",
          "host": "CAMPUS-DC01",
          "process": "ldap.exe",
          "event": "BloodHound LDAP enumeration sweep targeting Domain Admins group",
          "alert": "RECONNAISSANCE"
        },
        {
          "time": "11:12:40",
          "host": "CAMPUS-DC01",
          "process": "rubeus.exe",
          "event": "Kerberoasting SPN ticket extraction: Hashcat crack of svc_sql account",
          "alert": "PRIVILEGE ESCALATION"
        },
        {
          "time": "11:20:10",
          "host": "CAMPUS-DC01",
          "process": "schtasks.exe",
          "event": "Scheduled task 'SystemUpdate' created to execute HermeticWiper across all servers",
          "alert": "DESTRUCTIVE WEAPON"
        },
        {
          "time": "11:25:30",
          "host": "CAMPUS-DC01",
          "process": "auth.exe",
          "event": "Honeypot Canary Account 'administrator_backup' logged into by adversary",
          "alert": "HONEYPOT TRIGGERED"
        },
        {
          "time": "11:29:45",
          "host": "CAMPUS-DC01",
          "process": "wiper.exe",
          "event": "Master Boot Record (MBR) overwrite sequence armed. Total domain erasure in 15 seconds.",
          "alert": "IMMINENT BLACKOUT"
        }
      ],
      "questions": [
        {
          "id": "q1",
          "label": "1. Reconnaissance Tooling",
          "prompt": "What Active Directory enumeration tool was executed at 11:04:15 to map domain trust relationships?",
          "options": [
            {
              "value": "A",
              "text": "A) Notepad"
            },
            {
              "value": "B",
              "text": "B) BloodHound / SharpHound LDAP enumeration"
            },
            {
              "value": "C",
              "text": "C) Windows Solitaire"
            },
            {
              "value": "D",
              "text": "D) Excel Macro"
            }
          ]
        },
        {
          "id": "q2",
          "label": "2. Kerberos Exploitation Vector",
          "prompt": "What technique was utilized at 11:12:40 via Rubeus to extract service account ticket hashes?",
          "options": [
            {
              "value": "A",
              "text": "A) Kerberoasting (Requesting Service Principal Name TGS tickets to crack offline)"
            },
            {
              "value": "B",
              "text": "B) SQL Injection into the login page"
            },
            {
              "value": "C",
              "text": "C) Overclocking the RAM"
            },
            {
              "value": "D",
              "text": "D) Sending an ICMP ping packet"
            }
          ]
        },
        {
          "id": "q3",
          "label": "3. Destructive Wiper Architecture",
          "prompt": "What is the primary operational objective of the HermeticWiper payload scheduled at 11:20:10?",
          "options": [
            {
              "value": "A",
              "text": "A) To show a funny desktop meme"
            },
            {
              "value": "B",
              "text": "B) To permanently overwrite Master Boot Records (MBR) and partition tables, rendering systems unbootable"
            },
            {
              "value": "C",
              "text": "C) To clean temporary browser files"
            },
            {
              "value": "D",
              "text": "D) To increase network speed"
            }
          ]
        },
        {
          "id": "q4",
          "label": "4. Canary Account Tripwire",
          "prompt": "Which honeypot credential trap was touched by the attacker at 11:25:30?",
          "options": [
            {
              "value": "A",
              "text": "A) Guest"
            },
            {
              "value": "B",
              "text": "B) Honeypot Canary Account 'administrator_backup'"
            },
            {
              "value": "C",
              "text": "C) DefaultAccount"
            },
            {
              "value": "D",
              "text": "D) Student_01"
            }
          ]
        },
        {
          "id": "q5",
          "label": "5. Master Room Exit PIN",
          "prompt": "Select the verified Room Exit PIN computed from your forensic investigation:",
          "options": [
            {
              "value": "A",
              "text": "A) 31"
            },
            {
              "value": "B",
              "text": "B) 49"
            },
            {
              "value": "C",
              "text": "C) 68"
            },
            {
              "value": "D",
              "text": "D) 95"
            }
          ]
        }
      ]
    },
    "D": {
      "caseLetter": "D",
      "title": "Station 04 // 10-Min Blackout",
      "subtitle": "Case 4-D: The Mass Exfiltration Citadel Protocol",
      "briefing": "DATA PIRACY & EXTORTION: Threat actors have staged 2 Terabytes of proprietary campus research and student records into encrypted multi-volume archives. The final exfiltration siphon is active, coupled with an automated ledger wipe.",
      "timeline": [
        {
          "time": "11:02:10",
          "host": "RESEARCH-VAULT-01",
          "process": "7z.exe",
          "event": "Multi-volume archive created: C:\\Windows\\Temp\\7z_archive.part01 encrypted with AES-256",
          "alert": "DATA STAGING"
        },
        {
          "time": "11:12:00",
          "host": "RESEARCH-VAULT-01",
          "process": "rclone.exe",
          "event": "Rclone multi-threaded cloud exfiltration started over encrypted SSH tunnel",
          "alert": "DATA EXFILTRATION"
        },
        {
          "time": "11:24:20",
          "host": "FINANCE-ERP",
          "process": "sql_exec",
          "event": "Treasury ledger table manipulation: diversion wire transfer routed to offshore IBAN",
          "alert": "FINANCIAL FRAUD"
        },
        {
          "time": "11:28:10",
          "host": "AUDIT-DB",
          "process": "canary_monitor",
          "event": "Canary database record #8872 queried outside authorized business hours",
          "alert": "TRIPWIRE BREACH"
        },
        {
          "time": "11:29:50",
          "host": "CORE-SWITCH-01",
          "process": "wipe_config",
          "event": "Switch firmware wipe scheduled: total blackout of campus fiber in 10 seconds",
          "alert": "IMMINENT BLACKOUT"
        }
      ],
      "questions": [
        {
          "id": "q1",
          "label": "1. Data Staging Mechanism",
          "prompt": "How did the threat actor prepare the massive 2TB research payload for exfiltration at 11:02:10?",
          "options": [
            {
              "value": "A",
              "text": "A) Printing files on paper"
            },
            {
              "value": "B",
              "text": "B) Compressing and encrypting into multi-volume archives (7z_archive.part01) with AES-256"
            },
            {
              "value": "C",
              "text": "C) Emailing individual files one by one"
            },
            {
              "value": "D",
              "text": "D) Changing file names to .txt"
            }
          ]
        },
        {
          "id": "q2",
          "label": "2. Exfiltration Cloud Tool",
          "prompt": "What command-line tool was utilized at 11:12:00 to upload files across multiple cloud storage endpoints?",
          "options": [
            {
              "value": "A",
              "text": "A) Rclone (Cloud storage synchronization tool)"
            },
            {
              "value": "B",
              "text": "B) Internet Explorer 6"
            },
            {
              "value": "C",
              "text": "C) Notepad++"
            },
            {
              "value": "D",
              "text": "D) Windows Media Player"
            }
          ]
        },
        {
          "id": "q3",
          "label": "3. Financial Sabotage Vector",
          "prompt": "What fraudulent activity occurred at 11:24:20 in the Finance ERP system?",
          "options": [
            {
              "value": "A",
              "text": "A) Ordering new coffee cups"
            },
            {
              "value": "B",
              "text": "B) Unauthorized SQL manipulation of treasury ledger tables routing funds to an offshore IBAN"
            },
            {
              "value": "C",
              "text": "C) Printing student grade sheets"
            },
            {
              "value": "D",
              "text": "D) Submitting a routine vacation request"
            }
          ]
        },
        {
          "id": "q4",
          "label": "4. Honeypot Database Detection",
          "prompt": "Which database canary tripwire record triggered the alert at 11:28:10?",
          "options": [
            {
              "value": "A",
              "text": "A) User #0001"
            },
            {
              "value": "B",
              "text": "B) Canary database record #8872 queried outside authorized hours"
            },
            {
              "value": "C",
              "text": "C) Table 'students'"
            },
            {
              "value": "D",
              "text": "D) Index 'prn'"
            }
          ]
        },
        {
          "id": "q5",
          "label": "5. Master Room Exit PIN",
          "prompt": "Select the verified Room Exit PIN computed from your forensic investigation:",
          "options": [
            {
              "value": "A",
              "text": "A) 28"
            },
            {
              "value": "B",
              "text": "B) 61"
            },
            {
              "value": "C",
              "text": "C) 77"
            },
            {
              "value": "D",
              "text": "D) 94"
            }
          ]
        }
      ]
    }
  }
};

window.STATION_CASES = STATION_CASES;
