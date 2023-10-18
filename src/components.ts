export interface Restaurant {
  name: string,
  address: string,
  company: string,
  city: string,
  postalCode: number,
  phone: number,
  _id: number
}



export interface Course{
  name: string,
  diets: string,
  price: number,
}

export interface Days{
  date: string,
  courses: Course[]
}

export interface Menu{
  days: Days[]
  date: string,
  courses: Course[];
}


const restaurantRow = (restaurant: Restaurant): HTMLTableRowElement => {
  const {name, address, company} = restaurant;
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

const restaurantModal = (restaurant: Restaurant, menu: Menu): string => {
  const {name, address, city, postalCode, phone, company} = restaurant;
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
  
  menu.courses.forEach((course: Course) => {
    const {name, diets, price} = course;
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


const restaurantModalWeekly = (restaurant: Restaurant, menu: Menu): string => {
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

  menu.days.forEach((day: Days) => {
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

    courses.forEach((course: Course) => {
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



const errorModal = (message: string): string => {
  const html = `
        <h3>Error</h3>
        <p>${message}</p>
        `;
  return html;
};

export {restaurantRow, restaurantModal, restaurantModalWeekly, errorModal};
