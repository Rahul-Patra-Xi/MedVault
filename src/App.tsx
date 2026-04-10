import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/use-auth";
import { RecordsProvider } from "@/hooks/use-records";
import { MedicationsProvider } from "@/hooks/use-medications";
import { SharingProvider } from "@/hooks/use-sharing";
import { AuditProvider } from "@/hooks/use-audit";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Records from "./pages/Records";
import Timeline from "./pages/Timeline";
import Share from "./pages/Share";
import Security from "./pages/Security";
import Settings from "./pages/Settings";
import Assistant from "./pages/Assistant";
import BookAppointment from "./pages/BookAppointment";
import Login from "./pages/Login";
import SharedView from "./pages/SharedView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RecordsProvider>
          <MedicationsProvider>
            <SharingProvider>
              <AuditProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/welcome" element={<Landing />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/shared/:linkId" element={<SharedView />} />
                      <Route path="/" element={<Index />} />
                      <Route path="/records" element={<Records />} />
                      <Route path="/timeline" element={<Timeline />} />
                      <Route path="/appointments" element={<BookAppointment />} />
                      <Route path="/share" element={<Share />} />
                      <Route path="/assistant" element={<Assistant />} />
                      <Route path="/security" element={<Security />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </TooltipProvider>
              </AuditProvider>
            </SharingProvider>
          </MedicationsProvider>
        </RecordsProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
