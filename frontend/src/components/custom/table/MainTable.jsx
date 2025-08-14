import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../../ui/table";
import { Button } from "../../ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { markProblemAsSolved } from "../../../store/feature/dsa/dsaThunk"; // adjust path

const getRowColor = (status) => {
  if (status === 1) return "bg-green-100 dark:bg-green-800";
  if (status === 0) return "bg-red-200 dark:bg-red-800";
  return "bg-gray-100 dark:bg-gray-700/60";
};

const getDifficultyColor = (d) => {
  if (d.startsWith("E")) return "text-green-600 dark:text-green-400";
  if (d.startsWith("M")) return "text-yellow-700 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

const MainTable = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  // Read problems directly from Redux
  const problems = useSelector((state) => state.dsa.problems || {});

  // Initialize expandedTopics as empty (all collapsed by default)
  const [expandedTopics, setExpandedTopics] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("expandedTopics");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
// When problems change, only add new topics to expandedTopics if you want:
useEffect(() => {
  const topics = Object.keys(problems);
  setExpandedTopics(prev => {
    const updated = { ...prev };
    topics.forEach(t => {
      if (!(t in updated)) {
        updated[t] = false;  // new topics collapsed by default
      }
    });
    return updated;
  });
}, [problems]);

useEffect(() => {
  if (typeof window !== "undefined") {
    localStorage.setItem("expandedTopics", JSON.stringify(expandedTopics));
  }
}, [expandedTopics]);

  const toggleTopic = (topic) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topic]: !prev[topic],
    }));
  };

  const filterBySearch = (problemsArr) => {
    if (!search) return problemsArr;
    return problemsArr.filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.problem && p.problem.toLowerCase().includes(search.toLowerCase()))
    );
  };

  // On checkbox toggle, dispatch thunk to update status in backend & redux
  const toggleSolved = (topic, idxInTopic) => {
    const topicProblems = problems[topic] || [];
    const problem = topicProblems[idxInTopic];
    if (!problem) return;

    const newStatus = problem.status === 1 ? 0 : 1;

    // Dispatch thunk with problemId 
    dispatch(markProblemAsSolved(problem._id));
  };

  // Sort topics alphabetically by key name
  const topicsSorted = Object.keys(problems);

  return (
    <div className="py-8 flex justify-center">
      <div className="w-full max-w-6xl rounded-2xl shadow-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        {/* Header and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-b border-zinc-200 dark:border-zinc-700 bg-gradient-to-r from-indigo-50/80 via-white to-pink-50/80 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800">
          <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-zinc-800 dark:text-white flex-1">
            DSA Sheet - Topics
          </h1>
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 border border-zinc-200 dark:border-zinc-700 transition-all placeholder:text-zinc-400"
          />
        </div>

        {/* Topics & Questions */}
        <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
          {topicsSorted.length === 0 && (
            <p className="p-6 text-center text-zinc-600 dark:text-zinc-400">
              No questions found.
            </p>
          )}

          {topicsSorted.map((topic) => {
            const filteredQuestions = filterBySearch(problems[topic] || []);
            const isExpanded = expandedTopics[topic];

            return (
              <div key={topic}>
                {/* Topic Header - clickable */}
                <button
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  className="w-full flex items-center justify-between px-6 py-4 bg-zinc-100 dark:bg-zinc-800 cursor-pointer select-none hover:bg-indigo-50 dark:hover:bg-indigo-900 transition"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-3 font-semibold text-lg text-zinc-900 dark:text-white">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                    <span>{topic}</span>
                    <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">
                      ({filteredQuestions.length} questions)
                    </span>
                  </div>
                </button>

                {/* Questions Table under topic */}
                {isExpanded && (
                  <div className="overflow-x-auto px-6 pb-6">
                    <Table>
                      <TableHeader>
                        <TableRow className="text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/60">
                          <TableHead className="px-4 py-3 text-left font-semibold">
                            #
                          </TableHead>
                          <TableHead className="px-4 py-3 text-left font-semibold">
                            Title
                          </TableHead>
                          {/* Problem column removed */}
                          <TableHead className="px-4 py-3 text-left font-semibold">
                            Diff
                          </TableHead>
                          <TableHead className="px-4 py-3 text-left font-semibold">
                            Link
                          </TableHead>
                          <TableHead className="px-4 py-3 text-center font-semibold">
                            Solved
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredQuestions.map((p, idx) => (
                          <TableRow
                            key={p._id}
                            className={`transition-colors ${getRowColor(
                              p.status
                            )} hover:bg-indigo-50/60 dark:hover:bg-indigo-900/30`}
                          >
                            <TableCell className="px-4 py-3 text-base font-semibold text-zinc-700 dark:text-zinc-200">
                              {idx + 1}
                            </TableCell>
                            <TableCell className="px-4 py-3 font-bold text-zinc-900 dark:text-white whitespace-nowrap max-w-xs truncate">
                              {p.title}
                            </TableCell>

                            <TableCell className="px-4 py-3">
                              <span
                                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm ${getDifficultyColor(
                                  p.difficulty
                                )} bg-zinc-100 dark:bg-zinc-800/40`}
                              >
                                {p.difficulty}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <Button
                                asChild
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-none border-none transition-all"
                              >
                                <a
                                  href={p.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Solve
                                </a>
                              </Button>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-center">
                              <label className="inline-flex items-center cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={p.status === 1}
                                  onChange={() => toggleSolved(topic, idx)}
                                  className="peer sr-only"
                                />
                                <span
                                  className={`w-5 h-5 rounded border-2 border-zinc-300 dark:border-zinc-600 flex items-center justify-center transition-colors duration-150 bg-white dark:bg-zinc-800 ${
                                    p.status === 1
                                      ? "bg-green-200 border-green-400 dark:bg-green-800 dark:border-green-500"
                                      : "group-hover:border-indigo-400"
                                  }`}
                                >
                                  {p.status === 1 && (
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
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MainTable;
