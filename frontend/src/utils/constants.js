export const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical',
  'Civil',
  'Chemical',
  'MBA',
  'Other',
]

export const BATCHES = Array.from({ length: 20 }, (_, i) =>
  String(new Date().getFullYear() + 1 - i)
)

export const JOB_TYPES = ['full-time', 'internship', 'part-time', 'contract']




export const MENTORSHIP_STATUS = {
  pending:   { label: 'Pending',   color: 'yellow' },
  active:    { label: 'Active',    color: 'green'  },
  rejected:  { label: 'Rejected',  color: 'red'    },
  completed: { label: 'Completed', color: 'slate'  },
}

export const USER_ROLES = ['student', 'alumni', 'admin']

export const NAV_ITEMS = [
  { to: '/dashboard',   label: 'Dashboard'        },
  { to: '/feed',        label: 'News Feed'         },
  { to: '/alumni',      label: 'Alumni Directory'  },
  { to: '/jobs',        label: 'Jobs & Internships'},
  { to: '/events',      label: 'Events'            },
  { to: '/messages',    label: 'Messages'          },
  { to: '/mentorship',  label: 'Mentorship'        },
  { to: '/profile',     label: 'My Profile'        },
]
