import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './frontendadmin/Login'
import Dashboard from './frontendadmin/Dashboard'
import AddParty from './frontendadmin/AddParty'
import Bank from './frontendadmin/Bank'
import Demo from './frontendadmin/Demo'
import Issuecheque from './frontendadmin/Issuecheque'
import Reports from './frontendadmin/Reports'
import AddUser from './frontendadmin/AddUser'
import EditUser from './frontendadmin/EditUser'
import Dashboarduser from './frontenduser/Dashboarduser'
import Addpartyuser from './frontenduser/Addpartyuser'
import Issuechequeuser from './frontenduser/Issuechequeuser'
import Reportsuser from './frontenduser/Reportsuser'
import DemoReport from './frontendadmin/DemoReport'
import Demouser from './frontenduser/Demouser'
import DemoReportuser from './frontenduser/DemoReportuser'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/addparty' element={<AddParty />} />
        <Route path='/bank' element={<Bank />} />
        <Route path="/issuecheque" element={<Issuecheque />} />
        <Route path="/reports" element={<Reports />} />
        <Route path='/adduser' element={<AddUser />} />
        <Route path='/edituser' element={<EditUser />} />
        <Route path='/dashboarduser' element={<Dashboarduser />} />
        <Route path='/addpartyuser' element={<Addpartyuser />} />
        <Route path='/issuechequeuser' element={<Issuechequeuser />} />
        <Route path='/reportsuser' element={<Reportsuser />} />
        <Route path='/demo' element={<Demo />} />
        <Route path='/demoreport' element={<DemoReport />} />
        <Route path='/demouser' element={<Demouser />} />
        <Route path='/demoreportuser' element={<DemoReportuser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
