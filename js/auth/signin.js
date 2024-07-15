const mailInput = document.getElementById("EmailInput");
const passwordInput = document.getElementById("PasswordInput");
const btnSignin = document.getElementById("BtnSignin");
const signinForm = document.getElementById("signinForm");

const btnSingin = document.getElementById("btnSignin");

btnSingin.addEventListener("click", checkCredentials);

function checkCredentials() {
  const dataForm = new FormData(signinForm);
  const myHeaders = new Headers();

  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    username: dataForm.get("Email"),
    password: dataForm.get("Password"),
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(apiURL + "login", requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        mailInput.classList.add("is-invalid");
        passwordInput.classList.add("is-invalid");
      }
    })
    .then((result) => {
      const token = result.apiToken;
      setToken(token);

      setCookie(RoleCookieName, result.roles[0], 7);
      window.location.replace("/");
    })
    .catch((error) => console.error(error));
}
