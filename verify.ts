import * as dotenv from "dotenv";
dotenv.config();

// @ts-ignore
globalThis.import = { meta: { env: process.env } };

import { loadSongs } from './src/lib/songs/loader.js';
import { searchSongs } from './src/lib/songs/search.js';
import { loadBible } from './src/lib/bible/loader.js';
import { search } from './src/lib/bible/search.js';
import { useBibleStore } from './src/lib/bible/store.js';

async function verify() {
  try {
    console.log("Loading songs...");
    const songs = await loadSongs();
    console.log("Searching for 'kaneer'...");
    const songResults = searchSongs("kaneer", songs);
    console.log("Song results:", songResults.length > 0 ? "SUCCESS" : "FAIL");

    console.log("Loading tamil bible...");
    const taData = await loadBible("ta");
    console.log("Searching for 'தேவன்'...");
    const taResults = search("தேவன்", taData, "ta");
    console.log("Tamil Bible results:", taResults.length > 0 ? "SUCCESS" : "FAIL");
    
    console.log("Loading english bible...");
    const enData = await loadBible("en");
    console.log("Searching for 'God'...");
    const enResults = search("God", enData, "en");
    console.log("English Bible results:", enResults.length > 0 ? "SUCCESS" : "FAIL");
    
  } catch (e) {
    console.error(e);
  }
}

verify();
