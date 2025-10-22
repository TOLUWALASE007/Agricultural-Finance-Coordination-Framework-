import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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
import PMTPortal from './pages/portals/PMTPortal';
import AnchorPortal from './pages/portals/AnchorPortal';
import LeadFirmPortal from './pages/portals/LeadFirmPortal';
import ProducerPortal from './pages/portals/ProducerPortal';
import CooperativePortal from './pages/portals/CooperativePortal';
import DeRiskingPortal from './pages/portals/DeRiskingPortal';
import ExtensionPortal from './pages/portals/ExtensionPortal';
import ResearcherPortal from './pages/portals/ResearcherPortal';
// Fund Provider sub-pages
import FundManagement from './pages/portals/FundProvider/FundManagement';
import LoanApplications from './pages/portals/FundProvider/LoanApplications';
// Removed PFI Partners and Insurance Claims from Fund Provider portal
import ReportsAnalytics from './pages/portals/FundProvider/ReportsAnalytics';
// Producer sub-pages
import ProducerLoanApplications from './pages/portals/Producer/LoanApplications';
import AnchorPartners from './pages/portals/Producer/AnchorPartners';
import InputSuppliers from './pages/portals/Producer/InputSuppliers';
// Fund Provider sub-pages
import FundProviderSettings from './pages/portals/FundProvider/Settings';
// Producer sub-pages
import ProducerSettings from './pages/portals/Producer/Settings';
import CropInsurance from './pages/portals/Producer/CropInsurance';
import ExtensionServices from './pages/portals/Producer/ExtensionServices';
import MarketPrices from './pages/portals/Producer/MarketPrices';
import Cooperative from './pages/portals/Producer/Cooperative';
// PFI sub-pages
import PFILoanProcessing from './pages/portals/PFI/LoanProcessing';
import PFIApplications from './pages/portals/PFI/Applications';
import PFIProducerNetwork from './pages/portals/PFI/ProducerNetwork';
import PFIAnchorPartners from './pages/portals/PFI/AnchorPartners';
import PFIInsuranceClaims from './pages/portals/PFI/InsuranceClaims';
import PFIRiskAssessment from './pages/portals/PFI/RiskAssessment';
import PFIReports from './pages/portals/PFI/Reports';
import PFISettings from './pages/portals/PFI/Settings';
// Coordinating Agency sub-pages
import CoordinatingAgencyPrograms from './pages/portals/CoordinatingAgency/Programs';
import CoordinatingAgencyStakeholders from './pages/portals/CoordinatingAgency/Stakeholders';
import CoordinatingAgencyCompliance from './pages/portals/CoordinatingAgency/Compliance';
import CoordinatingAgencyReports from './pages/portals/CoordinatingAgency/Reports';
import CoordinatingAgencySettings from './pages/portals/CoordinatingAgency/Settings';
// Insurance sub-pages
import InsurancePolicies from './pages/portals/Insurance/Policies';
import InsuranceClaimsPage from './pages/portals/Insurance/Claims';
import InsuranceRiskAssessment from './pages/portals/Insurance/RiskAssessment';
import InsuranceReports from './pages/portals/Insurance/Reports';
import InsuranceSettings from './pages/portals/Insurance/Settings';
// PMT sub-pages
import PMTProjects from './pages/portals/PMT/Projects';
import PMTStakeholders from './pages/portals/PMT/Stakeholders';
import PMTMonitoring from './pages/portals/PMT/Monitoring';
import PMTReports from './pages/portals/PMT/Reports';
import PMTSettings from './pages/portals/PMT/Settings';
// Anchor sub-pages
import AnchorProducerNetwork from './pages/portals/Anchor/ProducerNetwork';
import AnchorSupplyContracts from './pages/portals/Anchor/SupplyContracts';
import AnchorLoanPerformance from './pages/portals/Anchor/LoanPerformance';
import AnchorReports from './pages/portals/Anchor/Reports';
import AnchorSettings from './pages/portals/Anchor/Settings';
// Lead Firm sub-pages
import LeadFirmProductCatalog from './pages/portals/LeadFirm/ProductCatalog';
import LeadFirmOrders from './pages/portals/LeadFirm/Orders';
import LeadFirmProducerNetwork from './pages/portals/LeadFirm/ProducerNetwork';
import LeadFirmCreditSales from './pages/portals/LeadFirm/CreditSales';
import LeadFirmDelivery from './pages/portals/LeadFirm/Delivery';
import LeadFirmQualityControl from './pages/portals/LeadFirm/QualityControl';
import LeadFirmReports from './pages/portals/LeadFirm/Reports';
import LeadFirmSettings from './pages/portals/LeadFirm/Settings';
// Cooperative sub-pages
import CooperativeMembers from './pages/portals/Cooperative/Members';
import CooperativeGroupLoans from './pages/portals/Cooperative/GroupLoans';
import CooperativeSavings from './pages/portals/Cooperative/Savings';
import CooperativeSettings from './pages/portals/Cooperative/Settings';
import CooperativeReports from './pages/portals/Cooperative/Reports';
import CooperativeExtensionServices from './pages/portals/Cooperative/ExtensionServices';
import CooperativeMarketAccess from './pages/portals/Cooperative/MarketAccess';
import CooperativeTraining from './pages/portals/Cooperative/Training';
// De-risking sub-pages
import DeRiskingFunds from './pages/portals/DeRisking/DeRiskingFunds';
import DeRiskingRiskAssessment from './pages/portals/DeRisking/RiskAssessment';
import DeRiskingGuarantees from './pages/portals/DeRisking/Guarantees';
import DeRiskingPartners from './pages/portals/DeRisking/Partners';
import DeRiskingMonitoring from './pages/portals/DeRisking/Monitoring';
import DeRiskingReports from './pages/portals/DeRisking/Reports';
import DeRiskingSettings from './pages/portals/DeRisking/Settings';
// Extension sub-pages
import ExtensionFarmers from './pages/portals/Extension/Farmers';
import ExtensionTrainingPrograms from './pages/portals/Extension/TrainingPrograms';
import ExtensionSettings from './pages/portals/Extension/Settings';
import ExtensionAdvisoryServices from './pages/portals/Extension/AdvisoryServices';
import ExtensionTechnologyTransfer from './pages/portals/Extension/TechnologyTransfer';
import ExtensionFieldMonitoring from './pages/portals/Extension/FieldMonitoring';
import ExtensionReports from './pages/portals/Extension/Reports';
// Researcher sub-pages
import ResearcherResearchProjects from './pages/portals/Researcher/ResearchProjects';
import ResearcherDataCollection from './pages/portals/Researcher/DataCollection';
import ResearcherSettings from './pages/portals/Researcher/Settings';
import ResearcherPublications from './pages/portals/Researcher/Publications';
import ResearcherCollaborations from './pages/portals/Researcher/Collaborations';
import ResearcherFunding from './pages/portals/Researcher/Funding';
import ResearcherConferences from './pages/portals/Researcher/Conferences';
import ResearcherReports from './pages/portals/Researcher/Reports';

function App() {
  return (
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
        <Route path="/portal/fund-provider/funds" element={<FundManagement />} />
        <Route path="/portal/fund-provider/applications" element={<LoanApplications />} />
        { /* PFI Partners and Insurance Claims routes removed */ }
        <Route path="/portal/fund-provider/reports" element={<ReportsAnalytics />} />
        <Route path="/portal/fund-provider/settings" element={<FundProviderSettings />} />
        <Route path="/portal/coordinating-agency" element={<CoordinatingAgencyPortal />} />
        <Route path="/portal/coordinating-agency/programs" element={<CoordinatingAgencyPrograms />} />
        <Route path="/portal/coordinating-agency/stakeholders" element={<CoordinatingAgencyStakeholders />} />
        <Route path="/portal/coordinating-agency/compliance" element={<CoordinatingAgencyCompliance />} />
        <Route path="/portal/coordinating-agency/reports" element={<CoordinatingAgencyReports />} />
        <Route path="/portal/coordinating-agency/settings" element={<CoordinatingAgencySettings />} />
        <Route path="/portal/pfi" element={<PFIPortal />} />
        <Route path="/portal/pfi/loans" element={<PFILoanProcessing />} />
        <Route path="/portal/pfi/applications" element={<PFIApplications />} />
        <Route path="/portal/pfi/producers" element={<PFIProducerNetwork />} />
        <Route path="/portal/pfi/anchors" element={<PFIAnchorPartners />} />
        <Route path="/portal/pfi/insurance" element={<PFIInsuranceClaims />} />
        <Route path="/portal/pfi/risk" element={<PFIRiskAssessment />} />
        <Route path="/portal/pfi/reports" element={<PFIReports />} />
        <Route path="/portal/pfi/settings" element={<PFISettings />} />
        <Route path="/portal/insurance" element={<InsurancePortal />} />
        <Route path="/portal/insurance/policies" element={<InsurancePolicies />} />
        <Route path="/portal/insurance/claims" element={<InsuranceClaimsPage />} />
        <Route path="/portal/insurance/risk" element={<InsuranceRiskAssessment />} />
        <Route path="/portal/insurance/reports" element={<InsuranceReports />} />
        <Route path="/portal/insurance/settings" element={<InsuranceSettings />} />
        <Route path="/portal/pmt" element={<PMTPortal />} />
        <Route path="/portal/pmt/projects" element={<PMTProjects />} />
        <Route path="/portal/pmt/stakeholders" element={<PMTStakeholders />} />
        <Route path="/portal/pmt/monitoring" element={<PMTMonitoring />} />
        <Route path="/portal/pmt/reports" element={<PMTReports />} />
        <Route path="/portal/pmt/settings" element={<PMTSettings />} />
        <Route path="/portal/anchor" element={<AnchorPortal />} />
        <Route path="/portal/anchor/producers" element={<AnchorProducerNetwork />} />
        <Route path="/portal/anchor/contracts" element={<AnchorSupplyContracts />} />
        <Route path="/portal/anchor/loans" element={<AnchorLoanPerformance />} />
        <Route path="/portal/anchor/reports" element={<AnchorReports />} />
        <Route path="/portal/anchor/settings" element={<AnchorSettings />} />
        <Route path="/portal/lead-firm" element={<LeadFirmPortal />} />
        <Route path="/portal/lead-firm/products" element={<LeadFirmProductCatalog />} />
        <Route path="/portal/lead-firm/orders" element={<LeadFirmOrders />} />
        <Route path="/portal/lead-firm/producers" element={<LeadFirmProducerNetwork />} />
        <Route path="/portal/lead-firm/credit" element={<LeadFirmCreditSales />} />
        <Route path="/portal/lead-firm/delivery" element={<LeadFirmDelivery />} />
        <Route path="/portal/lead-firm/quality" element={<LeadFirmQualityControl />} />
        <Route path="/portal/lead-firm/reports" element={<LeadFirmReports />} />
        <Route path="/portal/lead-firm/settings" element={<LeadFirmSettings />} />
        <Route path="/portal/producer" element={<ProducerPortal />} />
        <Route path="/portal/producer/loans" element={<ProducerLoanApplications />} />
        <Route path="/portal/producer/anchors" element={<AnchorPartners />} />
        <Route path="/portal/producer/inputs" element={<InputSuppliers />} />
               <Route path="/portal/producer/settings" element={<ProducerSettings />} />
               <Route path="/portal/producer/insurance" element={<CropInsurance />} />
               <Route path="/portal/producer/extension" element={<ExtensionServices />} />
               <Route path="/portal/producer/prices" element={<MarketPrices />} />
               <Route path="/portal/producer/cooperative" element={<Cooperative />} />
        <Route path="/portal/cooperative" element={<CooperativePortal />} />
        <Route path="/portal/cooperative/members" element={<CooperativeMembers />} />
        <Route path="/portal/cooperative/loans" element={<CooperativeGroupLoans />} />
        <Route path="/portal/cooperative/savings" element={<CooperativeSavings />} />
               <Route path="/portal/cooperative/settings" element={<CooperativeSettings />} />
               <Route path="/portal/cooperative/reports" element={<CooperativeReports />} />
               <Route path="/portal/cooperative/extension" element={<CooperativeExtensionServices />} />
               <Route path="/portal/cooperative/market" element={<CooperativeMarketAccess />} />
               <Route path="/portal/cooperative/training" element={<CooperativeTraining />} />
        <Route path="/portal/de-risking" element={<DeRiskingPortal />} />
        <Route path="/portal/de-risking/funds" element={<DeRiskingFunds />} />
        <Route path="/portal/de-risking/risk" element={<DeRiskingRiskAssessment />} />
        <Route path="/portal/de-risking/guarantees" element={<DeRiskingGuarantees />} />
        <Route path="/portal/de-risking/partners" element={<DeRiskingPartners />} />
        <Route path="/portal/de-risking/monitoring" element={<DeRiskingMonitoring />} />
        <Route path="/portal/de-risking/reports" element={<DeRiskingReports />} />
        <Route path="/portal/de-risking/settings" element={<DeRiskingSettings />} />
        <Route path="/portal/extension" element={<ExtensionPortal />} />
        <Route path="/portal/extension/farmers" element={<ExtensionFarmers />} />
        <Route path="/portal/extension/training" element={<ExtensionTrainingPrograms />} />
               <Route path="/portal/extension/settings" element={<ExtensionSettings />} />
               <Route path="/portal/extension/advisory" element={<ExtensionAdvisoryServices />} />
               <Route path="/portal/extension/tech" element={<ExtensionTechnologyTransfer />} />
               <Route path="/portal/extension/monitoring" element={<ExtensionFieldMonitoring />} />
               <Route path="/portal/extension/reports" element={<ExtensionReports />} />
        <Route path="/portal/researcher" element={<ResearcherPortal />} />
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
  );
}

export default App;
