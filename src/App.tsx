import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ViewMember from "./components/member/ViewMember";
import SubBill from "./components/SubscriptionAndBilling/SubBill";
import FacilityRegistration from "./components/facility/FacilityRegistration";
import CommunicationTools from "./components/Communication/CommunicationTools";
import AccessControl from "./components/Access/AccessControl";
import Reports from "./components/Reporting & Analytics/Reports";
import CaddieManagement from "./components/CaddieManagement/CaddieManagement";
import EmployeeDirectory from "./components/Employees/EmployeeDirectory";
import RolesPermissions from "./components/Employees/RolesPermissions";
import AttendanceTracking from "./components/Employees/AttendanceTracking";
import SchedulingRostering from "./components/Employees/SchedulingRostering";
import PayrollCompensation from "./components/Employees/PayrollCompensation";
import PerformanceTracking from "./components/Employees/PerformanceTracking";
import TrainingCertifications from "./components/Employees/TrainingCertifications";
import ViewFacility from "./components/facility/ViewFacility";
import Rooms from "./components/Rooms";
import Dinning from "./components/Dinning";
import CostCenter from "./components/Accounting/Cost Centers";
import ChartOfAccounts from "./components/Accounting/Chart of Accounts";
import InvestmentProducts from "./components/Accounting/Investment Products";
import PostingPeriods from "./components/Accounting/Posting Periods";
import GeneralLedger from "./components/Accounting/GeneralLedger";
import SubscriptionPackage from "./components/Package/SubscriptionPackage";
import Advertisement from "./components/Advertisement";
import MobileUser from "./components/MobileUser";
import BankSetup from "./components/Accounting/Bank Setup";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            <Route index path="/member" element={<ViewMember />} />
            <Route index path="/rooms" element={<Rooms />} />
            <Route index path="/Subscription-and-billing" element={<SubBill/>} />
            <Route index path="/FacilityRegistration" element={<FacilityRegistration/>} />
            <Route index path="/Communication" element={<CommunicationTools/>} />
            <Route index path="/AccessControl" element={<AccessControl/>} />
            <Route index path="/Reports" element={<Reports/>} />
            <Route index path="/Caddie" element={<CaddieManagement/>} />
            <Route index path="/EmployeeDirectory" element={<EmployeeDirectory/>} />
            <Route index path="/RolesPermissions" element={<RolesPermissions/>} />
            <Route index path="/AttendanceTracking" element={<AttendanceTracking/>} />
            <Route index path="/SchedulingRostering" element={<SchedulingRostering/>} />
            <Route index path="/PayrollCompensation" element={<PayrollCompensation/>} />
            <Route index path="/PerformanceTracking" element={<PerformanceTracking/>} />
            <Route index path="/TrainingCertifications" element={<TrainingCertifications/>} />
            <Route index path="/facility" element={<ViewFacility/>} />
            <Route index path="/Dinning" element={<Dinning/>} />
            <Route index path="/CostCenter" element={<CostCenter/>} />
            <Route index path="/ChartOfAccounts" element={<ChartOfAccounts/>} />

            <Route index path="/BankSetup" element={<BankSetup/>} />
            
            <Route index path="/InvestmentProducts" element={<InvestmentProducts/>} />
            <Route index path="/PostingPeriods" element={<PostingPeriods/>} />
            <Route index path="/GeneralLedger" element={<GeneralLedger/>} />
            <Route index path="/SubscriptionPackage" element={<SubscriptionPackage/>} />
            <Route index path="/Advertisement" element={<Advertisement/>} />
            <Route index path="/MobileUser" element={<MobileUser/>} />


            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
