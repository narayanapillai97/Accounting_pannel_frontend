export const MenuList = [
  //Dashboard
  {
    title: "Dashboard",
    classsChange: "mm-collapse",
    iconStyle: <i className="fas fa-home" />,
    content: [
      {
        title: "Dashboard Light",
        to: "dashboard",
      },
      {
        title: "Dashboard Dark",
        to: "dashboard-dark",
      },
    
    ],
  },

  //Apps
  {
    title: "Apps",
    classsChange: "mm-collapse",
    iconStyle: <i className="fas fa-info-circle"></i>,
    content: [
      {
        title: "Profile",
        to: "app-profile",
      },
      // {
      //     title: 'Edit Profile',
      //     to: 'edit-profile'
      // },
      {
        title: "Email",
        //to: './',
        hasMenu: true,
        content: [
          {
            title: "Compose",
            to: "email-compose",
          },
        ],
      },
      {
        title: "Calendar",
        to: "app-calender",
      },
    ],
  },

  {
    title: "Accounting Panel",
    hasMenu: true,
    classsChange: "mm-collapse",
    iconStyle: <i className="fas fa-calculator"></i>, // Accounting icon
    content: [
      {
        title: "User",
        to: "UserMaster",
      },
      {
        title: "Masters",
        hasMenu: true,
        classsChange: "mm-collapse", // Added this
        iconStyle: <i className="fas fa-box"></i>,
        content: [
          {
            title: "Vendormaster",
            to: "vendormaster",
          },
          {
            title: "PayModeMaster",
            to: "PayModeMaster",
          },
        ],
      },
      {
        title: "Category",
        hasMenu: true,
        classsChange: "mm-collapse",
        iconStyle: <i className="fas fa-layer-group"></i>,
        content: [
          {
            title: "Main Category",
            to: "MainCategoryMaster",
          },
          {
            title: "Sub Category",
            to: "SubCategoryMaster", // Added route so click works
          },
          {
            title: "Variants",
            to: "VariantMaster",
          },
        ],
      },
      {
        title: "Employee",
        hasMenu: true,
        classsChange: "mm-collapse",
        iconStyle: <i className="fas fa-user-tie"></i>,
        content: [
          {
            title: "Employee Information",
            to: "EmployeeMaster",
          },
          {
            title: "Verification",
            to: "verification",
          },
          {
            title: "Bank Details",
            to: "BankDetails",
          },
        ],
      },
      {
        title: "Income",
        to: "Income",
      },
      {
        title: "Expenditure",
        to: "Expenditure",
      },
      {
        title: "Report",
        to: "Report",
      },
    ],
  },
  //Charts
  {
    title: "Charts",
    classsChange: "mm-collapse",
    iconStyle: <i className="fas fa-chart-line"></i>,
    content: [
      {
        title: "Basic chart",
        to: "chart-rechart",
      },
      {
        title: "Chart",
        to: "chart-chartjs",
      },
      {
        title: "Sparkline",
        to: "s-sparkline",
      },
      {
        title: "Apexchart",
        to: "chart-apexchart",
      },
    ],
  },

  {
    title: "Cards",
    to: "ui-card",
    classsChange: "mm-collapse",
    iconStyle: <i className="fas fa-box"></i>, // Font Awesome credit card icon
  },

  {
    title: "Badge",
    to: "s-badge",
    classsChange: "mm-collapse",
    iconStyle: <i className="fas fa-id-badge"></i>,
  },

  {
    title: "Form Components",
    to: "form-element",
    iconStyle: <i className="fas fa-edit"></i>,
  },
  //Boosttrap
  {
    title: "Bootstrap",
    classsChange: "mm-collapse",
    iconStyle: <i className="fab fa-bootstrap"></i>,
    content: [
      {
        title: "Accordion",
        to: "ui-accordion",
      },
      {
        title: "Alert",
        to: "ui-alert",
      },
      {
        title: "Button",
        to: "ui-button",
      },
      {
        title: "Modal",
        to: "ui-modal",
      },
      {
        title: "Button Group",
        to: "ui-button-group",
      },
      {
        title: "Cards",
        to: "ui-card",
      },
      {
        title: "Popover",
        to: "ui-popover",
      },
      {
        title: "Progressbar",
        to: "ui-progressbar",
      },

      {
        title: "Pagination",
        to: "ui-pagination",
      },
      
    ],
  },

  //Forms
  {
    title: "Forms",
    classsChange: "mm-collapse",
    iconStyle: <i className="fas fa-file-alt"></i>,
    content: [
      {
        title: "Wizard",
        to: "form-wizard",
      },
      {
        title: "Editor",
        to: "form-editor",
      },
      {
        title: "Pickers",
        to: "form-pickers",
      },
      {
        title: "Form Validate",
        to: "form-validation",
      },
    ],
  },
  //Table
  {
    title: "Table",
    classsChange: "mm-collapse",
    iconStyle: <i className="fas fa-table"></i>,
    content: [
  
      {
        title: "Table-Components",
        to: "table-bootstrap-basic",
      },
    ],
  },

  //Pages
    {
        title:'Pages',
        classsChange: 'mm-collapse',
        iconStyle: <i className="fas fa-clone"></i>,
        content : [
            {
                title:'Error',
                hasMenu : true,
                content : [
                    {
                        title: 'Error 404',
                        to : 'page-error-404',
                    },
                ],
            },
             {
                title:'Resigter',
                to: 'page-register',
            },

            {
                title:'Login',
                to: 'page-login',
            },

        ]
    },
];
