const error = document.querySelector(".error");

const taskUpdateBtns = () => {
  const taskUpdateBtns = document.querySelectorAll(".task-update");
  taskUpdateBtns.forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      const id = button.parentNode.parentNode.id;
      button.parentElement.parentElement.classList.add("completed");
      button.classList.add("button-remove");
      await fetch(`http://localhost:3000/task/update/${id}`, {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ completed: true }),
      });
    });
  });
};
const taskDeleteBtns = () => {
  const taskDeleteBtns = document.querySelectorAll(".task-delete");
  taskDeleteBtns.forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      const id = button.parentNode.parentNode.id;
      button.parentElement.parentElement.style.display = "none";
      await fetch(`http://localhost:3000/task/delete/${id}`, {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
      });
    });
  });
};

////////////////
//Get Tasks
const taskCotainer = document.querySelector(".tasks");
window.onload = async () => {
  const response = await fetch("http://localhost:3000/task/getall", {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });
  response.json().then((data) => {
    data.forEach((task) => {
      const html = `
                  <div class="task ${task.completed ? "completed" : ""}" id="${
        task._id
      }">
                    <section class="task-info">
                        <div class="task-name">${task.name}</div>
                    </section>
                    <section class="task-buttons">
                        <a class="task-update ${
                          task.completed ? "button-remove" : ""
                        }">Done</a>
                        <a class="task-delete">Delete</a>
                    </section>
                  </div>
        `;
      taskCotainer.insertAdjacentHTML("afterbegin", html);
      taskUpdateBtns();
      taskDeleteBtns();
    });
  });
};
////////////////
//Add Task
const addTaskForm = document.querySelector(".add-task-form");
const addTaskInput = document.querySelector(".add-task-form input");
if (addTaskForm) {
  addTaskForm.addEventListener("submit", async (e) => {
    error.innerHTML = "";
    e.preventDefault();
    const response2 = await fetch("http://localhost:3000/task/post", {
      credentials: "same-origin",
      mode: "same-origin",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: addTaskInput.value, completed: false }),
    });
    response2.json().then((task) => {
      if (task.name) {
        const html = `
                  <div class="task ${task.completed ? "completed" : ""}" id="${
          task._id
        }">
                    <section class="task-info">
                        <div class="task-name">${task.name}</div>
                    </section>
                    <section class="task-buttons">
                        <a class="task-update ${
                          task.completed ? "button-remove" : ""
                        }">Done</a>
                        <a class="task-delete">Delete</a>
                    </section>
                  </div>
        `;
        taskCotainer.insertAdjacentHTML("afterbegin", html);
        taskUpdateBtns();
        taskDeleteBtns();
      } else {
        console.log(task);
        if (task.nameError) {
          error.innerHTML = task.nameError;
        }
      }
    });
  });
}

/////////////////
//LoginForm
const loginForm = document.querySelector(".login-form");
const loginInput = document.querySelectorAll(".login-form input");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dataToSend = JSON.stringify({
      email: loginInput[0].value,
      password: loginInput[1].value,
    });
    await fetch("http://localhost:3000/user/login   ", {
      credentials: "same-origin",
      mode: "same-origin",
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: dataToSend,
    }).then((res) =>
      res.json().then((data) => {
        if (data.error) {
          error.innerHTML = data.error;
        } else {
          location.reload(true);
        }
      })
    );
  });
}
////////////////
////////////////
//RegisterForm
const registerForm = document.querySelector(".register-form");
const registerInput = document.querySelectorAll(".register-form input");
const nameError = document.querySelector(".name-error");
const emailError = document.querySelector(".email-error");
const passwordError = document.querySelector(".password-error");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    nameError.innerHTML = "";
    emailError.innerHTML = "";
    passwordError.innerHTML = "";
    error.innerHTML = "";
    e.preventDefault();
    const dataToSend = JSON.stringify({
      name: registerInput[0].value,
      email: registerInput[1].value,
      password: registerInput[2].value,
    });
    await fetch("http://localhost:3000/user/register", {
      credentials: "same-origin",
      mode: "same-origin",
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: dataToSend,
    }).then((res) =>
      res.json().then((data) => {
        if (data.error) {
          error.innerHTML = data.error;
        }
        if (data.nameError) {
          nameError.innerHTML = data.nameError;
        }
        if (data.emailError) {
          emailError.innerHTML = data.emailError;
        }
        if (data.passwordError) {
          passwordError.innerHTML = data.passwordError;
        }
        if (
          !data.error &&
          !data.nameError &&
          !data.emailError &&
          !data.passwordError
        ) {
          location.reload(true);
        }
      })
    );
  });
}
////////////////
//Update Task
////////////////
