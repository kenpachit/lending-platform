const users = {}; // Assuming this will be used for user management in future updates
const loans = [];

function requestLoan(requesterId, lenderId, itemId) {
  const isAlreadyRequested = loans.some(
    (loan) => loan.itemId === itemId && loan.status === 'pending'
  );

  if (isAlreadyRequested) {
    return { error: 'Item is already requested by someone else.' };
  }

  // Dynamically generate new loan ID based on existing lengths to avoid conflicts
  const newLoan = {
    id: loans.length + 1, // Improvement: consider a more unique ID generation method for scalability
    itemId,
    requesterId,
    lenderId,
    status: 'pending',
  };

  loans.push(newLoan);
  return newLoan;
}

function acceptLoan(loanId) {
  const loanIndex = loans.findIndex((loan) => loan.id === loanId);

  if (loanIndex === -1) {
    return { error: 'Loan request not found.' };
  }

  const loan = loans[loanIndex];
  if (loan.status !== 'pending') {
    return { error: 'Loan request is not in a pending status.' };
  }

  loan.status = 'accepted';
  return loan;
}

function markItemReturned(loanId) {
  const loanIndex = loans.findIndex((loan) => loan.id === loanId);

  if (loanIndex === -1) {
    return { error: 'Loan request not found.' };
  }

  const loan = loans[loanIndex];
  if (loan.status !== 'accepted') {
    return { error: 'Item cannot be returned because it has not been accepted yet.' };
  }

  loan.status = 'returned';
  return loan;
}

function getUserTransactionHistory(userId) {
  // Direct use of filter without intermediate assignment for efficiency
  return loans.filter((loan) => loan.requesterId === userId || loan.lenderId === userId);
}

module.exports = {
  requestLoan,
  acceptLoan,
  markItemReturned,
  getUserTransactionHistory,
};