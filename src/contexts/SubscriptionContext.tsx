import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  initializePurchases, 
  getCustomerInfo, 
  presentPaywall, 
  openCustomerPortal, 
  isEntitledToPro
} from "@/integrations/revenuecat";
import { CustomerInfo } from "@revenuecat/purchases-js";

interface SubscriptionContextType {
  isPro: boolean;
  loading: boolean;
  customerInfo: CustomerInfo | null;
  showPaywall: () => Promise<void>;
  showCustomerPortal: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isPro: false,
  loading: true,
  customerInfo: null,
  showPaywall: async () => {},
  showCustomerPortal: async () => {},
  refreshSubscription: async () => {},
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  const refreshSubscription = useCallback(async () => {
    if (!user) {
      setIsPro(false);
      setCustomerInfo(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const info = await getCustomerInfo();
      setCustomerInfo(info);
      if (info) {
        // Double check entitlement via helper
        const proEntitlement = await isEntitledToPro();
        setIsPro(proEntitlement);
      }
    } catch (error) {
      console.error("Error refreshing subscription:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      initializePurchases(user.id);
      refreshSubscription();
    } else {
      setIsPro(false);
      setCustomerInfo(null);
      setLoading(false);
    }
  }, [user?.id, refreshSubscription]);

  const handleShowPaywall = async () => {
    try {
      await presentPaywall();
      await refreshSubscription();
    } catch (error) {
      console.error("Failed to show paywall:", error);
    }
  };

  const handleShowCustomerPortal = async () => {
    await openCustomerPortal();
  };

  return (
    <SubscriptionContext.Provider 
      value={{ 
        isPro, 
        loading, 
        customerInfo, 
        showPaywall: handleShowPaywall, 
        showCustomerPortal: handleShowCustomerPortal,
        refreshSubscription
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
