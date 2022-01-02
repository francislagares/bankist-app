/// //////////////////////////////////////////////
/// //////////////////////////////////////////////
// BANKIST APP

interface IAccount {
  [key: string]: any;
  owner: string;
  movements: number[];
  interestRate: number;
  pin: number;
}

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// DOM Elements
const labelWelcome = document.querySelector('.welcome');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');

const containerApp: HTMLElement = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer: HTMLButtonElement = document.querySelector(
  '.form__btn--transfer',
);

const btnClose: HTMLButtonElement = document.querySelector('.form__btn--close');
const inputLoginUsername: HTMLInputElement = document.querySelector(
  '.login__input--user',
);
const inputLoginPin: HTMLInputElement =
  document.querySelector('.login__input--pin');
const inputTransferTo: HTMLInputElement =
  document.querySelector('.form__input--to');
const inputTransferAmount: HTMLInputElement = document.querySelector(
  '.form__input--amount',
);
const inputCloseUsername: HTMLInputElement =
  document.querySelector('.form__input--user');
const inputClosePin: HTMLInputElement =
  document.querySelector('.form__input--pin');

const displayMovements = (movements: number[]) => {
  movements.forEach((mov, i: number) => {
    const movementType = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${movementType}">
        ${i + 1} ${movementType.toUpperCase()}
        </div>
        <div class="movements__value">${mov}€</div>
      </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = (acc: IAccount) => {
  acc.balance = acc.movements.reduce((accum, cur) => accum + cur, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = (movements: number[], interestRate: number) => {
  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumIn.textContent = `${incomes}€`;

  const outcomes = movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interests = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, cur) => acc + cur);

  labelSumInterest.textContent = `${interests}€`;
};

const createUsernames = (accs: IAccount[]) => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = (acc: IAccount) => {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc.movements, acc.interestRate);
};

// EVENT HANDLERS
let currentAccount: IAccount;

btnLogin.addEventListener('click', e => {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc: IAccount) => acc.username === inputLoginUsername.value,
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display the UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = '100';

    // Clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update the UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc: IAccount = accounts.find(
    (acc: IAccount) => acc.username === inputTransferTo.value,
  );

  // Clear input fields
  inputTransferAmount.value = '';
  inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', e => {
  e.preventDefault();

  const accountToDelete = inputCloseUsername.value;
  const pin = +inputClosePin.value;

  // Clear input fields
  inputCloseUsername.value = '';
  inputClosePin.value = '';

  if (
    currentAccount.username === accountToDelete &&
    currentAccount.pin === pin
  ) {
    const index = accounts.findIndex(
      (acc: IAccount) => acc.username === currentAccount.username,
    );

    // Delete account
    accounts.splice(index, 1);

    // Hide Ui
    containerApp.style.opacity = '0';
  }
});
