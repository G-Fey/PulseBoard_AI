import { Redirect } from "expo-router";

export default function Index() {
  // Cette ligne dit à l'application :
  // "Dès que tu arrives ici, redirige immédiatement vers la page de login"
  return <Redirect href="/login" />;
}
