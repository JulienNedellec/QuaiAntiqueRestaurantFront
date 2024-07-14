import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

// Création d'une route pour la page 404 (page introuvable)
const route404 = new Route("404", "Page introuvable", "/pages/404.html", []);

// Fonction pour récupérer la route correspondant à une URL donnée
const getRouteByUrl = (url) => {
  return allRoutes.find(route => route.url === url) || route404;
};

// Fonction pour charger le contenu de la page
const loadContentPage = async () => {
  const path = window.location.pathname;
  const actualRoute = getRouteByUrl(path);

  const { authorize } = actualRoute;
  if (authorize.includes("disconnected") && isConnected()) {
    window.location.replace("/");
    return;
  }

  try {
    const response = await fetch(actualRoute.pathHtml);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const html = await response.text();
    document.getElementById("main-page").innerHTML = html;

    if (actualRoute.pathJS) {
      const scriptTag = document.createElement("script");
      scriptTag.type = "text/javascript";
      scriptTag.src = actualRoute.pathJS;
      document.body.appendChild(scriptTag);
    }

    document.title = `${actualRoute.title} - ${websiteName}`;
    showAndHideElementsForRoles();
  } catch (error) {
    console.error('Error loading content:', error);
  }
};

// Fonction pour gérer les événements de routage (clic sur les liens)
const routeEvent = (event) => {
  const href = event.target.getAttribute('href');
  if (href && href.startsWith('/')) {
    event.preventDefault();
    window.history.pushState({}, "", href);
    loadContentPage();
  }
};

// Gestion de l'événement de retour en arrière dans l'historique du navigateur
window.addEventListener('popstate', loadContentPage);

// Ajout de gestionnaires d'événements aux liens après que le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', routeEvent);
  });

  // Chargement du contenu de la page au chargement initial
  loadContentPage();
});
