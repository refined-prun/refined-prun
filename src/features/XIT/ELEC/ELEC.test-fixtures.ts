interface ElectionRowFixture {
  planet: string;
  planetNaturalId: string;
  electionStartOffsetMs?: number;
  electionEndOffsetMs?: number;
}

interface ElectionRow {
  planet: string;
  planetNaturalId: string;
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
    electionStartOffsetMs: 2 * dayMs + 3 * hourMs,
    electionEndOffsetMs: 10 * dayMs + 2 * hourMs,
  },
  {
    planet: 'Fake Voting Open (ZZ-002A)',
    planetNaturalId: 'ZZ-002A',
    electionStartOffsetMs: -(2 * hourMs + 15 * minuteMs),
    electionEndOffsetMs: 7 * dayMs + hourMs,
  },
  {
    planet: 'Fake Election Now (ZZ-003A)',
    planetNaturalId: 'ZZ-003A',
    electionStartOffsetMs: -(8 * dayMs),
    electionEndOffsetMs: -(30 * secondMs),
  },
  {
    planet: 'Fake Missing Data (ZZ-004A)',
    planetNaturalId: 'ZZ-004A',
  },
];

// Temporary UI test fixtures.
export const elecFakeRows = (now: number): ElectionRow[] => {
  return elecFakeRowOffsets.map(x => ({
    planet: x.planet,
    planetNaturalId: x.planetNaturalId,
    electionStart:
      x.electionStartOffsetMs === undefined ? undefined : now + x.electionStartOffsetMs,
    electionEnd: x.electionEndOffsetMs === undefined ? undefined : now + x.electionEndOffsetMs,
  }));
};
