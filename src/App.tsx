import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes } from "react-router-dom";
import { ErrorFallback } from "./components/ErrorFallback/ErrorFallback";
import { Home } from "./pages/Home/Home";
import { Redirect } from "./components/Redirect/Redirect";
import { CreateNote } from "./pages/Create/Note";
import { FindOrCreate } from "./pages/FindOrCreate/FindOrCreate";
import { ViewIncident } from "./pages/View/Incident";
import { EditIncident } from "./pages/Edit/Indicent";
import { LoadingAppPage } from "./pages/LoadingAppPage/LoadingAppPage";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { AdminCallbackPage } from "./pages/AdminCallbackPage/AdminCallbackPage";

function App() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
          <Routes>
            <Route path="/admin/callback" element={<AdminCallbackPage/>}/>
            <Route path="/findOrCreate" element={<FindOrCreate />} />
            <Route path="/view/incident/:incidentId" element={<ViewIncident />}/>
            <Route path="/edit/incident/:incidentId" element={<EditIncident />}/>
            <Route path="/create/note/:incidentId" element={<CreateNote />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/redirect" element={<Redirect />} />
            <Route index element={<LoadingAppPage />} />
          </Routes>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

export default App;
