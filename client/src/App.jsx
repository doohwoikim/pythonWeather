import Weather from "./components/Weather";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <div>
          <Weather />
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  )
}
