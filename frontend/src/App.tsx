import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/App.Routes';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
          <AppRoutes />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: 'dark:bg-dark-surface dark:text-white dark:border dark:border-dark-border',
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
              },
              success: {
                duration: 3000,
                className: 'dark:bg-green-800',
              },
              error: {
                duration: 5000,
                className: 'dark:bg-red-800',
              },
            }}
          />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;