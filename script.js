
document.documentElement.classList.add("js-active");

// 1. MENU HAMBURGER
const boutonMenu = document.querySelector(".menu-mobile");
const liensNavigation = document.querySelector("#liens-navigation");

if (boutonMenu && liensNavigation) {
  function fermerMenu() {
    liensNavigation.classList.remove("ouvert");
    document.body.classList.remove("menu-ouvert");
    boutonMenu.setAttribute("aria-expanded", "false");
    boutonMenu.setAttribute("aria-label", "Ouvrir le menu");
  }

  boutonMenu.addEventListener("click", () => {
    const ouvert = liensNavigation.classList.toggle("ouvert");
    document.body.classList.toggle("menu-ouvert", ouvert);
    boutonMenu.setAttribute("aria-expanded", String(ouvert));
    boutonMenu.setAttribute(
      "aria-label",
      ouvert ? "Fermer le menu" : "Ouvrir le menu"
    );
  });

  liensNavigation.querySelectorAll("a").forEach((lien) => {
    lien.addEventListener("click", fermerMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") fermerMenu();
  });
}

// 2. CARTE : ENTREES / PLATS / DESSERTS
const onglets = [...document.querySelectorAll(".onglet")];
const panneaux = [...document.querySelectorAll(".panneau-carte")];
const photoCarte = document.querySelector("#photo-carte");

const photosCategories = {
  entrees: "images/entrees.jpg",
  plats: "images/plats.jpg",
  desserts: "images/desserts.jpg"
};

let transitionCarteEnCours = false;

async function changerCategorie(categorie) {
  if (transitionCarteEnCours) return;

  const ongletActif = onglets.find(
    (onglet) => onglet.dataset.categorie === categorie
  );
  const nouveauPanneau = document.getElementById(`menu-${categorie}`);
  const panneauActuel = document.querySelector(".panneau-carte.actif");

  if (!ongletActif || !nouveauPanneau) return;
  if (panneauActuel === nouveauPanneau) return;

  transitionCarteEnCours = true;

  const duree = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? 0
    : 350;

  if (panneauActuel) panneauActuel.classList.add("sortie");
  if (photoCarte) photoCarte.classList.add("changement");

  await new Promise((resolve) => setTimeout(resolve, duree));

  onglets.forEach((onglet) => {
    const actif = onglet === ongletActif;
    onglet.classList.toggle("actif", actif);
    onglet.setAttribute("aria-selected", String(actif));
    onglet.tabIndex = actif ? 0 : -1;
  });

  panneaux.forEach((panneau) => {
    panneau.hidden = panneau !== nouveauPanneau;
    panneau.classList.remove("actif", "sortie", "entree");
  });

  nouveauPanneau.classList.add("actif", "entree");

  if (photoCarte && photosCategories[categorie]) {
    const nouvellePhoto = photosCategories[categorie];
    const imageTest = new Image();

    imageTest.onload = () => {
      photoCarte.src = nouvellePhoto;
      photoCarte.alt = `Photographie gastronomique : ${categorie}`;
    };

    imageTest.onerror = () => {
      console.warn("Photo introuvable :", nouvellePhoto);
    };

    imageTest.src = nouvellePhoto;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      nouveauPanneau.classList.remove("entree");
      if (photoCarte) photoCarte.classList.remove("changement");
    });
  });

  await new Promise((resolve) => setTimeout(resolve, duree));
  transitionCarteEnCours = false;
}

onglets.forEach((onglet, index) => {
  onglet.addEventListener("click", () => {
    changerCategorie(onglet.dataset.categorie);
  });

  onglet.addEventListener("keydown", (event) => {
    let nouvelIndex = index;

    if (event.key === "ArrowRight") {
      nouvelIndex = (index + 1) % onglets.length;
    } else if (event.key === "ArrowLeft") {
      nouvelIndex = (index - 1 + onglets.length) % onglets.length;
    } else if (event.key === "Home") {
      nouvelIndex = 0;
    } else if (event.key === "End") {
      nouvelIndex = onglets.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nouvelOnglet = onglets[nouvelIndex];
    changerCategorie(nouvelOnglet.dataset.categorie);
    nouvelOnglet.focus();
  });
});

// 3. ANIMATIONS AU DEFILEMENT
const elementsAnimes = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observateur = new IntersectionObserver(
    (entrees, observer) => {
      entrees.forEach((entree) => {
        if (entree.isIntersecting) {
          entree.target.classList.add("visible");
          observer.unobserve(entree.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px 40px 0px"
    }
  );

  elementsAnimes.forEach((element) => observateur.observe(element));
} else {
  elementsAnimes.forEach((element) => element.classList.add("visible"));
}

// 4. FORMULAIRE DE RESERVATION DEMO
const formulaire = document.querySelector("#formulaire-reservation");
const champDate = document.querySelector("#date");
const messageFormulaire = document.querySelector(".message-formulaire");

if (champDate) {
  const maintenant = new Date();
  const annee = maintenant.getFullYear();
  const mois = String(maintenant.getMonth() + 1).padStart(2, "0");
  const jour = String(maintenant.getDate()).padStart(2, "0");

  champDate.min = `${annee}-${mois}-${jour}`;
}

if (formulaire && messageFormulaire) {
  formulaire.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!formulaire.checkValidity()) {
      formulaire.reportValidity();
      return;
    }

    messageFormulaire.textContent =
      "Ceci est une démonstration : aucune réservation n'a été envoyée.";

    formulaire.reset();
  });
}
