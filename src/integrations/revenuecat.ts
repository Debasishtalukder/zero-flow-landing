import { Purchases, CustomerInfo, LogLevel } from "@revenuecat/purchases-js";

const REVENUECAT_API_KEY = "test_NtHAoHbWhcUIOPKYZxMtVZxrLIb";
const ENTITLEMENT_ID = "deba Pro";

// Set log level for debugging
Purchases.setLogLevel(LogLevel.Debug);

export const initializePurchases = (appUserId: string): Purchases => {
  if (Purchases.isConfigured()) {
    return Purchases.getSharedInstance();
  }
  return Purchases.configure({
    apiKey: REVENUECAT_API_KEY,
    appUserId: appUserId,
  });
};

export const getPurchasesInstance = (): Purchases => {
  return Purchases.getSharedInstance();
};

export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  try {
    const instance = getPurchasesInstance();
    return await instance.getCustomerInfo();
  } catch (error) {
    console.error("Failed to get customer info:", error);
    return null;
  }
};

export const isEntitledToPro = async (): Promise<boolean> => {
  try {
    const instance = getPurchasesInstance();
    return await instance.isEntitledTo(ENTITLEMENT_ID);
  } catch (error) {
    console.error("Failed to check entitlement:", error);
    return false;
  }
};

export const presentPaywall = async (htmlTargetSelector: string = "#paywall-container") => {
  try {
    const instance = getPurchasesInstance();
    const element = document.querySelector(htmlTargetSelector) as HTMLElement;
    
    // If target element is not found, it will render as a modal (null target)
    return await instance.presentPaywall({
      htmlTarget: element || undefined,
      onVisitCustomerCenter: () => {
        console.log("User wants to visit customer center");
        openCustomerPortal();
      }
    });
  } catch (error) {
    console.error("Failed to present paywall:", error);
    throw error;
  }
};

export const openCustomerPortal = async () => {
  try {
    const customerInfo = await getCustomerInfo();
    if (customerInfo?.managementURL) {
      window.open(customerInfo.managementURL, "_blank");
    } else {
      console.warn("No management URL found for this customer.");
      // Fallback: If no management URL, maybe they aren't subscribed or it's not configured
    }
  } catch (error) {
    console.error("Failed to open customer portal:", error);
  }
};
