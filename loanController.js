const users = {}; 
const loans = []; 

function requestLoan(requesterId, lenderId, itemId) {
  const isAlreadyRequested = loans.some(loan =>
    loan.itemId === itemId && loan.status === 'pending'
  );

  if (isAlreadyRequested) {
    return { error: 'Item is already requested by someone else.' };
  }

  const newLoan = {
    id: loans.length + 1,
    itemId,
    requesterId,
    lenderId,
    status: 'pending', 
  };

  loans.push(newLoan);
  return newLoan;
}

function acceptLoan(loanId) {
  const loan = loans.find(loan => loan.id === loanId);

  if (!loan) {
    return { error: 'Loan request not found.' };
  }

  if (loan.status !== 'pending') {
    return { error: 'Loan request is not in a pending status.' };
  }

  loan.status = 'accepted';
  return loan;
}

function markItemReturned(loanId) {
  const loan = loans.find(loan => loan.id === loanId);

  if (!loan) {
    return { error: 'Loan request not found.' };
  }

  if (loan.status !== 'accepted') {
    return { error: 'Item cannot be returned because it has not been accepted yet.' };
  }

  loan.status = 'returned';
  return loan;
}

function getUserTransactionHistory(userId) {
  const userLoans = loans.filter(loan =>
    loan.requesterId === userId || loan.lenderId === userId
  );
  return userLoans;
}

module.exports = {
  requestLoan,
  acceptLoan,
  markItemReturned,
  getUserTransactionHistory,
};