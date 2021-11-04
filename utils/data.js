export const routes = () => {
  return [
    {
      isActive: true,
      menu: 'Hidden',
      path: '/',
      name: 'Home',
    },
    {
      isActive: true,
      menu: 'Normal',
      path: '/dashboard',
      name: 'Dashboard',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/logon',
      name: 'User Logs',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/users',
      name: 'Users',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/groups',
      name: 'Groups',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/routes',
      name: 'Routes',
    },
    {
      isActive: true,
      menu: 'Profile',
      path: '/profile',
      name: 'Profile',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/product',
      name: 'Product',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/category',
      name: 'Category',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/order',
      name: 'Order',
    },
    {
      isActive: true,
      menu: 'Report',
      path: '/report/sales',
      name: 'Sales',
    },
    {
      isActive: true,
      menu: 'Report',
      path: '/report/customer',
      name: 'Customer',
    },
    {
      isActive: true,
      menu: 'Hidden',
      path: '/report/sales/sales-by-item-summary',
      name: 'Sales by item summary',
    },
    {
      isActive: true,
      menu: 'Hidden',
      path: '/report/customer/customer-balance',
      name: 'Balance',
    },
    {
      isActive: true,
      menu: 'Hidden',
      path: '/report/sales/sales-by-seller',
      name: 'Sales by seller',
    },
    {
      isActive: true,
      menu: 'Hidden',
      path: '/report/sales/sales-by-single-seller',
      name: 'Sales by single seller',
    },
    {
      isActive: true,
      menu: 'Report',
      path: '/report/transaction',
      name: 'Transaction',
    },
    {
      isActive: true,
      menu: 'Normal',
      path: '/receipt',
      name: 'Receipt',
    },
  ]
}

export const groups = (ids) => {
  return [
    {
      name: 'admin',
      isActive: true,
      route: ids,
    },
  ]
}

export const users = () => {
  return [
    {
      password: '123456',
      name: 'Ahmed',
      email: 'ahmaat19@gmail.com',
      group: 'admin',
    },
  ]
}
