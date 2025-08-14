import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../../ui/table";
import { Button } from "../../ui/button";
import { markProblemAsSolved } from "../../../store/feature/dsa/dsaThunk";

const getRowColor = (solved) => {
  if (solved === 1) return "bg-green-100 dark:bg-green-800";
  if (solved === 0) return "bg-red-200 dark:bg-red-800";
  return "bg-gray-100 dark:bg-gray-700/60";
};

const getDifficultyColor = (d) => {
  if (d === "E") return "text-green-600 dark:text-green-400";
  if (d === "M") return "text-yellow-700 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

const TargetQns = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const { solvedToday = [], unsolvedToday = [], backlog = [] } = useSelector(
    (state) => state.dsa.targetedProblems
  );
  const [updatingProblems, setUpdatingProblems] = useState({});

  // Combine all problems with their sections
  const allProblems = useMemo(() => {
    return [
      ...solvedToday.map(p => ({ ...p, section: 'Solved Today' })),
      ...unsolvedToday.map(p => ({ ...p, section: 'Unsolved Today' })),
      ...backlog.map(p => ({ ...p, section: 'Backlog' }))
    ].filter(p => 
      p?.title?.toLowerCase().includes(search.toLowerCase()) ||
      p?.topic?.toLowerCase().includes(search.toLowerCase())
    );
  }, [solvedToday, unsolvedToday, backlog, search]);

  const handleProblemSolved = async (problemId) => {
    if (updatingProblems[problemId]) return;
    
    try {
      setUpdatingProblems(prev => ({ ...prev, [problemId]: true }));
      await dispatch(markProblemAsSolved(problemId)).unwrap();
    } catch (error) {
      console.error('Failed to update problem status:', error);
    } finally {
      setUpdatingProblems(prev => {
        const newState = { ...prev };
        delete newState[problemId];
        return newState;
      });
    }
  };

  return (
    <div className="py-8 flex justify-center">
      <div className="w-full max-w-6xl px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Targeted DSA Problems
          </h2>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search problems..."
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-100 dark:bg-zinc-700">
                <TableHead className="w-16">#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead className="w-24">Difficulty</TableHead>
                <TableHead className="w-20">XP</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="w-24">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allProblems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-zinc-500">
                    No problems found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              ) : (
                allProblems.map((p, idx) => (
                  <TableRow
                    key={p._id}
                    className={`transition-colors ${getRowColor(p.status)} ${
                      idx % 2 === 1 ? "bg-zinc-50 dark:bg-zinc-800/40" : ""
                    } hover:bg-indigo-50/60 dark:hover:bg-indigo-900/30`}
                  >
                    <TableCell className="px-4 py-3 text-base font-semibold text-zinc-700 dark:text-zinc-200">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 font-bold text-zinc-900 dark:text-white whitespace-nowrap max-w-xs truncate">
                      {p.title}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                      {p.topic}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm ${getDifficultyColor(
                          p.difficulty.charAt(0) || 'M'
                        )} bg-zinc-100 dark:bg-zinc-800/40`}
                      >
                        {p.difficulty || 'Medium'}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center font-semibold">
                      {p.xpReward || 0} XP
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Button
                        asChild
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-none border-none transition-all"
                        disabled={updatingProblems[p._id]}
                      >
                        <a 
                          href={p.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          {updatingProblems[p._id] ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Updating...
                            </>
                          ) : 'Solve'}
                        </a>
                      </Button>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <label className="inline-flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={p.status === 1}
                          onChange={() => handleProblemSolved(p._id, p.status)}
                          disabled={updatingProblems[p._id]}
                          className={`peer sr-only ${updatingProblems[p._id] ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        />
                        <span
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-150 ${
                            p.status === 1
                              ? "bg-green-200 border-green-400 dark:bg-green-800 dark:border-green-500"
                              : "bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 group-hover:border-indigo-400"
                          } ${updatingProblems[p._id] ? 'opacity-50' : ''}`}
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TargetQns;