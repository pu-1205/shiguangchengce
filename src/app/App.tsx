import { RouterProvider } from 'react-router';
import { router } from './routes';
import '../styles/theme.css'; // Make sure styles exist or are applied

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;