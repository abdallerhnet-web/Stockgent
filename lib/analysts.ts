// Analyst & market views.
//
// RULE: only add an entry if you have opened the source yourself and the URL works.
// Copy the organization, date, and stated view exactly from that source.
// Never add example or placeholder entries. Never compute a "consensus".
// While this array is empty, the page shows "No sourced analyst views yet."

export type Analyst = {
  organization: string; // e.g. the firm as named in the source
  date: string; // date of the source, e.g. "2026-09-10"
  view: string; // the stated view, in your own words, no buy/sell language
  target?: number; // price target in USD, if the source states one
  reasoning?: string; // short plain-English reason given by the source
  url: string; // real, working link to the original source
};

export const ANALYSTS: Analyst[] = [];
