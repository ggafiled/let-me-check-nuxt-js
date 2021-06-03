export default function({ store, redirect, app }) {
  // If the user is not authenticated
  if (localStorage.getItem("authenticated")) {
    return redirect("/myshop");
  } else {
    return;
  }
}
