const THEMES: BuildOpts[] = [
  {
    id: "morning-light", name: "Morning Light",
    bg: "#f9d423",
    gradient: `radial-gradient(circle at 10% 20%, rgb(255, 200, 124) 0%, rgb(252, 251, 121) 90%)`,
    category: "Worship", mood: "vibrant",
    tags: ['morning', 'sunrise', 'golden', 'warm'],
    shadow: "deep"
  },
  {
    id: "sunrise", name: "Sunrise",
    bg: "#f83600",
    gradient: `linear-gradient(109.6deg, rgb(255, 207, 84) 11.2%, rgb(255, 158, 27) 91.1%)`,
    category: "Worship", mood: "vibrant",
    tags: ['sunrise', 'dawn', 'orange', 'dramatic'],
    shadow: "deep"
  },
  {
    id: "sunset", name: "Sunset",
    bg: "#fa709a",
    gradient: `linear-gradient(109.6deg, rgb(253, 199, 141) 11.3%, rgb(249, 143, 253) 100.2%)`,
    category: "Worship", mood: "vibrant",
    tags: ['sunset', 'dusk', 'pink', 'warm'],
    shadow: "deep"
  },
  {
    id: "ocean", name: "Ocean",
    bg: "#00c6ff",
    gradient: `radial-gradient(circle at 10% 20%, rgb(0, 107, 141) 0%, rgb(0, 219, 216) 90%)`,
    category: "Worship", mood: "vibrant",
    tags: ['ocean', 'sea', 'blue', 'water'],
    shadow: "deep"
  },
  {
    id: "forest", name: "Forest",
    bg: "#11998e",
    gradient: `linear-gradient(109.6deg, rgb(20, 230, 164) 11.2%, rgb(18, 128, 93) 91.1%)`,
    category: "Bible", mood: "vibrant",
    tags: ['forest', 'green', 'nature'],
    shadow: "deep"
  },
  {
    id: "aurora", name: "Aurora",
    bg: "#8E2DE2",
    gradient: `radial-gradient(circle at 50% 50%, rgb(148, 59, 236) 0%, rgb(50, 10, 144) 100.2%)`,
    category: "Worship", mood: "vibrant",
    tags: ['aurora', 'purple', 'ethereal'],
    shadow: "deep"
  },
  {
    id: "galaxy", name: "Galaxy",
    bg: "#cc2b5e",
    gradient: `radial-gradient(circle at 10% 20%, rgb(222, 63, 110) 0%, rgb(114, 25, 126) 90%)`,
    category: "Worship", mood: "vibrant",
    tags: ['galaxy', 'space', 'pink'],
    shadow: "deep"
  },
  {
    id: "royal-purple", name: "Royal Purple",
    bg: "#654ea3",
    gradient: `linear-gradient(to right, rgb(151, 149, 240) 0%, rgb(251, 200, 212) 100%)`,
    category: "Worship", mood: "vibrant",
    tags: ['royal', 'purple', 'premium'],
    shadow: "deep"
  },
  {
    id: "royal-blue", name: "Royal Blue",
    bg: "#2193b0",
    gradient: `linear-gradient(109.6deg, rgb(33, 147, 176) 11.2%, rgb(109, 213, 237) 91.1%)`,
    category: "Worship", mood: "vibrant",
    tags: ['royal', 'blue', 'premium'],
    shadow: "deep"
  },
  {
    id: "royal-green", name: "Royal Green",
    bg: "#02aab0",
    gradient: `linear-gradient(109.6deg, rgb(2, 170, 176) 11.2%, rgb(0, 205, 172) 91.1%)`,
    category: "Worship", mood: "vibrant",
    tags: ['royal', 'green', 'premium'],
    shadow: "deep"
  },
  {
    id: "royal-gold", name: "Royal Gold",
    bg: "#ffb347",
    gradient: `radial-gradient(circle at 10% 20%, rgb(255, 200, 124) 0%, rgb(252, 251, 121) 90%)`,
    category: "Worship", mood: "vibrant",
    tags: ['royal', 'gold', 'shimmer'],
    shadow: "deep"
  },
  {
    id: "emerald", name: "Emerald",
    bg: "#348F50",
    gradient: `linear-gradient(109.6deg, rgb(52, 143, 80) 11.2%, rgb(86, 180, 211) 91.1%)`,
    category: "Specialty", mood: "vibrant",
    tags: ['emerald', 'gem', 'green'],
    shadow: "deep"
  },
  {
    id: "sapphire", name: "Sapphire",
    bg: "#1cb5e0",
    gradient: `radial-gradient(circle at 10% 20%, rgb(0, 0, 70) 0%, rgb(28, 181, 224) 90%)`,
    category: "Specialty", mood: "vibrant",
    tags: ['sapphire', 'gem', 'blue'],
    shadow: "deep"
  },
  {
    id: "ruby", name: "Ruby",
    bg: "#e52d27",
    gradient: `linear-gradient(109.6deg, rgb(229, 45, 39) 11.2%, rgb(179, 18, 23) 91.1%)`,
    category: "Specialty", mood: "vibrant",
    tags: ['ruby', 'gem', 'red'],
    shadow: "deep"
  },
  {
    id: "rose", name: "Rose",
    bg: "#ff7eb3",
    gradient: `linear-gradient(109.6deg, rgb(255, 126, 179) 11.2%, rgb(255, 117, 140) 91.1%)`,
    category: "Bible", mood: "vibrant",
    tags: ['rose', 'pink', 'delicate'],
    shadow: "deep"
  },
  {
    id: "copper", name: "Copper",
    bg: "#e65c00",
    gradient: `linear-gradient(109.6deg, rgb(230, 92, 0) 11.2%, rgb(249, 212, 35) 91.1%)`,
    category: "Specialty", mood: "vibrant",
    tags: ['copper', 'orange', 'metal'],
    shadow: "deep"
  },
  {
    id: "silver", name: "Silver",
    bg: "#bdc3c7",
    gradient: `radial-gradient(circle at 10% 20%, rgb(189, 195, 199) 0%, rgb(44, 62, 80) 90%)`,
    category: "Modern", mood: "cool",
    tags: ['silver', 'gray', 'metal'],
    shadow: "deep"
  },
  {
    id: "graphite", name: "Graphite",
    bg: "#2b5876",
    gradient: `linear-gradient(109.6deg, rgb(43, 88, 118) 11.2%, rgb(78, 67, 118) 91.1%)`,
    category: "Modern", mood: "dark",
    tags: ['graphite', 'dark', 'neutral'],
    shadow: "deep"
  },
  {
    id: "midnight", name: "Midnight",
    bg: "#314755",
    gradient: `radial-gradient(circle at 10% 20%, rgb(49, 71, 85) 0%, rgb(38, 160, 218) 90%)`,
    category: "Events", mood: "vibrant",
    tags: ['midnight', 'navy', 'night'],
    shadow: "deep"
  },
  {
    id: "carbon", name: "Carbon",
    bg: "#141E30",
    gradient: `linear-gradient(109.6deg, rgb(20, 30, 48) 11.2%, rgb(36, 59, 85) 91.1%)`,
    category: "Modern", mood: "dark",
    tags: ['carbon', 'black', 'minimal'],
    shadow: "deep"
  },
  {
    id: "obsidian", name: "Obsidian",
    bg: "#000000",
    gradient: `radial-gradient(circle at 10% 20%, rgb(67, 67, 67) 0%, rgb(0, 0, 0) 90%)`,
    category: "Modern", mood: "dark",
    tags: ['obsidian', 'black', 'pure'],
    shadow: "deep"
  },
  {
    id: "pearl", name: "Pearl",
    bg: "#70e1f5",
    gradient: `linear-gradient(109.6deg, rgb(112, 225, 245) 11.2%, rgb(255, 209, 148) 91.1%)`,
    category: "Modern", mood: "vibrant",
    tags: ['pearl', 'cyan', 'warm'],
    shadow: "deep"
  },
  {
    id: "ivory", name: "Ivory",
    bg: "#00c6ff",
    gradient: `radial-gradient(circle at 10% 20%, rgb(0, 198, 255) 0%, rgb(0, 114, 255) 90%)`,
    category: "Modern", mood: "vibrant",
    tags: ['ivory', 'blue', 'radial'],
    shadow: "deep"
  },
  {
    id: "champagne", name: "Champagne",
    bg: "#f6d365",
    gradient: `linear-gradient(109.6deg, rgb(246, 211, 101) 11.2%, rgb(253, 160, 133) 91.1%)`,
    category: "Modern", mood: "vibrant",
    tags: ['champagne', 'orange', 'warm'],
    shadow: "deep"
  },
  {
    id: "wine", name: "Wine",
    bg: "#b224ef",
    gradient: `radial-gradient(circle at 10% 20%, rgb(178, 36, 239) 0%, rgb(117, 121, 255) 90%)`,
    category: "Specialty", mood: "vibrant",
    tags: ['wine', 'purple', 'rich'],
    shadow: "deep"
  },
  {
    id: "lavender", name: "Lavender",
    bg: "#c471f5",
    gradient: `linear-gradient(109.6deg, rgb(196, 113, 245) 11.2%, rgb(250, 113, 205) 91.1%)`,
    category: "Prayer", mood: "vibrant",
    tags: ['lavender', 'pink', 'gentle'],
    shadow: "deep"
  },
  {
    id: "sky", name: "Sky",
    bg: "#4facfe",
    gradient: `radial-gradient(circle at 10% 20%, rgb(79, 172, 254) 0%, rgb(0, 242, 254) 90%)`,
    category: "Prayer", mood: "vibrant",
    tags: ['sky', 'blue', 'peaceful'],
    shadow: "deep"
  },
  {
    id: "rain", name: "Rain",
    bg: "#43e97b",
    gradient: `linear-gradient(109.6deg, rgb(67, 233, 123) 11.2%, rgb(56, 249, 215) 91.1%)`,
    category: "Events", mood: "vibrant",
    tags: ['rain', 'green', 'fresh'],
    shadow: "deep"
  },
  {
    id: "cloud", name: "Cloud",
    bg: "#89f7fe",
    gradient: `radial-gradient(circle at 10% 20%, rgb(137, 247, 254) 0%, rgb(102, 166, 255) 90%)`,
    category: "Minimal", mood: "vibrant",
    tags: ['cloud', 'blue', 'clean'],
    shadow: "deep"
  },
  {
    id: "twilight", name: "Twilight",
    bg: "#6a11cb",
    gradient: `linear-gradient(109.6deg, rgb(106, 17, 203) 11.2%, rgb(37, 117, 252) 91.1%)`,
    category: "Worship", mood: "vibrant",
    tags: ['twilight', 'purple', 'blue'],
    shadow: "deep"
  },
  {
    id: "velvet", name: "Velvet",
    bg: "#f78ca0",
    gradient: `linear-gradient(109.6deg, rgb(247, 140, 160) 11.2%, rgb(249, 116, 143) 42.9%, rgb(253, 134, 140) 71.5%, rgb(254, 154, 139) 100.2%)`,
    category: "Specialty", mood: "vibrant",
    tags: ['velvet', 'rich', 'pink'],
    shadow: "deep"
  },
  {
    id: "minimal-black", name: "Minimal Black",
    bg: "#000000",
    gradient: `#000000`,
    category: "Minimal", mood: "dark",
    tags: ['minimal', 'black', 'pure'],
    shadow: "deep"
  },
  {
    id: "minimal-white", name: "Minimal White",
    bg: "#ffffff",
    gradient: `#ffffff`,
    category: "Minimal", mood: "light",
    tags: ['minimal', 'white', 'pure'],
    shadow: "deep"
  },
  {
    id: "modern-navy", name: "Modern Navy",
    bg: "#a18cd1",
    gradient: `linear-gradient(109.6deg, rgb(161, 140, 209) 11.2%, rgb(251, 194, 235) 91.1%)`,
    category: "Modern", mood: "vibrant",
    tags: ['navy', 'modern', 'pink'],
    shadow: "deep"
  },
  {
    id: "deep-ocean", name: "Deep Ocean",
    bg: "#ff0844",
    gradient: `radial-gradient(circle at 10% 20%, rgb(255, 8, 68) 0%, rgb(255, 177, 153) 90%)`,
    category: "Modern", mood: "vibrant",
    tags: ['ocean', 'deep', 'red'],
    shadow: "deep"
  },
  {
    id: "dark-purple", name: "Dark Purple",
    bg: "#93a5cf",
    gradient: `linear-gradient(109.6deg, rgb(147, 165, 207) 11.2%, rgb(228, 239, 233) 91.1%)`,
    category: "Modern", mood: "vibrant",
    tags: ['purple', 'dark', 'moody'],
    shadow: "deep"
  },
  {
    id: "warm-sand", name: "Warm Sand",
    bg: "#43e97b",
    gradient: `radial-gradient(circle at 10% 20%, rgb(67, 233, 123) 0%, rgb(56, 249, 215) 90%)`,
    category: "Prayer", mood: "vibrant",
    tags: ['sand', 'warm', 'green'],
    shadow: "deep"
  },
  {
    id: "golden-light", name: "Golden Light",
    bg: "#f83600",
    gradient: `linear-gradient(109.6deg, rgb(248, 54, 0) 11.2%, rgb(249, 212, 35) 91.1%)`,
    category: "Worship", mood: "vibrant",
    tags: ['golden', 'light', 'warm'],
    shadow: "deep"
  },
  {
    id: "cool-blue", name: "Cool Blue",
    bg: "#00c6fb",
    gradient: `radial-gradient(circle at 10% 20%, rgb(0, 198, 251) 0%, rgb(0, 91, 234) 90%)`,
    category: "Prayer", mood: "vibrant",
    tags: ['blue', 'cool', 'fresh'],
    shadow: "deep"
  },
  {
    id: "soft-pink", name: "Soft Pink",
    bg: "#ff9a9e",
    gradient: `linear-gradient(109.6deg, rgb(255, 154, 158) 11.2%, rgb(254, 207, 239) 91.1%)`,
    category: "Prayer", mood: "vibrant",
    tags: ['pink', 'soft', 'gentle'],
    shadow: "deep"
  },
  {
    id: "pastel-green", name: "Pastel Green",
    bg: "#a1c4fd",
    gradient: `radial-gradient(circle at 10% 20%, rgb(161, 196, 253) 0%, rgb(194, 233, 251) 90%)`,
    category: "Prayer", mood: "vibrant",
    tags: ['green', 'pastel', 'blue'],
    shadow: "deep"
  },
  {
    id: "steel", name: "Steel",
    bg: "#667eea",
    gradient: `linear-gradient(109.6deg, rgb(102, 126, 234) 11.2%, rgb(118, 75, 162) 91.1%)`,
    category: "Modern", mood: "vibrant",
    tags: ['steel', 'purple', 'cool'],
    shadow: "deep"
  },
  {
    id: "electric-blue", name: "Electric Blue",
    bg: "#89f7fe",
    gradient: `radial-gradient(circle at 10% 20%, rgb(137, 247, 254) 0%, rgb(102, 166, 255) 90%)`,
    category: "Events", mood: "vibrant",
    tags: ['electric', 'blue', 'cyan'],
    shadow: "deep"
  },
  {
    id: "crimson", name: "Crimson",
    bg: "#ff0844",
    gradient: `linear-gradient(109.6deg, rgb(255, 8, 68) 11.2%, rgb(255, 177, 153) 91.1%)`,
    category: "Events", mood: "vibrant",
    tags: ['crimson', 'red', 'bold'],
    shadow: "deep"
  },
  {
    id: "olive", name: "Olive",
    bg: "#cd9cf2",
    gradient: `radial-gradient(circle at 10% 20%, rgb(205, 156, 242) 0%, rgb(246, 243, 255) 90%)`,
    category: "Specialty", mood: "vibrant",
    tags: ['olive', 'purple', 'natural'],
    shadow: "deep"
  },
  {
    id: "chocolate", name: "Chocolate",
    bg: "#f6d365",
    gradient: `linear-gradient(109.6deg, rgb(246, 211, 101) 11.2%, rgb(253, 160, 133) 91.1%)`,
    category: "Specialty", mood: "vibrant",
    tags: ['chocolate', 'orange', 'warm'],
    shadow: "deep"
  },
  {
    id: "indigo", name: "Indigo",
    bg: "#c471f5",
    gradient: `radial-gradient(circle at 10% 20%, rgb(196, 113, 245) 0%, rgb(250, 113, 205) 90%)`,
    category: "Specialty", mood: "vibrant",
    tags: ['indigo', 'purple', 'deep'],
    shadow: "deep"
  },
  {
    id: "arctic", name: "Arctic",
    bg: "#4facfe",
    gradient: `linear-gradient(109.6deg, rgb(79, 172, 254) 11.2%, rgb(0, 242, 254) 91.1%)`,
    category: "Specialty", mood: "vibrant",
    tags: ['arctic', 'ice', 'frost'],
    shadow: "deep"
  },
  {
    id: "stone", name: "Stone",
    bg: "#43e97b",
    gradient: `radial-gradient(circle at 10% 20%, rgb(67, 233, 123) 0%, rgb(56, 249, 215) 90%)`,
    category: "Minimal", mood: "vibrant",
    tags: ['stone', 'green', 'neutral'],
    shadow: "deep"
  },
  {
    id: "smoke", name: "Smoke",
    bg: "#8E2DE2",
    gradient: `linear-gradient(109.6deg, rgb(142, 45, 226) 11.2%, rgb(74, 0, 224) 91.1%)`,
    category: "Modern", mood: "vibrant",
    tags: ['smoke', 'purple', 'moody'],
    shadow: "deep"
  },
];
