import React, { useEffect, useState } from 'react'
import UserLayout from '../../components/layout/UserLayout'
import Quote from '../../components/custom/cards/Quote'
import TableTabs from '@/components/custom/table/TableTab'
import StreakCalendar from '@/components/custom/cards/StreakCalendar'
import { getDsaProblems, getTargetedDsaProblems } from "../../store/feature/dsa/dsaThunk"
import { getStreak } from "../../store/feature/auth/authThunk";
import { useSelector, useDispatch } from 'react-redux'
import ProtectedRoute from "../../components/ProtectedRoute";
import { LoaderThree } from "@/components/ui/loader";

export default function DSA() {
  const { 
    problems, 
    targetedProblems, 
    loading, 
    dataLoaded: dsaDataLoaded 
  } = useSelector((state) => state.dsa);
  
  const { 
    streakDates, 
    loading: authLoading,
    dataLoaded: authDataLoaded 
  } = useSelector((state) => state.auth);
  
  const dispatch = useDispatch();
  const [initialLoading, setInitialLoading] = useState(true);

  // Load data only once
  useEffect(() => {
    const loadInitialData = async () => {
      const promises = [];
      
      if (!dsaDataLoaded.problems) {
        promises.push(dispatch(getDsaProblems()));
      }
      
      if (!dsaDataLoaded.targetedProblems) {
        promises.push(dispatch(getTargetedDsaProblems()));
      }
      
      if (!authDataLoaded.streakDates) {
        promises.push(dispatch(getStreak()));
      }

      if (promises.length > 0) {
        await Promise.all(promises);
      }
      
      setInitialLoading(false);
    };

    loadInitialData();
  }, [dsaDataLoaded, authDataLoaded, dispatch]);

  const Card = ({ children, className = "" }) => (
    <div className={`relative rounded-xl bg-white dark:bg-zinc-900 shadow p-4 sm:p-6 transition duration-300 hover:shadow-lg w-full h-full ${className}`}>
      {children}
    </div>
  );

  if (initialLoading || loading || authLoading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-screen">
          <LoaderThree />
        </div>
      </UserLayout>
    );
  }

  return (
    <ProtectedRoute>
      <UserLayout>
      {/* Mobile layout */}
      <div className="flex flex-col gap-4 md:hidden px-4 pt-6 pb-20">
        <Card>
          <TableTabs problems={problems} />
        </Card>
      </div>

      {/* Tablet layout */}
      <div className="hidden md:block lg:hidden px-4 pt-8 pb-8">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Card>
              <TableTabs problems={problems} />
            </Card>
          </div>
          <div className="col-span-1 flex flex-col gap-4">
            <Card>
              <StreakCalendar streakDates={streakDates}/>
            </Card>
            <Card>
              <Quote />
            </Card>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:grid grid-cols-3 gap-6 mx-auto max-w-7xl px-6 pt-8 pb-8">
        <div className="col-span-2">
          <Card>
            <TableTabs problems={problems} />
          </Card>
        </div>
        <div className="col-span-1 flex flex-col gap-4">
          <Card>
            <StreakCalendar streakDates={streakDates}/>
          </Card>
          <Card>
            <Quote />
          </Card>
        </div>
      </div>
    </UserLayout>
    </ProtectedRoute>
  )
}
