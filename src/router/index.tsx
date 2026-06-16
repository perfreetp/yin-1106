import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import HomePage from '../pages/HomePage';
import RulesListPage from '../pages/rules/RulesListPage';
import RuleDetailPage from '../pages/rules/RuleDetailPage';
import FavoritesPage from '../pages/rules/FavoritesPage';
import PracticeListPage from '../pages/practice/PracticeListPage';
import PracticeDetailPage from '../pages/practice/PracticeDetailPage';
import ComparePage from '../pages/practice/ComparePage';
import ChallengeLobbyPage from '../pages/challenge/ChallengeLobbyPage';
import ChallengePage from '../pages/challenge/ChallengePage';
import ChallengeResultPage from '../pages/challenge/ChallengeResultPage';
import MistakesPage from '../pages/mistakes/MistakesPage';
import MistakeDetailPage from '../pages/mistakes/MistakeDetailPage';
import StatsDashboardPage from '../pages/stats/StatsDashboardPage';
import StatsProfilePage from '../pages/stats/StatsProfilePage';
import StatsReportPage from '../pages/stats/StatsReportPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'rules',
        children: [
          {
            index: true,
            element: <RulesListPage />,
          },
          {
            path: ':id',
            element: <RuleDetailPage />,
          },
          {
            path: 'favorites',
            element: <FavoritesPage />,
          },
        ],
      },
      {
        path: 'practice',
        children: [
          {
            index: true,
            element: <PracticeListPage />,
          },
          {
            path: ':id',
            element: <PracticeDetailPage />,
          },
          {
            path: 'compare/:id',
            element: <ComparePage />,
          },
        ],
      },
      {
        path: 'challenge',
        children: [
          {
            index: true,
            element: <ChallengeLobbyPage />,
          },
          {
            path: ':levelId',
            element: <ChallengePage />,
          },
          {
            path: 'result/:attemptId',
            element: <ChallengeResultPage />,
          },
        ],
      },
      {
        path: 'mistakes',
        children: [
          {
            index: true,
            element: <MistakesPage />,
          },
          {
            path: ':id',
            element: <MistakeDetailPage />,
          },
        ],
      },
      {
        path: 'stats',
        children: [
          {
            index: true,
            element: <StatsDashboardPage />,
          },
          {
            path: 'profile',
            element: <StatsProfilePage />,
          },
          {
            path: 'report',
            element: <StatsReportPage />,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
