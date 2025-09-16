import React, { useContext } from "react";

/// React router dom
import { Routes, Route, Outlet } from "react-router-dom";

/// Css
import "./index.css";
import "./chart.css";
import "./step.css";

/// Layout
import Nav from "./layouts/nav";
import Footer from "./layouts/Footer";
import ScrollToTop from "./layouts/ScrollToTop";
/// Dashboard
import Home from "./components/Dashboard/Home";
import DashboardDark from "./components/Dashboard/DashboardDark";

/////Demo
import Theme1 from "./components/Dashboard/Demo/Theme1";
import Theme2 from "./components/Dashboard/Demo/Theme2";
import Theme3 from "./components/Dashboard/Demo/Theme3";
import Theme4 from "./components/Dashboard/Demo/Theme4";
import Theme5 from "./components/Dashboard/Demo/Theme5";
import Theme6 from "./components/Dashboard/Demo/Theme6";

/// App
import AppProfile from "./components/AppsMenu/AppProfile/AppProfile";
import Compose from "./components/AppsMenu/Email/Compose/Compose";
import Calendar from "./components/AppsMenu/Calendar/Calendar";

/// Charts
import Sparkline from "./components/charts/S-Sparkline";
import ChartJs from "./components/charts/Chartjs";
import RechartJs from "./components/charts/schart";
import ApexChart from "./components/charts/sapexcharts";

/// Bootstrap
import UiAlert from "./components/bootstrap/Alert";
import UiAccordion from "./components/bootstrap/Accordion";
import Sbadge from "./components/bootstrap/sBadge";
import UiButton from "./components/bootstrap/Button";
import UiModal from "./components/bootstrap/Modal";
import UiButtonGroup from "./components/bootstrap/ButtonGroup";
import UiCards from "./components/bootstrap/Cards";
import UiPopOver from "./components/bootstrap/PopOver";
import UiProgressBar from "./components/bootstrap/ProgressBar";
import UiPagination from "./components/bootstrap/Pagination";

//Redux
import Todo from "./pages/Todo";

/// Table
import SortingTable from "./components/table/SortingTable/SortingTable";
import FilteringTable from "./components/table/FilteringTable/FilteringTable";
import DataTable from "./components/table/DataTable";
import BootstrapTable from "./components/table/BootstrapTable";

/// Form
import Element from "./components/Forms/Element/Element";
import Wizard from "./components/Forms/MultiStepForm/MultiStepForm.js";
import Editor from "./components/Forms/Editor/Editor.js";
import Pickers from "./components/Forms/Pickers/Pickers";
import FormValidation from "./components/Forms/FormValidation/FormValidation";
import TextFields from "./components/Forms/textFields/textFields";

/// Pages
import LockScreen from "./pages/LockScreen";
import Error400 from "./pages/Error400";
import Error403 from "./pages/Error403";
import Error404 from "./pages/Error404";
import Error500 from "./pages/Error500";
import Error503 from "./pages/Error503";
import Setting from "./layouts/Setting";
import { ThemeContext } from "../context/ThemeContext";

///masters
import Vendormaster from "./components/vendormaster/index.js";
import Verification from "./components/Verification/index.js";
import BankDetails from "./components/Bankdetails/index.js";
import UserMaster from "./components/users/index.js";
import MainCategoryMaster from "./components/MainCategoryMaster/index.js";
import SubCategoryMaster from "./components/SubCategoryMaster/index.js";
import PayModeMaster from "./components/paymode/index.js";
import VariantMaster from "./components/variant/index.js";
import EmployeeMaster from "./components/employeeinfo/index.js";
import Income from "./components/income/index.js";
import Expenditure from "./components/Expenditure/index.js";
import Report from "./components/report/index.js";
import ExpenditureReport from "./components/expenditurereport/index.js";
import Incomereport from "./components/incomereport/index.js";
import ProfitAndLossReport from "./components/profitandloss/index.js";
import Login from "./pages/Login.js";
import Registration from "./pages/Registration.js";

const Markup = () => {
  const allroutes = [
    /// Dashboard
    { url: "", component: <Home /> },
    { url: "dashboard", component: <Home /> },
    { url: "dashboard-dark", component: <DashboardDark /> },

    ///Demo
    { url: "primary-sidebar", component: <Theme1 /> },
    { url: "mini-primary-sidebar", component: <Theme2 /> },
    { url: "compact-primary-header", component: <Theme3 /> },
    { url: "horizontal-primary-sidebar", component: <Theme4 /> },
    { url: "horizontal-modern-sidebar", component: <Theme5 /> },
    { url: "modern-sidebar", component: <Theme6 /> },

    /// Apps
    { url: "app-profile", component: <AppProfile /> },
    { url: "email-compose", component: <Compose /> },
    { url: "app-calender", component: <Calendar /> },

    /// Chart
    { url: "s-sparkline", component: <Sparkline /> },
    { url: "chart-chartjs", component: <ChartJs /> },
    { url: "chart-apexchart", component: <ApexChart /> },
    { url: "chart-rechart", component: <RechartJs /> },

    /// Bootstrap
    { url: "ui-alert", component: <UiAlert /> },
    { url: "s-badge", component: <Sbadge /> },
    { url: "ui-button", component: <UiButton /> },
    { url: "ui-modal", component: <UiModal /> },
    { url: "ui-button-group", component: <UiButtonGroup /> },
    { url: "ui-accordion", component: <UiAccordion /> },
    { url: "ui-card", component: <UiCards /> },
    { url: "ui-popover", component: <UiPopOver /> },
    { url: "ui-progressbar", component: <UiProgressBar /> },
    { url: "ui-pagination", component: <UiPagination /> },

    ///Redux
    { url: "todo", component: <Todo /> },

    /// Form
    { url: "form-element", component: <Element /> },
    { url: "form-wizard", component: <Wizard /> },
    { url: "form-editor", component: <Editor /> },
    { url: "form-pickers", component: <Pickers /> },
    { url: "form-validation", component: <FormValidation /> },

    /// table
    { url: "table-filtering", component: <FilteringTable /> },
    { url: "table-sorting", component: <SortingTable /> },
    { url: "table-datatable-basic", component: <DataTable /> },
    { url: "table-bootstrap-basic", component: <BootstrapTable /> },
    { url: "text-fields", component: <TextFields /> },

    ///masters
    { url: "Vendormaster", component: <Vendormaster /> },
    { url: "Verification", component: <Verification /> },
    { url: "BankDetails", component: <BankDetails /> },
    { url: "UserMaster", component: <UserMaster /> },
    { url: "MainCategoryMaster", component: <MainCategoryMaster /> },
    { url: "SubCategoryMaster", component: <SubCategoryMaster /> },
    { url: "PayModeMaster", component: <PayModeMaster /> },
    { url: "VariantMaster", component: <VariantMaster /> },
    { url: "EmployeeMaster", component: <EmployeeMaster /> },
    { url: "Income", component: <Income /> },
    { url: "Expenditure", component: <Expenditure /> },
    { url: "Report", component: <Report /> },
    { url: "ExpenditureReport", component: <ExpenditureReport /> },
    { url: "incomereport", component: <Incomereport /> },
    { url: "ProfitAndLossReport", component: <ProfitAndLossReport /> },
  ];

  return (
    <>
      <Routes>
        {/* Error / Special pages */}
        <Route path="page-lock-screen" element={<LockScreen />} />
        <Route path="page-error-400" element={<Error400 />} />
        <Route path="page-error-403" element={<Error403 />} />
        <Route path="page-error-404" element={<Error404 />} />
        <Route path="page-error-500" element={<Error500 />} />
        <Route path="page-error-503" element={<Error503 />} />

        {/* 🚀 No Layout pages */}
        <Route path="page-login" element={<Login />} />
        <Route path="page-register" element={<Registration />} />

        {/* ✅ All other pages use MainLayout */}
        <Route element={<MainLayout />}>
          {allroutes.map((data, i) => (
            <Route key={i} path={`${data.url}`} element={data.component} />
          ))}
        </Route>
      </Routes>

      <Setting />
      <ScrollToTop />
    </>
  );
};

function MainLayout() {
  const { menuToggle, sidebariconHover } = useContext(ThemeContext);
  return (
    <div
      id="main-wrapper"
      className={`show ${sidebariconHover ? "iconhover-toggle" : ""} ${
        menuToggle ? "menu-toggle" : ""
      }`}
    >
      <Nav />
      <div className="content-body" style={{ minHeight: window.screen.height - 45 }}>
        <div className="container-fluid">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Markup;
