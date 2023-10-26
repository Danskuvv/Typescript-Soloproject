import {errorModal, restaurantModal, restaurantModalWeekly, restaurantRow} from './components';
import {fetchData} from './functions';
import {apiUrl, positionOptions} from './variables';

import { Restaurant } from './components'
import { Course } from './components'
import { Menu } from './components';

import {UpdateResult} from './interfaces/UpdateResult';
import {UploadResult} from './interfaces/UploadResult';
import {LoginUser, UpdateUser, User} from './interfaces/User';
import {uploadUrl} from './variables';
import { fetchData2 } from './functions';

window.onload = () => {
  'use strict';

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
*/    //LOGIN STUFF ABOVE NOT WORING YET

const modal = document.querySelector('dialog');
if (!modal) {
  throw new Error('Modal not found');
}

const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

const createTable = (restaurants: Restaurant[]) => {
  const table = document.querySelector('table');
  table!.innerHTML = '';
  restaurants.forEach((restaurant: Restaurant) => {
    const tr = restaurantRow(restaurant);
    table!.appendChild(tr);
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
      
        const weeklyShow = document.createElement('Button')
        const dailyShow = document.createElement('Button')
        const closeModal = document.createElement('Button')
        closeModal.id = "CloseModal"
        weeklyShow.textContent= 'Show Weekly'
        dailyShow.textContent = 'Show Daily'
        closeModal.textContent = 'X'
        dailyShow.id = 'weeklyShow'
        weeklyShow.id = 'weeklyShow'
        closeModal.id = 'closeModal'
        
        
        closeModal.addEventListener('click', function(evt){
          modal.close()
        })
        
        
        // fetch menu daily
        const menuDaily = await fetchData(
          apiUrl + `/restaurants/daily/${restaurant._id}/fi`
        );
        
        console.log(menuDaily);
        
        // fetch menu weekly
        const menuWeekly = await fetchData(
          apiUrl + `/restaurants/weekly/${restaurant._id}/fi`
        );
        console.log(menuWeekly);

        //make show daily button show the daily info, clears the modal first, then adds buttons then adds the menu info.
        dailyShow!.addEventListener('click', function(evt){
          evt.preventDefault()
          modal.innerHTML = '';
          modal.insertAdjacentElement('beforeend', dailyShow)
          modal.insertAdjacentElement('beforeend', weeklyShow)
          modal.insertAdjacentElement('beforeend', closeModal)
          const menuHtml = restaurantModal(restaurant, menuDaily);
          modal.insertAdjacentHTML('beforeend', menuHtml);
        })
        
        //make show weekly button show the weekly info, clears the modal first, then adds buttons then adds the menu info.
        weeklyShow!.addEventListener('click', function(evt){
          evt.preventDefault()
          modal.innerHTML = '';
          modal.insertAdjacentElement('beforeend', dailyShow)
          modal.insertAdjacentElement('beforeend', weeklyShow)
          modal.insertAdjacentElement('beforeend', closeModal)
          const menuHtml = restaurantModalWeekly(restaurant, menuWeekly); //menuweekly doesnt work yet.
          modal.insertAdjacentHTML('beforeend', menuHtml);
        })

        const menuHtml = restaurantModal(restaurant, menuDaily);
        modal.insertAdjacentElement('beforeend', dailyShow)
        modal.insertAdjacentElement('beforeend', weeklyShow)
        modal.insertAdjacentElement('beforeend', closeModal)
        modal.insertAdjacentHTML('beforeend', menuHtml);

        modal.showModal();

      } catch (error) {
        modal.innerHTML = errorModal((error as Error).message);
        modal.showModal();
      }
    });
  });
};

const error = (err: { code: number; message: string; }) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

const success = async (pos: GeolocationPosition) => {
  try {
    const crd = pos.coords;
    const restaurants = await fetchData(apiUrl + '/restaurants');
    console.log(restaurants);
    restaurants.sort((a: any, b:any) => {
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
    const sodexoBtn = document.querySelector('#sodexo') as HTMLInputElement;
    const compassBtn = document.querySelector('#compass') as HTMLInputElement;
    const resetBtn = document.querySelector('#reset');
    const cityBar = document.querySelector('#cityfilter') as HTMLInputElement;

  
    sodexoBtn.addEventListener('change', () => {
      const isSodexoChecked = sodexoBtn.checked;
      compassBtn.checked = false;
      cityBar.value = '' //empties city filter


      const filteredRestaurants = restaurants.filter((restaurant: Restaurant) => {
        if (isSodexoChecked) {
          // include only sodexo if checked
          return restaurant.company === 'Sodexo';
        } else {
          // include all restaurants if not checked
          return true;
        }
      })

        console.log(filteredRestaurants);
        createTable(filteredRestaurants);

      })

    
    compassBtn.addEventListener('change', () => {
      const isCompassChecked = compassBtn.checked;
      sodexoBtn.checked = false //unchecks the other company.
      cityBar.value = '' //empties city filter


      const filteredRestaurants = restaurants.filter((restaurant: Restaurant) => {
        if (isCompassChecked) {
          // include only compass if checked
          return restaurant.company === 'Compass Group';
        } else {
          // inclule all if not checked
          return true;
        }
      });
          console.log(filteredRestaurants);
          createTable(filteredRestaurants);
      });

    resetBtn!.addEventListener('click', () => {
      createTable(restaurants);
      sodexoBtn.checked = false;
      compassBtn.checked = false;
      cityBar.value = '' //empties city filter
    });

    cityBar.addEventListener('input', () => {
      const searchQuery = cityBar.value.trim().toLowerCase();
      const cityRestaurants = restaurants.filter(
        (restaurant: Restaurant) => restaurant.city.toLowerCase().includes(searchQuery)
      );
      sodexoBtn.checked = false;
      compassBtn.checked = false;
      console.log(cityRestaurants);
      createTable(cityRestaurants);  
    });


  } catch (error) {
    modal.innerHTML = errorModal((error as Error).message);
    modal.showModal();
  }
};

navigator.geolocation.getCurrentPosition(success, error, positionOptions);


// DARKMODE 
function darkMode() {
  const element = document.body;
  const element_modal = modal
  element.classList.toggle("darkmode");
  element_modal?.classList.toggle('darkmode')
}

const darkButton = document.getElementById('darktheme') as HTMLInputElement
darkButton.addEventListener('click', function(evt){
  darkMode()
})

// DARKMODE END _____________________________________________________________________

