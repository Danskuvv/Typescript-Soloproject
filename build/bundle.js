'use strict';

const restaurantRow = (restaurant) => {
    const { name, address, company } = restaurant;
    const tr = document.createElement('tr');
    const nameCell = document.createElement('td');
    nameCell.innerText = name;
    const addressCell = document.createElement('td');
    addressCell.innerText = address;
    const companyCell = document.createElement('td');
    companyCell.innerText = company;
    tr.appendChild(nameCell);
    tr.appendChild(addressCell);
    tr.appendChild(companyCell);
    return tr;
};
const restaurantModal = (restaurant, menu) => {
    const { name, address, city, postalCode, phone, company } = restaurant;
    let html = `<h3>${name}</h3>
    <p>${company}</p>
    <p>${address} ${postalCode} ${city}</p>
    <p>${phone}</p>
    <table>
      <tr>
        <th>Course</th>
        <th>Diet</th>
        <th>Price</th>
      </tr>
    `;
    menu.courses.forEach((course) => {
        const { name, diets, price } = course;
        html += `
          <tr>
            <td>${name}</td>
            <td>${diets ?? ' - '}</td>
            <td>${price ?? ' - '}</td>
          </tr>
          `;
    });
    html += '</table>';
    return html;
};
const restaurantModalWeekly = (restaurant, menu) => {
    const { name, address, city, postalCode, phone, company } = restaurant;
    let html = `<h3>${name}</h3>
    <p>${company}</p>
    <p>${address} ${postalCode} ${city}</p>
    <p>${phone}</p>
    <table>
      <tr>
        <th>Day</th>
        <th>Courses</th>
      </tr>
    `;
    menu.days.forEach((day) => {
        const { date, courses } = day;
        html += `
      <tr>
        <td>${date}</td>
        <td>
          <table>
            <tr>
              <th>Course</th>
              <th>Diet</th>
              <th>Price</th>
            </tr>
    `;
        courses.forEach((course) => {
            const { name, diets, price } = course;
            html += `
            <tr>
              <td>${name}</td>
              <td>${diets ?? ' - '}</td>
              <td>${price ?? ' - '}</td>
            </tr>
          `;
        });
        html += `
          </table>
        </td>
      </tr>
    `;
    });
    html += '</table>';
    return html;
};
const errorModal = (message) => {
    const html = `
        <h3>Error</h3>
        <p>${message}</p>
        `;
    return html;
};

const fetchData = async (url, options = {}) => {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Error ${response.status} occured`);
    }
    const json = response.json();
    return json;
};

const apiUrl = 'https://sodexo-webscrape-r73sdlmfxa-lz.a.run.app/api/v1';
const positionOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

window.onload = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw1.js');
    }
};
/*
const loginForm = document.querySelector('#login-form');
// const profileForm = document.querySelector('#profile-form');
const avatarForm = document.querySelector('#avatar-form');

// select inputs from the DOM
const usernameInput = document.querySelector(
  '#username'
) as HTMLInputElement | null;
const passwordInput = document.querySelector(
  '#password'
) as HTMLInputElement | null;

const profileUsernameInput = document.querySelector(
  '#profile-username'
) as HTMLInputElement | null;
const profileEmailInput = document.querySelector(
  '#profile-email'
) as HTMLInputElement | null;

const avatarInput = document.querySelector(
  '#avatar'
) as HTMLInputElement | null;

// select profile elements from the DOM
const usernameTarget = document.querySelector('#username-target');
const emailTarget = document.querySelector('#email-target');
const avatarTarget = document.querySelector('#avatar-target');

// function to login
const login = async (user: {
  username: string;
  password: string;
}): Promise<LoginUser> => {
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  };
  return await fetchData2<LoginUser>(apiUrl + '/auth/login', options);
};

const addUserDataToDom = (user: User): void => {
  if (
    !usernameTarget ||
    !emailTarget ||
    !avatarTarget ||
    !profileEmailInput ||
    !profileUsernameInput
  ) {
    return;
  }
  usernameTarget.innerHTML = user.username;
  emailTarget.innerHTML = user.email;
  (avatarTarget as HTMLImageElement).src = uploadUrl + user.avatar;

  profileEmailInput.value = user.email;
  profileUsernameInput.value = user.username;
};

// function to get userdata from API using token
const getUserData = async (token: string): Promise<User> => {
  const options: RequestInit = {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };
  return await fetchData2<User>(apiUrl + '/users/token', options);
};



// function to check local storage for token and if it exists fetch
// userdata with getUserData then update the DOM with addUserDataToDom
const checkToken = async (): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) {
    return;
  }
  const userData = await getUserData(token);
  addUserDataToDom(userData);
};

// call checkToken on page load to check if token exists and update the DOM
checkToken();

// TODO: login form event listener
// event listener should call login function and save token to local storage
// then call addUserDataToDom to update the DOM with the user data
loginForm?.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  if (!usernameInput || !passwordInput) {
    return;
  }
  const user = {
    username: usernameInput.value,
    password: passwordInput.value,
  };
  const loginData = await login(user);
  console.log(loginData);
  // alert(loginData.message);
  localStorage.setItem('token', loginData.token);
  addUserDataToDom(loginData.data);
});
*/ //LOGIN STUFF ABOVE MAYBE WORKS MAYBE NOT
const modal = document.querySelector('dialog');
if (!modal) {
    throw new Error('Modal not found');
}
const calculateDistance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
const createTable = (restaurants) => {
    const table = document.querySelector('table');
    table.innerHTML = '';
    restaurants.forEach((restaurant) => {
        const tr = restaurantRow(restaurant);
        table.appendChild(tr);
        tr.addEventListener('click', async () => {
            try {
                // remove all highlights
                const allHighs = document.querySelectorAll('.highlight');
                allHighs.forEach((high) => {
                    high.classList.remove('highlight');
                });
                // add highlight
                tr.classList.add('highlight');
                // add restaurant data to modal
                modal.innerHTML = '';
                const weeklyShow = document.createElement('Button');
                const dailyShow = document.createElement('Button');
                const closeModal = document.createElement('Button');
                weeklyShow.textContent = 'Show Weekly';
                dailyShow.textContent = 'Show Daily';
                closeModal.textContent = 'X';
                dailyShow.id = 'weeklyShow';
                weeklyShow.id = 'weeklyShow';
                closeModal.id = 'closeModal';
                closeModal.addEventListener('click', function (evt) {
                    modal.close();
                });
                // fetch menu daily
                const menuDaily = await fetchData(apiUrl + `/restaurants/daily/${restaurant._id}/fi`);
                console.log(menuDaily);
                // fetch menu weekly
                const menuWeekly = await fetchData(apiUrl + `/restaurants/weekly/${restaurant._id}/fi`);
                console.log(menuWeekly);
                //make show daily button show the daily info, clears the modal first, then adds buttons then adds the menu info.
                dailyShow.addEventListener('click', function (evt) {
                    evt.preventDefault();
                    modal.innerHTML = '';
                    modal.insertAdjacentElement('beforeend', dailyShow);
                    modal.insertAdjacentElement('beforeend', weeklyShow);
                    modal.insertAdjacentElement('beforeend', closeModal);
                    const menuHtml = restaurantModal(restaurant, menuDaily);
                    modal.insertAdjacentHTML('beforeend', menuHtml);
                });
                //make show weekly button show the weekly info, clears the modal first, then adds buttons then adds the menu info.
                weeklyShow.addEventListener('click', function (evt) {
                    evt.preventDefault();
                    modal.innerHTML = '';
                    modal.insertAdjacentElement('beforeend', dailyShow);
                    modal.insertAdjacentElement('beforeend', weeklyShow);
                    modal.insertAdjacentElement('beforeend', closeModal);
                    const menuHtml = restaurantModalWeekly(restaurant, menuWeekly); //menuweekly doesnt work yet.
                    modal.insertAdjacentHTML('beforeend', menuHtml);
                });
                const menuHtml = restaurantModal(restaurant, menuDaily);
                modal.insertAdjacentElement('beforeend', dailyShow);
                modal.insertAdjacentElement('beforeend', weeklyShow);
                modal.insertAdjacentElement('beforeend', closeModal);
                modal.insertAdjacentHTML('beforeend', menuHtml);
                modal.showModal();
                /* fetch menu weekly
                const menuWeekly = await fetchData(
                  apiUrl + `/restaurants/weekly/${restaurant._id}/fi`
                );
                console.log(menuWeekly);
        
                const menuHtml = restaurantModal(restaurant, menuWeekly);
                modal.insertAdjacentElement('beforeend', weeklyLabel)
                modal.insertAdjacentHTML('beforeend', menuHtml);
        
                modal.showModal();
                */
            }
            catch (error) {
                modal.innerHTML = errorModal(error.message);
                modal.showModal();
            }
        });
    });
};
const error = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
};
const success = async (pos) => {
    try {
        const crd = pos.coords;
        const restaurants = await fetchData(apiUrl + '/restaurants');
        console.log(restaurants);
        restaurants.sort((a, b) => {
            const x1 = crd.latitude;
            const y1 = crd.longitude;
            const x2a = a.location.coordinates[1];
            const y2a = a.location.coordinates[0];
            const distanceA = calculateDistance(x1, y1, x2a, y2a);
            const x2b = b.location.coordinates[1];
            const y2b = b.location.coordinates[0];
            const distanceB = calculateDistance(x1, y1, x2b, y2b);
            return distanceA - distanceB;
        });
        createTable(restaurants);
        // buttons for filtering
        const sodexoBtn = document.querySelector('#sodexo');
        const compassBtn = document.querySelector('#compass');
        const resetBtn = document.querySelector('#reset');
        const cityBar = document.querySelector('#cityfilter');
        sodexoBtn.addEventListener('change', () => {
            const isSodexoChecked = sodexoBtn.checked;
            compassBtn.checked = false;
            const filteredRestaurants = restaurants.filter((restaurant) => {
                if (isSodexoChecked) {
                    // If the checkbox is checked, include only Compass Group restaurants
                    return restaurant.company === 'Sodexo';
                }
                else {
                    // If the checkbox is not checked, include all restaurants
                    return true;
                }
            });
            console.log(filteredRestaurants);
            createTable(filteredRestaurants);
        });
        compassBtn.addEventListener('change', () => {
            const isCompassChecked = compassBtn.checked;
            sodexoBtn.checked = false; //unchecks the other company.
            const filteredRestaurants = restaurants.filter((restaurant) => {
                if (isCompassChecked) {
                    // If the checkbox is checked, include only Compass Group restaurants
                    return restaurant.company === 'Compass Group';
                }
                else {
                    // If the checkbox is not checked, include all restaurants
                    return true;
                }
            });
            console.log(filteredRestaurants);
            createTable(filteredRestaurants);
        });
        resetBtn.addEventListener('click', () => {
            createTable(restaurants);
            sodexoBtn.checked = false;
            compassBtn.checked = false;
        });
        cityBar.addEventListener('input', () => {
            const searchQuery = cityBar.value.trim().toLowerCase();
            const cityRestaurants = restaurants.filter((restaurant) => restaurant.city.toLowerCase().includes(searchQuery) && restaurant.company === 'Sodexo');
            if (sodexoBtn.checked = true) {
                const cityRestaurants = restaurants.filter((restaurant) => restaurant.city.toLowerCase().includes(searchQuery) && restaurant.company === 'Sodexo');
                console.log(cityRestaurants);
                createTable(cityRestaurants);
            }
            else if (compassBtn.checked = true) {
                const cityRestaurants = restaurants.filter((restaurant) => restaurant.city.toLowerCase().includes(searchQuery) && restaurant.company === 'Compass');
                console.log(cityRestaurants);
                createTable(cityRestaurants);
            }
        });
    }
    catch (error) {
        modal.innerHTML = errorModal(error.message);
        modal.showModal();
    }
};
navigator.geolocation.getCurrentPosition(success, error, positionOptions);
// DARKMODE 
function darkMode() {
    const element = document.body;
    const element_modal = modal;
    element.classList.toggle("darkmode");
    element_modal?.classList.toggle('darkmode');
}
const darkButton = document.getElementById('darktheme');
darkButton.addEventListener('click', function (evt) {
    darkMode();
});
// DARKMODE END _____________________________________________________________________
