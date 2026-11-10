import type { FigureId } from "../ids.ts";
import { deepFreeze } from "./content.ts";

/** What a ranked life must show at its end to be eligible to mint as a historical figure. */
export interface FigureRequirement {
  figure: FigureId;
  title: string;
  summary: string;
  supplyCap: number;
  origins?: string[];
  jobsAny?: string[];
  minSkills?: Record<string, number>;
  minStats?: Record<string, number>;
  accomplishmentsAny?: string[];
  maxAgeAtAccomplishment?: number;
}

export const FIGURE_SUPPLY_CAP = 5;

/**
 * Thresholds sit above every job's entry requirement so only a deliberate,
 * well-played run reaches them. Ids reference worlds/alexandria-0.33.0.json.
 */
const FIGURE_LIST: FigureRequirement[] = [
  {
    figure: "alexander",
    title: "Alexander, the conqueror",
    summary: "Born to royal kin, a commander who reached the rank of general and earned a recorded military distinction while still young.",
    supplyCap: FIGURE_SUPPLY_CAP,
    origins: ["royal-household"],
    jobsAny: ["general"],
    minSkills: { warfare: 60, oratory: 35 },
    accomplishmentsAny: ["military-first-work", "military-prestige"],
    maxAgeAtAccomplishment: 32,
  },
  {
    figure: "aristotle",
    title: "Aristotle, the philosopher",
    summary: "A widely read teacher of argument who tutored students or advised the court and left a remembered philosophical work.",
    supplyCap: FIGURE_SUPPLY_CAP,
    jobsAny: ["philosophy-tutor", "court-adviser"],
    minSkills: { literacy: 55, philosophy: 50 },
    minStats: { knowledge: 45 },
    accomplishmentsAny: ["philosophy-first-work", "philosophy-prestige"],
  },
  {
    figure: "euclid",
    title: "Euclid, the geometer",
    summary: "A careful reckoner and reader who worked among tables and demonstrations and left a credited piece of scholarship.",
    supplyCap: FIGURE_SUPPLY_CAP,
    jobsAny: ["sky-table-calculator", "patron-supported-reader", "philosophy-tutor"],
    minSkills: { reckoning: 55, literacy: 50 },
    minStats: { knowledge: 45 },
    accomplishmentsAny: ["astronomy-calendar-first-work", "astronomy-calendar-prestige", "philosophy-prestige"],
  },
  {
    figure: "cleomenes",
    title: "Cleomenes of Naucratis, the grain administrator",
    summary: "A trader or court official with a head for accounts who grew rich and closed recorded commercial agreements.",
    supplyCap: FIGURE_SUPPLY_CAP,
    jobsAny: ["court-adviser", "shopkeeper"],
    minSkills: { reckoning: 50 },
    minStats: { wealth: 60 },
    accomplishmentsAny: ["commerce-first-work", "commerce-prestige"],
  },
];

export const FIGURES: readonly FigureRequirement[] = deepFreeze(FIGURE_LIST);
