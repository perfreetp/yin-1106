import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { useUserStore } from './store/useUserStore';
import { useRulesStore } from './store/useRulesStore';
import { useMistakesStore } from './store/useMistakesStore';
import { useStatsStore } from './store/useStatsStore';
import { usePracticeStore } from './store/usePracticeStore';

function App() {
  const initUser = useUserStore((state) => state.initUser);
  const initRules = useRulesStore((state) => state.initRules);
  const initMistakes = useMistakesStore((state) => state.initMistakes);
  const initScores = useStatsStore((state) => state.initScores);
  const initCompletedExercises = usePracticeStore((state) => state.initCompletedExercises);

  useEffect(() => {
    initUser();
    initRules();
    initMistakes();
    initScores();
    initCompletedExercises();
  }, [initUser, initRules, initMistakes, initScores, initCompletedExercises]);

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default App;
