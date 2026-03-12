import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { QuoteBuilderPage } from '../pages/QuoteBuilderPage';


export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <QuoteBuilderPage /> },
    ],
  },
]);
