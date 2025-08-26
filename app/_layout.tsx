import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CartProvider } from "@/store/cart-store";
import { OrderProvider } from "@/store/order-store";
import { AdminProvider } from "@/store/admin-store";
import { initializeMenuData } from "@/services/menu-service";
// Initialize Firebase
import "@/config/firebase";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="checkout" options={{ presentation: "modal" }} />
      <Stack.Screen name="order-status" options={{ presentation: "modal" }} />
      <Stack.Screen name="qr-scanner" options={{ presentation: "modal" }} />
      <Stack.Screen name="qr-generator" options={{ headerShown: true }} />
      <Stack.Screen name="admin-dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="menu-management" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize menu data in Firebase
        await initializeMenuData();
        // Hide splash screen after initialization
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error('Initialization error:', error);
        SplashScreen.hideAsync();
      }
    };
    
    initialize();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AdminProvider>
          <OrderProvider>
            <CartProvider>
              <RootLayoutNav />
            </CartProvider>
          </OrderProvider>
        </AdminProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}