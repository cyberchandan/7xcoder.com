// import { BrowserRouter,Routes,Route } from "react-router";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import "./App.css";
import Header from "./components/Header/Header";
import {
  structuredData,
  addSchemaMarkup,
  pageConfigs,
  updateMetaTags,
} from "./utils/seoConfig";
import HomePage1 from "./components/Home/HomePage1/HomePage1";
import HomePage3 from "./components/Home/HomePage3/HomePage3";
import HomePage6 from "./components/Home/HomePage6/HomePage6";
import AboutUs2 from "./components/About/AboutUs2";
import AboutUs3 from "./components/About/AboutUs3";
// import HomePage8 from "./components/Home/HomePage8";
import HomePage2 from "./components/Home/HomePage2/HomePage2";
import HomePage9 from "./components/Home/HomePage9";
import Testimonials from "./components/Home/HomePage5-5/Testimonials";

import AboutUs5 from "./components/About/AboutUs5";
import HomePage5 from "./components/Home/HomePage5";
import AboutUs1 from "./components/About/AboutUs1";
import HomePage4 from "./components/Home/HomePage4";
import AboutUs4 from "./components/About/AboutUs4";
import HomePgae78 from "./components/Home/HomePage8/HomePgae78";
import ContactUs_header from "./components/ContactUs/Contact/ContactUs_header";
import Contact from "./components/Home/HomePage8/Contact";

// import Blog from "./components/Blog/Blog";
import Career from "./components/Career/Career";
import AdminLogin from "./components/Admin/Login";
import AdminDashboard from "./components/Admin/Dashboard";


// Service
// import BrandingStrategy from "./components/Services/BrandingStrategy/BrandingStrategy";
// import BusinessSoftwareSolutions from "./components/Services/BusinessSoftwareSolutions/BusinessSoftwareSolutions";
// import DesignCreativeService from "./components/Services/DesignCreativeService/DesignCreativeService";
// import DigitalMarketingService from "./components/Services/DigitalMarketingService/DigitalMarketingService";
// import EcommerceSolutions from "./components/Services/EcommerceSolutions/EcommerceSolutions";
// import WebAndAppDevelopmentServices from "./components/Services/WebAndAppDevelopment/WebAndAppDevelopmentServices";

import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import CursorGlow from "./components/CursorGlow/CursorGlow";
import WhatsappPopup from "./components/WhatsappPopup/WhatsappPopup";
// import PayPerClick from "./components/Services/DigitalMarketingService/PayPerClick/PayPerClick";
// import WebAndAppDevelopment from "./components/Services/DigitalMarketingService/WebAndAppDevelopment/WebAndAppDevelopment";
// import SEOAndContentWriting from "./components/Services/DigitalMarketingService/SEOAndContentWriting/SEO";
// import EmailAndInfluencerMarketing from "./components/Services/DigitalMarketingService/EmailAndInfluencerMarketing/EmailAndInfluencerMarketing";
// import EcommerceAndMarketing from "./components/Services/DigitalMarketingService/EcommerceAndMarketing/EcommerceAndMarketing";
// import ContentAndVideoMarketing from "./components/Services/DigitalMarketingService/ContentAndVideoMarketing/ContentAndVideoMarketing";
// import AnalyticsROI from "./components/Services/DigitalMarketingService/AnalyticsROI/AnalyticsROI";
// import OnlineReputationManagement from "./components/Services/DigitalMarketingService/OnlineReputationManagement/Online_Reputation_Management";
// import GraphicDesign from "./components/Services/DesignCreativeService/GraphicDesign/GraphicDesign";
// import YoutubeThumbnailVideo from "./components/Services/DesignCreativeService/YoutubeThumbnailVideo/YoutubeThumbnailVideo";

// import PerformanceSecurityoptimization from "./components/Services/WebAndAppDevelopment/Performance,Security&Optimization/PerformanceSecurityoptimization.jsx"
// import UiUxDesign from "./components/Services/DesignCreativeService/UiUxDesign/UiUxDesign";
// import PostProduct from "./components/Services/DesignCreativeService/PostProduction/PostProduct";
// import VisualEffects from "./components/Services/DesignCreativeService/VisualEffects(VFX)/VisualEffects";
// import PhotographyAndVideography from "./components/Services/DesignCreativeService/PhotographyAndVideography/PhotographyAndVideography";
// import ProductVisualisation from "./components/Services/DesignCreativeService/3DPV/ProductVisualisation";
// import MotionGraphicsAnimation from "./components/Services/DesignCreativeService/MotionGraphics&Animation/MotionGraphics&Animation";
// import BackendAndAPIDevelopment from "./components/Services/WebAndAppDevelopment/BackendAndAPIDevelopment/BackendAndAPIDevelopment.jsx"
// import MobileAppDevelopment from "./components/Services/WebAndAppDevelopment/MobileAppDevelopment/MobileAppDevelopment.jsx";
// import MaintenanceSupport from "./components/Services/WebAndAppDevelopment/Maintenance&Support/MaintenanceSupport.jsx";
// import UIUXDrivenDevelopment from "./components/Services/WebAndAppDevelopment/UIUXDrivenDevelopment/UIUXDrivenDevelopment.jsx";

// Blog
import Blog from "./components/Blog/Blog";


// import PerformanceSecurity from "./components/Services/WebAndAppDevelopment/Performance,Security&Optimization/PerformanceSecurityoptimization.jsx"

// Branding and Strategy
// import BrandStrategyPositioning from "./components/Services/BrandingStrategy/BrandStrategyPositioning/BrandStrategyPositioning.jsx";
// import BrandGuidelinesGovernance from "./components/Services/BrandingStrategy/BrandGuidelinesGovernance/BrandGuidelinesGovernance.jsx";
// import BrandIntegrationImplementation from "./components/Services/BrandingStrategy/BrandIntegrationImplementation/BrandIntegrationImplementation.jsx";
// import BrandSupportOptimization from "./components/Services/BrandingStrategy/BrandSupportOptimization/BrandSupportOptimization.jsx";
// import MarketAndAudienceResearch from "./components/Services/BrandingStrategy/MarketAndAudienceResearch/MarketAndAudienceResearch.jsx";
// import ScalableBrandArchitecture from "./components/Services/BrandingStrategy/ScalableBrandArchitecture/ScalableBrandArchitecture.jsx";
// import StrategicBrandMessaging from "./components/Services/BrandingStrategy/StrategicBrandMessaging/StrategicBrandMessaging.jsx";
// import BrandIdentityDesignSystems from "./components/Services/BrandingStrategy/BrandIdentityDesignSystems/BrandIdentityDesignSystems.jsx";

// Business Software Solutions
// import SecureScalableArchitectureBusiness from "./components/Services/BusinessSoftwareSolutions/SecureScalableArchitecture/SecureScalableArchitecture.jsx";
// import DataAndReportingSystems from "./components/Services/BusinessSoftwareSolutions/DataAndReportingSystems/DataAndReportingSystems.jsx";
// import CloudBasedSoftwareSolutions from "./components/Services/BusinessSoftwareSolutions/CloudBasedSoftwareSolutions/CloudBasedSoftwareSolutions.jsx";
// import EnterpriseInternalSystems from "./components/Services/BusinessSoftwareSolutions/Enterprise&InternalSystems/Enterprise&InternalSystems.jsx";
// import ProcessAutomationSolutions from "./components/Services/BusinessSoftwareSolutions/ProcessAutomationSolutions/ProcessAutomationSolutions.jsx";
// import SystemIntegrationServices from "./components/Services/BusinessSoftwareSolutions/SystemIntegrationServices/SystemIntegrationServices.jsx";

// Ecommerce Solutions
// import CheckoutConversionOptimization from "./components/Services/EcommerceSolutions/CheckoutConversionOptimization/CheckoutConversionOptimization.jsx";
// import CustomEcommerceDevelopment from "./components/Services/EcommerceSolutions/CustomE-commerceDevelopment/CustomEcommerceDevelopment.jsx";
// import EnterpriseAndMarketplaceSolutions from "./components/Services/EcommerceSolutions/EnterpriseAndMarketplaceSolutions/EnterpriseAndMarketplaceSolutions.jsx";
// import MaintenanceSupportAndOptimization from "./components/Services/EcommerceSolutions/MaintenanceSupportAndOptimization/MaintenanceSupportAndOptimization.jsx";
// import ProductInventoryOrders from "./components/Services/EcommerceSolutions/ProductInventoryOrders/ProductInventoryOrders.jsx";
// import SecureScalableArchitecture from "./components/Services/EcommerceSolutions/SecureScalableArchitecture/SecureScalableArchitecture.jsx";
// import SystemIntegrationServicesEcom from "./components/Services/EcommerceSolutions/SystemIntegrationServicesEcom/SystemIntegrationServicesEcom.jsx";

// import CustomWebsiteDevelopment from "./components/Services/WebAndAppDevelopment/CustomWebsiteDevelopment/CustomWebsiteDevelopment.jsx";


// HRMS
// import HRMS from "./components/Services/HRMS/HRMS.jsx"


function AppContent() {
  const location = useLocation();

  useEffect(() => {
    // Add organization structured data
    addSchemaMarkup(structuredData.organization);

    // Update meta tags based on route
    const path = location.pathname;

    if (path === "/") {
      updateMetaTags(
        pageConfigs.home.title,
        pageConfigs.home.description,
        pageConfigs.home.keywords,
        pageConfigs.home.canonicalUrl,
      );
    } else if (path === "/about") {
      updateMetaTags(
        pageConfigs.about.title,
        pageConfigs.about.description,
        pageConfigs.about.keywords,
        pageConfigs.about.canonicalUrl,
      );
    } else if (path === "/contact") {
      updateMetaTags(
        pageConfigs.contact.title,
        pageConfigs.contact.description,
        pageConfigs.contact.keywords,
        pageConfigs.contact.canonicalUrl,
      );
    } else if (path === "/blog") {
      updateMetaTags(
        pageConfigs.blog.title,
        pageConfigs.blog.description,
        pageConfigs.blog.keywords,
        pageConfigs.blog.canonicalUrl,
      );
    } else if (path === "/careers") {
      updateMetaTags(
        pageConfigs.career.title,
        pageConfigs.career.description,
        pageConfigs.career.keywords,
        pageConfigs.career.canonicalUrl,
      );
    }

    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <ScrollToTop />
      <CursorGlow />
      <WhatsappPopup />
      <Header className="main-header" />

      <Routes>
         {/* HOME */}
         <Route path="/" element={<><HomePage1/><HomePage2/><HomePage3/><HomePage4/><HomePage5/><Testimonials/><HomePage6/><HomePgae78/><HomePage9/></>}/>
         
         {/* ABOUT */}
         <Route path="/about" element={<><AboutUs1/><AboutUs2/><AboutUs3/><AboutUs4/><HomePage9/></>}/>

         {/* CONTACT */}
         <Route path="/contact" element={<><ContactUs_header/><Contact/><HomePage9/></>}/>

         {/* BLOG */}
         <Route path="/blog" element={<><Blog/></>}/>
        <Route
          path="/careers"
          element={
            <>
              <Career />
            </>
          }
        />
        <Route
          path="/admin/login"
          element={
            <>
              <AdminLogin />
            </>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <>
              <AdminDashboard />
            </>
          }
        />
         {/* SERVICES */}
         {/* <Route path="/services/branding-strategy" element={<><BrandingStrategy/></>}/>
         <Route path="/services/business-software-solutions" element={<><BusinessSoftwareSolutions/></>}/>
         <Route path="/services/design-Creative-Services" element={<><DesignCreativeService/></>} />
         <Route path="/services/digital-marketing" element={<><DigitalMarketingService/></>}/>
         <Route path="/services/ecommerce-solutions" element={<><EcommerceSolutions/></>}/>
         <Route path="/services/web-and-app-development-services" element={<><WebAndAppDevelopmentServices/></>}/> */}

         {/* Branding and Strategy */}
          {/* <Route path="/services/brand-strategy-positioning" element={<><BrandStrategyPositioning/><HomePage9/></>}/>
          <Route path="/services/brand-identity-design-system" element={<><BrandIdentityDesignSystems/><HomePage9/></>} />
          <Route path="/services/messaging-communication-strategy" element={<><StrategicBrandMessaging/><HomePage9/></>} />
          <Route path="/services/market-audience-research" element={<><MarketAndAudienceResearch/><HomePage9/></>} />
          <Route path="/services/brand-integration-implementation" element={<><BrandIntegrationImplementation/><HomePage9/></>} />
          <Route path="/services/scalable-bradn-architecture" element={<><ScalableBrandArchitecture/><HomePage9/></>} />
          <Route path="/services/brand-guidelines-governance" element={<><BrandGuidelinesGovernance/><HomePage9/></>} />
          <Route path="/services/ongoing-brand-support-optimization" element={<><BrandSupportOptimization/><HomePage9/></>} />
 */}

          
          {/* Business Software Solutions */}
          {/* <Route path="/services/custom-business-software-development" element={<><HomePage9/></>} />
          <Route path="/services/enterprise-internal-system" element={<><EnterpriseInternalSystems/><HomePage9/></>} />
          <Route path="/services/process-automation-solutions" element={<><ProcessAutomationSolutions/><HomePage9/></>} />
          <Route path="/services/data-management-reporting-system" element={<><DataAndReportingSystems/><HomePage9/></>} />
          <Route path="/services/system-integration-services" element={<><SystemIntegrationServices/><HomePage9/></>} />
          <Route path="/services/secure-scalable-arch" element={<><SecureScalableArchitectureBusiness/><HomePage9/></>} />
          <Route path="/services/cloud-based-soft-sol" element={<><CloudBasedSoftwareSolutions/><HomePage9/></>} />
          <Route path="/services/maintenance-support-opt" element={<><HomePage9/></>} /> */}

          {/* Design Creative Service */}
         {/* <Route path="/services/graphic-design" element={<><GraphicDesign/><HomePage9/></>}/>
         <Route path="/services/youtube-thumbnail-video" element={<><YoutubeThumbnailVideo/><HomePage9/></>}/>
         <Route path="/services/ui-ux-design" element={<><UiUxDesign/><HomePage9/></>}/>
         <Route path="/services/post-product" element={<><PostProduct/><HomePage9/></>}/>
         <Route path="/services/product-visualisation" element={<><ProductVisualisation/><HomePage9/></>}/>
         <Route path="/services/motion-graphics" element={<><MotionGraphicsAnimation/><HomePage9/></>}/>
         <Route path="/services/visual-effests" element={<><VisualEffects/><HomePage9/></>}/>
         <Route path="/services/photography-videography" element={<><PhotographyAndVideography/><HomePage9/></>}/> */}


          {/* Digital Marketing Service */}

         {/* <Route path="/services/pay-per-click" element={<><PayPerClick/><HomePage9/></>}/>
         <Route path="/web-and-app-development" element={<><WebAndAppDevelopment/><HomePage9/></>}/>
         <Route path="/services/seo-and-content-writing" element={<><SEOAndContentWriting/><HomePage9/></>}/>
         <Route path="/services/email-and-influencer-marketing" element={<><EmailAndInfluencerMarketing/><HomePage9/></>}/>
         <Route path="/services/ecommerce-and-marketing" element={<><EcommerceAndMarketing/><HomePage9/></>}/>
         <Route path="/services/content-and-video-marketing" element={<><ContentAndVideoMarketing/><HomePage9/></>}/>
         <Route path="/services/analytics-and-roi-tracking" element={<><AnalyticsROI/><HomePage9/></>}/>
         <Route path="/services/online-reputation-management" element={<><OnlineReputationManagement/><HomePage9/></>}/>

          */}


          {/* Ecommerce Solutions */}
          {/* <Route path="/services/custom-e-commerce-development" element={<><CustomEcommerceDevelopment/><HomePage9/></>} />
          <Route path="/services/enterprise-marketplace-solutions" element={<><EnterpriseAndMarketplaceSolutions/><HomePage9/></>} />
          <Route path="/services/checkout-conversion-optimization" element={<><CheckoutConversionOptimization/><HomePage9/></>} />
          <Route path="/services/product-inventory-order-management" element={<><ProductInventoryOrders/><HomePage9/></>} />
          <Route path="/services/system-integration-services-ecom" element={<><SystemIntegrationServicesEcom/><HomePage9/></>} />
          <Route path="/services/secure-scalable-architecture" element={<><SecureScalableArchitecture/><HomePage9/></>} />
          <Route path="/services/cloud-based-e-com-solutions" element={<><HomePage9/></>} />
          <Route path="/services/maintenance-support-optimization" element={<><MaintenanceSupportAndOptimization/><HomePage9/></>} /> */}

          {/* Web and app development */}
         {/* <Route path="/services/Mobile-App-Development" element={<><MobileAppDevelopment/><HomePage9/></>}/>
         <Route path="/services/Maintenance-Support" element={<><MaintenanceSupport/><HomePage9/></>}/>
         <Route path="/services/backend-api" element={<><BackendAndAPIDevelopment/><HomePage9/></>}/>
         <Route path="/services/custom-website-development" element={<><CustomWebsiteDevelopment/><HomePage9/></>}/>
         <Route path="/services/uiux-driven-development" element={<><UIUXDrivenDevelopment/><HomePage9/></>}/>
         <Route path="/services/ecom-development-solution" element={<><HomePage9/></>}/>
         <Route path="/services/performance-sercurity-optimization" element={<><PerformanceSecurityoptimization/><HomePage9/></>}/>
         <Route path="/services/web-and-app-development-services" element={<><WebAndAppDevelopmentServices/><HomePage9/></>}/>
         */}

         {/* <Route path="/services/hrms" element={<><HRMS/><HomePage9/></>} /> */}

      </Routes>
    </>
  );
}

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
}

export default App;
