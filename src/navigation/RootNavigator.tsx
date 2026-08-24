import React, {useCallback, useRef, useState} from 'react';
import {ReportProduct} from '../data/fullReport';
import AssessmentFlowScreen from '../screens/AssessmentFlowScreen';
import AssessmentIntroScreen from '../screens/AssessmentIntroScreen';
import FullReportScreen from '../screens/FullReportScreen';
import LoginScreen from '../screens/LoginScreen';
import PlanBuildingScreen from '../screens/PlanBuildingScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ResultsScreen from '../screens/ResultsScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SplashScreen from '../screens/SplashScreen';
import {resolveIconGender} from '../data/userGender';
import {AuthResult} from '../services/auth';
import {ScreenName} from './types';

/**
 * Plain state-based switcher — the app only has a handful of linear screens
 * right now. If real stack/tab navigation (deep links, back gestures, nested
 * flows) becomes necessary, swap this for React Navigation; the screens
 * already take simple callback props, so the migration only touches this file.
 */
function RootNavigator(): React.JSX.Element {
  const [screen, setScreen] = useState<ScreenName>('splash');
  const [currentUser, setCurrentUser] = useState<AuthResult | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ReportProduct | null>(null);
  // FullReportScreen unmounts whenever we navigate away from it (e.g. into a product's detail
  // page), which would otherwise reset its scroll position — this ref survives that and lets it
  // restore exactly where the user left off.
  const fullReportScrollY = useRef(0);
  const handleFullReportScroll = useCallback((y: number) => {
    fullReportScrollY.current = y;
  }, []);

  const handleSplashComplete = useCallback(() => setScreen('signUp'), []);
  const handleAuthSuccess = useCallback((user: AuthResult) => {
    setCurrentUser(user);
    setScreen('assessmentIntro');
  }, []);
  const goToLogin = useCallback(() => setScreen('login'), []);
  const goToSignUp = useCallback(() => setScreen('signUp'), []);
  const goToAssessmentIntro = useCallback(() => setScreen('assessmentIntro'), []);
  const goToAssessment = useCallback(() => setScreen('assessment'), []);
  const goToBuildingPlan = useCallback(() => setScreen('buildingPlan'), []);
  const goToResults = useCallback(() => setScreen('results'), []);
  const goToFullReport = useCallback(() => setScreen('fullReport'), []);
  const goToProductDetail = useCallback((product: ReportProduct) => {
    setSelectedProduct(product);
    setScreen('productDetail');
  }, []);
  const goBackToFullReport = useCallback(() => setScreen('fullReport'), []);
  const iconGender = resolveIconGender(currentUser?.gender);

  switch (screen) {
    case 'splash':
      return <SplashScreen onAnimationComplete={handleSplashComplete} />;
    case 'signUp':
      return <SignUpScreen onSignUpSuccess={handleAuthSuccess} onNavigateToLogin={goToLogin} />;
    case 'login':
      return (
        <LoginScreen
          onLoginSuccess={handleAuthSuccess}
          onNavigateToSignUp={goToSignUp}
          onBack={goToSignUp}
        />
      );
    case 'assessmentIntro':
      return <AssessmentIntroScreen fullName={currentUser?.fullName} onContinue={goToAssessment} />;
    case 'assessment':
      return (
        <AssessmentFlowScreen
          iconGender={iconGender}
          onComplete={goToBuildingPlan}
          onExit={goToAssessmentIntro}
        />
      );
    case 'buildingPlan':
      return <PlanBuildingScreen onComplete={goToResults} />;
    case 'results':
      return <ResultsScreen onSeeFullReport={goToFullReport} onBack={goToAssessmentIntro} />;
    case 'fullReport':
      // TODO: hand off to a real checkout flow once it's designed — there's no dashboard/home
      // screen to land on instead, so for now this just loops back to the start of the funnel.
      return (
        <FullReportScreen
          iconGender={iconGender}
          onStartPlan={goToAssessmentIntro}
          onSelectProduct={goToProductDetail}
          onBack={goToResults}
          initialScrollY={fullReportScrollY.current}
          onScroll={handleFullReportScroll}
        />
      );
    case 'productDetail':
      // selectedProduct is always set together with this screen by goToProductDetail.
      return <ProductDetailScreen product={selectedProduct!} onBack={goBackToFullReport} />;
  }
}

export default RootNavigator;
