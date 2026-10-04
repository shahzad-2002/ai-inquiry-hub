import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Inquiries from "./pages/Inquiries.jsx";
import NewInquiry from "./pages/NewInquiry.jsx";
import InquiryDetails from "./pages/InquiryDetails.jsx";
import Leads from "./pages/Leads.jsx";
import FollowUps from "./pages/FollowUps.jsx";
import Automation from "./pages/Automation.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/inquiries" element={<Inquiries />} />
      <Route path="/inquiries/new" element={<NewInquiry />} />
      <Route path="/inquiries/:id" element={<InquiryDetails />} />
      <Route path="/leads" element={<Leads />} />
      <Route path="/follow-ups" element={<FollowUps />} />
      <Route path="/automation" element={<Automation />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
