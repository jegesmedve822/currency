function toggleMenu() {
    const menu = document.getElementById("dropdownMenu");
    // Ha "block" -> tegyük "none"-ra, ha "none" -> "block"-ra
    if (menu.style.display === "block") {
      menu.style.display = "none";
    } else {
      menu.style.display = "block";
    }
  }