// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn')
const container = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
const clearBtn = document.querySelector('.clear-btn')

// edit option
let editElement;
let editFlag = false;
let editID = '';

// ****** EVENT LISTENERS **********
// 항목 추가하기 버튼
form.addEventListener('submit', addItem)
// 항목 전부 삭제 버튼
clearBtn.addEventListener('click', clearItems);
// load items
window.addEventListener('DOMContentLoaded', setupItems);

// ****** FUNCTIONS **********
// 항목 추가하는 기능
function addItem(e) {
  e.preventDefault();
  // input에 입력한 값
  const value = grocery.value;

  const id = new Date().getTime().toString()
  // input에 입력 값이 있을 때
  if(value && !editFlag) {
    createListItem(id,value);
    // '리스트에 항목이 추가 되었습니다' 라는 문구가 적힌 success alert가 나타남
    displayAlert('리스트에 항목이 추가 되었습니다', 'success');
    // 항목들이 담긴 리스트 영역(?)을 보이게 한다.
    container.classList.add('show-container')
    // 로컬 저장소에 추가한다.
    addToLocalStorage(id,value);
    // 모든 값들(항목, Flag, ID) 초기화
    setBackToDefault();
  }
  // input에 입력 값이 있으면서
  // 수정이 끝나고 버튼을 누르게 되면
  else if (value && editFlag ){
    editElement.innerHTML = value;
    displayAlert('항목이 수정되었습니다.', 'success');
    // 로컬 저장소 수정
    editLocalStorage(editID, value);
    setBackToDefault();
  }
  // input에 입력 값이 없을 때
  else {
    // '값을 입력해주세요' 라는 문구가 적힌 danger alert가 나타남
    displayAlert('값을 입력해주세요', 'danger');
  }
}
// alert 나타나게 하는 기능
function displayAlert(text, action){
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  // alert 없어지는
  setTimeout(function(){
    alert.textContent = '';
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// 항목 전체 삭제
function clearItems() {
  const items = document.querySelectorAll('.grocery-item');

  if (items.length > 0) {
    items.forEach(function(item){
      list.removeChild(item);
    }); 
  }
  container.classList.remove('show-container');
  displayAlert('항목이 전체 삭제되었습니다.', 'danger');
  setBackToDefault();
  localStorage.removeItem('list');
}
// 항목 삭제 기능
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  // 목록에 아무것도 없을 경우 목록 창 전체를 안 보이게 한다.
  if(list.children.length === 0) {
    container.classList.remove('show-container');
  }
  // 삭제하고 '항목이 삭제 되었습니다' 라는 문구가 적힌 danger alert가 나타남
  displayAlert('항목이 삭제 되었습니다', 'danger')
  // 모든 값들 초기화
  setBackToDefault();
  // remove from local storage
  removeFromLocalStorage(id);
}
// 항목 수정 기능
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // 수정하는 항목의 값을 input 창에 입력값으로 다시 보여줌
  grocery.value = editElement.innerHTML;
  // 수정 모드
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = '수정';
}

// 항목 추가 후에 input 입력 값과 id, 수정플래그 값을 초기화하는 역할
function setBackToDefault() {
  grocery.value = '';
  editFlag = false;
  editID = '';
  submitBtn.textContent = '추가';
}

// ****** LOCAL STORAGE **********
// 로컬 저장소에 더해주는 기능
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  // items를 JSON 문자열로 변환해서 list에 추가시킨다.
  localStorage.setItem('list', JSON.stringify(items));
}
// 로컬 저장소의 값을 읽어오는 기능
function getLocalStorage() {
  return localStorage.getItem('list')
  ? JSON.parse(localStorage.getItem('list'))
  : [];
}
// 로컬 저장소의 값을 삭제하는 기능
function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  
  items = items.filter(function(item) {
    if(item.id !== id){
      return item;
    }
  });
  localStorage.setItem('list', JSON.stringify(items));
}
// 로컬 저장소의 값을 수정하는 기능
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function(item){
    if(item.id === id){
      item.value = value;
    }
    return item;
  })
  localStorage.setItem('list', JSON.stringify(items));
}
// localStorage API
// setItem
// getItem
// removeItem
// save as Strings
// localStorage.setItem('orange', JSON.stringify(['item', 'item2']));
// const oranges = JSON.parse(localStorage.getItem('orange'));
// console.log(oranges);
// localStorage.removeItem('orange');

// ****** SETUP ITEMS **********
function setupItems() {
  let items = getLocalStorage();
  if(items.length > 0){
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    })
    container.classList.add('show-container')
  }
}

// class와 id를 더해서 list에 마지막 child를 만들어 낸다.
function createListItem(id, value) {
  const element = document.createElement('article');
  // add class
  element.classList.add('grocery-item');
  // add id
  const attr = document.createAttribute('data-id');
  attr.value = id;
  element.setAttributeNode(attr); 
  element.innerHTML = `
    <p class="title">${value}</p>
    <div class="btn-container">
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>`;
  // 수정, 삭제 버튼들
  const deleteBtn = element.querySelector('.delete-btn');
  const editBtn = element.querySelector('.edit-btn');
  deleteBtn.addEventListener('click',deleteItem);
  editBtn.addEventListener('click',editItem);
  // append child
  list.appendChild(element);
}