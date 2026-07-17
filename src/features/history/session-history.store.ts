/**
 * Session History Store (Zustand)
 *
 * Manages UI state for the Session History feature:
 *  - Active session ID (the one currently recording)
 *  - Loaded sessions list + pagination
 *  - Search query and date filter
 *
 * Persistence: the activeSessionId is kept in localStorage so the recorder
 * can recover if the tab is refreshed without a full beforeunload.
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SessionRecord, SessionEventRecord } from "@/db/schema";
import {
  listSessions,
  getSession,
  getSessionEvents,
  searchSessions,
  searchSessionEvents,
  countSessions,
  dateRangeForFilter,
} from "./session-history.repo";

export type HistoryDateFilter =
  | "all"
  | "today"
  | "yesterday"
  | "last7"
  | "last30"
  | "thisMonth"
  | "thisYear";

interface SessionHistoryState {
  // ── Active recording ──────────────────────────────────────────────────────
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;

  // ── Session list ──────────────────────────────────────────────────────────
  sessions: SessionRecord[];
  totalSessions: number;
  isLoadingSessions: boolean;
  sessionListPage: number;
  searchQuery: string;
  dateFilter: HistoryDateFilter;

  loadSessions: () => Promise<void>;
  loadMoreSessions: () => Promise<void>;
  setSearchQuery: (q: string) => void;
  setDateFilter: (f: HistoryDateFilter) => void;
  refreshSessions: () => Promise<void>;

  // ── Session detail ────────────────────────────────────────────────────────
  openSession: SessionRecord | null;
  openSessionEvents: SessionEventRecord[];
  isLoadingDetail: boolean;
  detailSearchQuery: string;

  openSessionById: (id: string) => Promise<void>;
  setDetailSearchQuery: (q: string) => void;
  refreshDetail: () => Promise<void>;
  closeSession: () => void;

  // ── Hydration ─────────────────────────────────────────────────────────────
  _hydrated: boolean;
}

const PAGE_SIZE = 30;

export const useSessionHistory = create<SessionHistoryState>()(
  persist(
    (set, get) => ({
      // ── Active session ──────────────────────────────────────────────────
      activeSessionId: null,
      setActiveSessionId: (id) => set({ activeSessionId: id }),

      // ── Session list ────────────────────────────────────────────────────
      sessions: [],
      totalSessions: 0,
      isLoadingSessions: false,
      sessionListPage: 0,
      searchQuery: "",
      dateFilter: "all",

      loadSessions: async () => {
        set({ isLoadingSessions: true, sessionListPage: 0 });
        try {
          const { searchQuery, dateFilter } = get();
          const [total, sessions] = await Promise.all([
            countSessions(),
            searchQuery
              ? searchSessions(searchQuery, PAGE_SIZE)
              : listSessions({
                  limit: PAGE_SIZE,
                  offset: 0,
                  ...(dateFilter !== "all"
                    ? dateRangeForFilter(
                        dateFilter as Exclude<HistoryDateFilter, "all">,
                      )
                    : {}),
                }),
          ]);
          set({ sessions, totalSessions: total, sessionListPage: 0 });
        } finally {
          set({ isLoadingSessions: false });
        }
      },

      loadMoreSessions: async () => {
        const { sessionListPage, searchQuery, dateFilter, sessions } = get();
        const nextPage = sessionListPage + 1;
        const offset = nextPage * PAGE_SIZE;

        const more = searchQuery
          ? await searchSessions(searchQuery, PAGE_SIZE)
          : await listSessions({
              limit: PAGE_SIZE,
              offset,
              ...(dateFilter !== "all"
                ? dateRangeForFilter(
                    dateFilter as Exclude<HistoryDateFilter, "all">,
                  )
                : {}),
            });

        set({
          sessions: [...sessions, ...more],
          sessionListPage: nextPage,
        });
      },

      setSearchQuery: (q) => {
        set({ searchQuery: q });
        void get().loadSessions();
      },

      setDateFilter: (f) => {
        set({ dateFilter: f });
        void get().loadSessions();
      },

      refreshSessions: async () => {
        await get().loadSessions();
      },

      // ── Session detail ──────────────────────────────────────────────────
      openSession: null,
      openSessionEvents: [],
      isLoadingDetail: false,
      detailSearchQuery: "",

      openSessionById: async (id) => {
        set({ isLoadingDetail: true, openSession: null, openSessionEvents: [] });
        try {
          const [session, events] = await Promise.all([
            getSession(id),
            getSessionEvents(id),
          ]);
          set({
            openSession: session ?? null,
            openSessionEvents: events,
            detailSearchQuery: "",
          });
        } finally {
          set({ isLoadingDetail: false });
        }
      },

      setDetailSearchQuery: async (q) => {
        set({ detailSearchQuery: q });
        const { openSession } = get();
        if (!openSession) return;
        const events = await searchSessionEvents(openSession.id, q);
        set({ openSessionEvents: events });
      },

      refreshDetail: async () => {
        const { openSession } = get();
        if (!openSession) return;
        await get().openSessionById(openSession.id);
      },

      closeSession: () => {
        set({ openSession: null, openSessionEvents: [], detailSearchQuery: "" });
      },

      _hydrated: false,
    }),
    {
      name: "vision-session-history",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (s) => ({
        activeSessionId: s.activeSessionId,
        dateFilter: s.dateFilter,
      }),
      onRehydrateStorage: () => () => {
        try {
          useSessionHistory.setState({ _hydrated: true });
        } catch {
          /* best-effort */
        }
      },
    },
  ),
);
