export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};


export function emptyRows(page, rowsPerPage, arrayLength) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator(a, b, orderBy) {
  if (a[orderBy] === null) {
    return 1;
  }
  if (b[orderBy] === null) {
    return -1;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function applyFilter({ inputData, comparator, filterName, filters }) {
  // Stabilize array
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filteredData = stabilizedThis.map((el) => el[0]);

  // Name filter
  if (filterName) {
    filteredData = filteredData.filter((user) =>
      user.name.toLowerCase().includes(filterName.toLowerCase()) || 
      user.phone.toLowerCase().includes(filterName.toLowerCase())
    );
  }

  // Apply status filters
  if (filters.verified) {
    filteredData = filteredData.filter((user) => user.trustable);
  }

  if (filters.blocked) {
    filteredData = filteredData.filter((user) => user.blocked);
  }

  if (filters.phoneVerified) {
    filteredData = filteredData.filter((user) => user.phone_verified);
  }

  // Apply sorting
  if (filters.newest) {
    filteredData.sort((a, b) => new Date(b.created) - new Date(a.created));
  } else if (filters.oldest) {
    filteredData.sort((a, b) => new Date(a.created) - new Date(b.created));
  }

  // Apply places count filter
  if (filters.placesCount) {
    filteredData = filteredData.filter((user) => user.postsCount > 0);
  }

  // Apply sponsored places count filter
  if (filters.sponsoredPlaces) {
    filteredData = filteredData.filter((user) => user.sponsoredPostsCount > 0);
  }

  // Apply bookings count filter
  if (filters.bookingsCount) {
    filteredData = filteredData.filter((user) => user.bookingsCount > 0);
  }

  return filteredData;
}

