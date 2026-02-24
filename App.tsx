import React from "react";
import { registerAllServices } from "@config/container/registerServices";
import AppNavigator from "@navigation/AppNavigator";

registerAllServices();

export default function App(): React.JSX.Element {
  return <AppNavigator />;
}
