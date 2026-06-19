import { INodeProperties } from 'n8n-workflow';

export const matterOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['matter'] } },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Open a new matter',
        action: 'Create a matter',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Retrieve a matter by ID',
        action: 'Get a matter',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Retrieve a list of matters',
        action: 'Get many matters',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update an existing matter',
        action: 'Update a matter',
      },
    ],
    default: 'create',
  },
];

export const matterFields: INodeProperties[] = [
  // ─── Create ────────────────────────────────────────────────────────────────
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    required: true,
    displayOptions: { show: { resource: ['matter'], operation: ['create'] } },
    default: '',
    description: 'Matter description shown in the matter list (e.g. "H-1B Visa Application")',
  },
  {
    displayName: 'Client ID',
    name: 'clientId',
    type: 'string',
    required: true,
    displayOptions: { show: { resource: ['matter'], operation: ['create'] } },
    default: '',
    description: 'Clio contact ID of the client for this matter',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: { show: { resource: ['matter'], operation: ['create'] } },
    default: {},
    options: [
      {
        displayName: 'Client Reference',
        name: 'clientReference',
        type: 'string',
        default: '',
        description: 'Optional client-facing matter reference number',
      },
      {
        displayName: 'Open Date',
        name: 'openDate',
        type: 'dateTime',
        default: '',
        description: 'Leave blank to use today\'s date',
      },
      {
        displayName: 'Practice Area ID',
        name: 'practiceAreaId',
        type: 'string',
        default: '',
        description: 'Clio practice area numeric ID (find in Settings → Practice Areas)',
      },
      {
        displayName: 'Responsible Attorney ID',
        name: 'responsibleAttorneyId',
        type: 'string',
        default: '',
        description: 'Clio user ID of the responsible attorney',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        default: 'Pending',
        options: [
          { name: 'Pending', value: 'Pending' },
          { name: 'Open', value: 'Open' },
          { name: 'Closed', value: 'Closed' },
        ],
      },
    ],
  },

  // ─── Get / Update ID ───────────────────────────────────────────────────────
  {
    displayName: 'Matter ID',
    name: 'matterId',
    type: 'string',
    required: true,
    displayOptions: { show: { resource: ['matter'], operation: ['get', 'update'] } },
    default: '',
    description: 'Numeric Clio matter ID',
  },

  // ─── Get Many ──────────────────────────────────────────────────────────────
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: { show: { resource: ['matter'], operation: ['getAll'] } },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: { resource: ['matter'], operation: ['getAll'], returnAll: [false] },
    },
    typeOptions: { minValue: 1 },
    default: 50,
    description: 'Max number of results to return',
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    displayOptions: { show: { resource: ['matter'], operation: ['getAll'] } },
    default: {},
    options: [
      {
        displayName: 'Client ID',
        name: 'clientId',
        type: 'string',
        default: '',
        description: 'Filter matters belonging to this contact ID',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        default: '',
        options: [
          { name: 'All', value: '' },
          { name: 'Pending', value: 'Pending' },
          { name: 'Open', value: 'Open' },
          { name: 'Closed', value: 'Closed' },
        ],
      },
      {
        displayName: 'Fields',
        name: 'fields',
        type: 'string',
        default:
          'id,description,display_number,status,client,practice_area,open_date,created_at',
        description: 'Comma-separated list of Clio fields to include',
      },
    ],
  },

  // ─── Update ────────────────────────────────────────────────────────────────
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: { show: { resource: ['matter'], operation: ['update'] } },
    default: {},
    options: [
      { displayName: 'Description', name: 'description', type: 'string', default: '' },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        default: 'Open',
        options: [
          { name: 'Pending', value: 'Pending' },
          { name: 'Open', value: 'Open' },
          { name: 'Closed', value: 'Closed' },
        ],
      },
      {
        displayName: 'Close Date',
        name: 'closeDate',
        type: 'dateTime',
        default: '',
      },
    ],
  },
];
