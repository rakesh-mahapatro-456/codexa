import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../../ui/table";
import { Button } from "../../ui/button";
import { useDispatch } from 'react-redux';
import { markDailyChallengeProblemAsSolved } from '../../../store/feature/dsa/dsaThunk';

const getRowColor = (status, idx) => {
  if (status === 1) return "bg-green-100 dark:bg-green-800";
  if (status === 0) return "bg-red-200 dark:bg-red-800";
  return idx % 2 === 1 ? "bg-zinc-50 dark:bg-zinc-800/40" : "";
};

const RandomQuest = ({ problems = [] }) => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  const handleMarkSolved = (problemId) => {
    const problemToUpdate = problems.find((p) => p.id === problemId);
    if (problemToUpdate?.user_status === 1) return;
    dispatch(markDailyChallengeProblemAsSolved(problemId));
  };

  const filteredProblems = problems.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-full my-4 rounded-2xl shadow-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 border-b border-zinc-200 dark:border-zinc-700 bg-gradient-to-r from-indigo-50/80 via-white to-pink-50/80 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800">
        <span className="text-2xl mr-2">🎯</span>
        <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-zinc-800 dark:text-white flex-1">
          Random Quest
        </h2>
        <input
          type="text"
          placeholder="Search by title or topic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-32 sm:w-64 md:w-72 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 border border-zinc-200 dark:border-zinc-700 transition-all placeholder:text-zinc-400"
        />
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        {filteredProblems.length === 0 ? (
          <div className="p-6 sm:p-8 text-center text-zinc-500 dark:text-zinc-400 text-base">
            No problems in your focus list currently, or all are filtered out.
          </div>
        ) : (
          <Table className="w-full">
            <TableHeader>
              <TableRow className="text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/60">
                <TableHead className="px-4 py-3 text-left font-semibold">#</TableHead>
                <TableHead className="px-4 py-3 text-left font-semibold">Title</TableHead>
                <TableHead className="px-4 py-3 text-left font-semibold">Topic</TableHead>
                <TableHead className="px-4 py-3 text-left font-semibold">XP</TableHead>
                <TableHead className="px-4 py-3 text-center font-semibold">Solve</TableHead>
                <TableHead className="px-4 py-3 text-center font-semibold">Done?</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProblems.map((p, idx) => (
                <TableRow
                  key={p.id}
                  className={`transition-colors ${getRowColor(p.user_status, idx)} hover:bg-indigo-50/60 dark:hover:bg-indigo-900/30`}
                >
                  <TableCell className="px-4 py-3 text-base font-semibold text-zinc-700 dark:text-zinc-200">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="px-4 py-3 font-bold text-zinc-900 dark:text-white whitespace-nowrap max-w-xs truncate">
                    {p.title}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                    {p.topic}
                  </TableCell>
                  <TableCell className="px-4 py-3 font-semibold text-green-700 dark:text-green-400">
                    {p.xp}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <Button
                      asChild
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700 font-semibold shadow-none border-none transition-all"
                    >
                      <a href={p.link} target="_blank" rel="noopener noreferrer">
                        Solve
                      </a>
                    </Button>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <label className="inline-flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={p.user_status === 1}
                        onChange={() => handleMarkSolved(p.id)}
                        className="peer sr-only"
                        disabled={p.user_status === 1}
                      />
                      <span
                        className={`w-5 h-5 rounded border-2 border-zinc-300 dark:border-zinc-600 flex items-center justify-center transition-colors duration-150 bg-white dark:bg-zinc-800 ${
                          p.user_status === 1
                            ? "bg-green-200 border-green-400 dark:bg-green-800 dark:border-green-500"
                            : "group-hover:border-indigo-400"
                        }`}
                      >
                        {p.user_status === 1 && (
                          <svg
                            className="w-3 h-3 text-green-600 dark:text-green-300"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M4 8l3 3 5-5" />
                          </svg>
                        )}
                      </span>
                    </label>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default RandomQuest;