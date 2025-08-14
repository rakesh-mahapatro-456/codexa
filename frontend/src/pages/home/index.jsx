import UserLayout from "../../components/layout/UserLayout";
import UserCard from "../../components/custom/cards/UserCard";
import Streak from "../../components/custom/cards/Streak";
import DailyProgress from "../../components/custom/cards/DailyProgress";
import Progress from "../../components/custom/cards/Progress";
import RandomQuest from "../../components/custom/table/RandomQuest";
import Quote from "../../components/custom/cards/Quote";
import { GlowingEffect } from "../../components/ui/GlowingEffect";
import { dailyProgress, getStreak } from "../../store/feature/auth/authThunk";
import { getDailyChallenge,getDailyProgress } from "../../store/feature/dsa/dsaThunk";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { LoaderThree } from "@/components/ui/loader";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function Home() {
  const { user, dailyProgressData, dataLoaded: authDataLoaded } = useSelector((state) => state.auth);
  const { dailyChallenge, dataLoaded: dsaDataLoaded } = useSelector((state) => state.dsa);
  const dispatch = useDispatch();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
  
    const loadInitialData = async () => {
      const promises = [];
  
      if (!authDataLoaded.dailyProgress) promises.push(dispatch(dailyProgress()));
      if (!authDataLoaded.streakDates) promises.push(dispatch(getStreak()));
      if (!dsaDataLoaded.dailyChallenge) promises.push(dispatch(getDailyChallenge()));
      if (!dsaDataLoaded.dailyProgress) promises.push(dispatch(getDailyProgress()));

      if (promises.length > 0) {
        try {
          await Promise.all(promises);
        } catch (error) {
          console.error("Error loading initial data:", error);
        }
      }
      
      setInitialLoading(false);
    };
  
    // Only load data if user is authenticated and data isn't already loaded
    if (authDataLoaded.user && user) {
      loadInitialData();
    } else {
      setInitialLoading(false);
    }
  }, [user, authDataLoaded.user, authDataLoaded.dailyProgress, authDataLoaded.streakDates, dsaDataLoaded.dailyChallenge, dispatch]);

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderThree />
      </div>
    );
  }

  if (!user || !dailyProgressData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderThree />
      </div>
    );
  }

  const normalizedProblems = dailyChallenge.map((p) => ({
    id: p._id,
    title: p.title,
    topic: p.topic,
    xp: p.xpReward,
    link: p.link,
    user_status: p.status,
  }));

  const Card = ({ children }) => (
    <div className="relative rounded-xl bg-white dark:bg-zinc-900 shadow p-4 sm:p-6 transition duration-300 hover:shadow-lg w-full h-full">
      <GlowingEffect
        blur={0}
        inactiveZone={0.01}
        proximity={64}
        spread={40}
        variant="default"
        glow={true}
        disabled={false}
        movementDuration={2}
        borderWidth={1}
      />
      {children}
    </div>
  );

  return (
    <ProtectedRoute>
      <UserLayout>
      <div className="mt-6 sm:mt-8 lg:mt-12"> 
        {/* Mobile layout */}
        <div className="flex flex-col gap-6 sm:hidden">
          <Card>
            <UserCard name={user.name} level={user.levelId?.name || "1"} xp={user.xp} image="" />
          </Card>
          <Card>
            <Streak streak={user.streak} />
          </Card>
          <Card>
            <DailyProgress solved={dailyProgressData.solvedToday} goal={dailyProgressData.goal} xpToday={dailyProgressData.xpToday} timeZoneOffset={5.5} />
          </Card>
          <Card>
            <Progress solved={user.problemsSolved} />
          </Card>
          <Card>
            <RandomQuest problems={normalizedProblems} />
          </Card>
          <Card>
            <Quote />
          </Card>
        </div>

        {/* Tablet layout */}
        <div className="hidden sm:flex lg:hidden flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <UserCard name={user.name} level={user.levelId?.name || "1"} xp={user.xp} image="" />
            </Card>
            <Card>
              <Streak streak={user.streak} />
            </Card>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <Progress solved={user.problemsSolved} />
            </Card>
            <Card>
              <Quote />
            </Card>
          </div>
          <Card>
            <DailyProgress solved={dailyProgressData.solvedToday} xpToday={dailyProgressData.xpToday} goal={dailyProgressData.goal} timeZoneOffset={5.5} />
          </Card>
          <Card>
            <RandomQuest problems={normalizedProblems} />
          </Card>
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:grid grid-cols-12 gap-4 mx-auto max-w-7xl">
          <div className="col-span-12 grid grid-cols-12 gap-4">
            <div className="col-span-5">
              <Card>
                <UserCard name={user.name} level={user.levelId?.name || "1"} xp={user.xp || 0} image="" />
              </Card>
            </div>
            <div className="col-span-3">
              <Card>
                <Streak streak={user.streak} />
              </Card>
            </div>
            <div className="col-span-4">
              <Card>
                <Progress solved={user.problemsSolved} />
              </Card>
            </div>
          </div>
          <div className="col-span-6">
            <Card>
              <DailyProgress solved={dailyProgressData.solvedToday} xpToday={dailyProgressData.xpToday} goal={dailyProgressData.goal} timeZoneOffset={5.5} />
            </Card>
          </div>
          <div className="col-span-6">
            <Card>
              <Quote />
            </Card>
          </div>
          <div className="col-span-12">
            <Card>
              <RandomQuest problems={normalizedProblems} />
            </Card>
          </div>
        </div>
        </div>
      </UserLayout>
    </ProtectedRoute>
  );
}
