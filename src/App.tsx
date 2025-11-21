import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import ELearning from './pages/ELearning';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
// Portal imports
import FundProviderPortal from './pages/portals/FundProviderPortal';
import CoordinatingAgencyPortal from './pages/portals/CoordinatingAgencyPortal';
import PFIPortal from './pages/portals/PFIPortal';
import InsurancePortal from './pages/portals/InsurancePortal';
import AnchorPortal from './pages/portals/AnchorPortal';
import LeadFirmPortal from './pages/portals/LeadFirmPortal';
import ProducerPortal from './pages/portals/ProducerPortal';
import CooperativePortal from './pages/portals/CooperativePortal';
import ExtensionPortal from './pages/portals/ExtensionPortal';
import ResearcherPortal from './pages/portals/ResearcherPortal';
// Fund Provider sub-pages
import SchemeApplication from './pages/portals/FundProvider/SchemeApplication';
import FundProviderSettings from './pages/portals/FundProvider/Settings';
// Producer sub-pages
import ProducerSettings from './pages/portals/Producer/Settings';
import ProducerSchemeApplication from './pages/portals/Producer/SchemeApplication';
// PFI sub-pages
import PFISettings from './pages/portals/PFI/Settings';
import PFISchemeApplication from './pages/portals/PFI/SchemeApplication';
// Coordinating Agency sub-pages
import CoordinatingAgencyActivities from './pages/portals/CoordinatingAgency/Activities';
import CoordinatingAgencyFundSchemes from './pages/portals/CoordinatingAgency/FundSchemes';
import CoordinatingAgencyReportings from './pages/portals/CoordinatingAgency/Reportings';
// Representative Body pages
import RepresentativeInsurance from './pages/portals/CoordinatingAgency/Representative/InsuranceCompanies';
import RepresentativeExtension from './pages/portals/CoordinatingAgency/Representative/ExtensionOrganizations';
import RepresentativeNGOs from './pages/portals/CoordinatingAgency/Representative/NGOs';
// Publications / Blog / FAQs
import Publications from './pages/portals/CoordinatingAgency/Publications';
import Blog from './pages/portals/CoordinatingAgency/Blog';
import FAQs from './pages/portals/CoordinatingAgency/FAQs';
import CoordinatingAgencyStakeholders from './pages/portals/CoordinatingAgency/Stakeholders';
import CoordinatingAgencyTrainings from './pages/portals/CoordinatingAgency/Trainings';
import CoordinatingAgencySettings from './pages/portals/CoordinatingAgency/Settings';
// Coordinating Agency Applicants sub-pages
import FundProviderApplicants from './pages/portals/CoordinatingAgency/Applicants/FundProvider';
import PFIApplicants from './pages/portals/CoordinatingAgency/Applicants/PFIs';
import InsuranceCompanyApplicants from './pages/portals/CoordinatingAgency/Applicants/InsuranceCompanies';
// Fund Beneficiaries sub-pages
import LeadFirms from './pages/portals/CoordinatingAgency/FundBeneficiaries/LeadFirms';
import Anchors from './pages/portals/CoordinatingAgency/FundBeneficiaries/Anchors';
import CooperativeGroups from './pages/portals/CoordinatingAgency/FundBeneficiaries/CooperativeGroups';
import ProducersFarmers from './pages/portals/CoordinatingAgency/FundBeneficiaries/ProducersFarmers';
// Monitoring Team sub-pages
import CentralMonitoring from './pages/portals/CoordinatingAgency/CentralMonitoring';
import StateMonitoring from './pages/portals/CoordinatingAgency/StateMonitoring';
import LocalMonitoring from './pages/portals/CoordinatingAgency/LocalMonitoring';
import WardMonitoring from './pages/portals/CoordinatingAgency/WardMonitoring';
// Stakeholder Department sub-pages
import FundManagementDept from './pages/portals/CoordinatingAgency/Stakeholders/FundManagement';
import CreditRiskDept from './pages/portals/CoordinatingAgency/Stakeholders/CreditRisk';
import InsuranceDept from './pages/portals/CoordinatingAgency/Stakeholders/Insurance';
import FinanceDept from './pages/portals/CoordinatingAgency/Stakeholders/Finance';
import LegalDept from './pages/portals/CoordinatingAgency/Stakeholders/Legal';
import ITDept from './pages/portals/CoordinatingAgency/Stakeholders/IT';
import TrainingDept from './pages/portals/CoordinatingAgency/Stakeholders/Training';
import MonitoringDept from './pages/portals/CoordinatingAgency/Stakeholders/Monitoring';
// Insurance sub-pages
import InsuranceSchemeApplication from './pages/portals/Insurance/SchemeApplication';
import CooperativeSchemeApplication from './pages/portals/Cooperative/SchemeApplication';
import InsurancePolicies from './pages/portals/Insurance/Policies';
import InsuranceClaimsPage from './pages/portals/Insurance/Claims';
import InsuranceRiskAssessment from './pages/portals/Insurance/RiskAssessment';
import InsuranceReports from './pages/portals/Insurance/Reports';
import InsuranceSettings from './pages/portals/Insurance/Settings';
// Anchor sub-pages
import AnchorSettings from './pages/portals/Anchor/Settings';
import AnchorSchemeApplication from './pages/portals/Anchor/SchemeApplication';
// Lead Firm sub-pages
import LeadFirmSettings from './pages/portals/LeadFirm/Settings';
import LeadFirmSchemeApplication from './pages/portals/LeadFirm/SchemeApplication';
// Cooperative sub-pages
import CooperativeMembers from './pages/portals/Cooperative/Members';
import CooperativeGroupLoans from './pages/portals/Cooperative/GroupLoans';
import CooperativeSavings from './pages/portals/Cooperative/Savings';
import CooperativeSettings from './pages/portals/Cooperative/Settings';
import CooperativeReports from './pages/portals/Cooperative/Reports';
import CooperativeExtensionServices from './pages/portals/Cooperative/ExtensionServices';
import CooperativeMarketAccess from './pages/portals/Cooperative/MarketAccess';
import CooperativeTraining from './pages/portals/Cooperative/Training';
// Extension sub-pages
import ExtensionFarmers from './pages/portals/Extension/Farmers';
import ExtensionTrainingPrograms from './pages/portals/Extension/TrainingPrograms';
import ExtensionSettings from './pages/portals/Extension/Settings';
import ExtensionSchemeApplication from './pages/portals/Extension/SchemeApplication';
import ExtensionAdvisoryServices from './pages/portals/Extension/AdvisoryServices';
import ExtensionTechnologyTransfer from './pages/portals/Extension/TechnologyTransfer';
import ExtensionFieldMonitoring from './pages/portals/Extension/FieldMonitoring';
import ExtensionReports from './pages/portals/Extension/Reports';
// Researcher sub-pages
import ResearcherResearchProjects from './pages/portals/Researcher/ResearchProjects';
import ResearcherDataCollection from './pages/portals/Researcher/DataCollection';
import ResearcherSettings from './pages/portals/Researcher/Settings';
import ResearcherSchemeApplication from './pages/portals/Researcher/SchemeApplication';
import ResearcherPublications from './pages/portals/Researcher/Publications';
import ResearcherCollaborations from './pages/portals/Researcher/Collaborations';
import ResearcherFunding from './pages/portals/Researcher/Funding';
import ResearcherConferences from './pages/portals/Researcher/Conferences';
import ResearcherReports from './pages/portals/Researcher/Reports';

function App() {
  return (
    <NotificationProvider>
      <Router>
      <Routes>
        {/* Public Routes with Navbar and Footer */}
        <Route path="/*" element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/elearning" element={<ELearning />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
        
        {/* Portal Routes without Navbar and Footer */}
        <Route path="/portal/fund-provider" element={<FundProviderPortal />} />
        <Route path="/portal/fund-provider/scheme-application" element={<SchemeApplication />} />
        <Route path="/portal/fund-provider/settings" element={<FundProviderSettings />} />
        <Route path="/portal/coordinating-agency" element={<CoordinatingAgencyPortal />} />
        <Route path="/portal/coordinating-agency/activities" element={<CoordinatingAgencyActivities />} />
        <Route path="/portal/coordinating-agency/fund-schemes" element={<CoordinatingAgencyFundSchemes />} />
        <Route path="/portal/coordinating-agency/reportings" element={<CoordinatingAgencyReportings />} />
        <Route path="/portal/coordinating-agency/stakeholders" element={<CoordinatingAgencyStakeholders />} />
        {/* Representative Body */}
        <Route path="/portal/coordinating-agency/representative/insurance-companies" element={<RepresentativeInsurance />} />
        <Route path="/portal/coordinating-agency/representative/extension-organizations" element={<RepresentativeExtension />} />
        <Route path="/portal/coordinating-agency/representative/ngos" element={<RepresentativeNGOs />} />
        {/* Publications / Blog / FAQs */}
        <Route path="/portal/coordinating-agency/publications" element={<Publications />} />
        <Route path="/portal/coordinating-agency/blog" element={<Blog />} />
        <Route path="/portal/coordinating-agency/faqs" element={<FAQs />} />
        {/* Coordinating Agency Applicants */}
        <Route path="/portal/coordinating-agency/applicants/fund-provider" element={<FundProviderApplicants />} />
        <Route path="/portal/coordinating-agency/applicants/pfis" element={<PFIApplicants />} />
        <Route path="/portal/coordinating-agency/applicants/insurance-companies" element={<InsuranceCompanyApplicants />} />
        {/* Fund Beneficiaries */}
        <Route path="/portal/coordinating-agency/fund-beneficiaries/lead-firms" element={<LeadFirms />} />
        <Route path="/portal/coordinating-agency/fund-beneficiaries/anchors" element={<Anchors />} />
        <Route path="/portal/coordinating-agency/fund-beneficiaries/cooperative-groups" element={<CooperativeGroups />} />
        <Route path="/portal/coordinating-agency/fund-beneficiaries/producers-farmers" element={<ProducersFarmers />} />
        <Route path="/portal/coordinating-agency/stakeholders/fund-management" element={<FundManagementDept />} />
        <Route path="/portal/coordinating-agency/stakeholders/credit-risk" element={<CreditRiskDept />} />
        <Route path="/portal/coordinating-agency/stakeholders/insurance" element={<InsuranceDept />} />
        <Route path="/portal/coordinating-agency/stakeholders/finance" element={<FinanceDept />} />
        <Route path="/portal/coordinating-agency/stakeholders/legal" element={<LegalDept />} />
        <Route path="/portal/coordinating-agency/stakeholders/it" element={<ITDept />} />
        <Route path="/portal/coordinating-agency/stakeholders/training" element={<TrainingDept />} />
        <Route path="/portal/coordinating-agency/stakeholders/monitoring" element={<MonitoringDept />} />
        <Route path="/portal/coordinating-agency/monitoring/central" element={<CentralMonitoring />} />
        <Route path="/portal/coordinating-agency/monitoring/state" element={<StateMonitoring />} />
        <Route path="/portal/coordinating-agency/monitoring/local" element={<LocalMonitoring />} />
        <Route path="/portal/coordinating-agency/monitoring/ward" element={<WardMonitoring />} />
        <Route path="/portal/coordinating-agency/trainings" element={<CoordinatingAgencyTrainings />} />
        <Route path="/portal/coordinating-agency/settings" element={<CoordinatingAgencySettings />} />
        <Route path="/portal/pfi" element={<PFIPortal />} />
        <Route path="/portal/pfi/scheme-application" element={<PFISchemeApplication />} />
        <Route path="/portal/pfi/settings" element={<PFISettings />} />
        <Route path="/portal/insurance" element={<InsurancePortal />} />
        <Route path="/portal/insurance/scheme-application" element={<InsuranceSchemeApplication />} />
        <Route path="/portal/cooperative/scheme-application" element={<CooperativeSchemeApplication />} />
        <Route path="/portal/insurance/policies" element={<InsurancePolicies />} />
        <Route path="/portal/insurance/claims" element={<InsuranceClaimsPage />} />
        <Route path="/portal/insurance/risk" element={<InsuranceRiskAssessment />} />
        <Route path="/portal/insurance/reports" element={<InsuranceReports />} />
        <Route path="/portal/insurance/settings" element={<InsuranceSettings />} />
        <Route path="/portal/anchor" element={<AnchorPortal />} />
        <Route path="/portal/anchor/scheme-application" element={<AnchorSchemeApplication />} />
        <Route path="/portal/anchor/settings" element={<AnchorSettings />} />
        <Route path="/portal/lead-firm" element={<LeadFirmPortal />} />
        <Route path="/portal/lead-firm/scheme-application" element={<LeadFirmSchemeApplication />} />
        <Route path="/portal/lead-firm/settings" element={<LeadFirmSettings />} />
        <Route path="/portal/producer" element={<ProducerPortal />} />
        <Route path="/portal/producer/scheme-application" element={<ProducerSchemeApplication />} />
        <Route path="/portal/producer/settings" element={<ProducerSettings />} />
        <Route path="/portal/cooperative" element={<CooperativePortal />} />
        <Route path="/portal/cooperative/members" element={<CooperativeMembers />} />
        <Route path="/portal/cooperative/loans" element={<CooperativeGroupLoans />} />
        <Route path="/portal/cooperative/savings" element={<CooperativeSavings />} />
               <Route path="/portal/cooperative/settings" element={<CooperativeSettings />} />
               <Route path="/portal/cooperative/reports" element={<CooperativeReports />} />
               <Route path="/portal/cooperative/extension" element={<CooperativeExtensionServices />} />
               <Route path="/portal/cooperative/market" element={<CooperativeMarketAccess />} />
               <Route path="/portal/cooperative/training" element={<CooperativeTraining />} />
        <Route path="/portal/extension" element={<ExtensionPortal />} />
        <Route path="/portal/extension/scheme-application" element={<ExtensionSchemeApplication />} />
        <Route path="/portal/extension/farmers" element={<ExtensionFarmers />} />
        <Route path="/portal/extension/training" element={<ExtensionTrainingPrograms />} />
               <Route path="/portal/extension/settings" element={<ExtensionSettings />} />
               <Route path="/portal/extension/advisory" element={<ExtensionAdvisoryServices />} />
               <Route path="/portal/extension/tech" element={<ExtensionTechnologyTransfer />} />
               <Route path="/portal/extension/monitoring" element={<ExtensionFieldMonitoring />} />
               <Route path="/portal/extension/reports" element={<ExtensionReports />} />
        <Route path="/portal/researcher" element={<ResearcherPortal />} />
        <Route path="/portal/researcher/scheme-application" element={<ResearcherSchemeApplication />} />
        <Route path="/portal/researcher/projects" element={<ResearcherResearchProjects />} />
        <Route path="/portal/researcher/data" element={<ResearcherDataCollection />} />
               <Route path="/portal/researcher/settings" element={<ResearcherSettings />} />
               <Route path="/portal/researcher/publications" element={<ResearcherPublications />} />
               <Route path="/portal/researcher/collaborations" element={<ResearcherCollaborations />} />
               <Route path="/portal/researcher/funding" element={<ResearcherFunding />} />
               <Route path="/portal/researcher/conferences" element={<ResearcherConferences />} />
               <Route path="/portal/researcher/reports" element={<ResearcherReports />} />
      </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
