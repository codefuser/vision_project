const { searchSongs, buildSearchIndex } = require('./src/lib/songs/search.ts');

const testSongs = [
  {
    id: 1,
    title: "உம்பரிலும் அம்பரிலும் உயர்ந்தவரே",
    titleStem: "mprl mprl yrntvr",
    slides: [
      "உம்பரிலும் அம்பரிலும் உயர்ந்தவரே\nஉமக்கே எங்கள் ஆராதனை\nதேவாதி தேவனை துதியுங்கள்"
    ],
    content: "உம்பரிலும் அம்பரிலும் உயர்ந்தவரே"
  },
  {
    id: 2,
    title: "என் தேவா உம்மை நான் ஆராதனை",
    titleStem: "n tv m nn rtn",
    slides: [
      "என் தேவா உம்மை நான் ஆனந்தமாய் பாடுவேன்\nஆஹா ஆஹா\nஆராதனை அன்பின் ஆராதனை"
    ],
    content: "என் தேவா உம்மை நான் ஆனந்தமாய் பாடுவேன்"
  }
];

const variants = [
  "umbara",
  "ambara",
  "umbarah",
  "umbra",
  "ummbara",
  "umba",
  "ambaraa"
];

console.log("=== TESTING SEARCH VARIANTS ===");
for (const v of variants) {
  const hits = searchSongs(v, testSongs);
  console.log(`Query: '${v}' -> Top hit:`, hits[0] ? `'${hits[0].song.title}' (Score: ${hits[0].score})` : 'NO HIT');
}
