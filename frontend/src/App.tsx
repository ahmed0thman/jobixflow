import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom'
import { ToastProvider } from './components/ui/Toast'
import { AppShell } from './components/layout/AppShell'
import { platformAdminNav, platformDispatcherNav, companyDispatcherNav, companyAdminNav } from './config/nav'
import { currentUser, platformDispatcherUser, companyDispatcherUser, companyAdminUser } from './data/mock'

import { Dashboard } from './pages/platform-admin/Dashboard'
import { Companies } from './pages/platform-admin/Companies'
import { CompanyCreate } from './pages/platform-admin/CompanyCreate'
import { CompanyDetail } from './pages/platform-admin/CompanyDetail'
import { Jobs } from './pages/platform-admin/Jobs'
import { JobDetail } from './pages/platform-admin/JobDetail'
import { JobChat } from './pages/platform-admin/JobChat'
import { Wallet } from './pages/platform-admin/Wallet'
import { Transactions } from './pages/platform-admin/Transactions'
import { Reports } from './pages/platform-admin/Reports'
import { AuditLog } from './pages/platform-admin/AuditLog'
import { Settings } from './pages/platform-admin/Settings'
import { Placeholder } from './pages/Placeholder'

import { Dashboard as DispatcherDashboard } from './pages/platform-dispatcher/Dashboard'
import { NewJob } from './pages/platform-dispatcher/NewJob'
import { ServiceTypes } from './pages/platform-dispatcher/ServiceTypes'
import { JobHistory } from './pages/platform-dispatcher/JobHistory'
import { JobDetail as DispatcherJobDetail } from './pages/platform-dispatcher/JobDetail'
import { JobEdit } from './pages/platform-dispatcher/JobEdit'
import { JobChat as DispatcherJobChat } from './pages/platform-dispatcher/JobChat'
import { Companies as DispatcherCompanies } from './pages/platform-dispatcher/Companies'
import { CompanyShow } from './pages/platform-dispatcher/CompanyShow'
import { Customers as DispatcherCustomers } from './pages/platform-dispatcher/Customers'
import { CustomerDetail } from './pages/platform-dispatcher/CustomerDetail'

import { Dashboard as CompanyDispatcherDashboard } from './pages/company-dispatcher/Dashboard'
import { NewJob as CompanyNewJob } from './pages/company-dispatcher/NewJob'
import { ActiveJobs as CompanyActiveJobs } from './pages/company-dispatcher/ActiveJobs'
import { IncomingJobs as CompanyIncomingJobs } from './pages/company-dispatcher/IncomingJobs'
import { JobDetail as CompanyJobDetail } from './pages/company-dispatcher/JobDetail'
import { JobChat as CompanyJobChat } from './pages/company-dispatcher/JobChat'
import { Technicians as CompanyTechnicians } from './pages/company-dispatcher/Technicians'
import { LiveMap as CompanyLiveMap } from './pages/company-dispatcher/LiveMap'

import { Dashboard as CompanyAdminDashboard } from './pages/company-admin/Dashboard'
import { Wallet as CompanyAdminWallet } from './pages/company-admin/Wallet'
import { Transactions as CompanyAdminTransactions } from './pages/company-admin/Transactions'
import { CodeRequests as CompanyAdminCodeRequests } from './pages/company-admin/CodeRequests'
import { CodeRequestDetail as CompanyAdminCodeRequestDetail } from './pages/company-admin/CodeRequestDetail'
import { Technicians as CompanyAdminTechnicians } from './pages/company-admin/Technicians'
import { Reports as CompanyAdminReports } from './pages/company-admin/Reports'
import { KeyCodes as CompanyAdminKeyCodes } from './pages/company-admin/KeyCodes'
import { Jobs as CompanyAdminJobs } from './pages/company-admin/Jobs'
import { JobDetail as CompanyAdminJobDetail } from './pages/company-admin/JobDetail'
import { JobChat as CompanyAdminJobChat } from './pages/company-admin/JobChat'
import { Customers as CompanyAdminCustomers } from './pages/company-admin/Customers'
import { Users as CompanyAdminUsers } from './pages/company-admin/Users'
import { CallLogs as CompanyAdminCallLogs } from './pages/company-admin/CallLogs'
import { AuditLog as CompanyAdminAuditLog } from './pages/company-admin/AuditLog'
import { Settings as CompanyAdminSettings } from './pages/company-admin/Settings'

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/platform-admin" replace />} />

          <Route
            path="/platform-admin"
            element={<AppShell roleLabel="Platform Admin" nav={platformAdminNav} user={currentUser} />}
          >
            <Route index element={<Dashboard />} />
            <Route path="companies" element={<Companies />} />
            <Route path="companies/create" element={<CompanyCreate />} />
            <Route path="companies/:id" element={<CompanyDetail />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/:id" element={<JobDetail />} />
            <Route path="jobs/:id/chat" element={<JobChat />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="reports" element={<Reports />} />
            <Route path="audit-log" element={<AuditLog />} />
            <Route path="settings" element={<Settings />} />
            <Route path="countries" element={<Placeholder title="Countries" />} />
            <Route path="customers" element={<Placeholder title="Customers" />} />
            <Route path="users" element={<Placeholder title="Users" />} />
            <Route path="notifications" element={<Placeholder title="Notifications" />} />
          </Route>

          <Route
            path="/platform-dispatcher"
            element={<AppShell roleLabel="Platform Dispatcher" nav={platformDispatcherNav} user={platformDispatcherUser} />}
          >
            <Route index element={<DispatcherDashboard />} />
            <Route path="jobs/create" element={<NewJob />} />
            <Route path="service-types" element={<ServiceTypes />} />
            <Route path="jobs" element={<JobHistory />} />
            <Route path="jobs/:id" element={<DispatcherJobDetail />} />
            <Route path="jobs/:id/edit" element={<JobEdit />} />
            <Route path="jobs/:id/chat" element={<DispatcherJobChat />} />
            <Route path="companies" element={<DispatcherCompanies />} />
            <Route path="companies/:id" element={<CompanyShow />} />
            <Route path="customers" element={<DispatcherCustomers />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="audit-log" element={<AuditLog />} />
            <Route path="notifications" element={<Placeholder title="Notifications" />} />
          </Route>

          <Route
            path="/company-dispatcher"
            element={<AppShell roleLabel="Company Dispatcher" nav={companyDispatcherNav} user={companyDispatcherUser} />}
          >
            <Route index element={<CompanyDispatcherDashboard />} />
            <Route path="jobs/create" element={<CompanyNewJob />} />
            <Route path="jobs" element={<CompanyActiveJobs />} />
            <Route path="jobs/:id" element={<CompanyJobDetail />} />
            <Route path="jobs/:id/chat" element={<CompanyJobChat />} />
            <Route path="incoming-jobs" element={<CompanyIncomingJobs />} />
            <Route path="technicians" element={<CompanyTechnicians />} />
            <Route path="map" element={<CompanyLiveMap />} />
            <Route path="notifications" element={<Placeholder title="Notifications" />} />
          </Route>

          <Route
            path="/company-admin"
            element={<AppShell roleLabel="Company Admin" nav={companyAdminNav} user={companyAdminUser} />}
          >
            <Route index element={<CompanyAdminDashboard />} />
            <Route path="wallet" element={<CompanyAdminWallet />} />
            <Route path="transactions" element={<CompanyAdminTransactions />} />
            <Route path="code-requests" element={<CompanyAdminCodeRequests />} />
            <Route path="code-requests/:id" element={<CompanyAdminCodeRequestDetail />} />
            <Route path="technicians" element={<CompanyAdminTechnicians />} />
            <Route path="reports" element={<CompanyAdminReports />} />
            <Route path="key-codes" element={<CompanyAdminKeyCodes />} />
            <Route path="jobs" element={<CompanyAdminJobs />} />
            <Route path="jobs/:id" element={<CompanyAdminJobDetail />} />
            <Route path="jobs/:id/chat" element={<CompanyAdminJobChat />} />
            <Route path="notifications" element={<Placeholder title="Notifications" />} />
            <Route path="customers" element={<CompanyAdminCustomers />} />
            <Route path="users" element={<CompanyAdminUsers />} />
            <Route path="call-logs" element={<CompanyAdminCallLogs />} />
            <Route path="audit-log" element={<CompanyAdminAuditLog />} />
            <Route path="settings" element={<CompanyAdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/platform-admin" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
