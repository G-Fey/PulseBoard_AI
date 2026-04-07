import { Redirect } from "expo-router";

export default function Index() {
  // Cette ligne dit : "Dès que l'app s'ouvre, va sur le dashboard"
  return <Redirect href="/login" />;
}
