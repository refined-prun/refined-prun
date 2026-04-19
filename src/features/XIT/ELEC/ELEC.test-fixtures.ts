interface ElectionRowFixture {
  planet: string;
  planetNaturalId: string;
  type: 'GOV' | 'COGC';
  electionStartOffsetMs?: number;
  electionEndOffsetMs?: number;
}

interface ElectionRow {
  planet: string;
  planetNaturalId: string;
  type: 'GOV' | 'COGC';
  electionStart?: number;
  electionEnd?: number;
}

const dayMs = 24 * 60 * 60 * 1000;
const hourMs = 60 * 60 * 1000;
const minuteMs = 60 * 1000;
const secondMs = 1000;

const elecFakeRowOffsets: ElectionRowFixture[] = [
  {
    planet: 'Fake Future (ZZ-001A)',
    planetNaturalId: 'ZZ-001A',
    type: 'GOV',
    electionStartOffsetMs: 2 * dayMs + 3 * hourMs,
    electionEndOffsetMs: 10 * dayMs + 3 * hourMs,
  },
  {
    planet: 'Fake Voting Open (ZZ-002A)',
    planetNaturalId: 'ZZ-002A',
    type: 'GOV',
    electionStartOffsetMs: -(2 * dayMs + 15 * minuteMs),
    electionEndOffsetMs: 5 * dayMs + 23 * hourMs + 45 * minuteMs,
  },
  {
    planet: 'Fake Election Now (ZZ-003A)',
    planetNaturalId: 'ZZ-003A',
    type: 'GOV',
    electionStartOffsetMs: -(8 * dayMs + 30 * secondMs),
    electionEndOffsetMs: -(30 * secondMs),
  },
  {
    planet: 'Fake COGC Voting Open (ZZ-004A)',
    planetNaturalId: 'ZZ-004A',
    type: 'COGC',
    electionStartOffsetMs: -(3 * dayMs),
    electionEndOffsetMs: 4 * dayMs,
  },
  {
    planet: 'Fake Missing Data (ZZ-005A)',
    planetNaturalId: 'ZZ-005A',
    type: 'COGC',
  },
];

// Temporary UI test fixtures.
export const elecFakeRows = (now: number): ElectionRow[] => {
  return elecFakeRowOffsets.map(x => ({
    planet: x.planet,
    planetNaturalId: x.planetNaturalId,
    type: x.type,
    electionStart:
      x.electionStartOffsetMs === undefined ? undefined : now + x.electionStartOffsetMs,
    electionEnd: x.electionEndOffsetMs === undefined ? undefined : now + x.electionEndOffsetMs,
  }));
};
