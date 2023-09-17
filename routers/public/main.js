const rolesTable = document.getElementById('roles-table'); // Assuming your table has an ID

async function deleteRow(id) {
    try {
        
        const response = await fetch(`http://localhost:3000/roles/${id}`, {
            method: 'DELETE'
        });

        if (response.status === 200) {
            // Role deleted successfully, remove the corresponding row from the table
            const rowToDelete = document.querySelector(`[data-id="${id}"]`);
            if (rowToDelete) {
                rowToDelete.remove();
            }
        } else {
            console.error('Failed to delete role.');
        }
    } catch (err) {
        console.error(err);
    }
}

// Fetch and display roles data when the page loads
window.addEventListener('load', () => {
    fetchRoles();
});

function editRow(button) {
    const row = button.closest('tr'); // Find the closest parent row

    const fields = row.querySelectorAll('td:not(:last-child)');
    console.log(fields);
    // Exclude the last cell with buttons
    fields.forEach(field => {
        const text = field.textContent;
        if (!field.querySelector('input')) { // Check if there's no input element already
            field.innerHTML = `<input type="text" value="${text}">`;
        }
    });

    const editButton = row.querySelector('.edit-button');
    const saveButton = row.querySelector('.save-button');
    const cancelButton = row.querySelector('.cancel-button');

    editButton.style.display = 'none';
    saveButton.style.display = 'block';
    cancelButton.style.display = 'block';

}

async function saveRow(id, button) {
    const row = button.closest('tr'); // Find the closest parent row
    const editInputs = row.querySelectorAll('[data-field]'); // Select all editable input fields
console.log( editInputs);
    // Prepare the updated role data
    const updatedRoleData = {};
    editInputs.forEach(input => {
        const fieldName = input.getAttribute('data-field');

       // const fieldName = input.getAttribute('role'); // Get the field name from the input's data-field attribute
        updatedRoleData[fieldName] = input.value;
    });
console.log( updatedRoleData);
    try {
        // Send a PUT request to update the role on the server
        const response = await fetch(`http://localhost:3000/roles/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedRoleData),
        });

        if (response.status === 200) {
            // Role updated successfully on the server
            // Disable editing for input fields
            editInputs.forEach(input => {
                input.disabled = true;
            });

            // Toggle button visibility
            const editButton = row.querySelector('.edit-button');
            const saveButton = row.querySelector('.save-button');
            const cancelButton = row.querySelector('.cancel-button');
            editButton.style.display = 'block';
            saveButton.style.display = 'none';
            cancelButton.style.display = 'none';
        } else {
            console.error('Failed to update role.');
        }
    } catch (err) {
        console.error(err);
    }
}

// async function saveRow(roleId, button) {
//     const row = button.parentElement.parentElement;
   
//     const editInputs = row.querySelectorAll('input[data-field]'); // Select all editable input fields
// console.log(editInputs);
//     // Prepare the updated role data
//     const updatedRoleData = {};
//     editInputs.forEach(input => {
//         const fieldName = input.getAttribute('data-field'); // Get the field name from the input's data-field attribute
//         updatedRoleData[fieldName] = input.value;
//     });

//     try {
//         // Send a PUT request to update the role on the server
//         const response = await fetch(`http://localhost:3000/roles/${roleId}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(updatedRoleData),
//         });

//         if (response.status === 200) {
//             // Role updated successfully on the server
//             // You can optionally update the UI here to reflect the changes
//         } else {
//             console.error('Failed to update role.');
//         }
//     } catch (err) {
//         console.error(err);
//     } finally {
//         // Regardless of success or failure, re-enable the "Edit" button and hide the "Save" and "Cancel" buttons
//         editInputs.forEach(input => {
//             input.disabled = true;
//         });
//         row.querySelector('.edit-button').style.display = 'block';
//         row.querySelector('.save-button').style.display = 'none';
//         row.querySelector('.cancel-button').style.display = 'none';
//         // editButton.disabled = false;
//     }
// }





function cancelEdit(button) {
    const row = button.parentElement.parentElement;
    const fields = row.querySelectorAll('td:not(:last-child)'); // Exclude the last cell with buttons
    
    fields.forEach(field => {
        const input = field.querySelector('input');
        if (input) {
            // Restore the original text when the input field was first clicked
            input.value = input.defaultValue;
            field.textContent = input.value;
        }
    });

    const editButton = row.querySelector('.edit-button');
    const saveButton = row.querySelector('.save-button');
    const cancelButton = row.querySelector('.cancel-button');

    editButton.style.display = 'block';
    saveButton.style.display = 'none';
    cancelButton.style.display = 'none';

    // Enable other "Edit" buttons
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(btn => {
        btn.disabled = false;
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const showAddUserFormButton = document.getElementById('showAddUserForm');
    const addUserForm = document.getElementById('addUserForm');
    const newUserForm = document.getElementById('newUserForm');
  
    showAddUserFormButton.addEventListener('click', function () {
        rolesTable.style.display = 'none';
      addUserForm.style.display = 'block'; // Show the form
    });
  
    newUserForm.addEventListener('submit', async function (e) {
      e.preventDefault(); // Prevent the default form submission
  
      // Get values from the form
      const roleName = document.getElementById('roleName').value;
      const department = document.getElementById('department').value;
      const responsibilities = document.getElementById('responsibilities').value;
      const qualifications = document.getElementById('qualifications').value;
      const salary = document.getElementById('salary').value;
  
      // Create a new user object with the form values
      const newUser = {
        role_name: roleName,
        department: department,
        responsibilities: responsibilities,
        qualifications: qualifications,
        salary: salary,
      };
  
      try {
        // Send a POST request to create the new user on the server
        const response = await fetch('http://localhost:3000/roles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
          
        });

  
        if (response.status === 200) {
          // User created successfully
          console.log('User created successfully');

          // Optionally, you can hide the form again
          addUserForm.style.display = 'none';
          rolesTable.style.display = 'block';

          // Refresh the list of roles (you may need to implement a fetchRoles function)
          fetchRoles();
        } else {
          console.error('Failed to create user.');
        }
      } catch (err) {
        console.error(err);
      }
    });
  });
  




  // main.js

// Check for authentication token on page load
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (token) {
    // User is authenticated, display data
    fetchRoles();
    showLogoutButton();
  } else {
    // User is not authenticated, show login form
    showLoginForm();
  }
});

// Function to handle user authentication
async function authenticateUser(username, password) {
  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.status === 200) {
      // Authentication successful, store the token and display data
      const data = await response.json();
      const token = data.token;
      localStorage.setItem('token', token);
      fetchRoles();
      showLogoutButton();
      hideLoginForm();
    } else {
      // Authentication failed, display an error message
      displayMessage('Authentication failed. Please try again.');
    }
  } catch (error) {
    console.error('Authentication error:', error);
  }
}

// Function to log out the user (remove token)
function logoutUser() {
  localStorage.removeItem('token');
  // Hide the logout button and show the login form
  hideLogoutButton();
  showLoginForm();
  clearTableData();
}

// Function to display a message
function displayMessage(message) {
  const messageElement = document.getElementById('message');
  messageElement.textContent = message;
}

// Function to show the login form
function showLoginForm() {
  const loginForm = document.getElementById('login-form');
  loginForm.style.display = 'block';

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Call the authentication function with the provided username and password
    authenticateUser(username, password);
  });
}

// Function to hide the login form
function hideLoginForm() {
  const loginForm = document.getElementById('login-form');
  loginForm.style.display = 'none';
}

// Function to show the logout button
function showLogoutButton() {
  const logoutButton = document.getElementById('logout-button');
  logoutButton.style.display = 'block';

  logoutButton.addEventListener('click', () => {
    logoutUser();
  });
}

// Function to hide the logout button
function hideLogoutButton() {
  const logoutButton = document.getElementById('logout-button');
  logoutButton.style.display = 'none';
}

// Function to clear table data
function clearTableData() {
  const tableBody = document.getElementById('roles-table-body');
  tableBody.innerHTML = '';
}

// Function to fetch and display roles data
async function fetchRoles() {
  const token = localStorage.getItem('token');
  console.log(token );

  if (!token) {
    console.log('Authentication token is missing.');
    return;
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await fetch('http://localhost:3000/roles', {
      method: 'GET',
      headers: headers
    });

    if (response.status === 401) {
      console.log('Unauthorized access.');
      return;
    }

    if (response.status === 200) {
      const data = await response.json();
      const tableBody = document.getElementById('roles-table-body');
      clearTableData();

      data.forEach(role => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${role.role_name}</td>
          <td>${role.department}</td>
          <td>${role.responsibilities}</td>
          <td>${role.qualifications}</td>
          <td>${role.salary}</td>
          <td>
            <button class="edit-button" onclick="editRow(this)">Edit</button>
            <button class="delete-button" onclick="deleteRow('${role._id}')">Delete</button>
            <button class="save-button" style="display: none;" onclick="saveRow('${role._id}', this)">Save</button>
            <button class="cancel-button" style="display: none;" onclick="cancelEdit(this)">Cancel</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    } else {
      console.log('Error:', response.status);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Continue with your existing code for editing and other actions
// main.js

// Check for authentication token on page load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
      // User is authenticated, display data
      fetchRoles();
      showLogoutButton();
    } else {
      // User is not authenticated, show login form
      showLoginForm();
    }
  });
  
  // Function to handle user authentication
  async function authenticateUser(username, password) {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.status === 200) {
        // Authentication successful, store the token and display data
        const data = await response.json();
        const token = data.token;
        localStorage.setItem('token', token);
        fetchRoles();
        showLogoutButton();
        hideLoginForm();
      } else {
        // Authentication failed, display an error message
        displayMessage('Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  }
  
  // Function to log out the user (remove token)
  function logoutUser() {
    localStorage.removeItem('token');
    // Hide the logout button and show the login form
    hideLogoutButton();
    showLoginForm();
    clearTableData();
  }
  
  // Function to display a message
  function displayMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
  }
  
  // Function to show the login form
  function showLoginForm() {
    const loginForm = document.getElementById('login-form');
    loginForm.style.display = 'block';
  
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      // Call the authentication function with the provided username and password
      authenticateUser(username, password);
    });
  }
  
  // Function to hide the login form
  function hideLoginForm() {
    const loginForm = document.getElementById('login-form');
    loginForm.style.display = 'none';
  }
  
  // Function to show the logout button
  function showLogoutButton() {
    const logoutButton = document.getElementById('logout-button');
    logoutButton.style.display = 'block';
  
    logoutButton.addEventListener('click', () => {
      logoutUser();
    });
  }
  
  // Function to hide the logout button
  function hideLogoutButton() {
    const logoutButton = document.getElementById('logout-button');
    logoutButton.style.display = 'none';
  }
  
  // Function to clear table data
  function clearTableData() {
    const tableBody = document.getElementById('roles-table-body');
    tableBody.innerHTML = '';
  }
  
  // Function to fetch and display roles data
  async function fetchRoles() {
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.log('Authentication token is missing.');
      return;
    }
  
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  
    try {
      const response = await fetch('http://localhost:3000/roles', {
        method: 'GET',
        headers: headers
      });
  
      if (response.status === 401) {
        console.log('Unauthorized access.');
        return;
      }
  
      if (response.status === 200) {
        const data = await response.json();
        const tableBody = document.getElementById('roles-table-body');
        clearTableData();
  
        data.forEach(role => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td  data-field="role_name">${role.role_name}</td>
            <td   data-field="department">${role.department}</td>
            <td  data-field="responsibilities">${role.responsibilities}</td>
            <td   data-field="qualifications">${role.qualifications}</td>
            <td    data-field="salary">${role.salary}</td>
            <td>
              <button class="edit-button" onclick="editRow(this)">Edit</button>
              <button class="delete-button" onclick="deleteRow('${role._id}')">Delete</button>
              <button class="save-button" style="display: none;" onclick="saveRow('${role._id}', this)">Save</button>
              <button class="cancel-button" style="display: none;" onclick="cancelEdit(this)">Cancel</button>
            </td>
          `;
          tableBody.appendChild(row);
        });
      } else {
        console.log('Error:', response.status);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }
  
  // Continue with your existing code for editing and other actions
  