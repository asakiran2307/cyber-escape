/**
 * BLACKOUT PROTOCOL: Cryptographic Engine & PRN Deterministic Auto-Assigner
 * 1. Hashes and validates all 16 station cases (4 cases x 4 stations).
 * 2. Deterministically assigns the student's unique combination of 4 station sets
 *    directly from their PRN Number (zero user manual selection).
 */

const CryptoEngine = (function () {
  const SALT = "BLACKOUT_SOC_SALT_9981_";

  function sha256Sync(ascii) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    const lengthProperty = "length";
    let i, j;
    let result = "";

    const words = [];
    const asciiBitLength = ascii[lengthProperty] * 8;

    let hash = (sha256Sync.h = sha256Sync.h || []);
    const k = (sha256Sync.k = sha256Sync.k || []);
    let primeCounter = k[lengthProperty];

    const isComposite = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 300; i += candidate) {
          isComposite[i] = candidate;
        }
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }

    ascii += "\x80";
    while ((ascii[lengthProperty] % 64) - 56) ascii += "\x00";
    for (i = 0; i < ascii[lengthProperty]; i++) {
      j = ascii.charCodeAt(i);
      if (j >> 8) return;
      words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
    words[words[lengthProperty]] = asciiBitLength;

    for (j = 0; j < words[lengthProperty]; ) {
      const w = words.slice(j, (j += 16));
      const oldHash = hash;
      hash = hash.slice(0, 8);

      for (i = 0; i < 64; i++) {
        const w15 = w[i - 15],
          w2 = w[i - 2];
        const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
        const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
        w[i] = i < 16 ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0;

        const s1_h = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
        const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
        const temp1 = (hash[7] + s1_h + ch + k[i] + w[i]) | 0;
        const s0_h = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
        const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
        const temp2 = (s0_h + maj) | 0;

        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
      }

      for (i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }

    for (i = 0; i < 8; i++) {
      for (let b = 3; b >= 0; b--) {
        const byte = (hash[i] >> (b * 8)) & 255;
        result += (byte < 16 ? "0" : "") + byte.toString(16);
      }
    }
    return result;
  }

  function hashInput(val) {
    const sanitized = String(val).trim().toUpperCase();
    return sha256Sync(SALT + sanitized);
  }

  /**
   * Complete Solution Hashes for all 16 Station Cases (4 stations x 4 cases)
   */
  const STATION_SOLUTIONS = {
    // Station 1: The Spoofed Origin
    1: {
      A: { q1: hashInput("C"), q2: hashInput("B"), q3: hashInput("C") },
      B: { q1: hashInput("B"), q2: hashInput("A"), q3: hashInput("B") },
      C: { q1: hashInput("A"), q2: hashInput("A"), q3: hashInput("B") },
      D: { q1: hashInput("B"), q2: hashInput("A"), q3: hashInput("A") }
    },
    // Station 2: The Digital Shadow
    2: {
      A: { q1: hashInput("B"), q2: hashInput("B"), q3: hashInput("C") },
      B: { q1: hashInput("B"), q2: hashInput("A") },
      C: { q1: hashInput("B"), q2: hashInput("A") },
      D: { q1: hashInput("B"), q2: hashInput("A") }
    },
    // Station 3: The Domain Mirage
    3: {
      A: { q1: hashInput("B"), q2: hashInput("C"), q3: hashInput("C") },
      B: { q1: hashInput("A"), q2: hashInput("B"), q3: hashInput("A") },
      C: { q1: hashInput("A"), q2: hashInput("A"), q3: hashInput("A") },
      D: { q1: hashInput("C"), q2: hashInput("A"), q3: hashInput("A") }
    },
    // Station 4: The 10-Minute Blackout
    4: {
      A: { q1: hashInput("C"), q2: hashInput("A"), q3: hashInput("C"), q4: hashInput("B") }, // Exit PIN: 25
      B: { q1: hashInput("B"), q2: hashInput("A"), q3: hashInput("C"), q4: hashInput("B") }, // Exit PIN: 34
      C: { q1: hashInput("B"), q2: hashInput("A"), q3: hashInput("B"), q4: hashInput("B") }, // Exit PIN: 49
      D: { q1: hashInput("B"), q2: hashInput("A"), q3: hashInput("B"), q4: hashInput("B") }  // Exit PIN: 61
    }
  };

  /**
   * Deterministic PRN Assignment Engine:
   * Maps a PRN (e.g. 2024010529 or CS-8821) into a unique case combination across all 4 stations.
   * Guarantees the same PRN always gets the exact same cases, with zero user selection.
   */
  function deriveSetsFromPRN(prnString) {
    const cleanPrn = String(prnString).trim().toUpperCase();
    let numHash = 0;
    for (let i = 0; i < cleanPrn.length; i++) {
      numHash = (numHash * 31 + cleanPrn.charCodeAt(i)) & 0x7fffffff;
    }

    const letters = ["A", "B", "C", "D"];
    const s1 = letters[numHash % 4];
    const s2 = letters[Math.floor(numHash / 4) % 4];
    const s3 = letters[Math.floor(numHash / 16) % 4];
    const s4 = letters[Math.floor(numHash / 64) % 4];

    return {
      sets: {
        1: s1,
        2: s2,
        3: s3,
        4: s4
      },
      codeProfile: `CASE-${s1}${s2}${s3}${s4}`
    };
  }

  return {
    hash: hashInput,
    deriveSetsFromPRN: deriveSetsFromPRN,
    verifyAdmin: function (passcode) {
      const p = String(passcode || "").trim().toUpperCase();
      return p === "CYBER-ADMIN-2026" || p === "ADMIN" || p === "ADMIN2026" || p === "ADMIN@2026";
    },
    verifyStationMCQ: function (stationNum, caseLetter, questionId, userValue) {
      const station = STATION_SOLUTIONS[stationNum];
      if (!station) return false;
      const caseSet = station[caseLetter];
      if (!caseSet || !caseSet[questionId]) return false;
      return hashInput(userValue) === caseSet[questionId];
    }
  };
})();

window.CryptoEngine = CryptoEngine;
