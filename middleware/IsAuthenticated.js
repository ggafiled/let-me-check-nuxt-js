export default function({ store, redirect, app }) {
  // If the user is not authenticated
  if (!app.$cookies.get("auth") && !app.$cookies.get("userId")) {
    return redirect("/register");
  }
}
